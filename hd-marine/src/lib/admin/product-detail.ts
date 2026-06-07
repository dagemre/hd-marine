import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

type ProductTr =
  Database["public"]["Tables"]["product_translations"]["Row"];

export type AdminProductDetail = {
  id: string;
  brand: string | null;
  sku: string | null;
  isActive: boolean;
  isFeatured: boolean;
  legacyUrl: string | null;
  primaryCategoryId: string;
  categoryIds: string[];
  tr: ProductTr | null;
  en: ProductTr | null;
  specs: {
    id: string;
    sortOrder: number;
    tr: { id: string; label: string; value: string } | null;
    en: { id: string; label: string; value: string } | null;
  }[];
  faqs: {
    id: string;
    sortOrder: number;
    tr: { id: string; question: string; answer: string } | null;
    en: { id: string; question: string; answer: string } | null;
  }[];
  images: {
    id: string;
    storagePath: string;
    isPrimary: boolean;
    sortOrder: number;
    altTr: string | null;
    altEn: string | null;
  }[];
};

export async function getAdminProduct(
  supabase: Client,
  id: string
): Promise<AdminProductDetail | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id, brand, sku, is_active, is_featured, legacy_url, primary_category_id,
       product_categories(category_id),
       product_translations(*),
       product_specs(id, sort_order, product_spec_translations(id, locale, label, value)),
       product_faqs(id, sort_order, product_faq_translations(id, locale, question, answer)),
       product_images(id, storage_path, is_primary, sort_order, alt_tr, alt_en)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[admin/product-detail] sorgu hatası:", error.message);
    return null;
  }

  const findTr = <T extends { locale: string }>(rows: T[], locale: string) =>
    rows.find((r) => r.locale === locale) ?? null;

  return {
    id: data.id,
    brand: data.brand,
    sku: data.sku,
    isActive: data.is_active,
    isFeatured: data.is_featured,
    legacyUrl: data.legacy_url,
    primaryCategoryId: data.primary_category_id,
    categoryIds: data.product_categories.map((c) => c.category_id),
    tr: findTr(data.product_translations, "tr"),
    en: findTr(data.product_translations, "en"),
    specs: data.product_specs
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => {
        const tr = findTr(s.product_spec_translations, "tr");
        const en = findTr(s.product_spec_translations, "en");
        return {
          id: s.id,
          sortOrder: s.sort_order,
          tr: tr ? { id: tr.id, label: tr.label, value: tr.value } : null,
          en: en ? { id: en.id, label: en.label, value: en.value } : null,
        };
      }),
    faqs: data.product_faqs
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((f) => {
        const tr = findTr(f.product_faq_translations, "tr");
        const en = findTr(f.product_faq_translations, "en");
        return {
          id: f.id,
          sortOrder: f.sort_order,
          tr: tr
            ? { id: tr.id, question: tr.question, answer: tr.answer }
            : null,
          en: en
            ? { id: en.id, question: en.question, answer: en.answer }
            : null,
        };
      }),
    images: data.product_images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({
        id: img.id,
        storagePath: img.storage_path,
        isPrimary: img.is_primary,
        sortOrder: img.sort_order,
        altTr: img.alt_tr,
        altEn: img.alt_en,
      })),
  };
}
