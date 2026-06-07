# Dev Mock — Sandbox PostgREST Taklidi

Claude'un sandbox'ından supabase.co'ya ağ erişimi yok. Bu mock, gerçek DB'den
alınmış küçük fixture'larla (kategori ağacı alt kümesi + 2 ürün kartı + 1 tam
ürün + 3 redirect) PostgREST'i taklit eder; frontend'i sandbox'ta uçtan uca
test etmeye yarar.

Kullanım (tek bash çağrısında — arka plan süreçler çağrılar arası ölür):

```bash
python3 scripts/dev-mock/mock_supabase.py &
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:8787 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key \
./node_modules/.bin/next start -p 3100 &
sleep 5
curl -s http://127.0.0.1:3100/urunler/yaglama-cihazlari/aksesuarlar
```

Notlar:
- `maybeSingle()` istekleri `Accept: vnd.pgrst.object` gönderir; bulunamayınca
  406 + PGRST116 dönülür (supabase-js bunu data:null yapar).
- next.config'teki 127.0.0.1 image remotePattern bu mock içindir.
- Gerçek veriyle test her zaman Emre'nin Mac'inde (`Siteyi Başlat.command`).
