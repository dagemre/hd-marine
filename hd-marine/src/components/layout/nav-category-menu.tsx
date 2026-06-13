"use client";

import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { NavCategory } from "./nav-types";

/**
 * Masaüstü "Ürünler" dropdown'ı için iç içe (özyinelemeli) kategori menüsü.
 *
 * - Yalnızca üzerine gelinen öğenin alt menüsü açılır (kısa gecikmeli
 *   hover-intent ile öğe ↔ alt menü arası geçiş pürüzsüz).
 * - Alt menüler viewport'a göre `fixed` konumlanır: böylece kaydırılabilen
 *   bir üst panelin içinde olsalar bile kırpılmazlar.
 * - Her panel kendi içinde dikey kaydırılabilir; uzun listeler (ör. Yağlama
 *   Cihazları, Aksesuarlar) ekranı taşırsa panel içinde kaydırılır.
 */
export function NavCategoryMenu({
  categories,
  depth = 0,
  maxHeight,
}: {
  categories: NavCategory[];
  depth?: number;
  maxHeight?: number;
}) {
  const [open, setOpen] = useState<{
    slug: string;
    left: number;
    top: number;
    maxH: number;
  } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(null), 160);
  };

  const openSub = (cat: NavCategory, e: React.MouseEvent<HTMLDivElement>) => {
    cancelClose();
    const r = e.currentTarget.getBoundingClientRect();
    const margin = 12;
    const vh = window.innerHeight;
    const MIN = 260;
    let top = r.top;
    let maxH = vh - top - margin;
    if (maxH < MIN) {
      top = Math.max(margin, vh - margin - MIN);
      maxH = vh - top - margin;
    }
    setOpen({ slug: cat.slug, left: r.right, top, maxH });
  };

  const openCat = open
    ? categories.find((c) => c.slug === open.slug) ?? null
    : null;

  return (
    <div
      className={
        "overflow-y-auto overscroll-contain rounded-xl border border-black/5 bg-white py-2 shadow-card-hover" +
        (maxHeight == null ? " max-h-[80vh]" : "")
      }
      style={maxHeight != null ? { maxHeight } : undefined}
      onMouseLeave={scheduleClose}
    >
      {categories.map((cat) => {
        const hasChildren = cat.children.length > 0;
        return (
          <div
            key={cat.slug}
            onMouseEnter={(e) =>
              hasChildren ? openSub(cat, e) : scheduleClose()
            }
          >
            <Link
              href={{ pathname: "/urunler/[...slug]", params: { slug: cat.path } }}
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-brand-50 hover:text-primary"
            >
              {cat.name}
              {hasChildren && (
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-ink-400"
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
              )}
            </Link>
          </div>
        );
      })}

      {openCat && open && (
        <div
          className="fixed w-72 pl-2"
          style={{ left: open.left, top: open.top, zIndex: 60 + depth }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <NavCategoryMenu
            categories={openCat.children}
            depth={depth + 1}
            maxHeight={open.maxH}
          />
        </div>
      )}
    </div>
  );
}
