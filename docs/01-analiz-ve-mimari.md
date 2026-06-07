# HD Marine — Analiz ve Mimari Dokümanı (v1)

> Tarih: 7 Haziran 2026 · Durum: Onay bekliyor · Kod yazımı başlamadı

---

## 1. Mevcut WordPress Sitesi Analizi

### 1.1 Platform
| Bileşen | Tespit |
|---|---|
| CMS | WordPress + Elementor 4.0.1 (sayfa kurucu) |
| Tema | Twenty Seventeen tabanlı + Header Footer Elementor (HFE) |
| Eklentiler | ElementsKit, MetForm (formlar), Wordfence (güvenlik), WPForms Lite |
| Analitik | Google Tag Manager (GTM-NW5LSXZR) |
| SEO eklentisi | **YOK** (Yoast/RankMath yok) — meta description'lar eksik |
| Çok dillilik | **YOK** (Polylang/WPML yok) — site tamamen Türkçe |
| E-ticaret | **YOK** — WooCommerce kullanılmamış; tüm ürünler hiyerarşik "page" olarak kurgulanmış |

### 1.2 Sayfa Envanteri (WP REST API ile doğrulandı)
**Toplam: 324 sayfa**

| Tip | Adet | Açıklama |
|---|---|---|
| Kurumsal sayfa | 8 | Anasayfa, Hakkımızda, Sektörler, Kataloglar, Ürünler, İletişim, Teklif Alın, 404 |
| Ana kategori | 7 | Endüstriyel Pompalar, Sızdırmazlık Elemanları, Boru Tamir Ekipmanları, Endüstriyel Kimyasallar, Diyaframlı Pompa Yedek Parçaları, Otomatik Boya Ekipmanları, Yağlama Cihazları |
| Alt kategori | ~54 (+2 ara seviye) | En büyüğü Yağlama Cihazları: 22 alt kategori |
| Ürün detay | ~255 | Çoğunluğu Yağlama Cihazları ve Boya Ekipmanları altında |

Hiyerarşi 4 seviyeye kadar iniyor:
`/urunler/yaglama-cihazlari/yag-cekme-pompalari/elektrikli-yag-cekme-pompalari/{ürün}/`

### 1.3 Kategori Ağacı (özet)
- **Endüstriyel Pompalar** (10 alt): Blower, Dişli Pompa, Diyaframlı Pompa, Dozaj Pompası, Manyetik Asit Pompaları, Monopompa, Mono Pompa Yedek Parça, Lobe Pompa, Vakum Pompası, Varil Pompası
- **Sızdırmazlık Elemanları** (6 alt): Anti Splashing Tape, Ambar Kapak Bantları, Grafitli/Klingrit Contalar, Spiral Sarımlı Çelik Conta, Teflon Contalar, Yumuşak Salmastralar
- **Boru Tamir Ekipmanları** (2 alt): Kelepçeler, Bandaj
- **Endüstriyel Kimyasallar** (3 alt): Gemi Kimyasalları, Sanayi Kimyasalları, Termal Etiket
- **Diyaframlı Pompa Yedek Parçaları** (7 alt): Aro, Blagdon, Graco, Sandpiper, Versa-Matic, Wilden, Yamada uyumlu
- **Otomatik Boya Ekipmanları** (4 alt): Airless Makinalar, Basınçlı Kazanlar, Boya Tabancaları, Karıştırıcılar
- **Yağlama Cihazları** (22 alt): Gres pompaları, yağ pompaları, varil sistemleri, aksesuarlar (59 ürün)...

### 1.4 Ürün/Kategori Detay Sayfası Yapısı (mevcut)
Örnek (Blower) sayfasından tespit edilen içerik blokları:
1. Başlık + breadcrumb
2. Ürün görseli (içeriğe gömülü, featured image kullanılmamış)
3. Pazarlama açıklaması (zengin metin)
4. "Neden HD Marine?" madde listesi
5. **Teknik Değer Tablosu** (Özellik | Değer formatında HTML tablo)
6. Teknik avantajlar listesi
7. **SSS accordion** (4-5 soru/cevap)
8. Teklif formu (MetForm/WPForms)

