import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

/** Footer üstü gradient teklif bandı (tasarımdaki "Teklif Formu" CTA'sı). */
export async function QuoteCta() {
  const t = await getTranslations("about");

  return (
    <section className="bg-gradient-to-r from-brand-800 via-brand-600 to-brand-500 py-10 text-white lg:py-12">
      <Container>
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <span className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-white/12">
            {/* Teklif belgesi */}
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
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
            className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-white px-7 text-sm font-bold uppercase tracking-wide text-primary shadow-lg transition-colors hover:bg-brand-50"
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
      </Container>
    </section>
  );
}
