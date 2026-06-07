#!/usr/bin/env python3
"""
HD Marine Faz 1 — Adım 6: İçerik parse (teknik tablo, açıklama, SSS, görseller)
Girdi : data/raw/pages/{id}.json + data/parsed/classification.json
Çıktı : data/parsed/products.json, data/parsed/categories.json, data/parsed/parse-issues.json
Kural : Teknik değer UYDURULMAZ — sadece HTML'de olan veri çıkarılır.
        Parse edilemeyen / şüpheli içerik parse-issues.json'a düşer.
"""
import json, re
from pathlib import Path
from bs4 import BeautifulSoup

DATA = Path(__file__).parent / "data"
cls = json.load(open(DATA / "parsed/classification.json"))
by_id = {x["id"]: x for x in cls}

def category_chain(x):
    out, cur = [], x["parent_id"]
    while cur and cur in by_id:
        out.append({"id": cur, "slug": by_id[cur]["slug"], "title": by_id[cur]["title"]})
        cur = by_id[cur]["parent_id"]
    return list(reversed(out))

def strip_size(url):
    return re.sub(r"-\d+x\d+(?=\.(jpg|jpeg|png|webp|gif)$)", "", url, flags=re.I)

def largest_srcset(img):
    if img.get("srcset"):
        best, bw = None, -1
        for part in img["srcset"].split(","):
            bits = part.strip().split()
            if bits:
                w = int(bits[1][:-1]) if len(bits) > 1 and bits[1].endswith("w") else 0
                if w > bw:
                    best, bw = bits[0], w
        return best
    return img.get("src")

def clean_html(node):
    """widget içeriğini sade HTML'e indir (class/style/svg temizle)"""
    s = BeautifulSoup(str(node), "html.parser")
    for svg in s.find_all("svg"):
        svg.decompose()
    for tag in s.find_all(True):
        tag.attrs = {k: v for k, v in tag.attrs.items() if k in ("href", "src", "alt")}
    inner = "".join(str(c) for c in s.children)
    return re.sub(r"\s+", " ", inner).strip()

products, categories, issues = [], [], []