### 1.5 Görseller
- Tümü `/wp-content/uploads/YYYY/MM/` altında; WP Media REST endpoint **açık** (`source_url`, boyut varyantları, alt_text erişilebilir)
- Sayfalarda `featured_media: 0` → görseller Elementor HTML içine gömülü; migrasyonda HTML parse edilerek çıkarılacak

### 1.6 SEO Durumu (mevcut)
- Title formatı: `{Sayfa Adı} – HD Marine` (otomatik), meta description çoğunlukla yok
- `wp-sitemap.xml` (WP varsayılanı) mevcut, canonical'lar doğru
- Schema.org / JSON-LD yok, hreflang yok, OG etiketleri eksik
- URL'ler SEO dostu ve hiyerarşik → **yeni sitede korunmalı** (mevcut sıralamaları kaybetmemek için)

### 1.7 Veri Kalitesi Sorunları (migrasyonda temizlenecek)
- `-2`, `-3` sonekli kopya sluglar (ör. tecomec-…-2/-3)
- Aynı ürün iki farklı kategoride duplicate (ör. gres-yaglama-kiti-44950)
- Parent'ı ile aynı slug'a sahip kopya sayfa (elektrikli-yag-cekme-pompalari)
- `sayfa2` adında elle yapılmış pagination sayfası (aksesuarlar)
- Bu kayıtlar migrasyon script'inde raporlanacak ve onayına sunulacak

---

## 2. Yeni Tasarım Analizi (Context — ANA REFERANS)

7 sayfa tasarımı incelendi. Tasarım dili: **koyu lacivert/mavi kurumsal palet, endüstriyel fotoğraflı hero alanları, beyaz kart grid'leri, bol beyaz alan, her sayfada "Teklif Alın" CTA'sı.**

| Tasarım | Ana bileşenler |
|---|---|
| **Anasayfa** | Hero (büyük tipografi + CTA), 4'lü değer önerisi şeridi, ürün kategorileri grid (6 kart), "Mühendislik Esaslı Çözümler" bölümü, 4'lü özellik kartları, zengin footer (TR+NL ofis) |
| **Ürünler** | Mavi hero + 4 güven rozeti, **sol kategori sidebar** + ürün kart grid'i (görsel + kategori etiketi + isim + "Detayları İncele"), sıralama/filtre dropdown, alt CTA bandı |
| **Ürün Detay** | Breadcrumb, sol: görsel + rozetler; sağ: **sticky "Fiyat Teklif Alın" formu**, teknik özellik listesi (ikonlu), 4'lü güven şeridi, **tab'lı içerik** (açıklama/teknik/kullanım alanları/SSS), **Benzer Ürünler** carousel |
| **Hakkımızda** | Hero, 4 değer kartı, görsel+metin "Endüstriyel Tesislerde Çözüm Ortağınız" bölümü, vizyon/misyon kartları, CTA bandı |
| **Sektörler** | Hero, **24 sektör kartı** (görsel + isim + ok), "Sizin Sektörünüz Hangisi?" CTA bandı |
| **İletişim** | Hero, 4 bilgi kartı (adres/telefon/email/çalışma saatleri), harita + iletişim formu (yan yana), CTA bandı |
| **Teklif Alın** | Hero, sol: "Neden HD Marine?" + iletişim bilgileri; sağ: **detaylı teklif formu** (ad, email, telefon, firma, ürün grubu radio seçimi, mesaj, KVKK onayı) |

> Önemli fark: Tasarımda **Sektörler** sayfası 24 sektör içeriyor; mevcut sitede sektör detayları zayıf. Sektör içerikleri yeni yazılacak.
> Önemli fark: Tasarımda **Kataloglar** sayfası yok; mevcut sitede var → yeni sitede kalacak (karar).
>
> **Tasarım yaklaşımı (karar):** Context tasarımları ana referanstır ancak birebir kopyalanmak zorunda değildir. Uygulama sırasında UX açısından daha iyi çözümler önerilebilir; önemli sapmalar Emre'ye gerekçesiyle sunulur.

---

## 3. Önerilen Teknoloji Mimarisi

