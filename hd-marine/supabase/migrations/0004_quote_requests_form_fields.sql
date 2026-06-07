-- Teklif Alın sayfası form alanları (7 Haziran 2026)
-- Uygulandı: MCP apply_migration "quote_requests_form_fields"
alter table public.quote_requests
  add column if not exists sector_slug text,
  add column if not exists estimated_need text,
  add column if not exists delivery_location text;

comment on column public.quote_requests.sector_slug is 'Sektör TR slug''ı (sectors.sector_translations); ?sektor= parametresi veya form seçimi';
comment on column public.quote_requests.estimated_need is 'Tahmini ihtiyaç / alım tipi (form seçeneği)';
comment on column public.quote_requests.delivery_location is 'Teslimat yapılacak şehir / bölge';
