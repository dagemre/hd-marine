import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/home/hero";
import { SectorStrip } from "@/components/home/sector-strip";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { SolutionsBand } from "@/components/home/solutions-band";
import { alternatesFor } from "@/lib/seo/meta";

export const revalidate = 86400;

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

  return (
    <>
      {/* Hero (sabit yükseklik) + altına/sınıra taşan 8'li sektör kartı */}
      <Hero />
      <SectorStrip />
      <CategoryCarousel />
      <SolutionsBand />
    </>
  );
}
