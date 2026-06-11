import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hdmarine.com.tr";
export const SITE_NAME = "HD Marine";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Verilen route için locale'e göre tam URL */
export function urlFor(href: Href, locale: Locale): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

/**
 * hreflang alternates — tr / en / x-default (x-default = TR).
 * Dinamik sayfalarda her locale için doğru slug'lı href'ler ayrı
 * verilir (localizedHrefs); statik sayfalarda tek href yeterlidir.
 */
export function alternatesFor(
  locale: Locale,
  hrefs: Partial<Record<Locale, Href>> | Href
): NonNullable<Metadata["alternates"]> {
  const map: Partial<Record<Locale, Href>> =
    typeof hrefs === "object" && hrefs !== null && ("tr" in hrefs || "en" in hrefs)
      ? (hrefs as Partial<Record<Locale, Href>>)
      : { tr: hrefs as Href, en: hrefs as Href };

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const href = map[l];
    if (href) languages[l] = urlFor(href, l);
  }
  if (languages.tr) languages["x-default"] = languages.tr;

  const current = map[locale] ?? map.tr;
  return {
    canonical: current ? urlFor(current, locale) : undefined,
    languages,
  };
}

/**
 * Meta title: DB'de meta_title varsa olduğu gibi (absolute) kullanılır;
 * yoksa şablondan üretilir ve layout template'i "| HD Marine" ekler.
 */
export function metaTitle(
  dbMetaTitle: string | null | undefined,
  fallbackParts: string[]
): Metadata["title"] {
  if (dbMetaTitle) return { absolute: dbMetaTitle };
  return fallbackParts.filter(Boolean).join(" | ");
}
