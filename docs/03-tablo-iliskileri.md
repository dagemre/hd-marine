# HD Marine — Veritabanı Tablo İlişkileri

> ERD görseli: `02-veritabani-erd.mermaid` · Şema özeti: `01-analiz-ve-mimari.md` §4
> Toplam: **20 tablo** (5 alan grubu)

---

## 1. Tasarım Prensipleri

**a) Çeviri tablosu deseni:** Dile bağlı her veri `*_translations` tablosunda tutulur; ana tablo yalnızca dilden bağımsız alanları taşır (sıralama, görsel yolu, aktiflik). Her çeviri satırı `UNIQUE(entity_id, locale)` ile korunur; slug'lar `UNIQUE(locale, slug)` ile dil başına benzersizdir. `translation_status` kolonu (`auto`/`reviewed`) otomatik üretilen EN çevirilerin admin panelden onay takibini sağlar.

**b) Product entity modeli:** WordPress'teki page hiyerarşisinin aksine ürün; kategori ilişkisi, görselleri, teknik özellikleri ve SSS'leri ayrı tablolarda olan bağımsız bir varlıktır. URL hiyerarşisi yalnızca route katmanında (SEO için) yeniden kurulur.

**c) Migrasyon izlenebilirliği:** `products.legacy_wp_id` ve `legacy_url` alanları her kaydın WP kaynağını saklar; script'ler bu alanla idempotent upsert yapar, 301 yönlendirmeleri buradan üretilir.

---

## 2. İlişki Detayları

### Katalog hiyerarşisi
| İlişki | Kardinalite | Açıklama |
|---|---|---|
| `categories.parent_id → categories.id` | 1—N (self) | Sınırsız derinlikte kategori ağacı. Mevcut veride 3 seviye var (ana → alt → ara). `NULL` = kök kategori. `ON DELETE RESTRICT` — çocuğu olan kategori silinemez. |
| `categories → category_translations` | 1—N | Dil başına tam 1 satır (tr zorunlu, en otomatik üretilir). |

### Ürünler
| İlişki | Kardinalite | Açıklama |
|---|---|---|
| `products.primary_category_id → categories` | N—1 | Ürünün **ana** kategorisi; breadcrumb ve canonical URL bu zincirden üretilir. `ON DELETE RESTRICT`. |
| `products ↔ categories` (via `product_categories`) | N—N | Bir ürün birden fazla kategoride listelenebilir. WP'deki duplicate sayfalar (ör. gres-yaglama-kiti iki kategoride) tek ürün kaydına inip buradan iki kategoriye bağlanır. Ana kategori de bu tabloda yer alır (tutarlılık trigger'ı ile garanti edilir). |
| `products → product_translations` | 1—N | name, slug, summary, description, usage_areas + meta alanları dil başına. |
| `products → product_images` | 1—N | `storage_path` Supabase Storage'daki birebir taşınmış dosyayı işaret eder. `is_primary` listelerde gösterilecek görseli seçer (ürün başına 1 adet, partial unique index ile). `sort_order` galeri sırası. |
| `products → product_specs → product_spec_translations` | 1—N—N | "Teknik Değer Tablosu"nun her satırı bir spec kaydı. `label` çevrilir (Motor Gücü → Motor Power), `value` sayısal/teknik olduğu için **çevrilmez, aynen kopyalanır** (0.37–25 kW). |
| `products → product_faqs → product_faq_translations` | 1—N—N | Ürün detayındaki SSS accordion'u. JSON-LD `FAQPage` şeması buradan üretilir. |

### İçerik
| İlişki | Kardinalite | Açıklama |
|---|---|---|
| `sectors → sector_translations` | 1—N | 24 sektör kartı; metinler Claude taslağı → Emre onayı. |
| `pages → page_translations` | 1—N | Statik sayfalar (`key`: home, about, contact, quote, catalogs, 404). `content` JSONB — blok bazlı yapı (hero, değer kartları, vizyon/misyon...) admin panelden alan alan düzenlenebilir. |
| `catalogs → catalog_translations` | 1—N | PDF kataloglar; dosya Storage'da, başlık/açıklama çevrilebilir. |

### Formlar
| İlişki | Kardinalite | Açıklama |
|---|---|---|
| `quote_requests.product_id → products` | N—1 (nullable) | Teklif ürün detay sayfasındaki sticky formdan geldiyse dolu; genel `/teklif-alin` formundan geldiyse `NULL`, `product_group` serbest metin taşır. `ON DELETE SET NULL` — ürün silinse talep kaybolmaz. |
| `contact_messages` | bağımsız | FK yok; iletişim sayfası formu. |
| Her ikisi | — | `locale` alanı hangi dilden gönderildiğini saklar (yanıt dili için). |

### SEO & Admin
| İlişki | Kardinalite | Açıklama |
|---|---|---|
| `redirects` | bağımsız | `old_path` → `new_path` haritası; Next.js middleware her 404 öncesi buraya bakar. Migrasyonda temizlenen duplicate'ler ve birleştirilen sayfalar için otomatik doldurulur. |
| `auth.users → profiles` | 1—1 | Supabase Auth kullanıcısı başına bir profil. Tek rol (`admin`); `role` kolonu ileride editör rolü için hazır. Yeni auth kullanıcısı trigger ile otomatik profil alır. |

---

## 3. RLS (Row Level Security) Özeti

| Tablo grubu | anon (ziyaretçi) | authenticated (admin) |
|---|---|---|
| categories, products, sectors, pages, catalogs + tüm translations, images, specs, faqs | SELECT (yalnız `is_active=true`) | Tam CRUD |
| quote_requests, contact_messages | Yalnız INSERT | SELECT + UPDATE (status) |
| redirects | SELECT | Tam CRUD |
| profiles | — | Kendi kaydını okur; admin tümünü okur |
| Storage: product-images, site-assets, catalogs bucket | public read | write |

---

## 4. İndeksler ve Kısıtlar (kritik olanlar)

- `category_translations(locale, slug)` UNIQUE — URL çözümleme buradan, sorgu başına index hit
- `product_translations(locale, slug)` UNIQUE — aynı şekilde
- `products(legacy_wp_id)` UNIQUE — idempotent migrasyon
- `product_images(product_id) WHERE is_primary` partial UNIQUE — tek ana görsel garantisi
- `redirects(old_path)` UNIQUE
- `product_categories(category_id)` index — kategori sayfası ürün listesi sorgusu
- `quote_requests(status, created_at)` index — admin gelen kutusu
- Tüm FK'lere otomatik index (Postgres FK'lere index koymaz, migration'da elle eklenir)

---

## 5. Tipik Sorgu Akışları

**Ürün detay sayfası** (`/urunler/.../blower-x`):
slug → `product_translations` → `products` → paralel: images, specs+translations, faqs+translations, primary_category breadcrumb zinciri, benzer ürünler (aynı kategoriden 4 adet).

**Kategori sayfası**: slug → `category_translations` → alt kategoriler + `product_categories` üzerinden ürün grid (primary image + name).

**Sitemap üretimi**: tüm aktif translation slug'ları locale bazında taranır → `/sitemap.xml` (tr + en alternates).
