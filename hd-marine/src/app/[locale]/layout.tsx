import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "@fontsource-variable/inter";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hdmarine.com.tr"
  ),
  title: {
    default: "HD Marine – Endüstriyel Ürünler",
    template: "%s | HD Marine",
  },
  description:
    "Endüstriyel tesislerde çözüm ortağınız. Endüstriyel pompalar, sızdırmazlık elemanları, boru tamir ekipmanları ve daha fazlası.",
  openGraph: {
    type: "website",
    siteName: "HD Marine",
    locale: "tr_TR",
    alternateLocale: "en_US",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
