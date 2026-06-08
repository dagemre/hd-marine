import { HeroBackground } from "@/components/ui/hero-background";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

/**
 * Teklif Alın sayfa başlığı (tasarımdaki navy hero, sol hizalı):
 * "TEKLİF ALIN" pill rozeti + H1 + iki satırlık alt metin.
 * Arka plan: kurumsal gradient + hero1.jpg (sağdan görünür, luminosity harman).
 * pt: h-18 şeffaf header payı dahil (yeni sayfa kuralı).
 */
export async function QuoteHero() {
  const t = await getTranslations("quote");

  return (
    <section className="relative isolate overflow-hidden bg-deep-navy text-white">
      <HeroBackground src="/hero1.jpg" />

      <Container className="pt-30 pb-16 lg:pt-34 lg:pb-20">
        <p className="inline-flex items-center rounded-full border border-white/35 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-100 sm:text-sm">
          {t("heroBadge")}
        </p>
        <h1 className="mt-5 text-display font-extrabold sm:text-display-lg lg:text-[3.75rem] lg:leading-[1.08] lg:tracking-[-0.02em]">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-100 sm:text-lg">
          {t("heroSubtitle")}
        </p>
      </Container>
    </section>
  );
}
