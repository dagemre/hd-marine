-- HD Marine — RLS politikaları
-- Model: anon = ziyaretçi (yalnız aktif içerik okur, form gönderir)
--        authenticated = admin (tek rol; tüm girişli kullanıcılar yöneticidir)

-- Admin kontrolü (profiles üzerinde RLS özyinelemesini önlemek için security definer)
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

-- ============ RLS AÇ ============
alter table public.categories                enable row level security;
alter table public.category_translations     enable row level security;
alter table public.products                  enable row level security;
alter table public.product_categories        enable row level security;
alter table public.product_translations      enable row level security;
alter table public.product_images            enable row level security;
alter table public.product_specs             enable row level security;
alter table public.product_spec_translations enable row level security;
alter table public.product_faqs              enable row level security;
alter table public.product_faq_translations  enable row level security;
alter table public.sectors                   enable row level security;
alter table public.sector_translations       enable row level security;
alter table public.pages                     enable row level security;
alter table public.page_translations         enable row level security;
alter table public.catalogs                  enable row level security;
alter table public.catalog_translations      enable row level security;
alter table public.quote_requests            enable row level security;
alter table public.contact_messages          enable row level security;
alter table public.redirects                 enable row level security;
alter table public.profiles                  enable row level security;

-- ============ İÇERİK: public read (aktif) + admin full ============
create policy "public read active" on public.categories
  for select using (is_active or public.is_admin());
create policy "admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.category_translations
  for select using (
    public.is_admin() or exists (
      select 1 from public.categories c
      where c.id = category_id and c.is_active));
create policy "admin write" on public.category_translations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read active" on public.products
  for select using (is_active or public.is_admin());
create policy "admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_categories
  for select using (true);
create policy "admin write" on public.product_categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_translations
  for select using (
    public.is_admin() or exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active));
create policy "admin write" on public.product_translations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_images for select using (true);
create policy "admin write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_specs for select using (true);
create policy "admin write" on public.product_specs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_spec_translations for select using (true);
create policy "admin write" on public.product_spec_translations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_faqs for select using (true);
create policy "admin write" on public.product_faqs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.product_faq_translations for select using (true);
create policy "admin write" on public.product_faq_translations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read active" on public.sectors
  for select using (is_active or public.is_admin());
create policy "admin write" on public.sectors
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.sector_translations for select using (true);
create policy "admin write" on public.sector_translations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.pages for select using (true);
create policy "admin write" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.page_translations for select using (true);
create policy "admin write" on public.page_translations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read active" on public.catalogs
  for select using (is_active or public.is_admin());
create policy "admin write" on public.catalogs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read" on public.catalog_translations for select using (true);
create policy "admin write" on public.catalog_translations
  for all using (public.is_admin()) with check (public.is_admin());

-- ============ FORMLAR: anon insert + admin read/update ============
-- NOT: anon insert'te RETURNING / .select() KULLANILMAZ (select politikası
-- yok, RLS hatası verir). Form server action'ları sadece insert yapar.
create policy "anyone can submit" on public.quote_requests
  for insert with check (true);
create policy "admin read" on public.quote_requests
  for select using (public.is_admin());
create policy "admin update" on public.quote_requests
  for update using (public.is_admin()) with check (public.is_admin());

create policy "anyone can submit" on public.contact_messages
  for insert with check (true);
create policy "admin read" on public.contact_messages
  for select using (public.is_admin());

-- ============ SEO ============
create policy "public read" on public.redirects for select using (true);
create policy "admin write" on public.redirects
  for all using (public.is_admin()) with check (public.is_admin());

-- ============ PROFİLLER ============
create policy "own or admin read" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "own update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
