-- HD Marine — Storage bucket'ları
-- product-images: WP'den birebir taşınan ürün görselleri (dönüştürme YOK)
-- site-assets:    logo, hero görselleri, sektör/kategori görselleri
-- catalogs:       PDF kataloglar

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('site-assets', 'site-assets', true),
  ('catalogs', 'catalogs', true)
on conflict (id) do nothing;

-- Public read (bucket'lar zaten public; politika tutarlılık için)
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "public read site assets" on storage.objects
  for select using (bucket_id = 'site-assets');
create policy "public read catalogs" on storage.objects
  for select using (bucket_id = 'catalogs');

-- Admin yazma (girişli kullanıcı = admin)
create policy "admin write product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

create policy "admin write site assets" on storage.objects
  for insert with check (bucket_id = 'site-assets' and public.is_admin());
create policy "admin update site assets" on storage.objects
  for update using (bucket_id = 'site-assets' and public.is_admin());
create policy "admin delete site assets" on storage.objects
  for delete using (bucket_id = 'site-assets' and public.is_admin());

create policy "admin write catalogs" on storage.objects
  for insert with check (bucket_id = 'catalogs' and public.is_admin());
create policy "admin update catalogs" on storage.objects
  for update using (bucket_id = 'catalogs' and public.is_admin());
create policy "admin delete catalogs" on storage.objects
  for delete using (bucket_id = 'catalogs' and public.is_admin());
