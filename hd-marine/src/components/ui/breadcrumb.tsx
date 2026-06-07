import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  /** Son öğe için href verilmez */
  href?: string;
};

/**
 * Görsel breadcrumb. Link render'ı çağıran taraftan gelir (i18n Link
 * tip-güvenliği nedeniyle) — burada yalnızca <a> yapısı ve stil var;
 * sayfalar kendi <Link> öğelerini `renderItem` ile geçirebilir.
 */
export function Breadcrumb({
  items,
  renderLink,
  className,
}: {
  items: BreadcrumbItem[];
  renderLink: (item: BreadcrumbItem, index: number) => React.ReactNode;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
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
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink-900">
                  {item.label}
                </span>
              ) : (
                renderLink(item, i)
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
