import type { Locale } from "@/i18n/routing";
import { getCategoryTree, categorySlugPath } from "./categories";
import { getProductBySlug, prodT } from "./products";
import type { CategoryNode, ResolvedPath } from "./types";

/**
 * /urunler/[...slug] catch-all çözümleyici.
 *
 * Slug zinciri kategori ağacında yürünür (herhangi bir locale'in slug'ı
 * eşleşir — dil değiştirici yanlış dilin slug'ıyla gelirse de bulunur).
 * Zincirin tamamı kategoriyse → kategori sayfası.
 * Aksi halde son segment ürün slug'ı olarak denenir → ürün sayfası.
 *
 * canonicalSlugs istenen locale'deki doğru yoldur; istekle birebir
 * eşleşmiyorsa sayfa 308 (permanentRedirect) ile canonical'a yönlenir.
 */
export async function resolveSlugPath(
  slugs: string[],
  locale: Locale
): Promise<ResolvedPath> {
  if (slugs.length === 0) return { type: "not-found" };

  const tree = await getCategoryTree();
  if (tree.roots.length === 0) return { type: "not-found" };

  const matchChild = (
    nodes: CategoryNode[],
    slug: string
  ): CategoryNode | undefined =>
    nodes.find((n) =>
      Object.values(n.i18n).some((t) => t?.slug === slug)
    );

  // 1) Kategori zinciri olarak dene
  let nodes = tree.roots;
  let current: CategoryNode | undefined;
  let categoryDepth = 0;
  for (const slug of slugs) {
    const found = matchChild(nodes, slug);
    if (!found) break;
    current = found;
    nodes = found.children;
    categoryDepth++;
  }

  if (current && categoryDepth === slugs.length) {
    return {
      type: "category",
      category: current,
      canonicalSlugs: categorySlugPath(tree, current, locale),
    };
  }

  // 2) Son segment ürün olarak dene (öncesindeki zincir kategori olmalı)
  if (categoryDepth === slugs.length - 1 && current) {
    const product = await getProductBySlug(slugs[slugs.length - 1]);
    if (product) {
      const primary = tree.byId.get(product.primaryCategoryId);
      const productSlug = prodT(product.i18n, locale).slug;
      const canonicalSlugs = primary
        ? [...categorySlugPath(tree, primary, locale), productSlug]
        : [productSlug];
      return { type: "product", product, canonicalSlugs };
    }
  }

  return { type: "not-found" };
}
