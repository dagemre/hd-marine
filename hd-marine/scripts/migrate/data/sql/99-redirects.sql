-- HD Marine Faz 1: 301 yönlendirmeleri
BEGIN;
INSERT INTO redirects (old_path, new_path, status_code) VALUES ($h$/urunler/yaglama-cihazlari/aksesuarlar/sayfa2/$h$, $h$/urunler/yaglama-cihazlari/aksesuarlar/$h$, 301) ON CONFLICT (old_path) DO NOTHING;
INSERT INTO redirects (old_path, new_path, status_code) VALUES ($h$/urunler/yaglama-cihazlari/yag-cekme-pompalari/elektrikli-yag-cekme-pompalari/elektrikli-yag-cekme-pompalari/$h$, $h$/urunler/yaglama-cihazlari/yag-cekme-pompalari/elektrikli-yag-cekme-pompalari/$h$, 301) ON CONFLICT (old_path) DO NOTHING;
INSERT INTO redirects (old_path, new_path, status_code) VALUES ($h$/urunler/yaglama-cihazlari/aksesuarlar/gres-yaglama-kiti-44950/$h$, $h$/urunler/yaglama-cihazlari/gresaj-baglanti-parcalari/gres-yaglama-kiti-44950/$h$, 301) ON CONFLICT (old_path) DO NOTHING;
INSERT INTO redirects (old_path, new_path, status_code) VALUES ($h$/urunler/diyaframli-pompa-yedek-parcalari/graco-uyumlu-yedek-parca/$h$, $h$/urunler/yaglama-cihazlari/elektrikli-yag-pompalari/graco-uyumlu-yedek-parca/$h$, 301) ON CONFLICT (old_path) DO NOTHING;
INSERT INTO redirects (old_path, new_path, status_code) VALUES ($h$/urunler/yaglama-cihazlari/aksesuarlar/tecomec-0543-tetiksiz-basincli-yikama-tabancasi-2/$h$, $h$/urunler/yaglama-cihazlari/aksesuarlar/tecomec-0543-tetiksiz-basincli-yikama-tabancasi-3/$h$, 301) ON CONFLICT (old_path) DO NOTHING;
COMMIT;