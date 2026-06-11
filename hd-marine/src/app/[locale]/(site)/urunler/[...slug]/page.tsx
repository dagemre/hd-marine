import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { resolveSlugPath } from "@/lib/data/resolve";
import { getCategoryTree, catT, categoryChain, categorySlugPath } from "@/lib/data/categories";
import { prodT } from "@/lib/data/products";
import { alternatesFor, metaTitle, urlFor } from "@/lib/seo/meta";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { productImageUrl } from "@/lib/storage";
import { imageAlt } from "@/lib/data/products";
import { CategoryView } from "@/components/product/category-view";
import { ProductView } from "@/components/product/product-view";

export const revalidate = 300;

type Params = Promise<{ locale: string; slug: string[] }>;

function decodeSlugs(slugs: string[]): string[] {
  return slugs.map((s) => decodeURIComponent(s));
}

/** Her iki locale için canonical slug yolları (hreflang) */
async function localizedHrefs(slugs: string[], locale: Locale) {
  const resolved = await resolveSlugPath(slugs, locale);
  if (resolved.type === "not-found") return null;

  const tree = await getCategoryTree();
  const hrefs: Partial<
    Record<Locale, { pathname: "/urunler/[...slug]"; params: { slug: string[] } }>
  > = {};
  for (const l of routing.locales) {
    let s: string[];
    if (resolved.type === "category") {
      s = categorySlugPath(tree, resolved.category, l);
    } else {
      const primary = tree.byId.get(resolved.product.primaryCategoryId);
      const pSlug = prodT(resolved.product.i18n, l).slug;
      s = primary ? [...categorySlugPath(tree, primary, l), pSlug] : [pSlug];
    }
    hrefs[l] = { pathname: "/urunler/[...slug]", params: { slug: s } };
  }
  return { resolved, hrefs };
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const data = await localizedHrefs(decodeSlugs(slug), locale);
  if (!data) return {};

  const { resolved, hrefs } = data;
  const tree = await getCategoryTree();

  if (resolved.type === "category") {
    const tr = catT(resolved.category, locale);
    const description = tr.meta_description ?? tr.description?.slice(0, 160);
    return {
      title: metaTitle(tr.meta_title, [tr.name]),
      description,
      alternates: alternatesFor(locale, hrefs),
      openGraph: { title: tr.name, description: description ?? undefined },
    };
  }

  const tr = prodT(resolved.product.i18n, locale);
  const primary = tree.byId.get(resolved.product.primaryCategoryId);
  const categoryName = primary ? catT(primary, locale).name : "";
  const description = tr.meta_description ?? tr.summary ?? undefined;
  const primaryImage = resolved.product.images[0];
  return {
    title: metaTitle(tr.meta_title, [tr.name, categoryName]),
    description,
    alternates: alternatesFor(locale, hrefs),
    openGraph: {
      title: tr.name,
      description,
      ...(primaryImage
        ? {
            images: [
              {
                url: productImageUrl(primaryImage.storagePath),
                alt: imageAlt(primaryImage, locale, tr.name),
              },
            ],
          }
        : {}),
    },
  };
}

export default async function CatalogPage({ params }: { params: Params }) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const slugs = decodeSlugs(slug);
  const resolved = await resolveSlugPath(slugs, locale);
  if (resolved.type === "not-found") notFound();

  // Canonical yol değilse (yanlış dilin slug'ı, eski hiyerarşi vb.) → 308
  if (resolved.canonicalSlugs.join("/") !== slugs.join("/")) {
    permanentRedirect({
      href: {
        pathname: "/urunler/[...slug]",
        params: { slug: resolved.canonicalSlugs },
      },
      locale,
    });
  }

  const tree = await getCategoryTree();
  const tNav = await getTranslations("nav");

  // Breadcrumb JSON-LD
  const chainNodes =
    resolved.type === "category"
      ? categoryChain(tree, resolved.category)
      : (() => {
          const primary = tree.byId.get(resolved.product.primaryCategoryId);
          return primary ? categoryChain(tree, primary) : [];
        })();
  const crumbsLd = [
    { name: tNav("home"), url: urlFor("/", locale) },
    { name: tNav("products"), url: urlFor("/urunler", locale) },
    ...chainNodes.map((node) => ({
      name: catT(node, locale).name,
      url: urlFor(
        {
          pathname: "/urunler/[...slug]",
          params: { slug: categorySlugPath(tree, node, locale) },
        },
        locale
      ),
    })),
    ...(resolved.type === "product"
      ? [{ name: prodT(resolved.product.i18n, locale).name }]
      : []),
  ];

  // Product JSON-LD (ürün sayfalarında)
  const productLd =
    resolved.type === "product"
      ? (() => {
          const tr = prodT(resolved.product.i18n, locale);
          const img = resolved.product.images[0];
          return productJsonLd({
            name: tr.name,
            description: tr.meta_description ?? tr.summary,
            image: img ? productImageUrl(img.storagePath) : null,
            sku: resolved.product.sku,
            brand: resolved.product.brand,
            url: urlFor(
              {
                pathname: "/urunler/[...slug]",
                params: { slug: resolved.canonicalSlugs },
              },
              locale
            ),
          });
        })()
      : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbsLd)} />
      {productLd && <JsonLd data={productLd} />}
      {resolved.type === "category" ? (
        <CategoryView category={resolved.category} tree={tree} locale={locale} />
      ) : (
        <ProductView product={resolved.product} tree={tree} locale={locale} />
      )}
    </>
  );
}
