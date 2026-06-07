import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { PlaceholderPage } from "@/components/placeholder-page";
import { alternatesFor } from "@/lib/seo/meta";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("sectors"), alternates: alternatesFor(locale, "/sektorler") };
}

export default async function SectorsPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <PlaceholderPage title={t("sectors")} />;
}