```
┌─────────────────────────────────────────────┐
│  Next.js 15 (App Router) + TypeScript       │
│  Tailwind CSS · SSG/ISR · next/image        │
│  ├── (site)   → Public website (TR/EN)      │
│  └── (admin)  → /admin paneli (Auth korumalı)│
└──────────────────┬──────────────────────────┘
                   │ @supabase/supabase-js + @supabase/ssr
┌──────────────────▼──────────────────────────┐
│  SUPABASE                                   │
│  ├── PostgreSQL (içerik + ürün + form kayıt)│
│  ├── Storage (ürün görselleri — birebir)    │
│  └── Auth (sadece admin panel için)         │
└─────────────────────────────────────────────┘
```

**Neden bu stack:**
- **Next.js App Router**: SEO için kritik olan server-side rendering / static generation; ürün sayfaları ISR ile hem hızlı hem güncel
- **Supabase**: proje gereksinimi; RLS ile admin yazma / public okuma ayrımı temiz çözülür
- **Local geliştirme**: `.env.local` ile Supabase bağlantısı; tüm geliştirme ve test local'de, deploy sonraya bırakıldı

**Önerilen klasör yapısı (local):**
```
hd-marine/
├── .env.local                  # Supabase URL + anon key (+ service key sadece script'ler için)
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── [locale]/...   # tr (varsayılan, prefix'siz) / en
│   │   └── (admin)/admin/...  # ürün & içerik yönetimi
│   ├── components/            # ui/, layout/, product/, forms/ (yeniden kullanılabilir)
│   ├── lib/                   # supabase client, i18n, seo helpers
│   └── messages/              # tr.json, en.json (arayüz metinleri)
├── scripts/
│   └── migrate/               # WP → Supabase migrasyon script'leri
└── supabase/
    └── migrations/            # SQL şema dosyaları
```

---

## 4. Supabase Database Şeması

Çok dillilik **çeviri tablosu (translation table)** deseni ile — her dil için ayrı satır, TR'ye fallback:

```sql
-- KATEGORİLER (hiyerarşik, self-referencing)
categories (
  id uuid PK, parent_id uuid FK→categories, sort_order int,
  image_path text, is_active bool, created_at, updated_at
)
category_translations (
  category_id FK, locale text ('tr'|'en'), name text, slug text,
  description text, meta_title text, meta_description text,
  UNIQUE(locale, slug), UNIQUE(category_id, locale)
)

-- ÜRÜNLER (gerçek product entity — WP'deki "page" yapısı KOPYALANMAZ)
products (
  id uuid PK,
  primary_category_id FK→categories,   -- breadcrumb & canonical URL için ana kategori
  sku text NULL, brand text NULL,
  sort_order int, is_active bool, is_featured bool,
  legacy_wp_id int, legacy_url text,   -- migrasyon izi + 301 yönlendirme
  created_at, updated_at
)
product_categories (                   -- çoka-çok: bir ürün birden fazla kategoride
  product_id FK, category_id FK, PRIMARY KEY(product_id, category_id)
)                                      -- WP'deki duplicate sayfalar tek ürün kaydına iner
product_translations (
  product_id FK, locale, name, slug, summary text,
  description text,            -- zengin metin (HTML)
  usage_areas text,            -- kullanım alanları tab'ı
  meta_title, meta_description,
  UNIQUE(locale, slug), UNIQUE(product_id, locale)
)
product_images (
  id uuid PK, product_id FK, storage_path text,
  alt_tr text, alt_en text, sort_order int, is_primary bool
)
product_specs (                -- Teknik Değer Tablosu satırları
  id uuid PK, product_id FK, sort_order int
)
product_spec_translations (spec_id FK, locale, label text, value text)
product_faqs (id uuid PK, product_id FK, sort_order int)
product_faq_translations (faq_id FK, locale, question text, answer text)

-- SEKTÖRLER
sectors (id uuid PK, sort_order, image_path, is_active)
sector_translations (sector_id FK, locale, name, slug, description, meta_title, meta_description)

-- STATİK SAYFA İÇERİKLERİ (Hakkımızda vb. admin'den düzenlenebilir)
pages (id uuid PK, key text UNIQUE)        -- 'home', 'about', 'contact'...
page_translations (
  page_id FK, locale, title, slug,
  content jsonb,               -- blok bazlı içerik (hero, değer kartları...)
  meta_title, meta_description
)

-- FORM KAYITLARI
quote_requests (
  id uuid PK, full_name, email, phone, company,
  product_group text, product_id uuid NULL FK,
  message text, locale, status text ('new'|'contacted'|'closed'),
  created_at
)
contact_messages (id, full_name, email, phone, subject, message, locale, created_at)

-- KATALOGLAR (PDF indirme sayfası — karar: yeni sitede kalacak)
catalogs (id uuid PK, file_path text, cover_image_path text, sort_order int, is_active bool)
catalog_translations (catalog_id FK, locale, title, description)

-- SEO / YÖNLENDİRME
redirects (id, old_path text UNIQUE, new_path text, status_code int DEFAULT 301)

-- ADMIN
profiles (id uuid PK = auth.users.id, full_name, role text ('admin'|'editor'))
```

