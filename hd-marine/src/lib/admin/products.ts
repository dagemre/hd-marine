import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export const PRODUCTS_PAGE_SIZE = 25;

export type ProductListItem = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  imageCount: number;
  primaryCategoryId: string;
  enStatus: "auto" | "reviewed" | "missing";
};

export type ProductListParams = {
  q?: string;
  categoryId?: string;
  active?: "aktif" | "pasif";
  enStatus?: "auto" | "reviewed";
  page: number;
};

export type ProductListResult = {
  items: ProductListItem[];
  total: number;
  page: number;
  pageCount: number;
};

/**
 * Ürün listesi — TR çeviri tarafından sorgulanır ki ada göre arama ve
 * sıralama PostgREST'te doğrudan çalışsın. EN çeviri durumu, sayfadaki
 * ürünler için ikinci küçük bir sorguyla eklenir.
 */
export async function listProducts(
  supabase: Client,
  params: ProductListParams
): Promise<ProductListResult> {
  // EN çeviri durumu filtresi: önce eşleşen ürün id'leri (maks ~277)
  let idFilter: string[] | null = null;
  if (params.enStatus) {
    const { data } = await supabase
      .from("product_translations")
      .select("product_id")
      .eq("locale", "en")
      .eq("translation_status", params.enStatus);
    idFilter = (data ?? []).map((r) => r.product_id);
    if (idFilter.length === 0) {
      return { items: [], total: 0, page: 1, pageCount: 0 };
    }
  }

  let query = supabase
    .from("product_translations")
    .select(
      "product_id, name, slug, products!inner(id, is_active, primary_category_id, product_images(id), product_categories!inner(category_id))",
      { count: "exact" }
    )
    .eq("locale", "tr");

  if (params.q) query = query.ilike("name", `%${params.q}%`);
  if (params.active)
    query = query.eq("products.is_active", params.active === "aktif");
  if (params.categoryId)
    query = query.eq(
      "products.product_categories.category_id",
      params.categoryId
    );
  if (idFilter) query = query.in("product_id", idFilter);

  const from = (params.page - 1) * PRODUCTS_PAGE_SIZE;
  const { data, count, error } = await query
    .order("name")
    .range(from, from + PRODUCTS_PAGE_SIZE - 1);

  if (error || !data) {
    console.warn("[admin/products] liste sorgusu başarısız:", error?.message);
    return { items: [], total: 0, page: 1, pageCount: 0 };
  }

  // Sayfadaki ürünlerin EN çeviri durumu
  const ids = data.map((r) => r.product_id);
  const enMap = new Map<string, string>();
  if (ids.length > 0) {
    const { data: enRows } = await supabase
      .from("product_translations")
      .select("product_id, translation_status")
      .eq("locale", "en")
      .in("product_id", ids);
    for (const r of enRows ?? []) enMap.set(r.product_id, r.translation_status);
  }

  const items: ProductListItem[] = data.map((r) => ({
    id: r.product_id,
    name: r.name,
    slug: r.slug,
    isActive: r.products.is_active,
    imageCount: r.products.product_images.length,
    primaryCategoryId: r.products.primary_category_id,
    enStatus: (enMap.get(r.product_id) ?? "missing") as
      | "auto"
      | "reviewed"
      | "missing",
  }));

  const total = count ?? items.length;
  return {
    items,
    total,
    page: params.page,
    pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PAGE_SIZE)),
  };
}
