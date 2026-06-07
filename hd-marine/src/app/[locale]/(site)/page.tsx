import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/home/hero";
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
      {/* İlk ekran: (site) layout'taki -mt-18 ile şeffaf header'ın arkasına uzanır;
          hero tek başına tam viewport yüksekliği kaplar */}
      <div className="flex min-h-svh flex-col">
        <Hero />
      </div>
      <CategoryCarousel />
      <SolutionsBand />
    </>
  );
}
