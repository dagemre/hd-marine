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
          {items.map((item) => (
            <Link
              key={item.pathname}
              href={item.pathname}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-3 font-semibold text-white"
            >
              {item.label}
            </Link>
          ))}

          <p className="pb-1 pt-4 text-xs font-bold uppercase tracking-widest text-brand-300">
            {t("products")}
          </p>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={{ pathname: "/urunler/[...slug]", params: { slug: [cat.slug] } }}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-brand-100"
            >
              {cat.name}
            </Link>
          ))}

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
