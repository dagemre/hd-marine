"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { productImageUrl } from "@/lib/storage";

export type ExplorerItem = {
  id: string;
  /** Kart üstündeki küçük büyük-harf etiket */
  eyebrow?: string;
  name: string;
  /** Kart kısa açıklaması (düz metin) */
  blurb?: string;
  imagePath: string | null;
  imageAlt?: string;
  /** /urunler/[...slug] parametreleri */
  slugs: string[];
};

export type CategoryOption = {
  label: string;
  /** Kök kategori slug yolu; boş dizi = Tüm Ürünler */
  slugs: string[];
  active?: boolean;
};

function PlaceholderArt() {
  return (
    <div
      aria-hidden
      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-primary"
    >
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ExplorerCard({ item, view }: { item: ExplorerItem; view: "grid" | "list" }) {
  const t = useTranslations("common");

  const image = item.imagePath ? (
    <Image
      src={productImageUrl(item.imagePath)}
      alt={item.imageAlt ?? item.name}
      width={360}
      height={270}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <PlaceholderArt />
  );

  const body = (
    <>
      {item.eyebrow && (
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-400">
          {item.eyebrow}
        </p>
      )}
      <h3 className="mt-1.5 text-lg font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary">
        {item.name}
      </h3>
      {item.blurb && (
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.blurb}</p>
      )}
      <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-primary/60 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
        {t("viewDetails")}
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2 8h11M9.5 4 13.5 8l-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  if (view === "list") {
    return (
      <Link
        href={{ pathname: "/urunler/[...slug]", params: { slug: item.slugs } }}
        className="group block"
      >
        <article className="flex gap-5 rounded-2xl border border-black/5 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover sm:gap-6 sm:p-5">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-surface p-3 sm:h-36 sm:w-44">
            {image}
          </div>
          <div className="flex min-w-0 flex-col py-1">{body}</div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      href={{ pathname: "/urunler/[...slug]", params: { slug: item.slugs } }}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-shadow hover:shadow-card-hover">
        <div className="m-4 flex aspect-[4/3] items-center justify-center rounded-xl bg-surface p-5">
          {image}
        </div>
        <div className="flex flex-1 flex-col px-6 pb-6 pt-1">{body}</div>
      </article>
    </Link>
  );
}

/**
 * Katalog ana sütunu (Context/ürünler.png): başlık + araç çubuğu
 * (kategori filtresi, sıralama, grid/liste görünümü) + kart ızgarası.
 */
export function CatalogExplorer({
  heading,
  items,
  categoryOptions,
}: {
  heading: string;
  items: ExplorerItem[];
  categoryOptions: CategoryOption[];
}) {
  const t = useTranslations("products");
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"default" | "az">("default");

  const sorted = useMemo(() => {
    if (sort === "default") return items;
    return [...items].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [items, sort]);

  const activeIdx = Math.max(
    categoryOptions.findIndex((o) => o.active),
    0
  );

  const selectCls =
    "h-10 w-full min-w-0 cursor-pointer appearance-none truncate rounded-lg border border-black/10 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-600 shadow-card outline-none transition-colors hover:border-primary/40 focus:border-primary sm:w-auto";

  const toggleCls = (active: boolean) =>
    cn(
      "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
      active
        ? "border-primary bg-primary text-white"
        : "border-black/10 bg-white text-ink-400 hover:text-primary"
    );

  return (
    <div className="min-w-0">
      {/* Araç çubuğu */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-ink-900 lg:text-[1.75rem]">{heading}</h2>
        <div className="flex w-full min-w-0 items-center gap-2.5 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:flex-none">
            <select
              aria-label={t("allCategories")}
              className={selectCls}
              value={activeIdx}
              onChange={(e) => {
                const opt = categoryOptions[Number(e.target.value)];
                if (!opt) return;
                if (opt.slugs.length === 0) router.push("/urunler");
                else
                  router.push({
                    pathname: "/urunler/[...slug]",
                    params: { slug: opt.slugs },
                  });
              }}
            >
              {categoryOptions.map((opt, i) => (
                <option key={i} value={i}>
                  {opt.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>

          <div className="relative min-w-0 flex-1 sm:flex-none">
            <select
              aria-label={t("sortLabel")}
              className={selectCls}
              value={sort}
              onChange={(e) => setSort(e.target.value as "default" | "az")}
            >
              <option value="default">{`${t("sortLabel")} ${t("sortPopular")}`}</option>
              <option value="az">{`${t("sortLabel")} ${t("sortAz")}`}</option>
            </select>
            <SelectChevron />
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label={t("gridView")}
              aria-pressed={view === "grid"}
              className={toggleCls(view === "grid")}
              onClick={() => setView("grid")}
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="4" y="4" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
                <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
                <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
                <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t("listView")}
              aria-pressed={view === "list"}
              className={toggleCls(view === "list")}
              onClick={() => setView("list")}
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 6h2m3 0h11M4 12h2m3 0h11M4 18h2m3 0h11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Kartlar */}
      <div
        className={cn(
          "mt-7",
          view === "grid"
            ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            : "space-y-4"
        )}
      >
        {sorted.map((item) => (
          <ExplorerCard key={item.id} item={item} view={view} />
        ))}
      </div>
    </div>
  );
}

function SelectChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
