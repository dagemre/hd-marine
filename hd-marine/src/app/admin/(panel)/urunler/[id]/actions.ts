"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";

/** Mutasyon sonrası: admin sayfası + tüm public sayfalar tazelenir */
function refresh(productId: string) {
  revalidatePath(`/admin/urunler/${productId}`);
  revalidatePath("/", "layout");
}

function fail(productId: string, message: string): never {
  redirect(`/admin/urunler/${productId}?hata=${encodeURIComponent(message)}`);
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const strOrNull = (fd: FormData, key: string) => str(fd, key) || null;

/** Textarea satırları → highlights jsonb (string dizisi, en çok 6) */
function parseHighlights(fd: FormData): string[] | null {
  const lines = str(fd, "highlights")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);
  return lines.length > 0 ? lines : null;
}

/** "Başlık | Açıklama" satırları → feature_cards jsonb (en çok 5) */
function parseFeatureCards(
  fd: FormData
): { title: string; description: string }[] | null {
  const cards = str(fd, "feature_cards")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return {
        title: title.trim(),
        description: rest.join("|").trim(),
      };
    })
    .filter((c) => c.title);
  return cards.length > 0 ? cards : null;
}

/* ---------------- İçerik (TR/EN çeviri) ---------------- */

export async function updateTranslation(
  productId: string,
  locale: "tr" | "en",
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const name = str(formData, "name");
  const slug = str(formData, "slug");
  if (!name || !slug) fail(productId, "Ad ve slug zorunludur.");

  const payload = {
    name,
    slug,
    summary: strOrNull(formData, "summary"),
    description: strOrNull(formData, "description"),
    usage_areas: strOrNull(formData, "usage_areas"),
    highlights: parseHighlights(formData),
    feature_cards: parseFeatureCards(formData),
    meta_title: strOrNull(formData, "meta_title"),
    meta_description: strOrNull(formData, "meta_description"),
    translation_status:
      locale === "tr"
        ? "reviewed"
        : formData.get("reviewed") === "on"
          ? "reviewed"
          : "auto",
  };

  const { error } = await supabase
    .from("product_translations")
    .update(payload)
    .eq("product_id", productId)
    .eq("locale", locale);

  if (error) {
    fail(
      productId,
      error.code === "23505"
        ? `Bu slug başka bir üründe kullanılıyor: ${slug}`
        : `Kayıt başarısız: ${error.message}`
    );
  }
  refresh(productId);
}

/* ---------------- Genel ayarlar ---------------- */

export async function updateSettings(
  productId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const primaryCategoryId = str(formData, "primary_category_id");
  const categoryIds = formData.getAll("category_ids").map(String);
  if (!primaryCategoryId) fail(productId, "Ana kategori zorunludur.");
  if (!categoryIds.includes(primaryCategoryId)) {
    categoryIds.push(primaryCategoryId);
  }

  const { error } = await supabase
    .from("products")
    .update({
      is_active: formData.get("is_active") === "on",
      is_featured: formData.get("is_featured") === "on",
      brand: strOrNull(formData, "brand"),
      sku: strOrNull(formData, "sku"),
      primary_category_id: primaryCategoryId,
    })
    .eq("id", productId);
  if (error) fail(productId, `Kayıt başarısız: ${error.message}`);

  // Kategori atamaları: farkı uygula (sil + ekle)
  const { data: current } = await supabase
    .from("product_categories")
    .select("category_id")
    .eq("product_id", productId);
  const currentIds = new Set((current ?? []).map((c) => c.category_id));
  const nextIds = new Set(categoryIds);

  const toDelete = [...currentIds].filter((id) => !nextIds.has(id));
  const toInsert = [...nextIds].filter((id) => !currentIds.has(id));

  if (toDelete.length > 0) {
    const { error: e } = await supabase
      .from("product_categories")
      .delete()
      .eq("product_id", productId)
      .in("category_id", toDelete);
    if (e) fail(productId, `Kategori güncellenemedi: ${e.message}`);
  }
  if (toInsert.length > 0) {
    const { error: e } = await supabase
      .from("product_categories")
      .insert(toInsert.map((category_id) => ({ product_id: productId, category_id })));
    if (e) fail(productId, `Kategori güncellenemedi: ${e.message}`);
  }

  refresh(productId);
}

/* ---------------- Özellikler (spec) ---------------- */

export async function saveSpec(
  productId: string,
  specId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const sortOrder = parseInt(str(formData, "sort_order"), 10) || 0;
  const { error } = await supabase
    .from("product_specs")
    .update({ sort_order: sortOrder })
    .eq("id", specId);
  if (error) fail(productId, `Özellik kaydedilemedi: ${error.message}`);

  for (const locale of ["tr", "en"] as const) {
    const label = str(formData, `label_${locale}`);
    const value = str(formData, `value_${locale}`);
    if (!label && !value) continue;
    const { error: e } = await supabase
      .from("product_spec_translations")
      .upsert(
        { spec_id: specId, locale, label, value },
        { onConflict: "spec_id,locale" }
      );
    if (e) fail(productId, `Özellik çevirisi kaydedilemedi: ${e.message}`);
  }
  refresh(productId);
}

