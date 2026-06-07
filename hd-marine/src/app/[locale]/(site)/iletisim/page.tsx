import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCategoryTree, catT } from "@/lib/data/categories";
import { alternatesFor } from "@/lib/seo/meta";
import { Container } from "@/components/ui/container";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCards } from "@/components/contact/contact-info-cards";
import { ContactMap } from "@/components/contact/contact-map";
import {
  ContactForm,
  type ProductOption,
} from "@/components/contact/contact-form";
import { SupportCta } from "@/components/contact/support-cta";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  return {
    title: tNav("contact"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/iletisim"),
  };
}

export default async function ContactPage({ params }: { params: Params }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  // DB'ye her zaman TR değer yazılır (admin gelen kutusu TR okur)
  const tTr = await getTranslations({ locale: "tr", namespace: "contact" });

  // Select seçenekleri: ana kategoriler (DB sırasıyla) + Diğer
  const tree = await getCategoryTree();
  const products: ProductOption[] = [
    ...tree.roots.map((node) => ({
      key: catT(node, "tr").slug,
      label: catT(node, locale).name,
      valueTr: catT(node, "tr").name,
    })),
    { key: "diger", label: t("otherGroup"), valueTr: tTr("otherGroup") },
  ];

  return (
    <>
      <ContactHero />

      {/* Hero'ya taşan 4 iletişim bilgisi kartı */}
      <section className="bg-white">
        <Container className="relative z-10 -mt-16 lg:-mt-18">
          <ContactInfoCards />
        </Container>
      </section>

      {/* Konumumuz + İletişime Geçin */}
      <section className="bg-white">
        <Container className="grid items-stretch gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
          <ContactMap />
          <ContactForm products={products} />
        </Container>
      </section>

      <SupportCta />
    </>
  );
}
