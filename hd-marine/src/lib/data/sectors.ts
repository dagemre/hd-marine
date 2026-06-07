import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";
import type { Sector, SectorTranslation } from "./types";

/**
 * Aktif sektörler (21 kayıt) — sort_order'a göre, istek başına React cache.
 * DB erişilemezse boş liste döner (sandbox/offline toleransı).
 */
export const getSectors = cache(async (): Promise<Sector[]> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sectors")
      .select("id, sort_order, image_path, sector_translations(locale, name, slug)")
      .eq("is_active", true)
      .order("sort_order");

    if (error || !data) {
      console.warn("[data/sectors] sektör sorgusu başarısız:", error?.message);
      return [];
    }

    return data.map((row) => {
      const i18n: Sector["i18n"] = {};
      for (const tr of row.sector_translations) {
        i18n[tr.locale as Locale] = { name: tr.name, slug: tr.slug };
      }
      return {
        id: row.id,
        sortOrder: row.sort_order,
        imagePath: row.image_path,
        i18n,
      };
    });
  } catch (err) {
    console.warn("[data/sectors] beklenmedik hata:", err);
    return [];
  }
});

/** Locale çevirisi — TR fallback */
export function secT(sector: Sector, locale: Locale): SectorTranslation {
  return (sector.i18n[locale] ?? sector.i18n.tr)!;
}
