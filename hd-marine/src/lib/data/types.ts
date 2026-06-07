import type { Locale } from "@/i18n/routing";

/* ---------- Kategori ---------- */

export type CategoryTranslation = {
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

export type CategoryNode = {
  id: string;
  parentId: string | null;
  sortOrder: number;
  imagePath: string | null;
  i18n: Partial<Record<Locale, CategoryTranslation>>;
  children: CategoryNode[];
};

export type CategoryTree = {
  roots: CategoryNode[];
  byId: Map<string, CategoryNode>;
};

/* ---------- Ürün ---------- */

export type ProductTranslation = {
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  usage_areas: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

export type ProductImage = {
  id: string;
  storagePath: string;
  altTr: string | null;
  altEn: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ProductSpec = { label: string; value: string };
export type ProductFaq = { question: string; answer: string };

/** Liste kartları için hafif ürün modeli */
export type ProductCard = {
  id: string;
  brand: string | null;
  primaryCategoryId: string;
  i18n: Partial<Record<Locale, Pick<ProductTranslation, "name" | "slug" | "summary">>>;
  primaryImage: ProductImage | null;
};

/** Detay sayfası için tam ürün modeli */
export type ProductFull = {
  id: string;
  sku: string | null;
  brand: string | null;
  isFeatured: boolean;
  primaryCategoryId: string;
  categoryIds: string[];
  i18n: Partial<Record<Locale, ProductTranslation>>;
  images: ProductImage[];
  /** locale çözülmüş spec/SSS — TR fallback uygulanmış */
  specs: Partial<Record<Locale, ProductSpec[]>>;
  faqs: Partial<Record<Locale, ProductFaq[]>>;
};

/* ---------- Sektör ---------- */

export type SectorTranslation = {
  name: string;
  slug: string;
};

export type Sector = {
  id: string;
  sortOrder: number;
  imagePath: string | null;
  i18n: Partial<Record<Locale, SectorTranslation>>;
};

/* ---------- Slug çözümleme ---------- */

export type ResolvedPath =
  | { type: "category"; category: CategoryNode; canonicalSlugs: string[] }
  | { type: "product"; product: ProductFull; canonicalSlugs: string[] }
  | { type: "not-found" };
