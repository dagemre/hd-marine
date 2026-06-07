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
import {
  prodT,
  imageAlt,
  getProductsByCategory,
} from "@/lib/data/products";
import { productImageUrl } from "@/lib/storage";
import { stripHtml } from "@/lib/text";
import { JsonLd } from "@/lib/seo/jsonld";
import type { CategoryTree, ProductFull } from "@/lib/data/types";
import { iconFor, WrenchIcon } from "./detail/icons";
import { ProductGallery } from "./detail/product-gallery";
import { QuoteCard, type QuoteGroupOption } from "./detail/quote-card";
import { SimilarProducts, type SimilarItem } from "./detail/similar-products";

/* ---------- içerik yardımcıları ---------- */

const norm = (s: string) =>
  s.toLocaleLowerCase("tr").replace(/[^a-z0-9çğıöşü]+/gi, "");

/**
 * Tasarımdaki başlık düzeni: özet "Genişletilmiş Ad – Alt Başlık"
 * kalıbındaysa (ön ek ürün adını içeriyorsa) H1 ön ekten, alt başlık
 * tireden sonrasından gelir; rozet ürün adını gösterir.
 * Örn. Blower: özet "Endüstriyel Blower – Güçlü Hava & Gaz Transfer
 * Çözümleri" → H1 "Endüstriyel Blower", alt başlık "Güçlü…", rozet "Blower".
 */
function titleParts(
  name: string,
  summary: string | null,
  categoryName: string | undefined
): { title: string; subtitle: string | null; badge: string | undefined } {
  let title = name;
  let subtitle: string | null = null;
  let badge = categoryName;

  if (summary) {
    const m = summary.match(/^(.{2,80}?)\s*[–—-]\s+(.{3,})$/);
    if (m && norm(m[1]).includes(norm(name))) {
      title = m[1].trim();
      subtitle = m[2].trim();
      if (norm(title) !== norm(name)) badge = name;
    } else if (summary.length <= 90) {
      subtitle = summary;
    }
  }
  return { title, subtitle, badge };
}

/** Açıklamanın ilk paragrafı — galeri yanındaki tanıtım metni */
function introFrom(description: string | null): string | null {
  if (!description) return null;
  const m = description.match(/<p[^>]*>[\s\S]*?<\/p>/i);
  return m ? m[0] : null;
}

