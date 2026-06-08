"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export type GalleryImage = { id: string; url: string; alt: string };

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4.5 w-4.5">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m16 16 4.5 4.5M11 8.5v5M8.5 11h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Tasarımdaki galeri: büyüteç butonlu ana görsel + altta küçük görseller */
export function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const t = useTranslations("product");
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[active] ?? null;

  // Lightbox: Escape ile kapat, açıkken arka plan kaymasın
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  return (
    <div>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-black/5 bg-white p-8 shadow-card">
        {current ? (
          <>
            <Image
              key={current.id}
              src={current.url}
              alt={current.alt}
              width={640}
              height={640}
              priority
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={t("galleryZoom")}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-ink-600 transition-colors hover:border-primary hover:text-primary"
            >
              <ZoomIcon />
            </button>
          </>
        ) : (
          <p className="text-sm text-ink-400">—</p>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t("galleryThumb", { name, index: i + 1 })}
              aria-current={active === i}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg border bg-white p-2 transition-colors",
                active === i
                  ? "border-primary ring-1 ring-primary/30"
                  : "border-black/5 hover:border-brand-200"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={120}
                height={120}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-navy/80 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            aria-label={t("galleryClose")}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            onClick={() => setZoomed(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="m6 6 12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div
            className="max-h-full max-w-3xl rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.alt}
              width={1200}
              height={1200}
              className="max-h-[80vh] max-w-full w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
