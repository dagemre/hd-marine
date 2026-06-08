import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

const TR_MAP: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  İ: "i",
  I: "i",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

/**
 * Türkçe karakterleri ASCII'ye çevirerek URL-uyumlu slug üretir.
 * "Diyaframlı Pompa Ø50" -> "diyaframli-pompa-50"
 */
export function slugify(input: string): string {
  const replaced = input
    .normalize("NFC")
    .replace(/[çğıöşüÇĞİIÖŞÜ]/g, (ch) => TR_MAP[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return replaced || "urun";
}

/**
 * Verilen locale içinde benzersiz bir ürün slug'ı döndürür.
 * Çakışma varsa "-2", "-3" … eklenir. excludeProductId düzenlenen ürünü
 * kendi slug'ıyla çakışmaktan korur.
 */
export async function uniqueProductSlug(
  supabase: Client,
  locale: "tr" | "en",
  name: string,
  excludeProductId?: string
): Promise<string> {
  const base = slugify(name);
  const { data } = await supabase
    .from("product_translations")
    .select("slug, product_id")
    .eq("locale", locale)
    .like("slug", `${base}%`);

  const taken = new Set(
    (data ?? [])
      .filter((r) => !excludeProductId || r.product_id !== excludeProductId)
      .map((r) => r.slug)
  );

  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
