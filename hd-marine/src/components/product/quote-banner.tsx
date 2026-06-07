import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Katalog sayfaları footer üstü teklif bandı (Context/ürünler.png):
 * koyu lacivert yuvarlatılmış panel — belge ikonu + başlık/metin + buton.
 */
export async function QuoteBanner() {
  const t = await getTranslations("products");

  return (
    <div className="rounded-3xl bg-deep-navy px-6 py-8 text-white shadow-card-hover sm:px-10 lg:px-12">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M14 3v5h5M9 13h6m-6 4h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold sm:text-2xl">{t("ctaTitle")}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-brand-100 sm:text-base">
            {t("ctaText")}
          </p>
        </div>
        <Link
          href="/teklif-alin"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover"
        >
          {t("ctaButton")}
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M2 8h11M9.5 4 13.5 8l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
