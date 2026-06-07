#!/usr/bin/env python3
"""
HD Marine Faz 1 — Adım 3: Sayfa sınıflandırma
Girdi : data/parsed/index.json + data/raw/pages/{id}.json
Çıktı : data/parsed/classification.json
Mantık: ağaç konumu (urunler kökü altı mı, çocuğu var mı) + içerik sinyalleri
        (Teknik Değer Tablosu, SSS accordion, "ÜRÜNÜ GÖRÜNTÜLE" listesi, teklif formu)
"""
import json, re, collections
from pathlib import Path

DATA = Path(__file__).parent / "data"
URUNLER_ROOT = 128  # /urunler/

idx = json.load(open(DATA / "parsed/index.json"))
by_id = {r["id"]: r for r in idx}
children = collections.defaultdict(list)
for r in idx:
    if r["parent_id"]:
        children[r["parent_id"]].append(r["id"])

def chain(pid):
    """parent zinciri (kendisi dahil, kökten yaprağa)"""
    out = []
    cur = pid
    seen = set()
    while cur and cur in by_id and cur not in seen:
        seen.add(cur)
        out.append(cur)
        cur = by_id[cur]["parent_id"]
    return list(reversed(out))

def signals(pid):
    html = json.load(open(DATA / f"raw/pages/{pid}.json"))["content"]["rendered"]
    return {
        "has_spec_table": bool(re.search(r"Teknik\s+Değer\s+Tablosu|<td[^>]*>\s*Özellik\s*</td>", html)),
        "has_faq": "elementskit-accordion" in html,
        "has_product_listing": ("ÜRÜNÜ GÖRÜNTÜLE" in html) or ("TÜM ÜRÜNLERİ GÖRÜNTÜLE" in html),
        "has_quote_form": ("wpforms" in html) or ("metform" in html),
        "content_len": len(html),
    }

result = []
for r in idx:
    pid = r["id"]
    ch = chain(pid)
    in_product_tree = URUNLER_ROOT in ch
    n_children = len(children.get(pid, []))
    sig = signals(pid)

    if pid == URUNLER_ROOT:
        ptype = "category_root"
    elif not in_product_tree:
        ptype = "corporate"
    elif n_children > 0:
        ptype = "category"
    else:
        ptype = "product"

    # şüpheli durumlar
    flags = []
    if ptype == "product" and not sig["has_spec_table"]:
        flags.append("urun_ama_teknik_tablo_yok")
    if ptype == "category" and sig["has_spec_table"]:
        flags.append("kategori_ama_teknik_tablo_var")
    if ptype == "product" and sig["has_product_listing"]:
        flags.append("urun_ama_listeleme_var")
    if re.search(r"-\d+$", r["slug"]) and not re.search(r"\d{4,}$", r["slug"]):
        flags.append("slug_sayisal_sonek")  # -2/-3 kopya adayı
    parent = by_id.get(r["parent_id"])
    if parent and parent["slug"] == r["slug"]:
        flags.append("parent_ile_ayni_slug")

    result.append({
        "id": pid,
        "slug": r["slug"],
        "title": r["title"],
        "link": r["link"],
        "type": ptype,
        "depth": len(ch),
        "parent_id": r["parent_id"],
        "path": "/".join(by_id[c]["slug"] for c in ch),
        "children_count": n_children,
        **sig,
        "flags": flags,
    })

json.dump(result, open(DATA / "parsed/classification.json", "w"), ensure_ascii=False, indent=1)

# özet
cnt = collections.Counter(x["type"] for x in result)
print("TÜRLER:", dict(cnt))
print("\nKURUMSAL SAYFALAR:")
for x in result:
    if x["type"] in ("corporate", "category_root"):
        print(f"  {x['id']:5d} {x['slug']:30s} {x['title']}")
print("\nANA KATEGORİLER (urunler'in çocukları):")
for x in result:
    if x["parent_id"] == URUNLER_ROOT:
        print(f"  {x['id']:5d} {x['slug']:35s} çocuk:{x['children_count']:3d} {x['title']}")
print("\nDERİNLİK DAĞILIMI:", dict(collections.Counter(x["depth"] for x in result)))
print("\nBAYRAKLI SAYFALAR:")
for x in result:
    if x["flags"]:
        print(f"  {x['id']:5d} {x['type']:9s} {x['slug']:45s} {x['flags']}")
