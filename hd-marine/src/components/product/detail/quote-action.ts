"use server";

import { createClient } from "@/lib/supabase/server";

export type ProductQuoteState = {
  status: "idle" | "success" | "error";
  /** Alan adı → product.error* sözlük anahtarı */
  fieldErrors?: Record<string, "errorRequired" | "errorEmail">;
  formError?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Ürün detay sayfasındaki "Fiyat Teklifi Alın" formu —
 * quote_requests tablosuna product_id ile yazar (RLS: anyone can submit).
 */
export async function submitProductQuote(
  _prev: ProductQuoteState,
  formData: FormData
): Promise<ProductQuoteState> {
  // Honeypot — botlar doldurursa sessizce "başarılı" dön
  if (((formData.get("website") as string) ?? "").trim()) {
    return { status: "success" };
  }

  const str = (name: string, max: number) =>
    ((formData.get(name) as string) ?? "").trim().slice(0, max);

  const fullName = str("fullName", 120);
  const email = str("email", 200);
  const phone = str("phone", 40);
  const productGroup = str("productGroup", 160);
  const message = str("message", 4000);
  const productId = str("productId", 60);
  const locale = str("locale", 5) === "en" ? "en" : "tr";

  const fieldErrors: ProductQuoteState["fieldErrors"] = {};
  if (!fullName) fieldErrors.fullName = "errorRequired";
  if (!email) fieldErrors.email = "errorRequired";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "errorEmail";
  if (!phone) fieldErrors.phone = "errorRequired";
  if (!productGroup) fieldErrors.productGroup = "errorRequired";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    // Not: anon insert'te .select() kullanılmaz (RLS)
    const { error } = await supabase.from("quote_requests").insert({
      full_name: fullName,
      email,
      phone,
      product_group: productGroup,
      product_id: productId || null,
      message: message || null,
      locale,
    });
    if (error) {
      console.error("[ürün detay] teklif insert hatası:", error.message);
      return { status: "error", formError: true };
    }
  } catch (e) {
    console.error("[ürün detay] teklif gönderilemedi:", e);
    return { status: "error", formError: true };
  }

  return { status: "success" };
}
