import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { urlFor } from "@/lib/seo/meta";
import { getCategoryTree, categorySlugPath } from "@/lib/data/categories";
import { getNavProducts, prodT } from "@/lib/data/products";

export const revalidate = 3600;

type Href = Parameters<typeof urlFor>[0];

/** Her iki locale için URL + hreflang alternates'li sitemap girdisi */
function entry(
  hrefs: Partial<Record<Locale, Href>>,
  opts: { priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const href = hrefs[l];
    if (href) languages[l] = urlFor(href, l);
  }
  return routing.locales.flatMap((l) => {
    const href = hrefs[l];
    if (!href) return [];
    return [
      {
        url: urlFor(href, l),
        changeFrequency: opts.changeFrequency,
        priority: opts.priority,
        alternates: { languages },
      },
    ];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = [];

  // Statik sayfalar
  const staticPages: { href: Href; priority: number }[] = [
    { href: "/", priority: 1 },
    { href: "/urunler", priority: 0.9 },
    { href: "/sektorler", priority: 0.7 },
    { href: "/hakkimizda", priority: 0.6 },
    { href: "/iletisim", priority: 0.6 },
    { href: "/teklif-alin", priority: 0.8 },
  ];
  for (const p of staticPages) {
    items.push(
      ...entry(
        { tr: p.href, en: p.href },
        { priority: p.priority, changeFrequency: "weekly" }
      )
    );
  }

  const tree = await getCategoryTree();

  // Kategoriler (taban hariç tüm ağaç)
  for (const node of tree.byId.values()) {
    if (node.parentId === null) continue;
    const hrefs: Partial<Record<Locale, Href>> = {};
    for (const l of routing.locales) {
      const slugs = categorySlugPath(tree, node, l);
      if (slugs.length > 0) {
        hrefs[l] = { pathname: "/urunler/[...slug]", params: { slug: slugs } };
      }
    }
    items.push(...entry(hrefs, { priority: 0.7, changeFrequency: "weekly" }));
  }

  // Ürünler
  const products = await getNavProducts();
  for (const product of products) {
    const primary = tree.byId.get(product.primaryCategoryId);
    const hrefs: Partial<Record<Locale, Href>> = {};
    for (const l of routing.locales) {
      const pSlug = prodT(product.i18n, l).slug;
      const slugs = primary
        ? [...categorySlugPath(tree, primary, l), pSlug]
        : [pSlug];
      hrefs[l] = { pathname: "/urunler/[...slug]", params: { slug: slugs } };
    }
    items.push(...entry(hrefs, { priority: 0.8, changeFrequency: "monthly" }));
  }

  return items;
}
