import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { ProductsHero } from "@/components/product/products-hero";
import { CatalogSidebar } from "@/components/product/catalog-sidebar";
import {
  CatalogExplorer,
  type CategoryOption,
  type ExplorerItem,
} from "@/components/product/catalog-explorer";
import { QuoteBanner } from "@/components/product/quote-banner";
import {
  getCategoryTree,
  getCategoryProductCounts,
  catT,
  categorySlugPath,
} from "@/lib/data/categories";
import { alternatesFor } from "@/lib/seo/meta";
import { stripHtml } from "@/lib/text";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("title"),
    description: t("heroSubtitle"),
    alternates: alternatesFor(locale, "/urunler"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("products");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const [tree, counts] = await Promise.all([
    getCategoryTree(),
    getCategoryProductCounts(),
  ]);

  const items: ExplorerItem[] = tree.roots.map((node) => {
    const tr = catT(node, locale);
    return {
      id: node.id,
      eyebrow:
        node.children.length > 0
          ? t("subcategoryCount", { count: node.children.length })
          : tCommon("productCount", { count: counts.get(node.id) ?? 0 }),
      name: tr.name,
      blurb: stripHtml(tr.description) || undefined,
      imagePath: node.imagePath,
      slugs: categorySlugPath(tree, node, locale),
    };
  });

  const categoryOptions: CategoryOption[] = [
    { label: t("allCategories"), slugs: [], active: true },
    ...tree.roots.map((node) => ({
      label: catT(node, locale).name,
      slugs: categorySlugPath(tree, node, locale),
    })),
  ];

  return (
    <>
      <ProductsHero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        crumbs={[{ label: tNav("products") }]}
      />

      <div className="bg-surface py-12 lg:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
            <CatalogSidebar tree={tree} locale={locale} />
            {items.length === 0 ? (
              <p className="text-ink-400">{tCommon("loadError")}</p>
            ) : (
              <CatalogExplorer
                heading={t("allProducts")}
                items={items}
                categoryOptions={categoryOptions}
              />
            )}
          </div>

          <div className="mt-14 lg:mt-16">
            <QuoteBanner />
          </div>
        </Container>
      </div>
    </>
  );
}
