import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;

export type AdminCategoryNode = {
  id: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  imagePath: string | null;
  tr: { name: string; slug: string } | null;
  en: { name: string; slug: string; status: string } | null;
  children: AdminCategoryNode[];
};

export type FlatCategory = {
  id: string;
  name: string;
  depth: number;
  sortOrder: number;
  isActive: boolean;
};

/**
 * Tüm kategoriler (pasifler dahil) — admin için ağaç.
 * Taban "urunler" düğümü (parent'sız tek kök) HARİÇ tutulur;
 * roots = tabanın çocukları. (Frontend'deki kuralla aynı.)
 */
export async function getAdminCategoryTree(
  supabase: Client
): Promise<{ roots: AdminCategoryNode[]; baseId: string | null }> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, parent_id, sort_order, is_active, image_path, category_translations(locale, name, slug, translation_status)"
    )
    .order("sort_order");

  if (error || !data) {
    console.warn("[admin/categories] sorgu başarısız:", error?.message);
    return { roots: [], baseId: null };
  }

  const byId = new Map<string, AdminCategoryNode>();
  for (const row of data) {
    const tr = row.category_translations.find((t) => t.locale === "tr");
    const en = row.category_translations.find((t) => t.locale === "en");
    byId.set(row.id, {
      id: row.id,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      imagePath: row.image_path,
      tr: tr ? { name: tr.name, slug: tr.slug } : null,
      en: en
        ? { name: en.name, slug: en.slug, status: en.translation_status }
        : null,
      children: [],
    });
  }

  const topLevel: AdminCategoryNode[] = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      topLevel.push(node);
    }
  }

  const bySort = (a: AdminCategoryNode, b: AdminCategoryNode) =>
    a.sortOrder - b.sortOrder ||
    (a.tr?.name ?? "").localeCompare(b.tr?.name ?? "", "tr");
  for (const node of byId.values()) node.children.sort(bySort);
  topLevel.sort(bySort);

  if (topLevel.length === 1) {
    return { roots: topLevel[0].children, baseId: topLevel[0].id };
  }
  return { roots: topLevel, baseId: null };
}

/** Ağacın DFS düzleştirilmiş hali — select/dropdown ve liste için */
export function flattenCategories(roots: AdminCategoryNode[]): FlatCategory[] {
  const out: FlatCategory[] = [];
  const walk = (nodes: AdminCategoryNode[], depth: number) => {
    for (const n of nodes) {
      out.push({
        id: n.id,
        name: n.tr?.name ?? n.id,
        depth,
        sortOrder: n.sortOrder,
        isActive: n.isActive,
      });
      walk(n.children, depth + 1);
    }
  };
  walk(roots, 0);
  return out;
}
