import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type DashboardStats = {
  productCount: number;
  inactiveProductCount: number;
  categoryCount: number;
  autoProductTr: number;
  autoCategoryTr: number;
  productsWithoutImages: { id: string; name: string }[];
  productsWithoutDescription: { id: string; name: string }[];
};

const head = { count: "exact" as const, head: true };

export async function getDashboardStats(
  supabase: Client
): Promise<DashboardStats> {
  const [
    products,
    inactiveProducts,
    categories,
    autoProducts,
    autoCategories,
    productMeta,
  ] = await Promise.all([
    supabase.from("products").select("*", head),
    supabase.from("products").select("*", head).eq("is_active", false),
    supabase.from("categories").select("*", head),
    supabase
      .from("product_translations")
      .select("*", head)
      .eq("locale", "en")
      .eq("translation_status", "auto"),
    supabase
      .from("category_translations")
      .select("*", head)
      .eq("locale", "en")
      .eq("translation_status", "auto"),
    supabase
      .from("products")
      .select(
        "id, product_images(id), product_translations(locale, name, description)"
      ),
  ]);

  const productsWithoutImages: DashboardStats["productsWithoutImages"] = [];
  const productsWithoutDescription: DashboardStats["productsWithoutDescription"] =
    [];

  for (const p of productMeta.data ?? []) {
    const tr = p.product_translations.find((t) => t.locale === "tr");
    const name = tr?.name ?? p.id;
    if (p.product_images.length === 0) {
      productsWithoutImages.push({ id: p.id, name });
    }
    if (!tr?.description?.trim()) {
      productsWithoutDescription.push({ id: p.id, name });
    }
  }

  const byName = (a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name, "tr");
  productsWithoutImages.sort(byName);
  productsWithoutDescription.sort(byName);

  return {
    productCount: products.count ?? 0,
    inactiveProductCount: inactiveProducts.count ?? 0,
    categoryCount: categories.count ?? 0,
    autoProductTr: autoProducts.count ?? 0,
    autoCategoryTr: autoCategories.count ?? 0,
    productsWithoutImages,
    productsWithoutDescription,
  };
}
