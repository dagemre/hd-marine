# HD Marine — Faz 1 Migrasyon Raporu

**Tarih:** 7 Haziran 2026 · **Durum:** ✅ **FAZ 1 TAMAMLANDI** (onay alındı, import + görseller + EN çeviriler bitti — sonuçlar için §9)

> Bu rapor onaylanmadan veritabanına ürün import edilmedi ve Storage'a görsel yüklenmedi.
> Tüm ham veri ve analiz çıktıları local olarak `hd-marine/scripts/migrate/data/` altında duruyor.

---

## 1. Özet

| Metrik | Değer |
|---|---|
| Çekilen sayfa | **324/324** (WP REST API, tamamı doğrulandı, 0 bozuk) |
| Kurumsal sayfa | 8 (anasayfa, hakkımızda, sektörler, kataloglar, ürünler-kökü, iletişim, teklif-alın, 404) |
| Kategori | 35 (7 ana + 28 alt; 5 seviyeye kadar derinlik) |
| Ürün sayfası | 282 → önerilen **277 ürün entity** (birleştirme/eleme sonrası, §4) |
| Teknik tablosu olan ürün | 251 (toplam 1.813 spec satırı) |
| SSS'i olan ürün | 80 (toplam 319 soru-cevap) |
| Açıklaması olan ürün | 277 |
| Benzersiz görsel | 527 (485 hdmarine.com.tr + **42 gulersan.com**) |
| Görselsiz ürün | 0 |
| Çevrilecek içerik (EN) | ~306.000 karakter |

**Veri dosyaları:**
- Ham veri: `scripts/migrate/data/raw/pages/{id}.json` (324 dosya, tüm WP alanları)
- İndeks: `data/parsed/index.json` · Sınıflandırma: `classification.json`
- Ürünler: `products.json` · Kategoriler: `categories.json`
- Duplicate raporu: `duplicates-report.json` · Görsel envanteri: `images-inventory.json` · Sorunlar: `parse-issues.json`
- Script'ler: `scripts/migrate/02-classify.py`, `03-duplicates.py`, `04-images.py`, `05-parse-content.py` (tekrar çalıştırılabilir)

---

## 2. Sınıflandırma

Ağaç konumu (urunler kökü altında mı, çocuğu var mı) + içerik sinyalleriyle yapıldı:

```
kurumsal (8) ─ anasayfa, hakkimizda, sektorler, kataloglar, iletisim, teklif-alin, 404-2, urunler(kök)
ana kategoriler (7):
  endustriyel-pompalar (10 alt) · sizdirmazlik-elemanlari (6) · boru-tamir-ekipmanlari (2)
  endustriyel-urunler (3) · diyaframli-pompa-yedek-parcalari (7) · otomatik-boya-ekipmanlari (4)
  yaglama-cihazlari (22 alt — en büyük dal, ~200 ürün)
derinlik dağılımı: 1→8, 2→7, 3→54, 4→251, 5→4
```

