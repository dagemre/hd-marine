"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { uniqueProductSlug } from "@/lib/admin/slug";
import type { ActionState } from "@/components/admin/action-form";

const err = (message: string): ActionState => ({ ok: false, message });

/**
 * Yeni ürün oluşturur: ad + ana kategori yeterlidir.
 * Slug addan otomatik üretilir, TR (onaylı) ve EN (otomatik) çeviri
 * kayıtları açılır. Ardından düzenleme sayfasına yönlendirir.
 */
export async function createProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("primary_category_id") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;

  if (!name) return err("Ürün adı zorunludur.");
  if (!categoryId) return err("Ana kategori seçilmelidir.");

  // Ürün
  const { data: product, error: pErr } = await supabase
    .from("products")
    .insert({ primary_category_id: categoryId, brand, is_active: true })
    .select("id")
    .single();
  if (pErr || !product) return err(`Ürün oluşturulamadı: ${pErr?.message}`);

  // Ana kategori bağlantısı
  const { error: cErr } = await supabase
    .from("product_categories")
    .insert({ product_id: product.id, category_id: categoryId });
  if (cErr) {
    await supabase.from("products").delete().eq("id", product.id);
    return err(`Kategori bağlanamadı: ${cErr.message}`);
  }

  // Çeviriler (TR onaylı, EN otomatik — sonradan düzenlenebilir)
  const trSlug = await uniqueProductSlug(supabase, "tr", name);
  const enSlug = await uniqueProductSlug(supabase, "en", name);
  const { error: tErr } = await supabase.from("product_translations").insert([
    {
      product_id: product.id,
      locale: "tr",
      name,
      slug: trSlug,
      translation_status: "reviewed",
    },
    {
      product_id: product.id,
      locale: "en",
      name,
      slug: enSlug,
      translation_status: "auto",
    },
  ]);
  if (tErr) {
    await supabase.from("products").delete().eq("id", product.id);
    return err(`Ürün içeriği oluşturulamadı: ${tErr.message}`);
  }

  revalidatePath("/admin/urunler");
  revalidatePath("/", "layout");
  redirect(`/admin/urunler/${product.id}`);
}
