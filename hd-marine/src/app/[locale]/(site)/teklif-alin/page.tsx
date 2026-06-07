import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCategoryTree, catT } from "@/lib/data/categories";
import { getSectors, secT } from "@/lib/data/sectors";
import { alternatesFor } from "@/lib/seo/meta";
import { Container } from "@/components/ui/container";
import { QuoteHero } from "@/components/quote/quote-hero";
import { QuoteSidebar } from "@/components/quote/quote-sidebar";
import {
  QuoteForm,
  type GroupOption,
  type SectorOption,
} from "@/components/quote/quote-form";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<{ sektor?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "quote" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  return {
    title: tNav("getQuote"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/teklif-alin"),
  };
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { sektor } = await searchParams;
  const t = await getTranslations("quote");
  // DB'ye her zaman TR değer yazılır (admin gelen kutusu TR okur)
  const tTr = await getTranslations({ locale: "tr", namespace: "quote" });

  const [tree, sectorRows] = await Promise.all([
    getCategoryTree(),
    getSectors(),
  ]);

  // 8 ana kategori (DB sırasıyla) + Diğer
  const groups: GroupOption[] = [
    ...tree.roots.map((node) => ({
      key: catT(node, "tr").slug,
      label: catT(node, locale).name,
      valueTr: catT(node, "tr").name,
    })),
    { key: "diger", label: t("otherGroup"), valueTr: tTr("otherGroup") },
  ];

  // 21 sektör — value her zaman TR slug (sector_slug kolonu + ?sektor sözleşmesi)
  const sectors: SectorOption[] = sectorRows.map((s) => ({
    slug: secT(s, "tr").slug,
    label: secT(s, locale).name,
  }));

  // ?sektor= parametresi geçerli bir TR slug'sa formda ön-seçim yap
  const initialSector = sectors.some((s) => s.slug === sektor)
    ? sektor
    : undefined;

  return (
    <>
      <QuoteHero />
      <section className="bg-surface">
        <Container className="grid items-start gap-8 py-12 lg:grid-cols-[340px_1fr] lg:py-16">
          <QuoteSidebar />
          <QuoteForm
            groups={groups}
            sectors={sectors}
            initialSector={initialSector}
          />
        </Container>
      </section>
    </>
  );
}
