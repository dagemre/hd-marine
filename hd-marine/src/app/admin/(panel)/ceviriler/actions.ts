"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";

function refresh() {
  revalidatePath("/admin/ceviriler");
  revalidatePath("/", "layout");
}

export async function approveProductTranslation(
  translationId: string
): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .from("product_translations")
    .update({ translation_status: "reviewed" })
    .eq("id", translationId);
  refresh();
}

export async function approveCategoryTranslation(
  translationId: string
): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .from("category_translations")
    .update({ translation_status: "reviewed" })
    .eq("id", translationId);
  refresh();
}

export async function approveAllProductTranslations(): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .from("product_translations")
    .update({ translation_status: "reviewed" })
    .eq("locale", "en")
    .eq("translation_status", "auto");
  refresh();
}

export async function approveAllCategoryTranslations(): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase
    .from("category_translations")
    .update({ translation_status: "reviewed" })
    .eq("locale", "en")
    .eq("translation_status", "auto");
  refresh();
}
