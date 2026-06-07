import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

/** Footer üstü gradient destek bandı (tasarımdaki "Hızlı Destek Alın" + HEMEN ARAYIN). */
export async function SupportCta() {
  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");
  const phoneHref = `tel:${tFooter("phone").replace(/\s/g, "")}`;

  return (
    <section className="bg-gradient-to-r from-brand-800 via-brand-600 to-brand-500 py-10 text-white lg:py-12">
      <Container>
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-white/12">
            {/* Kulaklık (destek) */}
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect x="3.5" y="12.5" width="4" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
              <rect x="16.5" y="12.5" width="4" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M18.5 18.5c0 1.8-1.6 2.8-4 2.8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold sm:text-xl">{t("ctaTitle")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-brand-100 sm:text-base">
              {t("ctaText")}
            </p>
          </div>

          <a
            href={phoneHref}
            className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-white px-7 text-sm font-bold uppercase tracking-wide text-primary shadow-lg transition-colors hover:bg-brand-50"
          >
            {t("ctaButton")}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M7.8 4.5c.5 0 1 .3 1.2.8l1.1 2.4c.2.5.1 1.1-.3 1.5l-1 1a12.6 12.6 0 0 0 5 5l1-1c.4-.4 1-.5 1.5-.3l2.4 1.1c.5.2.8.7.8 1.2v2.1c0 .9-.7 1.6-1.6 1.5C10.6 19.1 4.9 13.4 4.3 6.1c-.1-.9.6-1.6 1.5-1.6h2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </Container>
    </section>
  );
}
