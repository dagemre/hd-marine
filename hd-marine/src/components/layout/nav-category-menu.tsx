import { Link } from "@/i18n/navigation";
import type { NavCategory } from "./nav-types";

/**
 * Her derinlik için AYRI (sabit) grup adı. Tüm seviyelerde aynı isim
 * kullanılırsa Tailwind'in `group-hover/ad` seçicisi en yakın değil
 * HERHANGİ bir üst atayı eşleştirdiğinden, üst kategoriye gelince torun
 * flyout da açılır. Ayrı adlar bunu engeller. Sınıflar literal olmalı ki
 * Tailwind JIT taraması yakalasın (dinamik şablon string'i çalışmaz).
 */
const LEVELS = [
  { group: "group/lvl0", show: "group-hover/lvl0:visible group-hover/lvl0:opacity-100" },
  { group: "group/lvl1", show: "group-hover/lvl1:visible group-hover/lvl1:opacity-100" },
  { group: "group/lvl2", show: "group-hover/lvl2:visible group-hover/lvl2:opacity-100" },
  { group: "group/lvl3", show: "group-hover/lvl3:visible group-hover/lvl3:opacity-100" },
  { group: "group/lvl4", show: "group-hover/lvl4:visible group-hover/lvl4:opacity-100" },
] as const;

/**
 * Masaüstü "Ürünler" dropdown'ı için iç içe (özyinelemeli) kategori menüsü.
 * Yalnızca üzerine gelinen öğenin alt menüsü açılır; bir üst seviyeye gelmek
 * torun seviyeyi AÇMAZ. Saf CSS hover ile çalışır (sunucu bileşeni).
 */
export function NavCategoryMenu({
  categories,
  depth = 0,
}: {
  categories: NavCategory[];
  depth?: number;
}) {
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
        <NavCategoryItem key={cat.slug} cat={cat} depth={depth} />
      ))}
    </div>
  );
}

function NavCategoryItem({ cat, depth }: { cat: NavCategory; depth: number }) {
  const hasChildren = cat.children.length > 0;
  const level = LEVELS[Math.min(depth, LEVELS.length - 1)];

  return (
    <div className={`relative ${level.group}`}>
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
        <div
          className={`invisible absolute left-full top-0 z-50 w-72 pl-2 opacity-0 transition-all ${level.show}`}
        >
          <NavCategoryMenu categories={cat.children} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}
