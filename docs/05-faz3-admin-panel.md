# Faz 3 — Admin Panel (7 Haziran 2026)

## Kapsam

Public sayfa tasarımlarından önce içerik kontrolü için yönetim paneli:
giriş (Supabase Auth), ürün/kategori yönetimi, EN çeviri inceleme akışı,
görsel yükleme. Gelen kutusu, 301 redirect ekranı ve kurumsal içerik
editörü bilinçli olarak ertelendi (formlar Faz 7'de).

## Mimari

- Aynı Next.js uygulaması içinde `[locale]` ağacından bağımsız ikinci kök:
  `src/app/admin/`. Admin arayüzü yalnızca Türkçe; i18n routing'e girmez,
  `robots: noindex`.
- Kimlik: Supabase Auth (e-posta + şifre). Signup kapalı — kullanıcılar
  Supabase Dashboard → Authentication → Add user ile eklenir; `profiles`
  satırı mevcut trigger ile otomatik oluşur (girişli kullanıcı = admin,
  tek rol).
- Middleware (`src/middleware.ts`): `/admin/*` istekleri i18n ve 301
  kontrolüne girmeden `updateSession` (token yenileme) + koruma görür.
  Oturum yoksa `/admin/giris`e yönlenir. Yardımcı:
  `src/lib/supabase/middleware.ts`.
- Tüm yazma işlemleri server action + oturumlu (cookie) Supabase client.
  RLS `is_admin()` policy'leri yetkiyi DB katmanında zorlar;
  service_role anahtarı uygulamada YOK. İkinci savunma hattı:
  `requireAdmin()` (`src/lib/admin/auth.ts`) her sayfa/aksiyon başında.
- Mutasyon sonrası `revalidatePath("/", "layout")` ile public sayfa
  cache'i tazelenir.

## Ekranlar

| Rota | İçerik |
|---|---|
| `/admin/giris` | Login (useActionState ile hata gösterimi) |
| `/admin` | Panel: sayılar + açık işler (görselsiz/açıklamasız ürünler) |
| `/admin/urunler` | Liste: ad arama, kategori/aktiflik/EN-durum filtreleri, 25'lik sayfalama |
| `/admin/urunler/[id]` | Genel ayarlar (aktif, öne çıkan, marka, SKU, ana kategori + çoklu kategori) ve sekmeler: İçerik TR / İçerik EN (onay checkbox'ı) / Özellikler / SSS / Görseller |
| `/admin/kategoriler` | Ağaç tablo: sıra (sort_order), TR/EN ad, EN onay, aktif |
| `/admin/ceviriler` | `auto` EN çeviriler (ürün/kategori sekmeli), tek tek veya toplu onay |

## Teknik notlar

- Görsel yükleme: server action → Storage `product-images`,
  `products/{trSlug}/{ts}-{dosya}` düzeni. JPEG/PNG/WebP, 5 MB sınırı.
  İlk görsel otomatik primary. `next.config.ts`'e
  `serverActions.bodySizeLimit: "8mb"` eklendi.
- Spec/SSS çevirilerinde `translation_status` kolonu YOK (yalnızca
  ürün/kategori/sayfa/sektör çevirilerinde var) — spec/SSS EN düzenlemesi
  ürün ekranındaki tablolardan yapılır.
- Slug'lar üründe düzenlenebilir (kırık URL uyarısıyla); kategoride
  kilitli. Slug değişiminde otomatik 301 üretilmez.
- Veri katmanındaki kategori sıralaması zaten `sort_order || TR ad`
  (Faz 2) — panel sort_order'ı düzenlenebilir kıldı, frontend değişikliği
  gerekmedi.
- Badge bileşenine `success/warning/danger` variant'ları eklendi.
- İç içe form yasağı: satır içi "Sil" butonları `ConfirmButton` +
  HTML `form` attribute'üyle ayrı boş formları tetikler.
- Doğrulama: sandbox'ta `tsc --noEmit` temiz. `next build` sandbox'ta
  ÇALIŞTIRILMADI — node_modules Mac (darwin-arm64) kurulumuydu ve
  platform ping-pong'u yaşatmamak için bilinçli dokunulmadı; ilk gerçek
  test Emre'nin Mac'inde (`Siteyi Başlat.command`).

## Açık işler

- İlk admin kullanıcı(lar) Supabase Dashboard'dan eklenecek.
- Görselsiz 2 ürün + açıklamasız 5 ürün panel ana sayfasında listelenir.
- Gelen kutusu / redirect ekranı / kurumsal içerik editörü: istenince eklenir.
