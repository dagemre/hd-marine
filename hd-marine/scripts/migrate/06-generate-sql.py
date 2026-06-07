#!/usr/bin/env python3
"""
HD Marine Faz 1 — Adım 7a: Import SQL üretimi (onaylı plan, rapor §4 ve §7)
Girdi : data/parsed/*.json + data/raw/pages/{id}.json (menu_order için)
Çıktı : data/sql/00-categories.sql, data/sql/products-NN.sql, data/sql/99-redirects.sql,
        data/parsed/image-upload-map.json
Kurallar:
 - Deterministik UUID (uuid5) → idempotent, tekrar çalıştırılabilir (ON CONFLICT DO NOTHING)
 - TR çeviriler translation_status='reviewed' (kaynak dil); EN sonraki adımda 'auto'
 - Birleştirmeler: 4397+4740, 2741+4476, 4776+4777 → tek ürün + product_categories
 - Elemeler: 3889 (sayfa2), 5185 (çift segment) → redirects
 - Teknik değerler birebir; meta_description açıklamanın ilk ~155 karakterinden türetilir
"""
import json, re, uuid, html
from pathlib import Path

DATA = Path(__file__).parent / "data"
SQL = DATA / "sql"
SQL.mkdir(exist_ok=True)
NS = uuid.UUID("8f0c2c1e-5b7a-4b54-9a4e-1d2hd0000000".replace("hd", "00"))  # sabit namespace

def uid(kind, key):
    return str(uuid.uuid5(NS, f"hdm-{kind}-{key}"))

def q(s):
    """dollar-quote; None → NULL"""
    if s is None or s == "":
        return "NULL"
    s = str(s)
    assert "$h$" not in s
    return f"$h${s}$h$"

def plain(htm, limit=None):
    t = html.unescape(re.sub(r"<[^>]+>", " ", htm or ""))
    t = re.sub(r"\s+", " ", t).strip()
    return t[:limit].rsplit(" ", 1)[0] + "…" if limit and len(t) > limit else t

def url_path(link):
    return re.sub(r"^https?://[^/]+", "", link) or "/"

cls = json.load(open(DATA / "parsed/classification.json"))
products = json.load(open(DATA / "parsed/products.json"))
cats = json.load(open(DATA / "parsed/categories.json"))
by_id = {x["id"]: x for x in cls}

def menu_order(pid):
    try:
        return json.load(open(DATA / f"raw/pages/{pid}.json")).get("menu_order", 0)
    except FileNotFoundError:
        return 0

# ---- onaylı kararlar ----
EXCLUDE = {3889, 5185}
# canonical_wp_id -> (ikincil_wp_id, ikincil de bu kategoriye bağlanır)
p_by_id = {p["id"]: p for p in products}
def richer(a, b):
    """daha zengin içerikli olanı canonical seç"""
    pa, pb = p_by_id[a], p_by_id[b]
    sa = (len(pa["specs"]), len(pa["description_html"] or ""), len(pa["images"]))
    sb = (len(pb["specs"]), len(pb["description_html"] or ""), len(pb["images"]))
    return (a, b) if sa >= sb else (b, a)

MERGES = [richer(4397, 4740), richer(2741, 4476), richer(4776, 4777)]
canonical_of = {sec: prim for prim, sec in MERGES}
secondary_ids = set(canonical_of)

# ====================================================================
# 00 — KATEGORİLER
# ====================================================================
lines = ["-- HD Marine Faz 1: kategoriler (otomatik üretildi — 06-generate-sql.py)", "BEGIN;"]
for c in sorted(cats, key=lambda c: len(by_id[c["id"]]["path"].split("/"))):  # parent önce
    cid = uid("cat", c["id"])
    parent = "NULL" if c["parent_id"] == 0 or c["id"] == 128 else f"'{uid('cat', c['parent_id'])}'"
    if c["id"] == 128:
        parent = "NULL"  # ürünler kökü
    lines.append(
        f"INSERT INTO categories (id, parent_id, sort_order) VALUES ('{cid}', {parent}, {menu_order(c['id'])}) "
        f"ON CONFLICT (id) DO NOTHING;")
    lines.append(
        "INSERT INTO category_translations (id, category_id, locale, name, slug, meta_title, translation_status) VALUES "
        f"('{uid('cattr-tr', c['id'])}', '{cid}', 'tr', {q(c['title'])}, {q(c['slug'])}, "
        f"{q(c['title'] + ' | HD Marine')}, 'reviewed') ON CONFLICT (id) DO NOTHING;")
lines.append("COMMIT;")
(SQL / "00-categories.sql").write_text("\n".join(lines), encoding="utf-8")

# ====================================================================
# ÜRÜNLER — 15'erli chunk dosyaları
# ====================================================================
img_map = []   # yükleme planı: kaynak URL -> storage path

