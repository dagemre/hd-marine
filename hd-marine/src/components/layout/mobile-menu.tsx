"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { NavItem, NavCategory } from "./nav-types";

export function MobileMenu({
  items,
  categories,
}: {
  items: NavItem[];
  categories: NavCategory[];
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Menü"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-50 origin-top border-t border-white/10 bg-deep-navy px-4 pb-6 pt-2 shadow-card-hover transition-all",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <nav className="flex flex-col">
          {items.map((item) =>
            item.pathname === "/urunler" ? (
              <MobileProducts
                key={item.pathname}
                label={item.label}
                categories={categories}
                onNavigate={() => setOpen(false)}
              />
            ) : (
              <Link
                key={item.pathname}
                href={item.pathname}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 font-semibold text-white"
              >
                {item.label}
              </Link>
            )
          )}

          <Link
            href="/teklif-alin"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-bold uppercase tracking-wide text-white"
          >
            {t("getQuote")}
          </Link>
        </nav>
      </div>
    </div>
  );
}

/** Mobil menüde "Ürünler" sekmesi — altında kategoriler açılır-kapanır */
function MobileProducts({
  label,
  categories,
  onNavigate,
}: {
  label: string;
  categories: NavCategory[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/urunler"
          onClick={onNavigate}
          className="flex-1 py-3 font-semibold text-white"
        >
          {label}
        </Link>
        {categories.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`${label} kategorileri`}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-brand-300"
          >
            <svg
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      {open && categories.length > 0 && (
        <div className="pb-2">
          {categories.map((cat) => (
            <MobileCategory
              key={cat.slug}
              cat={cat}
              depth={0}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Mobil menüde özyinelemeli, açılır-kapanır kategori öğesi */
function MobileCategory({
  cat,
  depth,
  onNavigate,
}: {
  cat: NavCategory;
  depth: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = cat.children.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={{ pathname: "/urunler/[...slug]", params: { slug: cat.path } }}
          onClick={onNavigate}
          className="flex-1 py-2 text-sm text-brand-100"
          style={{ paddingLeft: depth * 14 }}
        >
          {cat.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`${cat.name} alt kategorileri`}
            className="flex h-9 w-9 shrink-0 items-center justify-center text-brand-300"
          >
            <svg
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && open && (
        <div className="border-l border-white/10">
          {cat.children.map((child) => (
            <MobileCategory
              key={child.slug}
              cat={child}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
