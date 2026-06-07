"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  /** Alan bazlı hata anahtarları (contact.errors.* sözlüğüne bakar) */
  fieldErrors?: Record<string, string>;
  /** Genel hata anahtarı */
  formError?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = {
  fullName: 120,
  email: 200,
  phone: 40,
  productInterest: 160,
  message: 4000,
} as const;

/** İletişim mesajını contact_messages tablosuna yazar (RLS: anyone can submit). */
export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot — botlar doldurursa sessizce "başarılı" dön
  if ((formData.get("website") as string)?.trim()) {
    return { status: "success" };
  }

  const str = (name: string, max: number) =>
    ((formData.get(name) as string) ?? "").trim().slice(0, max);

  const fullName = str("fullName", MAX.fullName);
  const email = str("email", MAX.email);
  const phone = str("phone", MAX.phone);
  const productInfo = str("productInfo", 5); // "yes" | "no" | ""
  const productInterest = str("productInterest", MAX.productInterest);
  const message = str("message", MAX.message);
  const locale = str("locale", 5) === "en" ? "en" : "tr";

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = "required";
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "email";
  if (!phone) fieldErrors.phone = "required";
  if (productInfo !== "yes" && productInfo !== "no")
    fieldErrors.productInfo = "productInfo";
  if (!message) fieldErrors.message = "required";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      full_name: fullName,
      email,
      phone,
      message,
      wants_product_info: productInfo === "yes",
      // DB'ye her zaman TR kategori adı yazılır (admin gelen kutusu TR okur)
      product_interest: productInterest || null,
      locale,
    });

    if (error) {
      console.error("[iletisim] insert hatası:", error.message);
      return { status: "error", formError: "generic" };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[iletisim] beklenmedik hata:", err);
    return { status: "error", formError: "generic" };
  }
}
