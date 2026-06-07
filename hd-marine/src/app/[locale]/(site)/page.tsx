import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/home/hero";
import { FeatureStrip } from "@/components/home/feature-strip";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { SolutionsBand } from "@/components/home/solutions-band";
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

  return (
    <>
      {/* İlk ekran: -mt-18 ile şeffaf header'ın arkasına uzanır;
          hero (flex-1) + beyaz şerit birlikte tam viewport yüksekliği kaplar */}
      <div className="-mt-18 flex min-h-svh flex-col">
        <Hero />
        <div className="bg-surface pb-3 sm:pb-5">
          <FeatureStrip />
        </div>
      </div>
      <CategoryCarousel />
      <SolutionsBand />
    </>
  );
}