Not: Bellekteki ilk tahmin "~54 alt kategori, ~255 ürün" idi; gerçek yapı **34 kategori + 282 ürün** çıktı (derinlik-3'teki sayfaların bir kısmı çocuksuz, yani doğrudan ürün).

---

## 3. Veri kalitesi bulguları

| Bulgu | Adet | Değerlendirme |
|---|---|---|
| Başlıksız teknik tablo (Özellik/Değer satırı yok, direkt veri) | 190 ürün | Sorun değil — satırlar ad/değer çifti olarak sağlam parse edildi |
| Teknik tablosu hiç olmayan ürün | 31 | Çoğu kimyasal/yedek parça listeleme sayfası (gemi-kimyasallari, *-uyumlu-yedek-parca vb.) — doğal |
| SSS'i olmayan ürün | 202 | Eski sitede SSS sadece 80 üründe var — eksik değil, mevcut durum |
| Açıklamasız ürün | 5 | `havali-gres-pompasi-10-kg-2110`, `paletli-yag-pompalari`, `disli-yag-pompalari`, `hortumlar`, `elektrikli-yag-cekme-pompalari` — içerik girilmemiş |
| `<h1>` etiketi olmayan | 2 | `paslanmaz-basincli-boya-kazani-10-litre`, `gast-hava-motoru-1am-nrv-39a` (başlık indeksten alındı) |
| Alt text'siz görsel | 349/527 | SEO için yeni sitede alt text üretilmeli (ürün adından otomatik + admin düzeltme) |
| Türkçe karakter hatası | 2 | id 279 "Endustriyel Pompalar", id 6599 "Elektirikli" — düzeltme önerilir |

**Teknik değerler birebir korundu, hiçbir değer uydurulmadı.** Parse edilemeyen alan kalmadı; şüpheli olanların tamamı `parse-issues.json`'da.

---

## 4. Duplicate ve slug çakışmaları — ONAY GEREKEN KARARLAR

### 4a. Aynı ürün iki kategoride (tek ürün + çoklu kategori önerisi)
| Ürün | Sayfalar | Öneri |
|---|---|---|
| `gres-yaglama-kiti-44950` | id 4397 (gresaj-baglanti-parcalari) + id 4740 (aksesuarlar) | **Tek ürün**, `product_categories` ile 2 kategori; primary: gresaj-baglanti-parcalari → canonical URL oradan, diğer URL 301 |
| `graco-uyumlu-yedek-parca` | id 2741 (diyaframli-pompa-yedek-parcalari) + id 4476 (yaglama-cihazlari dalı) | **Tek ürün**, 2 kategori; primary: diyaframli-pompa-yedek-parcalari |
| `tecomec-0543-tetiksiz-basincli-yikama-tabancasi` | id 4776 (`-3`) + id 4777 (`-2`) — aynı başlık, aynı kategori | İçerik karşılaştırılıp **tek ürüne birleştirme**; diğer URL 301 |

### 4b. Hatalı/özel sayfalar
| Sayfa | Sorun | Öneri |
|---|---|---|
| id 5185 `elektrikli-yag-cekme-pompalari` | Parent'ıyla aynı slug → `/x/x/` çift segment URL; yaprak ama listeleme içeriyor | Import etme; eski URL → kategori sayfasına (id 4266) **301** |
| id 3889 `sayfa2` | Elle açılmış pagination sayfası | Import etme; yeni sitede gerçek pagination; URL → aksesuarlar kategorisine 301 |
| id 684 `404-2` | WP 404 şablon sayfası | İçerik (arama önerisi mesajı) yeni 404 tasarımına ilham; sayfa olarak import edilmez |

### 4c. `-2/-3` sonekli ama base'i olmayan 15 ürün
(sagola-4100-xtreme-2, asturo-k30-airless-pompa-2, hava-motoru-2 vb.) — orijinalleri WP çöpünde/silinmiş; yayındaki slug bu. **URL'ler birebir korunur**, işlem gerekmez. Yeni sitede admin panelden istenirse slug temizliği + 301 yapılabilir (opsiyonel).

**Sonuç: 282 sayfa → 277 ürün entity** (3 birleştirme −3, sayfa2 −1, 5185 −1).
Canonical URL kuralı her üründe primary category zincirinden üretilecek: `/urunler/{ana}/{alt}/{urun-slug}/`.

---

## 5. Görsel envanteri (Storage'a henüz YÜKLENMEDİ)

- **527 benzersiz görsel** tespit edildi: 405 jpg, 100 png, 19 webp, 2 jpeg, 1 gif.
- Her ürünün en az 1 görseli var. `srcset`'ten orijinal (en büyük) boyut URL'leri çıkarıldı; WP'nin `-300x300` türevi küçük boyutları değil **orijinaller** taşınacak → görseller birebir korunur.
- ⚠️ **42 görsel `www.gulersan.com`'da barınıyor** (175 yağlama ürününde paylaşımlı kullanılıyor). Bunlar tedarikçi sitesinden hotlink. Önerim: onayla birlikte bu 42 dosya da indirilip kendi Storage'ımıza alınır (hotlink kırılganlığı + performans + KVKK açısından doğrusu).
- Yükleme planı (onay sonrası): `product-images` bucket'ına `urunler/{kategori}/{slug}/{dosya-adi}` yapısıyla; orijinal dosya adları korunur; `images-inventory.json` → DB `product_images` eşlemesi script ile.

---

## 6. EN çeviri otomatik taslak planı

**Hacim:** ~306k karakter ürün içeriği + 784 karakter kategori adı + kurumsal sayfalar.

| Alan | Hacim | Yöntem |
|---|---|---|
| Spec adları | 195 benzersiz ad (18.9k kr) | **Sözlük yaklaşımı**: 195 ad bir kez çevrilir, tüm 1.813 satıra uygulanır → tutarlı terminoloji |
| Spec değerleri | 267 benzersiz değer | Sayı/birim içerenler olduğu gibi; metin olanlar (ör. "Havalı / Elektrikli") sözlükten |
| Başlık + alt başlık | 13.8k kr | LLM, marine/endüstri terminoloji talimatıyla |
| Açıklama + kullanım alanı + neden-HD | 215k kr | LLM, HTML yapısı korunarak alan alan |
| SSS (319 adet) | 43.8k kr | LLM |
| Kategori + kurumsal | küçük | LLM + elle gözden geçirme öncelikli |

**Akış:** Import sırasında her kayıt için `*_translations` tablolarına EN satırı `translation_status='auto'` ile yazılır → Faz 3 admin panelinde alan bazında gözden geçirilip `reviewed` yapılır. Teknik değerler (sayılar, birimler, malzeme kodları PTFE/EPDM vb.) çeviride **asla değiştirilmez** — sözlük + birim koruma kuralı script'e gömülür. SEO: EN sayfalar `/en/products/...` yapısında, hreflang çiftleri otomatik.

---

## 7. Onay sonrası import planı

1. `06-import.py`: kategoriler (35) → ürünler (277) → spec/SSS/çeviriler — `service_role` key ile, idempotent (yeniden çalıştırılabilir).
2. `07-upload-images.py`: 527 görsel (485 hdmarine + 42 gulersan) → `product-images` bucket; DB eşleme.
3. EN otomatik çeviri üretimi (§6) → `translation_status='auto'`.
4. `08-verify.py`: sayı/bütünlük kontrolü (277 ürün, 1.813 spec, 319 SSS, görsel eşleşmeleri) + örneklem karşılaştırma raporu.
5. 301 yönlendirme tablosu (5185, sayfa2, birleştirilen 3 ürünün ikincil URL'leri).

**Onay gereken kararlar (özet):** §4a'daki 3 birleştirme · §4b'deki 2 eleme+301 · gulersan görsellerinin Storage'a alınması · EN çeviri akışının bu haliyle başlaması.

---

## 8. Operasyon notları (bilgi)

- Sandbox'tan hdmarine.com.tr'ye doğrudan ağ kapalı olduğundan çekim `web_fetch` + tarayıcı üzerinden, paralel alt-ajanlarla yapıldı; 3 dev sayfa (3311, 3312, 3889) için Supabase **`pg_net` extension'ı geçici olarak etkinleştirildi** — istenirse kaldırılabilir (`net._http_response` geçici satırları silindi).
- `~/Downloads/hd_marine_pages_raw_39.json` ve `hd_marine_4489.json` ara dosyaları kalmış olabilir — silinebilir.
- Eski sitedeki GTM-NW5LSXZR ve WPForms/MetForm form alanları (teklif formu: isim, e-posta, telefon, ürün grubu, mesaj) yeni siteye taşınacaklar listesinde.

---

## 9. İMPORT SONUÇLARI (onay sonrası — Faz 1 kapanışı)

Emre'nin onayıyla (7 Haziran 2026) tüm plan uygulandı. **Final doğrulama sonuçları:**

| Kontrol | Beklenen | DB | Durum |
|---|---|---|---|
| categories / çevirileri (TR+EN) | 35 / 70 | 35 / 70 | ✓ |
| products | 277 | 277 | ✓ |
| product_translations (TR+EN) | 554 | 554 | ✓ |
| product_categories (çoklu kategori dahil) | 279 | 279 | ✓ |
| product_specs / çevirileri (TR+EN) | 1.807 / 3.614 | 1.807 / 3.614 | ✓ |
| product_faqs / çevirileri (TR+EN) | 319 / 638 | 319 / 638 | ✓ |
| product_images ↔ Storage objesi | 378 ↔ 378 | birebir, kırık referans 0 | ✓ |
| redirects (301) | 5 | 5 | ✓ |
| EN'i eksik ürün / duplicate slug / kopuk kategori | 0 | 0 | ✓ |

**Süreçte yakalanan ve düzeltilen sorunlar:**
1. **3 kolonlu tablolar** (gulersan kaynaklı: etiket | boş | değer): ilk parser 901 spec değerini boş okumuştu → parser düzeltildi, tüm değerler gerçek verileriyle aktarıldı (49 gerçekten boş satır boş string olarak korundu — çoğu set/kit içerik listesi).
2. **`cizgi.jpg` dekoratif ayraç** 172 üründe ürün görseli sanılmıştı → temizlendi (380 gerçek görsel planı kaldı).
3. **2 görsel kaynak sitede de kırık (404):** `hizli-gres-ucu-43545` ve `yag-tabanca-askiligi-7110` ürünlerinin tek görselleri yoktu → bu 2 ürün şu an görselsiz, **admin panelden görsel eklenecekler listesi**ne alındı.
4. Kategori adlarındaki yazım tutarsızlıkları düzeltildi ("Endustriyel"→"Endüstriyel", "Yağlama cihazları"→"Yağlama Cihazları" vb.).

**EN çeviri notları:** TR kaynak dil `reviewed`, tüm EN satırları `translation_status='auto'` (Faz 3 admin panelinde gözden geçirilecek). Spec etiketleri 195 kayıtlık tutarlı sözlükle çevrildi; model kodları, birimler, malzeme/marka adları birebir korundu. İYP/İGP gibi Türkçe model kodları bilinçli olarak değiştirilmedi. EN slug'lar benzersiz; SEO meta'ları (title + ~155 karakter description) iki dilde üretildi.

**Kalan altyapı notları:** `pg_net` extension açık (kaldırılabilir); `migrate-images` edge function devre dışı stub olarak duruyor (silinebilir); `~/Downloads/hd_marine_*.json` ara dosyaları silinebilir.

**Sıradaki faz:** Faz 2 — frontend temel yapı; ardından Faz 3 — admin panel (çeviri/görsel kontrolü için public sayfalardan önce).
