"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

function refresh() {
  revalidatePath("/admin/kategoriler");
  revalidatePath("/", "layout");
}

export async function updateCategory(
  categoryId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const nameTr = String(formData.get("name_tr") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const sortOrder = parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;

  if (!nameTr) {
    redirect("/admin/kategoriler?hata=" + encodeURIComponent("TR ad zorunludur."));
  }

  const { error } = await supabase
    .from("categories")
    .update({
      sort_order: sortOrder,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", categoryId);
  if (error) {
    redirect(
      "/admin/kategoriler?hata=" +
        encodeURIComponent(`Kayıt başarısız: ${error.message}`)
    );
  }

  const { error: eTr } = await supabase
    .from("category_translations")
    .update({ name: nameTr })
    .eq("category_id", categoryId)
    .eq("locale", "tr");
  if (eTr) {
    redirect(
      "/admin/kategoriler?hata=" +
        encodeURIComponent(`TR ad kaydedilemedi: ${eTr.message}`)
    );
  }

  if (nameEn) {
    const { error: eEn } = await supabase
      .from("category_translations")
      .update({
        name: nameEn,
        translation_status:
          formData.get("en_reviewed") === "on" ? "reviewed" : "auto",
      })
      .eq("category_id", categoryId)
      .eq("locale", "en");
    if (eEn) {
      redirect(
        "/admin/kategoriler?hata=" +
          encodeURIComponent(`EN ad kaydedilemedi: ${eEn.message}`)
      );
    }
  }

  refresh();
}