def product_rows(p, rows):
    """chunk genelinde tablo->satır listeleri doldur (multi-row insert için)"""
    wpid = p["id"]
    pid = uid("prod", wpid)
    rows["products"].append(
        f"('{pid}', '{uid('cat', p['primary_category_id'])}', {menu_order(wpid)}, {wpid}, {q(url_path(p['link']))})")
    desc = (p["description_html"] or "") + (p["why_hd_html"] or "")
    rows["product_translations"].append(
        f"('{uid('ptr-tr', wpid)}', '{pid}', 'tr', {q(p['title'])}, {q(p['slug'])}, {q(p['subtitle'])}, "
        f"{q(desc or None)}, {q(p['usage_areas_html'])}, {q(p['title'] + ' | HD Marine')}, "
        f"{q(plain(desc, 155) or None)}, 'reviewed')")
    cat_ids = {p["primary_category_id"]}
    for sec, prim in canonical_of.items():
        if prim == wpid:
            cat_ids.add(p_by_id[sec]["primary_category_id"])
    for cid in cat_ids:
        rows["product_categories"].append(f"('{pid}', '{uid('cat', cid)}')")
    for i, s in enumerate(p["specs"]):
        sid = uid("spec", f"{wpid}-{i}")
        rows["product_specs"].append(f"('{sid}', '{pid}', {i})")
        # value NOT NULL: kaynakta boşsa boş string olarak korunur (NULL değil)
        val = q(s["value"]) if s["value"] else "$h$$h$"
        rows["product_spec_translations"].append(
            f"('{uid('spectr-tr', f'{wpid}-{i}')}', '{sid}', 'tr', {q(s['name'])}, {val})")
    for i, f in enumerate(p["faqs"]):
        fid = uid("faq", f"{wpid}-{i}")
        rows["product_faqs"].append(f"('{fid}', '{pid}', {i})")
        rows["product_faq_translations"].append(
            f"('{uid('faqtr-tr', f'{wpid}-{i}')}', '{fid}', 'tr', {q(f['question'])}, {q(f['answer'])})")
    imgs, seen = [], set()
    for src in [p] + [p_by_id[s] for s, pr in canonical_of.items() if pr == wpid]:
        for im in src["images"]:
            if im["url"] not in seen:
                seen.add(im["url"])
                imgs.append(im)
    for i, im in enumerate(imgs):
        fname = im["url"].rstrip("/").rsplit("/", 1)[-1]
        spath = f"products/{p['slug']}/{fname}"
        img_map.append({"source_url": im["url"], "storage_path": spath, "product_wp_id": wpid})
        rows["product_images"].append(
            f"('{uid('img', f'{wpid}-{i}')}', '{pid}', {q(spath)}, {q(im['alt'] or p['title'])}, {i}, "
            f"{'true' if i == 0 else 'false'})")

TABLE_COLS = {
    "products": "(id, primary_category_id, sort_order, legacy_wp_id, legacy_url)",
    "product_translations": "(id, product_id, locale, name, slug, summary, description, usage_areas, meta_title, meta_description, translation_status)",
    "product_categories": "(product_id, category_id)",
    "product_specs": "(id, product_id, sort_order)",
    "product_spec_translations": "(id, spec_id, locale, label, value)",
    "product_faqs": "(id, product_id, sort_order)",
    "product_faq_translations": "(id, faq_id, locale, question, answer)",
    "product_images": "(id, product_id, storage_path, alt_tr, sort_order, is_primary)",
}