for x in cls:
    pid = x["id"]
    raw = json.load(open(DATA / f"raw/pages/{pid}.json"))
    soup = BeautifulSoup(raw["content"]["rendered"], "html.parser")
    page_issues = []

    # ---- görseller (form spinner hariç) ----
    imgs = []
    seen = set()
    for img in soup.find_all("img"):
        src = img.get("src", "")
        # submit spinner, data-uri ve dekoratif ayraç (cizgi.jpg) ürün görseli değildir
        if not src or "submit-spin" in src or src.startswith("data:") or "/cizgi" in src:
            continue
        u = strip_size(largest_srcset(img))
        if u not in seen:
            seen.add(u)
            imgs.append({"url": u, "alt": (img.get("alt") or "").strip()})

    if x["type"] != "product":
        if x["type"] in ("category", "category_root"):
            categories.append({
                "id": pid, "slug": x["slug"], "title": x["title"], "path": x["path"],
                "parent_id": x["parent_id"], "link": x["link"],
                "children": [{"id": c["id"], "slug": c["slug"], "title": c["title"], "type": c["type"]}
                             for c in cls if c["parent_id"] == pid],
                "images": imgs,
            })
        continue

    # ---- ürün alanları ----
    h1 = soup.find("h1")
    name = h1.get_text(strip=True) if h1 else x["title"]
    if not h1:
        page_issues.append("h1_yok")

    # alt başlık: ilk h3 (accordion dışında, başlık widget'ı)
    subtitle = None
    for h3 in soup.find_all("h3"):
        if h3.find_parent(class_="elementskit-accordion") or "icon-box-title" in (h3.get("class") or []):
            continue
        t = h3.get_text(strip=True)
        if t and t.lower() not in ("fiyat teklifi alın",):
            subtitle = t
            break

    # teknik tablo(lar)
    specs, spec_issue = [], False
    for table in soup.find_all("table"):
        rows = table.find_all("tr")
        if not rows:
            continue
        head = [td.get_text(strip=True) for td in rows[0].find_all(["td", "th"])]
        body_rows = rows[1:] if head[:2] == ["Özellik", "Değer"] else rows
        if head[:2] != ["Özellik", "Değer"]:
            spec_issue = True
        for tr in body_rows:
            cells = [td.get_text(" ", strip=True) for td in tr.find_all(["td", "th"])]
            # boş ara kolonları atla (gulersan tarzı 3 kolonlu tablolar: etiket | boş | değer)
            non_empty = [c for c in cells if c]
            if len(non_empty) >= 2:
                specs.append({"name": non_empty[0], "value": non_empty[1]})
            elif len(non_empty) == 1 and len(cells) >= 2:
                specs.append({"name": non_empty[0], "value": ""})  # kaynakta gerçekten boş
    if spec_issue and specs:
        page_issues.append("tablo_basligi_standart_disi")
    if not specs:
        page_issues.append("teknik_tablo_yok")

    # SSS
    faqs = []
    for card in soup.find_all(class_="elementskit-card"):
        q = card.find(class_="ekit-accordion-title")
        a = card.find(class_="ekit-accordion--content")
        if q and a:
            faqs.append({"question": q.get_text(strip=True), "answer": clean_html(a)})
    if not faqs:
        page_issues.append("sss_yok")

    # açıklama bölümleri (text-editor widget'ları; tablo, form, accordion hariç)
    intro_parts, usage_html, why_html = [], None, None
    current = "intro"
    for el in soup.find_all(class_="elementor-widget"):
        wtype = el.get("data-widget_type", "")
        if wtype.startswith("heading"):
            t = el.get_text(strip=True)
            if re.match(r"Kullanım Alanları", t, re.I):
                current = "usage"
            elif t.startswith("Neden"):
                current = "why"
            elif t in ("Fiyat Teklifi Alın",):
                current = "form"
        if not wtype.startswith("text-editor"):
            continue
        if el.find("table") or el.find_parent(class_="elementskit-accordion"):
            continue
        htmlpart = clean_html(el.find(class_="elementor-widget-container") or el)
        if not htmlpart or "formu doldurarak" in htmlpart:
            continue
        if current == "intro":
            intro_parts.append(htmlpart)
        elif current == "usage":
            usage_html = (usage_html or "") + htmlpart
        elif current == "why":
            why_html = (why_html or "") + htmlpart

    description_html = "".join(intro_parts) or None
    if not description_html:
        page_issues.append("aciklama_yok")

    ext_imgs = [i["url"] for i in imgs if "hdmarine.com.tr" not in i["url"]]
    if ext_imgs:
        page_issues.append("harici_gorsel")

    products.append({
        "id": pid, "slug": x["slug"], "title": x["title"], "name_h1": name,
        "link": x["link"], "path": x["path"],
        "category_chain": category_chain(x),
        "primary_category_id": x["parent_id"],
        "subtitle": subtitle,
        "description_html": description_html,
        "usage_areas_html": usage_html,
        "why_hd_html": why_html,
        "specs": specs,
        "faqs": faqs,
        "images": imgs,
        "external_images": ext_imgs,
        "issues": page_issues,
    })
    if page_issues:
        issues.append({"id": pid, "slug": x["slug"], "path": x["path"], "issues": page_issues})

json.dump(products, open(DATA / "parsed/products.json", "w"), ensure_ascii=False, indent=1)
json.dump(categories, open(DATA / "parsed/categories.json", "w"), ensure_ascii=False, indent=1)
json.dump(issues, open(DATA / "parsed/parse-issues.json", "w"), ensure_ascii=False, indent=1)

# özet
import collections
print(f"ürün: {len(products)} | kategori: {len(categories)} | sorunlu sayfa: {len(issues)}")
cnt = collections.Counter(i for rec in issues for i in rec["issues"])
print("sorun dağılımı:", dict(cnt))
ok_full = sum(1 for p in products if not p["issues"])
print(f"tam temiz ürün (tablo+SSS+açıklama+yerel görsel): {ok_full}")
print(f"spec'li ürün: {sum(1 for p in products if p['specs'])} | SSS'li: {sum(1 for p in products if p['faqs'])} | açıklamalı: {sum(1 for p in products if p['description_html'])}")
print("örnek ürün:", json.dumps({k: v for k, v in products[0].items() if k in ('slug','subtitle','specs','faqs')}, ensure_ascii=False)[:600])
