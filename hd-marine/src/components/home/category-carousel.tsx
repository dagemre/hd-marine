import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { CategoryCard } from "@/components/product/category-card";
import { getCategoryTree, catT } from "@/lib/data/categories";

/**
 * Tasarımdaki "ÜRÜNLERİMİZ" bölümü: solda başlık bloğu, sağda Tüm Ürünler
 * butonu; altında ana kategorilerin yatay kaydırmalı kart şeridi.
 */
export async function CategoryCarousel() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tree = await getCategoryTree();

  return (
    <section className="bg-surface pt-16 pb-20 lg:pt-20 lg:pb-28">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-12">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
              {t("categoriesEyebrow")}
            </p>
            <h2 className="text-display-sm font-bold text-ink-900 lg:text-display">
              {t("categoriesTitle")}
            </h2>
            <p className="mt-4 text-lg text-ink-600">{t("categoriesSubtitle")}</p>
          </div>
          <Link
            href="/urunler"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-brand-200 bg-white px-6 text-sm font-bold uppercase tracking-wide text-navy transition-colors hover:border-primary hover:text-primary"
          >
            {t("allProducts")}
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M2 8h11M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {tree.roots.length === 0 ? (
          <p className="text-center text-ink-400">{tCommon("loadError")}</p>
        ) : (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:thin]">
            {tree.roots.map((node) => {
              const tr = catT(node, locale);
              return (
                <div
                  key={node.id}
                  className="w-64 shrink-0 snap-start sm:w-72"
                >
                  <CategoryCard
                    name={tr.name}
                    slugs={[tr.slug]}
                    imagePath={node.imagePath}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
