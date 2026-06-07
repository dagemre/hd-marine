"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

const SLIDE_MS = 7000;

const miniIcons = [
  // Yüksek kalite (kalkan + onay)
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Uzman mühendislik (kişi + dişli)
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3.5 20a5.5 5.5 0 0 1 11 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="17.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M17.5 11.8v1.2m0 5v1.2m3.2-5.9-1 .6m-4.4 2.6-1 .6m6.4 0-1-.6m-4.4-2.6-1-.6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>,
  // Hızlı & güvenilir (şimşek)
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
];

/**
 * Anasayfa hero slider'ı (Emre'nin 8 Haz 2026 tasarımı):
 * 3 görsel sırayla döner, aktif görselde yavaş zoom (Ken Burns);
 * üstte iki overlay katmanı (ana lacivert + soldan maviye geçiş).
 */
export function HeroSlider({ images }: { images: string[] }) {
  const t = useTranslations("home");
  const [active, setActive] = useState(0);
  const count = images.length;

  const goTo = useCallback(
    (i: number) => setActive(((i % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), SLIDE_MS);
    return () => clearInterval(id);
  }, [count, active]);

  const minis = [t("heroMini1"), t("heroMini2"), t("heroMini3")];

  return (
    <section className="relative isolate flex flex-1 items-center overflow-hidden bg-deep-navy text-white">
      {/* Slaytlar */}
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-1000",
            i === active ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              "object-cover [filter:brightness(0.55)_contrast(1.1)_saturate(0.9)]",
              i === active && "hero-kenburns"
            )}
          />
        </div>
      ))}

      {/* Mobil: içerik tüm genişliği kapladığı için tek düz koyu overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[rgba(4,27,70,0.78)] sm:hidden"
      />
      {/* sm+ Overlay Katman 1 — ana lacivert, sağa doğru şeffaflaşır */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(4,27,70,0.80)_0%,rgba(4,27,70,0.42)_50%,rgba(4,27,70,0.06)_100%)] sm:block"
      />
      {/* sm+ Overlay Katman 2 — soldan sağa mavi geçiş, sağ uç neredeyse şeffaf */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(4,27,70,0.85)_0%,rgba(6,43,107,0.45)_45%,rgba(13,94,255,0.05)_100%)] sm:block"
      />

      <Container className="w-full pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300 sm:text-sm">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-4 text-display-sm font-extrabold sm:text-display lg:text-[4.25rem] lg:leading-[1.06] lg:tracking-[-0.02em]">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-100 sm:text-lg lg:mt-6 lg:text-xl">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-10">
            <Link
              href="/urunler"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-primary px-7 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary-hover sm:justify-start"
            >
              {t("heroCtaProducts")}
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
            <Link
              href="/teklif-alin"
              className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-white/40 px-7 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy sm:justify-start"
            >
              {t("heroCta")}
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

          {/* Mini özellikler — mobilde gizli (beyaz şerit zaten aynı mesajı veriyor) */}
          <div className="mt-10 hidden flex-wrap gap-x-10 gap-y-4 sm:flex lg:mt-14">
            {minis.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-brand-300">{miniIcons[i]}</span>
                <p className="max-w-[9.5rem] text-sm font-semibold leading-snug text-brand-100">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {count > 1 && (
        <>
          {/* Mobil: alt ortada slayt noktaları */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => goTo(i)}
                aria-label={`Slayt ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-6 bg-primary" : "w-1.5 bg-white/40"
                )}
              />
            ))}
          </div>

          {/* Sağ dikey slayt göstergesi */}
          <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex lg:right-10">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => goTo(i)}
                aria-label={`Slayt ${i + 1}`}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-colors",
                  i === active ? "text-white" : "text-white/40 hover:text-white/70"
                )}
              >
                {String(i + 1).padStart(2, "0")}
                <span
                  className={cn(
                    "block h-px transition-all",
                    i === active ? "w-7 bg-primary" : "w-3 bg-white/30"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Önceki / sonraki */}
          <div className="absolute bottom-8 right-6 hidden gap-3 sm:flex lg:right-10">
            <button
              onClick={() => goTo(active - 1)}
              aria-label="Önceki görsel"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M10 4 6 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => goTo(active + 1)}
              aria-label="Sonraki görsel"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="m6 4 4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
