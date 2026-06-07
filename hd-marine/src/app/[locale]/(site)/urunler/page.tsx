import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Section } from "@/components/ui/section";
import { PageHero } from "@/components/layout/page-hero";
import { CategoryCard } from "@/components/product/category-card";
import { getCategoryTree, catT } from "@/lib/data/categories";
import { alternatesFor } from "@/lib/seo/meta";

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
    description: t("subtitle"),
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
  const tCommon = await getTranslations("common");
  const tree = await getCategoryTree();

  return (
    <>
      <PageHero
        badge={t("heroBadge")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Section tone="surface">
        {tree.roots.length === 0 ? (
          <p className="text-center text-ink-400">{tCommon("loadError")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tree.roots.map((node) => {
              const tr = catT(node, locale);
              return (
                <CategoryCard
                  key={node.id}
                  name={tr.name}
                  slugs={[tr.slug]}
                  imagePath={node.imagePath}
                  productCountLabel={
                    node.children.length > 0
                      ? `${node.children.length} ${t("subcategories").toLocaleLowerCase(locale)}`
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