**RLS politikaları:**
- Tüm içerik tabloları: `is_active = true` → herkese SELECT; INSERT/UPDATE/DELETE sadece `profiles.role = 'admin'`
- `quote_requests` / `contact_messages`: herkes INSERT (anon form gönderimi), sadece admin SELECT
- Storage `product-images` bucket: public read, admin write

**Storage yapısı:**
```
product-images/   → products/{product_id}/{orijinal-dosya-adi}.jpg  (birebir, dönüştürmesiz)
category-images/  → categories/{category_id}/...
site-assets/      → logo, hero görselleri, sektör görselleri
```

---

## 5. Çok Dilli Mimari (TR ana, EN ikinci)

| Konu | Karar |
|---|---|
| URL deseni | TR prefix'siz: `/urunler/blower` · EN: `/en/products/blower` |
| Routing | Next.js `[locale]` segment + middleware (TR varsayılan, prefix yok) |
| İçerik çevirisi | DB'de translation tabloları; EN kaydı yoksa **TR'ye fallback** + admin panelde "çevrilmedi" uyarısı |
| Arayüz metinleri | `messages/tr.json`, `messages/en.json` (next-intl) |
| Slug'lar | Dil başına ayrı slug (EN slug'lar İngilizce: `/en/products/industrial-pumps/blower`) |
| hreflang | Her sayfada `tr` / `en` / `x-default` alternates |

---

## 6. SEO Mimarisi

