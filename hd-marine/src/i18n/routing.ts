import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  // TR prefix'siz (/urunler), EN /en altında (/en/products)
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/urunler": { tr: "/urunler", en: "/products" },
    "/urunler/[...slug]": {
      tr: "/urunler/[...slug]",
      en: "/products/[...slug]",
    },
    "/hakkimizda": { tr: "/hakkimizda", en: "/about" },
    "/sektorler": { tr: "/sektorler", en: "/sectors" },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/teklif-alin": { tr: "/teklif-alin", en: "/get-a-quote" },
    "/kataloglar": { tr: "/kataloglar", en: "/catalogs" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
