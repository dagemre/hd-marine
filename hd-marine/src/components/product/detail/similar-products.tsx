"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

export type SimilarItem = {
  id: string;
  name: string;
  slugs: string[];
  imageUrl: string | null;
  imageAlt: string;
};

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4.5 w-4.5">
      <path
        d={direction === "left" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tasarımdaki "Benzer Ürünlerimiz" bölümü: oklu yatay ürün karuseli */
export function SimilarProducts({ items }: { items: SimilarItem[] }) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrowCls =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-ink-600 shadow-card transition-colors hover:border-primary hover:text-primary";

  return (
    <section aria-labelledby="similar-products-title">
      <Container>
        <h2
          id="similar-products-title"
          className="text-2xl font-extrabold text-navy lg:text-3xl"
        >
          {t("relatedProducts")}
        </h2>

        <div className="mt-6 flex items-center gap-3 lg:gap-5">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("carouselPrev")}
            className={arrowCls}
          >
            <Arrow direction="left" />
          </button>

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 snap-x gap-4 overflow-x-auto pb-2 lg:gap-5 [scrollbar-width:thin]"
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={{
                  pathname: "/urunler/[...slug]",
                  params: { slug: item.slugs },
                }}
                className="group block w-[220px] shrink-0 snap-start rounded-xl border border-black/5 bg-white shadow-card transition-shadow hover:shadow-card-hover sm:w-[240px]"
              >
                <div className="flex aspect-square items-center justify-center p-3">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      width={300}
                      height={300}
                      className="max-h-full max-w-full w-auto object-contain transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-ink-400"
                    >
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="m3 16 5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="border-t border-black/5 p-4">
                  <h3 className="text-sm font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {tCommon("viewDetails")} →
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("carouselNext")}
            className={arrowCls}
          >
            <Arrow direction="right" />
          </button>
        </div>
      </Container>
    </section>
  );
}
