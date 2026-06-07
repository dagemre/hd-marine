import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SectorsHero } from "@/components/sectors/sectors-hero";
import { SectorGrid } from "@/components/sectors/sector-grid";
import { SectorsCta } from "@/components/sectors/sectors-cta";
import { alternatesFor } from "@/lib/seo/meta";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "sectors" });
  return {
    title: tNav("sectors"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/sektorler"),
  };
}

export default async function SectorsPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  return (
    <>
      <SectorsHero />
      <SectorGrid />
      <SectorsCta />
    </>
  );
}