1. **Render stratejisi**: Tüm public sayfalar SSG/ISR → tam HTML, hızlı FCP
2. **Meta yönetimi**: meta_title / meta_description DB'den, admin panelden düzenlenebilir; eksikse şablondan üret (`{Ürün} | {Kategori} | HD Marine`)
3. **URL koruması**: Mevcut TR URL hiyerarşisi birebir korunur; temizlenen duplicate'ler için `redirects` tablosundan **301**
4. **Yapısal veri (JSON-LD)**: `Organization` (global), `BreadcrumbList` (tüm sayfalar), `Product` (ürün detay), `FAQPage` (SSS bloğu), `LocalBusiness` (iletişim)
5. **Sitemap**: dil bazlı dinamik `sitemap.xml` (DB'den üretilir) + `robots.txt`
6. **OG/Twitter kartları**: ürün görseliyle otomatik
7. **Performans**: `next/image` (orijinal dosya korunur, sadece servis ederken optimize edilir — kaynak görsel değiştirilmez), lazy loading, font optimizasyonu
8. **GTM**: mevcut GTM-NW5LSXZR taşınır

---

## 7. Sayfa Bazlı İçerik Yapısı

| Route (TR) | Route (EN) | Veri kaynağı | Render |
|---|---|---|---|
| `/` | `/en` | `pages('home')` + öne çıkan kategoriler | ISR |
| `/hakkimizda` | `/en/about` | `pages('about')` | ISR |
| `/urunler` | `/en/products` | categories ağacı | ISR |
| `/urunler/[...slug]` | `/en/products/[...slug]` | catch-all → slug DB'de kategori mi ürün mü çözülür | ISR |
| `/sektorler` | `/en/sectors` | sectors | ISR |
| `/iletisim` | `/en/contact` | `pages('contact')` + form → `contact_messages` | ISR + server action |
| `/teklif-alin` | `/en/get-a-quote` | form → `quote_requests` | ISR + server action |
| `/kataloglar` | `/en/catalogs` | catalogs (PDF + Storage) | ISR |
| `/admin/*` | — | tüm tablolar (CRUD) | Client + Auth |

**Catch-all çözümleme mantığı:** `/urunler/a/b/c` → slug zinciri DB'de yürünür; son segment kategori ise → kategori sayfası (alt kategoriler + ürün grid), ürün ise → ürün detay sayfası. Böylece 4 seviyeli hiyerarşi tek route ile yönetilir.

> **Not:** URL'lerdeki hiyerarşi yalnızca SEO sürekliliği içindir. Veri modelinde ürünler sayfa değil, **bağımsız product entity**'leridir (kategori ilişkisi, görseller, spec'ler, SSS ayrı tablolarda). WordPress'in page-tabanlı yapısı veri modeline taşınmaz.

---

## 8. Admin Panel (yeni gereksinim)

**Kapsam önerisi** (`/admin`, Supabase Auth ile korumalı):
- **Ürünler**: liste/ara/filtrele, ürün ekle/düzenle/sil, görsel yükleme (Storage), spec tablosu ve SSS editörü, TR/EN sekmeli çeviri formu, aktif/pasif
- **Kategoriler**: ağaç görünümü, sıralama, ekle/düzenle
- **Sayfa içerikleri**: Hakkımızda, Anasayfa blokları, İletişim bilgileri (TR/EN)
- **Sektörler**: CRUD
- **Teklif talepleri & iletişim mesajları**: gelen kutusu, durum yönetimi (yeni/iletişime geçildi/kapandı)
- **SEO**: sayfa başına meta title/description düzenleme
- **Kataloglar**: PDF yükleme/sıralama
- Supabase Auth (email+şifre), RLS ile çift katman güvenlik
- **Karar:** Birden fazla kullanıcı, **tek rol** (hepsi admin yetkili). `profiles` tablosu korunur; ileride editör rolü eklemek kolay olur.

---

## 9. Veri Migrasyon Stratejisi (manuel giriş YOK)

WP REST API açık olduğu için **tam otomatik** migrasyon mümkün:

```
scripts/migrate/
├── 01-fetch.ts      # /wp-json/wp/v2/pages (324 sayfa, sayfalanmış) → ham JSON local'e kaydet
├── 02-parse.ts      # Elementor HTML parse (cheerio):
│                    #   başlık, açıklama, teknik tablo → specs[],
│                    #   SSS accordion → faqs[], görsel URL'leri, meta
├── 03-classify.ts   # parent zincirinden kategori/ürün ayrımı,
│                    #   duplicate & "-2/-3" slug raporu → ONAYA SUNULUR
├── 04-images.ts     # /wp-content/uploads görsellerini indir →
│                    #   Supabase Storage'a BİREBİR yükle (dönüştürme yok)
├── 05-import.ts     # categories → products → specs → faqs → images insert
│                    #   legacy_wp_id + legacy_url kaydı, redirects üretimi
├── 06-translate.ts  # TÜM içeriklerin EN çevirisi otomatik üretilir
│                    #   (teknik terminoloji korunur, değerler çevrilmez,
│                    #    translation_status='auto' işaretlenir)
└── 07-verify.ts     # sayım karşılaştırma (324 sayfa ↔ DB kayıtları),
                     #   kırık görsel/slug kontrolü, rapor
```

Notlar:
- Teknik tablolar HTML'den **aynen** alınır — hiçbir teknik değer uydurulmaz; parse edilemeyen sayfalar rapora düşer ve sana sorulur
- Görseller orijinal dosya adı ve çözünürlükle taşınır
- Script'ler idempotent (tekrar çalıştırılabilir, `legacy_wp_id` ile upsert)
- **EN çevirileri ilk migrasyonda otomatik oluşturulur** (karar). Translation tablolarına `translation_status ('auto'|'reviewed')` kolonu eklenir; admin panelden düzenlenip "reviewed" işaretlenebilir
- WP'de iki kategoride duplicate duran ürünler tek product kaydına indirgenir, `product_categories` ile her iki kategoriye bağlanır

---

## 10. Uygulama Yol Haritası (FİNAL — rev.2)

| Faz | Kapsam | Çıktı |
|---|---|---|
| **0. Kurulum** | Next.js 15 + Tailwind + TypeScript iskeleti, Supabase şema migration'ları, RLS politikaları, Storage bucket'ları, `.env.local` | Çalışan boş iskelet (local) |
| **1. Migrasyon** | Bölüm 9 script'leri: 324 sayfa çekilir, parse edilir, **page → product entity dönüşümü**, duplicate temizlik raporu onaya sunulur, görseller birebir Storage'a taşınır, **EN çevirileri otomatik üretilir** (`auto` işaretli), doğrulama raporu | Dolu DB (TR+EN) + Storage + 301 haritası |
| **2. Tasarım sistemi** | Context tasarımlarından renk/tipografi token'ları, header/footer, UI bileşen kütüphanesi (kart, buton, form, breadcrumb, accordion, tab, carousel) | Yeniden kullanılabilir bileşenler |
| **3. Admin panel** | Supabase Auth (çok kullanıcı, tek rol), ürün/kategori/sayfa/sektör/katalog CRUD, görsel yükleme, TR/EN çeviri editörü (`auto` → `reviewed`), teklif & mesaj gelen kutusu | **255 ürünlük import'u kontrol/düzeltme aracı** |
| **4. Public sayfalar (TR)** | Anasayfa → Ürünler → Ürün Detay → Hakkımızda → Sektörler → İletişim → Teklif Alın → Kataloglar; formlar Supabase'e yazar | Tasarımlara uyumlu TR site |
| **5. Çok dillilik (EN)** | EN routing + hreflang + dil değiştirici (EN içerik zaten DB'de hazır) | TR/EN tam site |
| **6. İçerik üretimi** | 24 sektör tanıtım metni taslakları (Claude yazar → Emre admin panelden onaylar) | Sektörler sayfası içeriği |
| **7. SEO & test** | JSON-LD, dinamik sitemap, redirects, Lighthouse/CWV, form ve responsive testleri, içerik QA | Yayına hazır local build |

> Admin panel bilinçli olarak öne alındı: 255 ürün import edildikten hemen sonra içerik kontrolü panelden yapılabilsin diye.
> Her faz sonunda local'de test edilir, onay alınmadan sonraki faza geçilmez. Deploy kapsam dışı; kodlama ve testler tamamen local'de.

---

## 11. Alınan Kararlar (7 Haziran 2026)

| Konu | Karar |
|---|---|
| Veri modeli | Ürünler **gerçek product entity** olarak modellenir; WP'nin page yapısı kopyalanmaz. Çoka-çok kategori ilişkisi (`product_categories`) |
| EN içerik | İlk migrasyonda **otomatik üretilir** (`translation_status='auto'`), admin panelden düzenlenip onaylanır |
| Admin panel sırası | **Faz 3'e** alındı — import sonrası içerik kontrolü için |
| Tasarım yaklaşımı | Context tasarımları referans; UX açısından daha iyi çözümler önerilebilir, birebir kopya zorunlu değil |
| Kataloglar | Yeni sitede kalacak (PDF indirme sayfası, yeni tasarıma uygun) |
| Sektör metinleri | Claude taslak yazar, Emre onaylar |
| Admin panel | Birden fazla kullanıcı, tek rol |
| Domain | hdmarine.com.tr aynı kalacak, WP'nin yerine geçecek → TR URL'leri birebir korunur, temizlenen sayfalara 301 |
| Frontend stack | Next.js 15 (App Router) + TypeScript + Tailwind (itiraz yoksa bu şekilde ilerlenecek) |
| Duplicate temizliği | Migrasyon sırasında rapor çıkarılıp onaya sunulacak |
