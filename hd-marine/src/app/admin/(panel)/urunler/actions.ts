"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

/**
 * Ürünü siler. Bağlı çeviriler, kategoriler, özellikler, SSS ve görsel
 * kayıtları veritabanında ON DELETE CASCADE ile otomatik silinir; depodaki
 * görsel dosyalarını da temizleriz.
 */
export async function deleteProduct(productId: string): Promise<void> {
  const { supabase } = await requireAdmin();

  // Depodaki görselleri topla
  const { data: images } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    redirect(
      `/admin/urunler?hata=${encodeURIComponent(
        `Ürün silinemedi: ${error.message}`
      )}`
    );
  }

  const paths = (images ?? []).map((i) => i.storage_path).filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from("product-images").remove(paths);
  }

  revalidatePath("/admin/urunler");
  revalidatePath("/", "layout");
  redirect("/admin/urunler?silindi=1");
}
