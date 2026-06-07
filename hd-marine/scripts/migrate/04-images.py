#!/usr/bin/env python3
"""
HD Marine Faz 1 — Adım 5: Görsel envanteri (Storage'a YÜKLEME YOK — sadece tespit)
Girdi : data/raw/pages/{id}.json + data/parsed/classification.json
Çıktı : data/parsed/images-inventory.json
Not   : Ürün görselleri birebir korunacak; srcset'ten en büyük (orijinal) URL alınır.
"""
import json, re, collections
from pathlib import Path
from bs4 import BeautifulSoup

DATA = Path(__file__).parent / "data"
cls = {x["id"]: x for x in json.load(open(DATA / "parsed/classification.json"))}

def largest_from_srcset(srcset):
    best, best_w = None, -1
    for part in srcset.split(","):
        bits = part.strip().split()
        if not bits:
            continue
        url = bits[0]
        w = int(bits[1][:-1]) if len(bits) > 1 and bits[1].endswith("w") else 0
        if w > best_w:
            best, best_w = url, w
    return best

# WP boyut soneki (-300x300 vb.) temizleyip orijinali tahmin et
def strip_size_suffix(url):
    return re.sub(r"-\d+x\d+(?=\.(jpg|jpeg|png|webp|gif)$)", "", url, flags=re.I)

images = {}   # canonical_url -> kayıt
page_stats = []
SKIP = re.compile(r"submit-spin\.svg|data:image|wpforms-lite/assets", re.I)

for pid, meta in cls.items():
    html = json.load(open(DATA / f"raw/pages/{pid}.json"))["content"]["rendered"]
    soup = BeautifulSoup(html, "html.parser")
    found = []
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if not src or SKIP.search(src):
            continue
        original = strip_size_suffix(largest_from_srcset(img["srcset"]) if img.get("srcset") else src)
        found.append({"url": original, "alt": (img.get("alt") or "").strip(), "rendered_src": src})
    # inline style / data-settings içindeki arkaplan görselleri
    for m in re.finditer(r'url\((?:&quot;|\"|\')?(https?://[^)\"\'&]+?\.(?:jpg|jpeg|png|webp|gif))', html, re.I):
        u = strip_size_suffix(m.group(1))
        if not SKIP.search(u):
            found.append({"url": u, "alt": "", "rendered_src": m.group(1), "background": True})

    seen_page = set()
    for f in found:
        u = f["url"]
        if u in seen_page:
            continue
        seen_page.add(u)
        rec = images.setdefault(u, {"url": u, "alts": set(), "pages": [], "is_background": False})
        if f["alt"]:
            rec["alts"].add(f["alt"])
        rec["pages"].append({"id": pid, "type": meta["type"], "slug": meta["slug"]})
        if f.get("background"):
            rec["is_background"] = True
    page_stats.append({"id": pid, "type": meta["type"], "slug": meta["slug"], "image_count": len(seen_page)})

inv = {
    "toplam_benzersiz_gorsel": len(images),
    "gorseller": [{**r, "alts": sorted(r["alts"])} for r in images.values()],
    "sayfa_istatistikleri": page_stats,
    "gorselsiz_urunler": [p for p in page_stats if p["type"] == "product" and p["image_count"] == 0],
    "alt_text_olmayan": [u for u, r in images.items() if not r["alts"] and not r["is_background"]],
}
json.dump(inv, open(DATA / "parsed/images-inventory.json", "w"), ensure_ascii=False, indent=1)

print("Benzersiz görsel:", inv["toplam_benzersiz_gorsel"])
print("Görselsiz ürün sayısı:", len(inv["gorselsiz_urunler"]))
for p in inv["gorselsiz_urunler"][:20]:
    print("  ", p)
print("Alt text'siz görsel sayısı:", len(inv["alt_text_olmayan"]))
exts = collections.Counter(u.rsplit(".", 1)[-1].lower() for u in images)
print("Uzantılar:", dict(exts))
host = collections.Counter(re.match(r"https?://([^/]+)", u).group(1) for u in images)
print("Host'lar:", dict(host))
