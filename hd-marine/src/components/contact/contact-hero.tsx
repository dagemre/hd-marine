import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

/**
 * İletişim sayfa başlığı (Context/İletişim.png):
 * "BİZE ULAŞIN" pill rozeti + H1 + tek satırlık alt metin.
 * Arka plan: kurumsal gradient + hero1.jpg (quote-hero deseni).
 * pt: h-18 şeffaf header payı dahil; pb geniş — bilgi kartları
 * şeridi hero'nun üzerine taşar (-mt ile).
 */
export async function ContactHero() {
  const t = await getTranslations("contact");

  return (
    <section className="relative isolate overflow-hidden bg-hero-gradient text-white">
      <Image
        src="/hero1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover object-right opacity-45 mix-blend-luminosity [mask-image:linear-gradient(100deg,transparent_30%,black_72%)]"
      />

      <Container className="pt-30 pb-28 lg:pt-34 lg:pb-32">
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
