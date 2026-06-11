import { SITE_URL, SITE_NAME } from "./meta";

/** JSON-LD script bloğu */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-hd.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90 533 308 51 46",
      contactType: "sales",
      availableLanguage: ["Turkish", "English"],
    },
  };
}

export function productJsonLd(opts: {
  name: string;
  description?: string | null;
  image?: string | null;
  sku?: string | null;
  brand?: string | null;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.sku ? { sku: opts.sku } : {}),
    ...(opts.brand
      ? { brand: { "@type": "Brand", name: opts.brand } }
      : {}),
    url: opts.url,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
