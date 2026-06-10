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

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
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

            <a
              href={`https://wa.me/905333085146?text=${encodeURIComponent(
                "Merhaba, ürünleriniz hakkında bilgi almak istiyorum"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-[#25D366] px-7 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-[#1EBE5B]"
            >
              WhatsApp
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
