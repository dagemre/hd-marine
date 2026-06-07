# HD Marine — Yeni Website

WordPress sitesinin (hdmarine.com.tr) Next.js 15 + Supabase ile yeniden yapımı.

## Hızlı Başlangıç

Klasördeki **"Siteyi Başlat.command"** dosyasına çift tıkla — ilk seferde bağımlılıkları kurar, sonra http://localhost:3000 açılır.

> İlk açılışta macOS "tanımlanamayan geliştirici" uyarısı verirse: dosyaya sağ tık → Aç.

Manuel başlatma:
```bash
cd hd-marine
npm install   # sadece ilk seferde
npm run dev
```

## Gereksinimler
- Node.js 20+ (LTS) — https://nodejs.org
- `.env.local` içinde Supabase anahtarları (Supabase projesi oluşturulunca doldurulacak)

## Yapı
```
src/app/            → sayfalar (App Router)
src/lib/supabase/   → Supabase client'ları (browser + server)
supabase/migrations → veritabanı şeması (3 dosya: şema, RLS, storage)
docs/ (üst klasörde) → mimari dokümanlar ve ERD
```

## Durum
- [x] Faz 0: İskelet + şema dosyaları
- [ ] Supabase projesi (bağlayıcı yeniden bağlanınca migration'lar uygulanacak)
- [ ] Faz 1: WP'den veri migrasyonu
