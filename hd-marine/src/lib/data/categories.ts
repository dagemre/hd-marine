import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/i18n/routing";
import type {
  CategoryNode,
  CategoryTranslation,
  CategoryTree,
} from "./types";

/**
 * Tüm aktif kategori ağacı (35 kayıt) — tek sorguyla çekilir,
 * istek başına React cache ile tekrar kullanılır.
 * DB erişilemezse boş ağaç döner (sandbox/offline toleransı).
 *
 * ÖNEMLİ: DB'de tepe seviyede tek "taban" kategori vardır
 * (slug: urunler/products) — /urunler route'unun kendisini temsil eder.
 * `roots` bu taban kategorinin ÇOCUKLARIDIR (7 ana kategori) ve slug
 * yolları taban kategoriyi içermez (URL'de /urunler zaten sabittir).
 */
export const getCategoryTree = cache(async (): Promise<CategoryTree> => {
  const empty: CategoryTree = { roots: [], byId: new Map() };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, parent_id, sort_order, image_path, category_translations(locale, name, slug, description, meta_title, meta_description)"
      )
      .eq("is_active", true)
      .order("sort_order");

    if (error || !data) {
      console.warn("[data/categories] kategori sorgusu başarısız:", error?.message);
      return empty;
    }

    const byId = new Map<string, CategoryNode>();
    for (const row of data) {
      const i18n: CategoryNode["i18n"] = {};
      for (const tr of row.category_translations) {
        i18n[tr.locale as Locale] = {
          name: tr.name,
          slug: tr.slug,
          description: tr.description,
          meta_title: tr.meta_title,
          meta_description: tr.meta_description,
        };
      }
      byId.set(row.id, {
        id: row.id,
        parentId: row.parent_id,
        sortOrder: row.sort_order,
        imagePath: row.image_path,
        i18n,
        children: [],
      });
    }

    const topLevel: CategoryNode[] = [];
    for (const node of byId.values()) {
      if (node.parentId && byId.has(node.parentId)) {
        byId.get(node.parentId)!.children.push(node);
      } else {
        topLevel.push(node);
      }
    }
    // sort_order eşitse TR ada göre deterministik sırala
    const bySort = (a: CategoryNode, b: CategoryNode) =>
      a.sortOrder - b.sortOrder ||
      (a.i18n.tr?.name ?? "").localeCompare(b.i18n.tr?.name ?? "", "tr");
    for (const node of byId.values()) node.children.sort(bySort);
    topLevel.sort(bySort);

    // Taban "urunler" kategorisi tek tepe düğümse onun çocukları kök sayılır
    const roots =
      topLevel.length === 1 ? topLevel[0].children : topLevel;

    return { roots, byId };
  } catch (e) {
    console.warn("[data/categories] kategori ağacı yüklenemedi:", e);
    return empty;
  }
});

/** Çeviri — istenen locale yoksa TR'ye düşer */
export function catT(
  node: CategoryNode,
  locale: Locale
): CategoryTranslation {
  return (node.i18n[locale] ?? node.i18n.tr)!;
}

/** Taban (parent'sız) kategori mi? — URL yollarına dahil edilmez */
function isBaseNode(node: CategoryNode): boolean {
  return node.parentId === null;
}

/** Kök → node slug zinciri (taban kategori hariç; verilen locale'de, TR fallback) */
export function categorySlugPath(
  tree: CategoryTree,
  node: CategoryNode,
  locale: Locale
): string[] {
  const slugs: string[] = [];
  let current: CategoryNode | undefined = node;
  while (current && !isBaseNode(current)) {
    slugs.unshift(catT(current, locale).slug);
    current = current.parentId ? tree.byId.get(current.parentId) : undefined;
  }
  return slugs;
}

/** Breadcrumb için kök → node kategori zinciri (taban kategori hariç) */
export function categoryChain(
  tree: CategoryTree,
  node: CategoryNode
): CategoryNode[] {
  const chain: CategoryNode[] = [];
  let current: CategoryNode | undefined = node;
  while (current && !isBaseNode(current)) {
    chain.unshift(current);
    current = current.parentId ? tree.byId.get(current.parentId) : undefined;
  }
  return chain;
}
