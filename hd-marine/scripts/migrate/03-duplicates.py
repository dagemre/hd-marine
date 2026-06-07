#!/usr/bin/env python3
"""
HD Marine Faz 1 — Adım 4: Duplicate ve slug çakışma raporu
Girdi : data/parsed/classification.json
Çıktı : data/parsed/duplicates-report.json
Kural : duplicate ürünlerde tek ürün + çoklu kategori (product_categories) yaklaşımı;
        canonical URL daima primary category zincirinden üretilir.
"""
import json, re, collections
from pathlib import Path

DATA = Path(__file__).parent / "data"
cls = json.load(open(DATA / "parsed/classification.json"))
by_id = {x["id"]: x for x in cls}

report = {
    "ayni_slug_farkli_id": [],      # birebir aynı slug, farklı sayfa
    "sonekli_kopya": [],            # base-2 / base-3 varyantları (base mevcutsa)
    "ayni_baslik_farkli_slug": [],  # başlık aynı, slug farklı
    "parent_ile_ayni_slug": [],
    "ozel_anomaliler": [],
}

# 1) birebir aynı slug
slug_map = collections.defaultdict(list)
for x in cls:
    slug_map[x["slug"]].append(x)
for slug, items in slug_map.items():
    if len(items) > 1:
        report["ayni_slug_farkli_id"].append({
            "slug": slug,
            "pages": [{"id": i["id"], "type": i["type"], "path": i["path"], "link": i["link"]} for i in items],
            "oneri": "Tek ürün kaydı + product_categories ile her iki kategoriye bağla; "
                     "canonical URL primary category zincirinden",
        })

# 2) -N sonekli kopyalar (base slug gerçekten mevcutsa)
all_slugs = set(slug_map)
for x in cls:
    m = re.match(r"^(.*)-(\d)$", x["slug"])  # tek haneli sonek: -2..-9
    if not m:
        continue
    base = m.group(1)
    if base in all_slugs:
        base_items = slug_map[base]
        report["sonekli_kopya"].append({
            "kopya": {"id": x["id"], "slug": x["slug"], "title": x["title"], "path": x["path"]},
            "base": [{"id": b["id"], "slug": b["slug"], "title": b["title"], "path": b["path"]} for b in base_items],
            "ayni_baslik": any(b["title"] == x["title"] for b in base_items),
        })

# 2b) soneki var ama base slug sitede yok (orijinali silinmiş/çöpte olabilir — URL birebir korunur)
for x in cls:
    m = re.match(r"^(.*)-(\d)$", x["slug"])
    if m and m.group(1) not in all_slugs and x["type"] == "product":
        # model numarası gibi görünenleri ele: başlık zaten rakamla bitiyorsa atla
        if not re.search(r"\d\s*$", x["title"]):
            report.setdefault("sonekli_ama_base_yok", []).append({
                "id": x["id"], "slug": x["slug"], "title": x["title"], "path": x["path"],
                "not": "WP -N soneki; orijinal slug yayında değil. URL birebir korunacak, sadece bilgi.",
            })

# 3) aynı başlık, farklı slug (sonekli kopyalarda yakalanmayanlar)
title_map = collections.defaultdict(list)
for x in cls:
    if x["type"] == "product":
        title_map[x["title"].strip().lower()].append(x)
flagged_ids = {k["kopya"]["id"] for k in report["sonekli_kopya"]} | \
              {p["id"] for g in report["ayni_slug_farkli_id"] for p in g["pages"]}
for t, items in title_map.items():
    if len(items) > 1 and not all(i["id"] in flagged_ids for i in items[1:]):
        report["ayni_baslik_farkli_slug"].append({
            "title": items[0]["title"],
            "pages": [{"id": i["id"], "slug": i["slug"], "path": i["path"]} for i in items],
        })

# 4) parent ile aynı slug
for x in cls:
    if "parent_ile_ayni_slug" in x["flags"]:
        report["parent_ile_ayni_slug"].append({
            "id": x["id"], "slug": x["slug"], "link": x["link"],
            "parent_id": x["parent_id"],
            "sorun": "URL'de çift segment oluşuyor (ör. /a/a/); muhtemelen yanlış iç içe sayfa",
        })

# 5) özel anomaliler
for x in cls:
    if x["slug"] == "sayfa2":
        report["ozel_anomaliler"].append({
            "id": x["id"], "slug": x["slug"], "path": x["path"],
            "sorun": "Elle açılmış pagination sayfası — yeni sitede gerçek pagination ile çözülür, import edilmemeli",
        })
    if x["type"] == "product" and x["has_product_listing"]:
        report["ozel_anomaliler"].append({
            "id": x["id"], "slug": x["slug"], "path": x["path"],
            "sorun": "Yaprak sayfa ama ürün listeleme içeriyor — kategori sayfası olabilir, elle kontrol",
        })

json.dump(report, open(DATA / "parsed/duplicates-report.json", "w"), ensure_ascii=False, indent=1)

for k, v in report.items():
    print(f"\n=== {k} ({len(v)}) ===")
    for item in v[:40]:
        print(" ", json.dumps(item, ensure_ascii=False)[:200])