/* ---------- görünüm ---------- */

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
  const chain = primary ? categoryChain(tree, primary) : [];
  const specs = product.specs[locale] ?? product.specs.tr ?? [];
  const faqs = product.faqs[locale] ?? product.faqs.tr ?? [];
  const { title, subtitle, badge } = titleParts(
    tr.name,
    tr.summary,
    primary ? catT(primary, locale).name : undefined
  );
  const intro = introFrom(tr.description);

  const crumbs: CrumbEntry[] = [
    ...chain.map((node) => ({
      label: catT(node, locale).name,
      slugs: categorySlugPath(tree, node, locale),
    })),
    { label: tr.name },
  ];

  /* Galeri görselleri */
  const galleryImages = product.images.map((img) => ({
    id: img.id,
    url: productImageUrl(img.storagePath),
    alt: imageAlt(img, locale, tr.name),
  }));

  /* Teklif formu: ana ürün grupları (değer = TR adı, admin tarafında tutarlı) */
  const groups: QuoteGroupOption[] = tree.roots.map((node) => ({
    value: catT(node, "tr").name,
    label: catT(node, locale).name,
  }));
  const defaultGroup = chain[0] ? catT(chain[0], "tr").name : undefined;

  /* Benzer ürünler: aynı ana kategoriden, kendisi hariç */
  const similar: SimilarItem[] = product.primaryCategoryId
    ? (await getProductsByCategory(product.primaryCategoryId))
        .filter((p) => p.id !== product.id)
        .slice(0, 8)
        .map((p) => {
          const pt = prodT(p.i18n, locale);
          const pPrimary = tree.byId.get(p.primaryCategoryId);
          const slugs = pPrimary
            ? [...categorySlugPath(tree, pPrimary, locale), pt.slug]
            : [pt.slug];
          return {
            id: p.id,
            name: pt.name,
            slugs,
            imageUrl: p.primaryImage
              ? productImageUrl(p.primaryImage.storagePath)
              : null,
            imageAlt: p.primaryImage
              ? imageAlt(p.primaryImage, locale, pt.name)
              : pt.name,
          };
        })
    : [];

  /* Sekmeler — verisi olmayan sekme gösterilmez (Dokümanlar bilinçli yok) */
  const tabs: TabItem[] = [];
  if (tr.description) {
    tabs.push({
      label: t("description"),
      content: (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div
            className="rich-text text-ink-600"
            dangerouslySetInnerHTML={{ __html: tr.description }}
          />
          {/* Teknik destek paneli (tasarımdaki açık mavi kart) */}
          <div className="h-fit rounded-xl bg-brand-50 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <WrenchIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold leading-snug text-navy">
                  {t("supportTitle")}
                </h3>
                <p className="mt-1.5 text-sm text-ink-600">{t("supportText")}</p>
                <Link
                  href="/iletisim"
                  className={buttonStyles("outline", "sm", "mt-4")}
                >
                  {t("supportCta")}
                </Link>
              </div>
            </div>
          </div>
        </div>
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

  /* Product JSON-LD (SEO) */
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tr.name,
    ...(galleryImages.length > 0 && {
      image: galleryImages.map((img) => img.url),
    }),
    ...(tr.summary || tr.description
      ? { description: tr.summary ?? stripHtml(tr.description).slice(0, 300) }
      : {}),
    ...(product.brand && {
      brand: { "@type": "Brand", name: product.brand },
    }),
    ...(product.sku && { sku: product.sku }),
    ...(primary && { category: catT(primary, locale).name }),
  };

  return (
    <>
      <JsonLd data={productLd} />

      {/* Şeffaf header arkasındaki koyu endüstriyel görsel bandı */}
      <div className="relative h-28 overflow-hidden bg-deep-navy lg:h-30">
        <Image
          src="/hero1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-deep-navy/70 via-deep-navy/40 to-deep-navy/60"
        />
      </div>

      {/* Breadcrumb bandı */}
      <div className="border-b border-black/5 bg-white">
        <Container className="py-4">
          <CatalogBreadcrumb entries={crumbs} />
        </Container>
      </div>

      <div className="bg-surface pb-16 lg:pb-24">
        <Container className="pt-10 lg:pt-14">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
            {/* Sol: başlık + galeri + tanıtım + özellik listesi */}
            <div>
              {badge && (
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-white text-primary"
                >
                  {badge}
                </Badge>
              )}
              <h1 className="mt-3 text-display-sm font-extrabold text-navy lg:text-display">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-lg font-semibold text-ink-900 lg:text-xl">
                  {subtitle}
                </p>
              )}
              {(product.brand || product.sku) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.brand && (
                    <Badge>{`${t("brand")}: ${product.brand}`}</Badge>
                  )}
                  {product.sku && (
                    <Badge variant="outline">{`${t("sku")}: ${product.sku}`}</Badge>
                  )}
                </div>
              )}

              {/* Başlık altı ikonlu kısa özellikler (admin doldurur) */}
              {tr.highlights.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2.5">
                  {tr.highlights.map((label) => {
                    const Icon = iconFor(label);
                    return (
                      <li
                        key={label}
                        className="flex items-center gap-2 text-sm font-semibold text-ink-900"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-primary" />
                        {label}
                      </li>
                    );
                  })}
                </ul>
              )}

              <hr className="mt-6 border-black/5" />

              <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] lg:gap-10">
                <ProductGallery images={galleryImages} name={tr.name} />

                <div>
                  {intro ? (
                    <div
                      className="rich-text text-sm leading-relaxed text-ink-600"
                      dangerouslySetInnerHTML={{ __html: intro }}
                    />
                  ) : (
                    // Alt başlıkta zaten gösterilen özet burada tekrarlanmaz
                    !subtitle &&
                    tr.summary && (
                      <p className="text-sm leading-relaxed text-ink-600">
                        {tr.summary}
                      </p>
                    )
                  )}

                  {/* İkonlu özellik listesi (DB'deki teknik özelliklerden) */}
                  {specs.length > 0 && (
                    <ul className="mt-7 space-y-5">
                      {specs.slice(0, 8).map((spec, i) => {
                        const Icon = iconFor(spec.label);
                        return (
                          <li key={i} className="flex items-start gap-3.5">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <div>
                              <p className="text-sm font-bold leading-snug text-ink-900">
                                {spec.label}
                              </p>
                              <p className="mt-0.5 text-sm text-ink-600">
                                {spec.value}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Sağ: teklif formu kartı */}
            <QuoteCard
              productId={product.id}
              groups={groups}
              defaultGroup={defaultGroup}
            />
          </div>

          {/* Özellik şeridi (admin doldurur; boşsa gizli) */}
          {tr.featureCards.length > 0 && (
            <div className="mt-10 rounded-2xl border border-black/5 bg-white px-2 py-2 shadow-card lg:mt-12">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-brand-50">
                {tr.featureCards.map((card) => {
                  const Icon = iconFor(card.title);
                  return (
                    <div key={card.title} className="flex gap-3.5 px-5 py-6">
                      <Icon className="h-7 w-7 shrink-0 text-primary" />
                      <div>
                        <h3 className="text-sm font-bold leading-snug text-navy">
                          {card.title}
                        </h3>
                        {card.description && (
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                            {card.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sekmeler kartı */}
          {tabs.length > 0 && (
            <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-card lg:mt-12 lg:p-8">
              <Tabs items={tabs} />
            </div>
          )}
        </Container>

        {/* Benzer ürünler */}
        {similar.length > 0 && (
          <div className="mt-14 lg:mt-20">
            <SimilarProducts items={similar} />
          </div>
        )}
      </div>
    </>
  );
}
