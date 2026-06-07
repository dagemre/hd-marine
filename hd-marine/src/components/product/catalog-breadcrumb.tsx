import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type CrumbEntry = {
  label: string;
  /** Verilirse /urunler/[...slug] linki olur; son öğede verilmez */
  slugs?: string[];
};

function Chevron() {
  return (
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
  );
}

const linkCls = "text-ink-600 transition-colors hover:text-primary";

/** Ürün/kategori sayfaları için breadcrumb: Anasayfa › Ürünler › … */
export function CatalogBreadcrumb({
  entries,
  className,
}: {
  entries: CrumbEntry[];
  className?: string;
}) {
  const t = useTranslations("nav");

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className={linkCls}>
            {t("home")}
          </Link>
        </li>
        <li className="flex items-center gap-1.5">
          <Chevron />
          <Link href="/urunler" className={linkCls}>
            {t("products")}
          </Link>
        </li>
        {entries.map((entry, i) => {
          const isLast = i === entries.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              <Chevron />
              {isLast || !entry.slugs ? (
                <span aria-current="page" className="font-medium text-ink-900">
                  {entry.label}
                </span>
              ) : (
                <Link
                  href={{
                    pathname: "/urunler/[...slug]",
                    params: { slug: entry.slugs },
                  }}
                  className={linkCls}
                >
                  {entry.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
