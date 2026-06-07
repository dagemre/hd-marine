import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { CategoryCard } from "./category-card";
import { ProductCard } from "./product-card";
import { CatalogBreadcrumb, type CrumbEntry } from "./catalog-breadcrumb";
import {
  catT,
  categoryChain,
  categorySlugPath,
} from "@/lib/data/categories";
import { getProductsByCategory, prodT, imageAlt } from "@/lib/data/products";
import type { CategoryNode, CategoryTree } from "@/lib/data/types";

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
  const tCommon = await getTranslations("common");
  const tr = catT(category, locale);
  const products = await getProductsByCategory(category.id);

  const crumbs: CrumbEntry[] = categoryChain(tree, category).map((node) => ({
    label: catT(node, locale).name,
    slugs: categorySlugPath(tree, node, locale),
  }));

  return (
    <>
      <div className="border-b border-black/5 bg-white">
        <Container className="py-4">
          <CatalogBreadcrumb entries={crumbs} />
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <h1 className="text-display-sm font-bold lg:text-display">{tr.name}</h1>
        {tr.description && (
          <div
            className="rich-text mt-4 max-w-3xl text-ink-600"
            dangerouslySetInnerHTML={{ __html: tr.description }}
          />
        )}

        {category.children.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-6 text-xl font-bold">{t("subcategories")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.children.map((child) => {
                const childTr = catT(child, locale);
                return (
                  <CategoryCard
                    key={child.id}
                    name={childTr.name}
                    slugs={categorySlugPath(tree, child, locale)}
                    imagePath={child.imagePath}
                  />
                );
              })}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">
              {tCommon("productCount", { count: products.length })}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const pTr = prodT(product.i18n, locale);
                const primary = tree.byId.get(product.primaryCategoryId);
                const slugs = primary
                  ? [...categorySlugPath(tree, primary, locale), pTr.slug]
                  : [pTr.slug];
                return (
                  <ProductCard
                    key={product.id}
                    name={pTr.name}
                    slugs={slugs}
                    imagePath={product.primaryImage?.storagePath ?? null}
                    imageAlt={
                      product.primaryImage
                        ? imageAlt(product.primaryImage, locale, pTr.name)
                        : undefined
                    }
                    brand={product.brand}
                  />
                );
              })}
            </div>
          </section>
        )}

        {category.children.length === 0 && products.length === 0 && (
          <p className="mt-12 text-ink-400">{tCommon("noResults")}</p>
        )}
      </Container>
    </>
  );
}
