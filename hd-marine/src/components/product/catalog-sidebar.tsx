import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { catT, categorySlugPath } from "@/lib/data/categories";
import type { CategoryTree } from "@/lib/data/types";

/** TR slug → sidebar ikonu (tasarımdaki madde ikonları) */
const categoryIcons: Record<string, React.ReactNode> = {
  "yaglama-cihazlari": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path
        d="M12 3.5s5.5 6.1 5.5 10a5.5 5.5 0 1 1-11 0c0-3.9 5.5-10 5.5-10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "endustriyel-pompalar": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  "sizdirmazlik-elemanlari": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "endustriyel-kimyasallar": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path
        d="M10 3h4M10.5 3v6.2L5.6 17a3 3 0 0 0 2.6 4.5h7.6a3 3 0 0 0 2.6-4.5l-4.9-7.8V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.5 14h9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "termal-etiket": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path
        d="M3.5 12 12 3.5h6a2.5 2.5 0 0 1 2.5 2.5v6L12 20.5a2 2 0 0 1-2.8 0l-5.7-5.7a2 2 0 0 1 0-2.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="8" r="1.4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  "otomatik-boya-ekipmanlari": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path
        d="M9 3h6v4H9zM7 7h10v6a2 2 0 0 1-2 2h-1v4a2 2 0 1 1-4 0v-4H9a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "boru-tamir-ekipmanlari": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <path
        d="M3 9V5m0 4h7a4 4 0 0 1 4 4v6m-4 0h8m-4 0v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 19a7 7 0 0 0 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "diyaframli-pompa-yedek-parcalari": (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

const fallbackIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
    <path
      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const allIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="m8.5 12 2.3 2.3L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Katalog sol sütunu (Context/ürünler.png):
 * KATEGORİLER kartı (Tüm Ürünler + ana kategoriler) ve
 * "İhtiyacınız mı var?" iletişim kartı.
 */
export async function CatalogSidebar({
  tree,
  locale,
  activeCategoryId,
}: {
  tree: CategoryTree;
  locale: Locale;
  /** Aktif kök kategori id'si; verilmezse "Tüm Ürünler" aktif */
  activeCategoryId?: string;
}) {
  const t = await getTranslations("products");

  const itemCls = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
      active
        ? "bg-primary text-white shadow-card"
        : "text-ink-600 hover:bg-brand-50 hover:text-primary"
    );

  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card">
        <h2 className="px-4 pb-3 pt-2 text-sm font-bold uppercase tracking-widest text-ink-900">
          {t("categoriesTitle")}
        </h2>
        <nav aria-label={t("categoriesTitle")}>
          <ul className="space-y-1">
            <li>
              <Link href="/urunler" className={itemCls(!activeCategoryId)}>
                <span className="shrink-0">{allIcon}</span>
                {t("allProducts")}
              </Link>
            </li>
            {tree.roots.map((node) => {
              const tr = catT(node, locale);
              const trSlug = node.i18n.tr?.slug ?? tr.slug;
              return (
                <li key={node.id}>
                  <Link
                    href={{
                      pathname: "/urunler/[...slug]",
                      params: { slug: categorySlugPath(tree, node, locale) },
                    }}
                    className={itemCls(node.id === activeCategoryId)}
                  >
                    <span className="shrink-0">
                      {categoryIcons[trSlug] ?? fallbackIcon}
                    </span>
                    {tr.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* İhtiyacınız mı var? */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
        <h3 className="text-sm font-bold uppercase tracking-widest text-ink-900">
          {t("needHelpTitle")}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          {t("needHelpText")}
        </p>
        <Link
          href="/iletisim"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M4 13a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="3" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="17" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {t("needHelpCta")}
        </Link>
      </div>
    </aside>
  );
}