export async function addSpec(
  productId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const labelTr = str(formData, "label_tr");
  const valueTr = str(formData, "value_tr");
  if (!labelTr || !valueTr) fail(productId, "Özellik adı ve değeri (TR) zorunludur.");

  const sortOrder = parseInt(str(formData, "sort_order"), 10) || 999;
  const { data: spec, error } = await supabase
    .from("product_specs")
    .insert({ product_id: productId, sort_order: sortOrder })
    .select("id")
    .single();
  if (error || !spec) fail(productId, `Özellik eklenemedi: ${error?.message}`);

  const rows = [{ spec_id: spec.id, locale: "tr", label: labelTr, value: valueTr }];
  const labelEn = str(formData, "label_en");
  const valueEn = str(formData, "value_en");
  if (labelEn && valueEn) {
    rows.push({ spec_id: spec.id, locale: "en", label: labelEn, value: valueEn });
  }
  const { error: e } = await supabase
    .from("product_spec_translations")
    .insert(rows);
  if (e) fail(productId, `Özellik çevirisi eklenemedi: ${e.message}`);

  refresh(productId);
}

export async function deleteSpec(
  productId: string,
  specId: string
): Promise<void> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("product_specs")
    .delete()
    .eq("id", specId);
  if (error) fail(productId, `Özellik silinemedi: ${error.message}`);
  refresh(productId);
}

/* ---------------- SSS ---------------- */

export async function saveFaq(
  productId: string,
  faqId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const sortOrder = parseInt(str(formData, "sort_order"), 10) || 0;
  const { error } = await supabase
    .from("product_faqs")
    .update({ sort_order: sortOrder })
    .eq("id", faqId);
  if (error) fail(productId, `SSS kaydedilemedi: ${error.message}`);

  for (const locale of ["tr", "en"] as const) {
    const question = str(formData, `question_${locale}`);
    const answer = str(formData, `answer_${locale}`);
    if (!question && !answer) continue;
    const { error: e } = await supabase
      .from("product_faq_translations")
      .upsert(
        { faq_id: faqId, locale, question, answer },
        { onConflict: "faq_id,locale" }
      );
    if (e) fail(productId, `SSS çevirisi kaydedilemedi: ${e.message}`);
  }
  refresh(productId);
}

export async function addFaq(
  productId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const questionTr = str(formData, "question_tr");
  const answerTr = str(formData, "answer_tr");
  if (!questionTr || !answerTr) fail(productId, "Soru ve cevap (TR) zorunludur.");

  const { data: faq, error } = await supabase
    .from("product_faqs")
    .insert({
      product_id: productId,
      sort_order: parseInt(str(formData, "sort_order"), 10) || 999,
    })
    .select("id")
    .single();
  if (error || !faq) fail(productId, `SSS eklenemedi: ${error?.message}`);

  const rows = [
    { faq_id: faq.id, locale: "tr", question: questionTr, answer: answerTr },
  ];
  const questionEn = str(formData, "question_en");
  const answerEn = str(formData, "answer_en");
  if (questionEn && answerEn) {
    rows.push({ faq_id: faq.id, locale: "en", question: questionEn, answer: answerEn });
  }
  const { error: e } = await supabase
    .from("product_faq_translations")
    .insert(rows);
  if (e) fail(productId, `SSS çevirisi eklenemedi: ${e.message}`);

  refresh(productId);
}

export async function deleteFaq(
  productId: string,
  faqId: string
): Promise<void> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("product_faqs").delete().eq("id", faqId);
  if (error) fail(productId, `SSS silinemedi: ${error.message}`);
  refresh(productId);
}

/* ---------------- Görseller ---------------- */

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadImage(
  productId: string,
  productSlug: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    fail(productId, "Dosya seçilmedi.");
  }
  if (!IMAGE_TYPES.has(file.type)) {
    fail(productId, "Sadece JPEG, PNG veya WebP yüklenebilir.");
  }
  if (file.size > 5 * 1024 * 1024) {
    fail(productId, "Dosya 5 MB'tan büyük olamaz.");
  }

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const path = `products/${productSlug}/${Date.now()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  if (upErr) fail(productId, `Yükleme başarısız: ${upErr.message}`);

  // İlk görselse primary yap
  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_path: path,
    is_primary: (count ?? 0) === 0,
    sort_order: (count ?? 0) + 1,
    alt_tr: strOrNull(formData, "alt_tr"),
  });
  if (error) {
    await supabase.storage.from("product-images").remove([path]);
    fail(productId, `Görsel kaydedilemedi: ${error.message}`);
  }
  refresh(productId);
}

export async function deleteImage(
  productId: string,
  imageId: string,
  storagePath: string
): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);
  if (error) fail(productId, `Görsel silinemedi: ${error.message}`);

  await supabase.storage.from("product-images").remove([storagePath]);
  refresh(productId);
}

export async function setPrimaryImage(
  productId: string,
  imageId: string
): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error: e1 } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  if (e1) fail(productId, `Güncellenemedi: ${e1.message}`);

  const { error: e2 } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (e2) fail(productId, `Güncellenemedi: ${e2.message}`);

  refresh(productId);
}

export async function updateImageMeta(
  productId: string,
  imageId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("product_images")
    .update({
      alt_tr: strOrNull(formData, "alt_tr"),
      alt_en: strOrNull(formData, "alt_en"),
      sort_order: parseInt(str(formData, "sort_order"), 10) || 0,
    })
    .eq("id", imageId);
  if (error) fail(productId, `Güncellenemedi: ${error.message}`);
  refresh(productId);
}
