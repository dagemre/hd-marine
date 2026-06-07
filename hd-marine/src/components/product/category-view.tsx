import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { ProductsHero, type DarkCrumb } from "./products-hero";
import { CatalogSidebar } from "./catalog-sidebar";
import {
  CatalogExplorer,
  type CategoryOption,
  type ExplorerItem,
} from "./catalog-explorer";
import { QuoteBanner } from "./quote-banner";
import {
  catT,
  categoryChain,
  categorySlugPath,
  getCategoryProductCounts,
} from "@/lib/data/categories";
import { getProductsByCategory, prodT, imageAlt } from "@/lib/data/products";
import { stripHtml } from "@/lib/text";
import type { CategoryNode, CategoryTree } from "@/lib/data/types";

/**
 * Kategori sayfası — ürünler sayfasıyla birebir aynı düzen
 * (Context/ürünler.png): hero + sol sidebar + araç çubuklu kart
 * ızgarası (alt kategoriler + doğrudan ürünler) + teklif bandı.
 */
export async function CategoryView({
  category,
  tree,
  locale,
}: {
  category: CategoryNode;
  tree: CategoryTree;
  locale: Locale;
}) {
  const t = await getTranslations("products");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tr = catT(category, locale);
  const [products, counts] = await Promise.all([
    getProductsByCategory(category.id),
    getCategoryProductCounts(),
  ]);

  const chain = categoryChain(tree, category);
  const crumbs: DarkCrumb[] = [
    { label: tNav("products"), root: true },
    ...chain.map((node) => ({
      label: catT(node, locale).name,
      slugs: categorySlugPath(tree, node, locale),
    })),
  ];

  // Sidebar'da aktif kök: zincirin ilk halkası
  const activeRootId = chain[0]?.id ?? category.id;

  // Kartlar: önce alt kategoriler, ardından doğrudan ürünler
  const categoryItems: ExplorerItem[] = category.children.map((child) => {
    const childTr = catT(child, locale);
    return {
      id: child.id,
      eyebrow:
        child.children.length > 0
          ? t("subcategoryCount", { count: child.children.length })
          : tCommon("productCount", { count: counts.get(child.id) ?? 0 }),
      name: childTr.name,
      blurb: stripHtml(childTr.description) || undefined,
      imagePath: child.imagePath,
      slugs: categorySlugPath(tree, child, locale),
    };
  });

  const productItems: ExplorerItem[] = products.map((product) => {
    const pTr = prodT(product.i18n, locale);
    const primary = tree.byId.get(product.primaryCategoryId);
    const slugs = primary
      ? [...categorySlugPath(tree, primary, locale), pTr.slug]
      : [pTr.slug];
    return {
      id: product.id,
      eyebrow: tr.name,
      name: pTr.name,
      blurb: stripHtml(pTr.summary) || undefined,
      imagePath: product.primaryImage?.storagePath ?? null,
      imageAlt: product.primaryImage
        ? imageAlt(product.primaryImage, locale, pTr.name)
        : undefined,
      slugs,
    };
  });

  const items = [...categoryItems, ...productItems];

  const categoryOptions: CategoryOption[] = [
    { label: t("allCategories"), slugs: [] },
    ...tree.roots.map((node) => ({
      label: catT(node, locale).name,
      slugs: categorySlugPath(tree, node, locale),
      active: node.id === activeRootId,
    })),
  ];

  return (
    <>
      <ProductsHero
        title={tr.name}
        subtitle={stripHtml(tr.description) || t("heroSubtitle")}
        crumbs={crumbs}
      />

      <div className="bg-surface py-12 lg:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
            <CatalogSidebar
              tree={tree}
              locale={locale}
              activeCategoryId={activeRootId}
            />
            {items.length === 0 ? (
              <p className="text-ink-400">{tCommon("noResults")}</p>
            ) : (
              <CatalogExplorer
                heading={tr.name}
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
