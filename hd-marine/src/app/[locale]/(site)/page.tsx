import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Section, SectionHeading } from "@/components/ui/section";
import { buttonStyles } from "@/components/ui/button";
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
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: { absolute: `HD Marine – ${t("heroTitle")}` },
    description: t("heroSubtitle"),
    alternates: alternatesFor(locale, "/"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tree = await getCategoryTree();

  return (
    <>
      {/* Hero */}
      <Section tone="gradient" className="py-24 lg:py-36">
        <div className="max-w-3xl">
          <h1 className="text-display font-bold lg:text-display-lg">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-100">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/teklif-alin" className={buttonStyles("primary", "lg")}>
              {t("heroCta")}
            </Link>
            <Link
              href="/urunler"
              className={buttonStyles("white", "lg")}
            >
              {tCommon("viewAll")}
            </Link>
          </div>
        </div>
      </Section>

      {/* Kategori grid */}
      <Section tone="surface">
        <SectionHeading
          title={t("categoriesTitle")}
          subtitle={t("categoriesSubtitle")}
        />
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
                />
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
