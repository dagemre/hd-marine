import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { CatalogBreadcrumb, type CrumbEntry } from "./catalog-breadcrumb";
import { catT, categoryChain, categorySlugPath } from "@/lib/data/categories";
import { prodT, imageAlt } from "@/lib/data/products";
import { productImageUrl } from "@/lib/storage";
import type { CategoryTree, ProductFull } from "@/lib/data/types";

export async function ProductView({
  product,
  tree,
  locale,
}: {
  product: ProductFull;
  tree: CategoryTree;
  locale: Locale;
}) {
  const t = await getTranslations("product");
  const tr = prodT(product.i18n, locale);
  const primary = tree.byId.get(product.primaryCategoryId);
  const specs = product.specs[locale] ?? product.specs.tr ?? [];
  const faqs = product.faqs[locale] ?? product.faqs.tr ?? [];

  const crumbs: CrumbEntry[] = [
    ...(primary
      ? categoryChain(tree, primary).map((node) => ({
          label: catT(node, locale).name,
          slugs: categorySlugPath(tree, node, locale),
        }))
      : []),
    { label: tr.name },
  ];

  const tabs: TabItem[] = [];
  if (tr.description) {
    tabs.push({
      label: t("description"),
      content: (
        <div
          className="rich-text text-ink-600"
          dangerouslySetInnerHTML={{ __html: tr.description }}
        />
      ),
    });
  }
  if (specs.length > 0) {
    tabs.push({
      label: t("specs"),
      content: (
        <div className="overflow-hidden rounded-xl border border-black/5">
          <table className="w-full text-sm">
            <tbody>
              {specs.map((spec, i) => (
                <tr key={i} className="odd:bg-surface">
                  <th className="w-2/5 px-4 py-3 text-left font-semibold text-ink-900">
                    {spec.label}
                  </th>
                  <td className="px-4 py-3 text-ink-600">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    });
  }
  if (tr.usage_areas) {
    tabs.push({
      label: t("usageAreas"),
      content: (
        <div
          className="rich-text text-ink-600"
          dangerouslySetInnerHTML={{ __html: tr.usage_areas }}
        />
      ),
    });
  }
  if (faqs.length > 0) {
    tabs.push({
      label: t("faq"),
      content: (
        <Accordion
          items={faqs.map((faq) => ({
            title: faq.question,
            content: faq.answer,
          }))}
        />
      ),
    });
  }

  const mainImage = product.images[0] ?? null;

  return (
    <>
      <div className="border-b border-black/5 bg-white">
        <Container className="py-4">
          <CatalogBreadcrumb entries={crumbs} />
        </Container>
      </div>

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Görseller */}
          <div>
            <div className="flex aspect-square items-center justify-center rounded-xl border border-black/5 bg-white p-8 shadow-card">
              {mainImage ? (
                <Image
                  src={productImageUrl(mainImage.storagePath)}
                  alt={imageAlt(mainImage, locale, tr.name)}
                  width={640}
                  height={640}
                  priority
                  className="max-h-full w-auto object-contain"
                />
              ) : (
                <p className="text-sm text-ink-400">—</p>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.slice(1, 6).map((img) => (
                  <div
                    key={img.id}
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white p-2"
                  >
                    <Image
                      src={productImageUrl(img.storagePath)}
                      alt={imageAlt(img, locale, tr.name)}
                      width={80}
                      height={80}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Özet + CTA */}
          <div>
            {primary && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {catT(primary, locale).name}
              </p>
            )}
            <h1 className="text-display-sm font-bold lg:text-display">
              {tr.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.brand && (
                <Badge>{`${t("brand")}: ${product.brand}`}</Badge>
              )}
              {product.sku && (
                <Badge variant="outline">{`${t("sku")}: ${product.sku}`}</Badge>
              )}
            </div>
            {tr.summary && (
              <p className="mt-6 text-lg leading-relaxed text-ink-600">
                {tr.summary}
              </p>
            )}
            <div className="mt-8">
              <Link
                href="/teklif-alin"
                className={buttonStyles("primary", "lg")}
              >
                {t("requestQuote")}
              </Link>
            </div>
          </div>
        </div>

        {tabs.length > 0 && <Tabs items={tabs} className="mt-14 lg:mt-20" />}
      </Container>
    </>
  );
}
