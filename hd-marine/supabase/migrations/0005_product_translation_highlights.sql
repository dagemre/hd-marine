-- Ürün detay sayfası: ürüne özel öne çıkan özellikler (7 Haziran 2026)
-- Uygulandı: MCP apply_migration "product_translation_highlights"
alter table public.product_translations
  add column if not exists highlights jsonb,
  add column if not exists feature_cards jsonb;

comment on column public.product_translations.highlights is 'Başlık altı ikonlu kısa özellikler — string dizisi, örn. ["Yüksek Performans","Düşük Titreşim"]; boşsa bölüm gizlenir';
comment on column public.product_translations.feature_cards is 'Özellik şeridi kartları — [{"title":"...","description":"..."}] dizisi (en çok 5); boşsa şerit gizlenir';
