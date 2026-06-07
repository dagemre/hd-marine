import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

/**
 * Hakkımızda sayfa başlığı (tasarımdaki navy hero):
 * breadcrumb + H1 + alt metin + "HD Marine Dünyasına Hoşgeldiniz" rozeti.
 * Arka plan: kurumsal gradient + hero1.jpg (sağdan görünür, luminosity harman).
 */
export async function AboutHero() {
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

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

      {/* pt: h-18 header + tasarımdaki boşluk (içerik header'ın arkasına uzanıyor) */}
      <Container className="pt-30 pb-32 lg:pt-34 lg:pb-36">
        {/* Breadcrumb — koyu zemine özel renkler */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                href="/"
                className="text-brand-200 transition-colors hover:text-white"
              >
                {tCommon("breadcrumbHome")}
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5 shrink-0 text-brand-300"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span aria-current="page" className="font-semibold text-white">
                {tNav("about")}
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-display font-extrabold sm:text-display-lg lg:text-[4.25rem] lg:leading-[1.06] lg:tracking-[-0.02em]">
          {tNav("about")}
        </h1>
        <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-100 sm:text-lg">
          {t("heroSubtitle")}
        </p>

        {/* Hoşgeldiniz rozeti */}
        <div className="mt-12 flex items-center gap-3 lg:mt-16">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35">
            {/* Çapa */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 7.2V21m0 0c-4.4 0-8-3.1-8-7.5M12 21c4.4 0 8-3.1 8-7.5M4 13.5 2.5 12M4 13.5 5.5 12M20 13.5 18.5 12m1.5 1.5L21.5 12M9 10h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-sm font-bold sm:text-base">{t("welcomeBadge")}</p>
        </div>
      </Container>
    </section>
  );
}
