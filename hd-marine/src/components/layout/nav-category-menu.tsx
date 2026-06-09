import { Link } from "@/i18n/navigation";
import type { NavCategory } from "./nav-types";

/**
 * Masaüstü "Ürünler" dropdown'ı için iç içe (özyinelemeli) kategori menüsü.
 * Alt kategorisi olan bir öğenin üzerine gelince yana doğru yeni bir
 * flyout açılır. Saf CSS hover ile çalışır (sunucu bileşeni).
 */
export function NavCategoryMenu({ categories }: { categories: NavCategory[] }) {
  // Tüm öğeler yaprak (alt menüsüz) ise uzun listede dikey kaydırma aç.
  // İç içe flyout'u olan menülerde kaydırma kapatılır ki yan açılan
  // alt menü yatayda kırpılmasın.
  const allLeaves = categories.every((c) => c.children.length === 0);

  return (
    <div
      className={
        "rounded-xl border border-black/5 bg-white py-2 shadow-card-hover" +
        (allLeaves ? " max-h-[70vh] overflow-y-auto" : "")
      }
    >
      {categories.map((cat) => (
        <NavCategoryItem key={cat.slug} cat={cat} />
      ))}
    </div>
  );
}

function NavCategoryItem({ cat }: { cat: NavCategory }) {
  const hasChildren = cat.children.length > 0;

  return (
    <div className="group/sub relative">
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

      {hasChildren && (
        <div className="invisible absolute left-full top-0 z-50 w-72 pl-2 opacity-0 transition-all group-hover/sub:visible group-hover/sub:opacity-100">
          <NavCategoryMenu categories={cat.children} />
        </div>
      )}
    </div>
  );
}
