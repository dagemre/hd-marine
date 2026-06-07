import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";
import type {
  ProductCard,
  ProductFeatureCard,
  ProductFull,
  ProductImage,
  ProductSpec,
  ProductFaq,
} from "./types";

/* ---------- yardımcılar ---------- */

type ImageRow = {
  id: string;
  storage_path: string;
  alt_tr: string | null;
  alt_en: string | null;
  sort_order: number;
  is_primary: boolean;
};

function mapImage(row: ImageRow): ProductImage {
  return {
    id: row.id,
    storagePath: row.storage_path,
    altTr: row.alt_tr,
    altEn: row.alt_en,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
  };
}

function sortImages(images: ProductImage[]): ProductImage[] {
  return images.sort(
    (a, b) =>
      Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder
  );
}

/* ---------- liste sorguları ---------- */

const CARD_SELECT = `id, brand, sort_order, primary_category_id,
  product_translations(locale, name, slug, summary),
  product_images(id, storage_path, alt_tr, alt_en, sort_order, is_primary)`;

type CardRow = {
  id: string;
  brand: string | null;
  sort_order: number;
  primary_category_id: string;
  product_translations: {
    locale: string;
    name: string;
    slug: string;
    summary: string | null;
  }[];
  product_images: ImageRow[];
};

function mapCard(row: CardRow): ProductCard {
  const i18n: ProductCard["i18n"] = {};
  for (const tr of row.product_translations) {
    i18n[tr.locale as Locale] = {
      name: tr.name,
      slug: tr.slug,
      summary: tr.summary,
    };
  }
  const images = sortImages(row.product_images.map(mapImage));
  return {
    id: row.id,
    brand: row.brand,
    primaryCategoryId: row.primary_category_id,
    i18n,
    primaryImage: images[0] ?? null,
  };
}

/** Bir kategorideki ürünler (çoka-çok ilişki üzerinden) */
export const getProductsByCategory = cache(
  async (categoryId: string): Promise<ProductCard[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(`${CARD_SELECT}, product_categories!inner(category_id)`)
        .eq("product_categories.category_id", categoryId)
        .eq("is_active", true)
        .order("sort_order");
      if (error || !data) {
        console.warn("[data/products] kategori ürünleri sorgusu:", error?.message);
        return [];
      }
      return (data as unknown as CardRow[]).map(mapCard);
    } catch (e) {
      console.warn("[data/products] kategori ürünleri yüklenemedi:", e);
      return [];
    }
  }
);

/** Öne çıkan ürünler (anasayfa vb.) */
export const getFeaturedProducts = cache(
  async (limit = 8): Promise<ProductCard[]> => {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(CARD_SELECT)
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order")
        .limit(limit);
      if (error || !data) return [];
      return (data as unknown as CardRow[]).map(mapCard);
    } catch {
      return [];
    }
  }
);

/* ---------- detay sorgusu ---------- */

const FULL_SELECT = `id, sku, brand, is_featured, primary_category_id,
  product_translations(locale, name, slug, summary, description, usage_areas, meta_title, meta_description, highlights, feature_cards),
  product_images(id, storage_path, alt_tr, alt_en, sort_order, is_primary),
  product_specs(id, sort_order, product_spec_translations(locale, label, value)),
  product_faqs(id, sort_order, product_faq_translations(locale, question, answer)),
  product_categories(category_id)`;

type FullRow = {
  id: string;
  sku: string | null;
  brand: string | null;
  is_featured: boolean;
  primary_category_id: string;
  product_translations: {
    locale: string;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    usage_areas: string | null;
    meta_title: string | null;
    meta_description: string | null;
    highlights: unknown;
    feature_cards: unknown;
  }[];
  product_images: ImageRow[];
  product_specs: {
    id: string;
    sort_order: number;
    product_spec_translations: { locale: string; label: string; value: string }[];
  }[];
  product_faqs: {
    id: string;
    sort_order: number;
    product_faq_translations: { locale: string; question: string; answer: string }[];
  }[];
  product_categories: { category_id: string }[];
};