def product_sql(p):
    wpid = p["id"]
    pid = uid("prod", wpid)
    cat_uuid = uid("cat", p["primary_category_id"])
    out = []
    out.append(
        f"INSERT INTO products (id, primary_category_id, sort_order, legacy_wp_id, legacy_url) VALUES "
        f"('{pid}', '{cat_uuid}', {menu_order(wpid)}, {wpid}, {q(url_path(p['link']))}) "
        f"ON CONFLICT (id) DO NOTHING;")
    desc = (p["description_html"] or "") + (p["why_hd_html"] or "")
    out.append(
        "INSERT INTO product_translations (id, product_id, locale, name, slug, summary, description, usage_areas, "
        "meta_title, meta_description, translation_status) VALUES "
        f"('{uid('ptr-tr', wpid)}', '{pid}', 'tr', {q(p['title'])}, {q(p['slug'])}, {q(p['subtitle'])}, "
        f"{q(desc or None)}, {q(p['usage_areas_html'])}, {q(p['title'] + ' | HD Marine')}, "
        f"{q(plain(desc, 155) or None)}, 'reviewed') ON CONFLICT (id) DO NOTHING;")
    # kategoriler (primary + birleştirilen ikincilin kategorisi)
    cat_ids = {p["primary_category_id"]}
    for sec, prim in canonical_of.items():
        if prim == wpid:
            cat_ids.add(p_by_id[sec]["primary_category_id"])
    for cid in cat_ids:
        out.append(f"INSERT INTO product_categories (product_id, category_id) VALUES "
                   f"('{pid}', '{uid('cat', cid)}') ON CONFLICT DO NOTHING;")
    # spec'ler
    for i, s in enumerate(p["specs"]):
        sid = uid("spec", f"{wpid}-{i}")
        out.append(f"INSERT INTO product_specs (id, product_id, sort_order) VALUES ('{sid}', '{pid}', {i}) "
                   f"ON CONFLICT (id) DO NOTHING;")
        out.append(f"INSERT INTO product_spec_translations (id, spec_id, locale, label, value) VALUES "
                   f"('{uid('spectr-tr', f'{wpid}-{i}')}', '{sid}', 'tr', {q(s['name'])}, {q(s['value'])}) "
                   f"ON CONFLICT (id) DO NOTHING;")
    # SSS
    for i, f in enumerate(p["faqs"]):
        fid = uid("faq", f"{wpid}-{i}")
        out.append(f"INSERT INTO product_faqs (id, product_id, sort_order) VALUES ('{fid}', '{pid}', {i}) "
                   f"ON CONFLICT (id) DO NOTHING;")
        out.append(f"INSERT INTO product_faq_translations (id, faq_id, locale, question, answer) VALUES "
                   f"('{uid('faqtr-tr', f'{wpid}-{i}')}', '{fid}', 'tr', {q(f['question'])}, {q(f['answer'])}) "
                   f"ON CONFLICT (id) DO NOTHING;")
    # görseller (birleştirilen ikincilin görselleri dahil, URL bazında dedup)
    imgs, seen = [], set()
    for src in [p] + [p_by_id[s] for s, pr in canonical_of.items() if pr == wpid]:
        for im in src["images"]:
            if im["url"] not in seen:
                seen.add(im["url"])
                imgs.append(im)
    for i, im in enumerate(imgs):
        fname = im["url"].rstrip("/").rsplit("/", 1)[-1]
        spath = f"products/{p['slug']}/{fname}"
        img_map.append({"source_url": im["url"], "storage_path": spath, "product_wp_id": wpid})
        out.append(f"INSERT INTO product_images (id, product_id, storage_path, alt_tr, sort_order, is_primary) VALUES "
                   f"('{uid('img', f'{wpid}-{i}')}', '{pid}', {q(spath)}, {q(im['alt'] or p['title'])}, {i}, "
                   f"{'true' if i == 0 else 'false'}) ON CONFLICT (id) DO NOTHING;")
    return out

final_products = [p for p in products if p["id"] not in EXCLUDE and p["id"] not in secondary_ids]
CHUNK = 25
for n in range(0, len(final_products), CHUNK):
    chunk = final_products[n:n + CHUNK]
    rows = {t: [] for t in TABLE_COLS}
    for p in chunk:
        product_rows(p, rows)
    body = ["-- HD Marine Faz 1: ürünler (otomatik üretildi, multi-row)", "BEGIN;"]
    for t in TABLE_COLS:  # sıra: products önce, bağımlılar sonra
        if rows[t]:
            body.append(f"INSERT INTO {t} {TABLE_COLS[t]} VALUES\n" + ",\n".join(rows[t]) +
                        "\nON CONFLICT DO NOTHING;")
    body.append("COMMIT;")
    fn = SQL / f"products-{n // CHUNK + 1:02d}.sql"
    fn.write_text("\n".join(body), encoding="utf-8")

# ====================================================================
# 99 — REDIRECTS
# ====================================================================
def canonical_path(p):
    return url_path(p["link"])

rl = ["-- HD Marine Faz 1: 301 yönlendirmeleri", "BEGIN;"]
redirs = []
redirs.append((url_path(by_id[3889]["link"]), "/urunler/yaglama-cihazlari/aksesuarlar/"))
redirs.append((url_path(by_id[5185]["link"]), url_path(by_id[4266]["link"])))
for sec, prim in canonical_of.items():
    redirs.append((url_path(by_id[sec]["link"]), canonical_path(p_by_id[prim])))
for old, new in redirs:
    rl.append(f"INSERT INTO redirects (old_path, new_path, status_code) VALUES ({q(old)}, {q(new)}, 301) "
              f"ON CONFLICT (old_path) DO NOTHING;")
rl.append("COMMIT;")
(SQL / "99-redirects.sql").write_text("\n".join(rl), encoding="utf-8")

json.dump(img_map, open(DATA / "parsed/image-upload-map.json", "w"), ensure_ascii=False, indent=1)

# özet
import os
files = sorted(SQL.glob("*.sql"))
print(f"ürün entity: {len(final_products)} (282 - {len(EXCLUDE)} eleme - {len(secondary_ids)} birleştirme)")
print(f"canonical seçimler: {MERGES}")
print(f"SQL dosyaları: {len(files)} adet, toplam {sum(os.path.getsize(f) for f in files)//1024} KB")
print(f"görsel yükleme planı: {len(img_map)} kayıt")
print(f"redirect: {len(redirs)}")
