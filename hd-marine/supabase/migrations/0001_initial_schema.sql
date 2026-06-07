-- HD Marine — İlk şema (20 tablo)
-- Referans: docs/02-veritabani-erd.mermaid + docs/03-tablo-iliskileri.md

-- ============ YARDIMCILAR ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============ KATEGORİLER ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete restrict,
  sort_order int not null default 0,
  image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index categories_parent_idx on public.categories(parent_id);
create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

create table public.category_translations (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  name text not null,
  slug text not null,
  description text,
  meta_title text,
  meta_description text,
  translation_status text not null default 'reviewed'
    check (translation_status in ('auto','reviewed')),
  unique (category_id, locale),
  unique (locale, slug)
);

-- ============ ÜRÜNLER (product entity) ============
create table public.products (
  id uuid primary key default gen_random_uuid(),
  primary_category_id uuid not null references public.categories(id) on delete restrict,
  sku text,
  brand text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  legacy_wp_id int unique,
  legacy_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_primary_category_idx on public.products(primary_category_id);
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);
create index product_categories_category_idx on public.product_categories(category_id);

create table public.product_translations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  name text not null,
  slug text not null,
  summary text,
  description text,
  usage_areas text,
  meta_title text,
  meta_description text,
  translation_status text not null default 'reviewed'
    check (translation_status in ('auto','reviewed')),
  unique (product_id, locale),
  unique (locale, slug)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_tr text,
  alt_en text,
  sort_order int not null default 0,
  is_primary boolean not null default false
);
create index product_images_product_idx on public.product_images(product_id);
create unique index product_images_one_primary
  on public.product_images(product_id) where is_primary;

create table public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 0
);
create index product_specs_product_idx on public.product_specs(product_id);

create table public.product_spec_translations (
  id uuid primary key default gen_random_uuid(),
  spec_id uuid not null references public.product_specs(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  label text not null,
  value text not null,
  unique (spec_id, locale)
);

create table public.product_faqs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 0
);
create index product_faqs_product_idx on public.product_faqs(product_id);

create table public.product_faq_translations (
  id uuid primary key default gen_random_uuid(),
  faq_id uuid not null references public.product_faqs(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  question text not null,
  answer text not null,
  unique (faq_id, locale)
);

-- ============ SEKTÖRLER ============
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  image_path text,
  is_active boolean not null default true
);

create table public.sector_translations (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid not null references public.sectors(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  name text not null,
  slug text not null,
  description text,
  meta_title text,
  meta_description text,
  translation_status text not null default 'reviewed'
    check (translation_status in ('auto','reviewed')),
  unique (sector_id, locale),
  unique (locale, slug)
);

-- ============ STATİK SAYFALAR ============
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  key text not null unique
);

create table public.page_translations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  title text not null,
  slug text,
  content jsonb not null default '{}'::jsonb,
  meta_title text,
  meta_description text,
  translation_status text not null default 'reviewed'
    check (translation_status in ('auto','reviewed')),
  unique (page_id, locale)
);

-- ============ KATALOGLAR ============
create table public.catalogs (
  id uuid primary key default gen_random_uuid(),
  file_path text not null,
  cover_image_path text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table public.catalog_translations (
  id uuid primary key default gen_random_uuid(),
  catalog_id uuid not null references public.catalogs(id) on delete cascade,
  locale text not null check (locale in ('tr','en')),
  title text not null,
  description text,
  unique (catalog_id, locale)
);

-- ============ FORM KAYITLARI ============
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  company text,
  product_group text,
  product_id uuid references public.products(id) on delete set null,
  message text,
  locale text not null default 'tr',
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);
create index quote_requests_inbox_idx on public.quote_requests(status, created_at desc);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  locale text not null default 'tr',
  created_at timestamptz not null default now()
);

-- ============ SEO ============
create table public.redirects (
  id uuid primary key default gen_random_uuid(),
  old_path text not null unique,
  new_path text not null,
  status_code int not null default 301
);

-- ============ ADMIN PROFİLLERİ ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Yeni auth kullanıcısına otomatik profil
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
