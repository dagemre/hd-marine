#!/usr/bin/env python3
"""Sandbox testi icin minimal PostgREST mock'u (gercek DB'den fixture'lar)."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

ROOT = "d2486102-2ff1-5e87-9142-7c21416751fa"
YAGLAMA = "464e7bea-31e1-50b3-be49-cacbf879d4dd"
AKSESUAR = "d808f613-708c-5d13-ad43-a5c16e1ae5f7"
GRESAJ = "96af3c65-c168-59a8-bbbb-2cc11b60ce10"

def cat(id, parent, tr_name, tr_slug, en_name, en_slug):
    return {
        "id": id, "parent_id": parent, "sort_order": 0, "image_path": None,
        "category_translations": [
            {"locale": "tr", "name": tr_name, "slug": tr_slug, "description": "",
             "meta_title": f"{tr_name} | HD Marine", "meta_description": None},
            {"locale": "en", "name": en_name, "slug": en_slug, "description": "",
             "meta_title": f"{en_name} | HD Marine", "meta_description": None},
        ],
    }

CATEGORIES = [
    cat(ROOT, None, "Ürünler", "urunler", "Products", "products"),
    cat("ca63eeaa-4d9e-523e-af16-2f00271f2aab", ROOT, "Endüstriyel Pompalar", "endustriyel-pompalar", "Industrial Pumps", "industrial-pumps"),
    cat("fe616929-3d10-58f6-a98d-bbe7a1c266bb", ROOT, "Sızdırmazlık Elemanları", "sizdirmazlik-elemanlari", "Sealing Elements", "sealing-elements"),
    cat("32fad966-8a58-5264-aa55-446c7af8b2dd", ROOT, "Boru Tamir Ekipmanları", "boru-tamir-ekipmanlari", "Pipe Repair Equipment", "pipe-repair-equipment"),
    cat("65c388a7-cbb1-5fe9-a972-c140614240ac", ROOT, "Endüstriyel Ürünler", "endustriyel-urunler", "Industrial Products", "industrial-products"),
    cat("394ff7a8-adde-56ba-835b-5c4bad3484ee", ROOT, "Diyaframlı Pompa Yedek Parçaları", "diyaframli-pompa-yedek-parcalari", "Diaphragm Pump Spare Parts", "diaphragm-pump-spare-parts"),
    cat("20488bda-f483-56b0-afd2-68456c07f95f", ROOT, "Otomatik Boya Ekipmanları", "otomatik-boya-ekipmanlari", "Automatic Paint Equipment", "automatic-paint-equipment"),
    cat(YAGLAMA, ROOT, "Yağlama Cihazları", "yaglama-cihazlari", "Lubrication Equipment", "lubrication-equipment"),
    cat(AKSESUAR, YAGLAMA, "Aksesuarlar", "aksesuarlar", "Accessories", "accessories"),
    cat(GRESAJ, YAGLAMA, "Gresaj Bağlantı Parçaları", "gresaj-baglanti-parcalari", "Greasing Fittings", "greasing-fittings"),
    cat("fb6d972f-70ec-5119-9684-32c9990f5176", YAGLAMA, "Elektrikli Yağ Pompaları", "elektrikli-yag-pompalari", "Electric Oil Pumps", "electric-oil-pumps"),
]

P1 = "bcb30cc7-0313-5dd1-90dd-e0267c3f5f01"
P2 = "702996f4-375d-5bb4-950c-2e7f63f3a685"
P1_IMG = {"id": "dd3043b1-9a00-55c9-9e66-e8276cb4b303",
          "storage_path": "products/uzun-hava-tabancasi-0243/0243-Uzun-Hava-Tabancasi.jpg",
          "alt_tr": "Uzun Hava Tabancası – 0243", "alt_en": None, "sort_order": 0, "is_primary": True}

CARDS = [
    {"id": P1, "brand": None, "sort_order": 0, "primary_category_id": AKSESUAR,
     "product_translations": [
         {"locale": "en", "name": "Long Air Blow Gun – 0243", "slug": "long-air-blow-gun-0243", "summary": ""},
         {"locale": "tr", "name": "Uzun Hava Tabancası – 0243", "slug": "uzun-hava-tabancasi-0243", "summary": ""}],
     "product_images": [P1_IMG]},
    {"id": P2, "brand": None, "sort_order": 0, "primary_category_id": GRESAJ,
     "product_translations": [
         {"locale": "en", "name": "Grease Lubrication Kit – 44950", "slug": "grease-lubrication-kit-44950", "summary": ""},
         {"locale": "tr", "name": "Gres Yağlama Kiti – 44950", "slug": "gres-yaglama-kiti-44950", "summary": ""}],
     "product_images": [{"id": "802cf6e9-efb4-5eaf-8c6c-ff673790359a",
                          "storage_path": "products/gres-yaglama-kiti-44950/44950-yaglama-kiti-2-1.jpg",
                          "alt_tr": "Gres Yağlama Kiti – 44950", "alt_en": None, "sort_order": 0, "is_primary": True}]},
]

P1_FULL = {
    "id": P1, "sku": None, "brand": None, "is_featured": False, "primary_category_id": AKSESUAR,
    "product_translations": [
        {"locale": "en", "name": "Long Air Blow Gun – 0243", "slug": "long-air-blow-gun-0243", "summary": "",
         "description": "<div><p><strong>Why the 0243 Long Air Blow Gun?</strong></p><p>The air blow gun operates on compressed air.</p></div>",
         "usage_areas": "", "meta_title": "Long Air Blow Gun – 0243 | HD Marine",
         "meta_description": "Why the 0243 Long Air Blow Gun? The air blow gun operates on compressed air."},
        {"locale": "tr", "name": "Uzun Hava Tabancası – 0243", "slug": "uzun-hava-tabancasi-0243", "summary": "",
         "description": "<div><p><strong>Neden 0243 Uzun Hava Tabancası ?</strong></p><p>Hava tabancası basınçlı hava ile çalışır.</p></div>",
         "usage_areas": "", "meta_title": "Uzun Hava Tabancası – 0243 | HD Marine",
         "meta_description": "Neden 0243 Uzun Hava Tabancası ? Hava tabancası basınçlı hava ile çalışır."}],
    "product_images": [P1_IMG],
    "product_specs": [{"id": "3ae449fc-88ca-5e6a-990d-52c4cd829807", "sort_order": 0,
                       "product_spec_translations": [
                           {"locale": "tr", "label": "Model", "value": "0243"},
                           {"locale": "en", "label": "Model", "value": "0243"}]}],
    "product_faqs": [],
    "product_categories": [{"category_id": AKSESUAR}],
}

SLUG_TO_PRODUCT = {
    "uzun-hava-tabancasi-0243": P1, "long-air-blow-gun-0243": P1,
    "gres-yaglama-kiti-44950": P2, "grease-lubrication-kit-44950": P2,
}

REDIRECTS = [
    {"old_path": "/urunler/diyaframli-pompa-yedek-parcalari/graco-uyumlu-yedek-parca/", "new_path": "/urunler/yaglama-cihazlari/elektrikli-yag-pompalari/graco-uyumlu-yedek-parca/", "status_code": 301},
    {"old_path": "/urunler/yaglama-cihazlari/aksesuarlar/gres-yaglama-kiti-44950/", "new_path": "/urunler/yaglama-cihazlari/gresaj-baglanti-parcalari/gres-yaglama-kiti-44950/", "status_code": 301},
    {"old_path": "/urunler/yaglama-cihazlari/aksesuarlar/sayfa2/", "new_path": "/urunler/yaglama-cihazlari/aksesuarlar/", "status_code": 301},
]

class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _json(self, payload, status=200):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path, _, query = self.path.partition("?")
        wants_object = "vnd.pgrst.object" in (self.headers.get("Accept") or "")

        if path == "/rest/v1/redirects":
            return self._json(REDIRECTS)
        if path == "/rest/v1/categories":
            return self._json(CATEGORIES)
        if path == "/rest/v1/product_translations":
            for slug, pid in SLUG_TO_PRODUCT.items():
                if f"slug=eq.{slug}" in query:
                    return self._json({"product_id": pid} if wants_object else [{"product_id": pid}])
            if wants_object:
                return self._json({"code": "PGRST116", "message": "0 rows", "details": None, "hint": None}, 406)
            return self._json([])
        if path == "/rest/v1/products":
            if f"id=eq.{P1}" in query:
                return self._json(P1_FULL if wants_object else [P1_FULL])
            if f"product_categories.category_id=eq.{AKSESUAR}" in query:
                return self._json(CARDS)
            if "product_categories.category_id=eq." in query:
                return self._json([])
            if wants_object:
                return self._json({"code": "PGRST116", "message": "0 rows", "details": None, "hint": None}, 406)
            return self._json([])
        return self._json([], 200)

HTTPServer(("127.0.0.1", 8787), H).serve_forever()
