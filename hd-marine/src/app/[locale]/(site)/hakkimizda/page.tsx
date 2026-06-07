import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { AboutHero } from "@/components/about/about-hero";
import { AboutFeatureStrip } from "@/components/about/about-feature-strip";
import { WhoWeAre } from "@/components/about/who-we-are";
import { VisionMission } from "@/components/about/vision-mission";
import { QuoteCta } from "@/components/about/quote-cta";
import { alternatesFor } from "@/lib/seo/meta";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: tNav("about"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/hakkimizda"),
  };
}

export default async function AboutPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      {/* Şerit, hero'nun alt kenarına taşar; zemin açık gri */}
      <div className="bg-surface pb-4">
        <AboutFeatureStrip />
      </div>
      <WhoWeAre />
      <VisionMission />
      <QuoteCta />
    </>
  );
}
