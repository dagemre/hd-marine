import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

/**
 * Izgara altındaki yuvarlatılmış navy band (tasarımdaki "Sizin Sektörünüz
 * Hangisi?"): belge ikonu + başlık/metin + beyaz çerçeveli Teklif Alın pill'i.
 */
export async function SectorsCta() {
  const t = await getTranslations("sectors");

  return (
    <div className="bg-surface pb-16 lg:pb-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 px-6 py-8 text-white sm:px-10 lg:px-12 lg:py-10">
          {/* Hafif doku — sağda büyük yarım daireler */}
          <svg
            className="pointer-events-none absolute -right-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 text-white/5"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden
          >
            <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="14" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="14" />
          </svg>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/25">
              {/* Teklif belgesi */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 3v4h4M9.5 12h5m-5 3.5h5m-5-7h2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold sm:text-xl">{t("ctaTitle")}</h2>
              <p className="mt-1 text-sm leading-relaxed text-brand-100 sm:text-base">
                {t("ctaText")}
              </p>
            </div>

            <Link
              href="/teklif-alin"
              className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full border border-white/60 px-7 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-primary"
            >
              {t("ctaButton")}
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
