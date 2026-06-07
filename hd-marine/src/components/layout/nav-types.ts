import type { AppPathname } from "@/i18n/routing";

/** Statik nav öğesi (Anasayfa, Hakkımızda, …) */
export type NavItem = {
  label: string;
  pathname: Exclude<AppPathname, "/urunler/[...slug]">;
};

/** Ürünler dropdown'ı için ana kategori öğesi */
export type NavCategory = {
  name: string;
  slug: string;
};
