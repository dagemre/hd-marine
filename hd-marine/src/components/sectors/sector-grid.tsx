import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section";
import { getSectors, secT } from "@/lib/data/sectors";
import { siteAssetUrl } from "@/lib/storage";

/**
 * Tasarımdaki sektör kartları ızgarası: görsel + ad + ok.
 * Kart tıklaması teklif formuna gider; sektör adı ?sektor= ile taşınır
 * (teklif-alın sayfası tasarlanırken bu parametre formda ön-seçim yapar).
 */
export async function SectorGrid() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("sectors");
  const tCommon = await getTranslations("common");
  const sectors = await getSectors();

  return (
    <section className="bg-surface py-16 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={t("listEyebrow")}
          title={t("listTitle")}
          subtitle={t("listText")}
        />

        {sectors.length === 0 ? (
          <p className="text-center text-ink-400">{tCommon("loadError")}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {sectors.map((sector) => {
              const tr = secT(sector, locale);
              return (
                <Link
                  key={sector.id}
                  href={{ pathname: "/teklif-alin", query: { sektor: tr.slug } }}
                  aria-label={t("cardAria", { name: tr.name })}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
                    {sector.imagePath && (
                      <Image
                        src={siteAssetUrl(sector.imagePath)}
                        alt={tr.name}
                        fill
                        sizes="(min-width: 1280px) 230px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3.5">
                    <h3 className="text-sm font-bold leading-snug text-navy">
                      {tr.name}
                    </h3>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M2 8h11M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
