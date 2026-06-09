import type { AppPathname } from "@/i18n/routing";

/** Statik nav öğesi (Anasayfa, Hakkımızda, …) */
export type NavItem = {
  label: string;
  pathname: Exclude<AppPathname, "/urunler/[...slug]">;
};

/** Ürünler dropdown'ı için kategori öğesi (iç içe alt kategorilerle) */
export type NavCategory = {
  name: string;
  /** Düğümün kendi slug'ı — React key için */
  slug: string;
  /** Kök → düğüm slug zinciri — /urunler/[...slug] yönlendirmesi için */
  path: string[];
  /** Alt kategoriler */
  children: NavCategory[];
};
