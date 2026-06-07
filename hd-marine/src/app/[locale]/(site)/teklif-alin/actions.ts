"use server";

import { createClient } from "@/lib/supabase/server";

export type QuoteFormState = {
  status: "idle" | "success" | "error";
  /** Alan bazlı hata anahtarları (quote.errors.* sözlüğüne bakar) */
  fieldErrors?: Record<string, string>;
  /** Genel hata anahtarı */
  formError?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = {
  fullName: 120,
  email: 200,
  phone: 40,
  company: 160,
  message: 4000,
  deliveryLocation: 160,
} as const;

/** Teklif talebini quote_requests tablosuna yazar (RLS: anyone can submit). */
export async function submitQuoteRequest(
  _prev: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  // Honeypot — botlar doldurursa sessizce "başarılı" dön
  if ((formData.get("website") as string)?.trim()) {
    return { status: "success" };
  }

  const str = (name: string, max: number) =>
    ((formData.get(name) as string) ?? "").trim().slice(0, max);

  const fullName = str("fullName", MAX.fullName);
  const email = str("email", MAX.email);
  const phone = str("phone", MAX.phone);
  const company = str("company", MAX.company);
  const message = str("message", MAX.message);
  const deliveryLocation = str("deliveryLocation", MAX.deliveryLocation);
  const estimatedNeed = str("estimatedNeed", 120);
  const sectorSlug = str("sectorSlug", 120);
  const locale = str("locale", 5) === "en" ? "en" : "tr";
  const productGroups = formData
    .getAll("productGroups")
    .map((v) => String(v).trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 12);

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = "required";
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "email";
  if (!phone) fieldErrors.phone = "required";
  if (productGroups.length === 0) fieldErrors.productGroups = "productGroups";
  if (!message) fieldErrors.message = "required";
  if (!estimatedNeed) fieldErrors.estimatedNeed = "required";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("quote_requests").insert({
      full_name: fullName,
      email,
      phone,
      company: company || null,
      product_group: productGroups.join(", "),
      message,
      estimated_need: estimatedNeed,
      delivery_location: deliveryLocation || null,
      sector_slug: sectorSlug || null,
      locale,
    });

    if (error) {
      console.error("[teklif-alin] insert hatası:", error.message);
      return { status: "error", formError: "generic" };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[teklif-alin] beklenmedik hata:", err);
    return { status: "error", formError: "generic" };
  }
}