/** jsonb highlights → temiz string dizisi (savunmacı parse) */
function parseHighlights(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .map((v) => v.trim())
    .slice(0, 6);
}

/** jsonb feature_cards → temiz {title, description} dizisi */
function parseFeatureCards(value: unknown): ProductFeatureCard[] {
  if (!Array.isArray(value)) return [];
  const cards: ProductFeatureCard[] = [];
  for (const v of value) {
    if (v && typeof v === "object" && typeof (v as ProductFeatureCard).title === "string") {
      const title = (v as ProductFeatureCard).title.trim();
      const description =
        typeof (v as ProductFeatureCard).description === "string"
          ? (v as ProductFeatureCard).description.trim()
          : "";
      if (title) cards.push({ title, description });
    }
  }
  return cards.slice(0, 5);
}

function mapFull(row: FullRow): ProductFull {
  const i18n: ProductFull["i18n"] = {};
  for (const tr of row.product_translations) {
    i18n[tr.locale as Locale] = {
      name: tr.name,
      slug: tr.slug,
      summary: tr.summary,
      description: tr.description,
      usage_areas: tr.usage_areas,
      meta_title: tr.meta_title,
      meta_description: tr.meta_description,
      highlights: parseHighlights(tr.highlights),
      featureCards: parseFeatureCards(tr.feature_cards),
    };
  }

  const specs: ProductFull["specs"] = { tr: [], en: [] };
  for (const spec of [...row.product_specs].sort(
    (a, b) => a.sort_order - b.sort_order
  )) {
    for (const locale of ["tr", "en"] as Locale[]) {
      const t =
        spec.product_spec_translations.find((s) => s.locale === locale) ??
        spec.product_spec_translations.find((s) => s.locale === "tr");
      if (t) specs[locale]!.push({ label: t.label, value: t.value } as ProductSpec);
    }
  }

  const faqs: ProductFull["faqs"] = { tr: [], en: [] };
  for (const faq of [...row.product_faqs].sort(
    (a, b) => a.sort_order - b.sort_order
  )) {
    for (const locale of ["tr", "en"] as Locale[]) {
      const t =
        faq.product_faq_translations.find((f) => f.locale === locale) ??
        faq.product_faq_translations.find((f) => f.locale === "tr");
      if (t)
        faqs[locale]!.push({ question: t.question, answer: t.answer } as ProductFaq);
    }
  }

  return {
    id: row.id,
    sku: row.sku,
    brand: row.brand,
    isFeatured: row.is_featured,
    primaryCategoryId: row.primary_category_id,
    categoryIds: row.product_categories.map((c) => c.category_id),
    i18n,
    images: sortImages(row.product_images.map(mapImage)),
    specs,
    faqs,
  };
}

/** Slug ile tam ürün — herhangi bir locale'in slug'ı eşleşir */
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductFull | null> => {
    try {
      const supabase = await createClient();
      const { data: trRow, error: trError } = await supabase
        .from("product_translations")
        .select("product_id")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();
      if (trError || !trRow) return null;

      const { data, error } = await supabase
        .from("products")
        .select(FULL_SELECT)
        .eq("id", trRow.product_id)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data) return null;
      return mapFull(data as unknown as FullRow);
    } catch (e) {
      console.warn("[data/products] ürün yüklenemedi:", e);
      return null;
    }
  }
);

/** Çeviri — istenen locale yoksa TR'ye düşer */
export function prodT<T>(i18n: Partial<Record<Locale, T>>, locale: Locale): T {
  return (i18n[locale] ?? i18n.tr)!;
}

/** Görsel alt metni — locale'e göre */
export function imageAlt(
  image: ProductImage,
  locale: Locale,
  fallback: string
): string {
  return (locale === "en" ? image.altEn : image.altTr) ?? fallback;
}
