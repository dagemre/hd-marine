import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminCategoryTree,
  type AdminCategoryNode,
} from "@/lib/admin/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { updateCategory } from "./actions";

export const metadata: Metadata = { title: "Kategoriler" };
export const dynamic = "force-dynamic";

function CategoryRow({
  node,
  depth,
}: {
  node: AdminCategoryNode;
  depth: number;
}) {
  const action = updateCategory.bind(null, node.id);

  return (
    <>
      <tr className="border-b border-brand-50 last:border-0 hover:bg-brand-50/50">
        <td className="px-3 py-2">
          <Input
            name="sort_order"
            form={`cat-${node.id}`}
            type="number"
            defaultValue={node.sortOrder}
            className="w-16 px-2 py-1.5 text-xs"
          />
        </td>
        <td className="px-3 py-2" style={{ paddingLeft: `${12 + depth * 24}px` }}>
          <Input
            name="name_tr"
            form={`cat-${node.id}`}
            defaultValue={node.tr?.name ?? ""}
            required
            className="px-2 py-1.5 text-sm font-semibold"
          />
          <p className="mt-0.5 text-xs text-ink-400">/{node.tr?.slug}</p>
        </td>
        <td className="px-3 py-2">
          <Input
            name="name_en"
            form={`cat-${node.id}`}
            defaultValue={node.en?.name ?? ""}
            className="px-2 py-1.5 text-sm"
          />
          <p className="mt-0.5 text-xs text-ink-400">/{node.en?.slug}</p>
        </td>
        <td className="px-3 py-2">
          {node.en?.status === "reviewed" ? (
            <Badge variant="success">Onaylı</Badge>
          ) : (
            <Badge variant="warning">Otomatik</Badge>
          )}
          <label className="mt-1 flex items-center gap-1.5 text-xs text-ink-600">
            <input
              type="checkbox"
              name="en_reviewed"
              form={`cat-${node.id}`}
              defaultChecked={node.en?.status === "reviewed"}
              className="h-3.5 w-3.5 accent-primary"
            />
            EN onaylı
          </label>
        </td>
        <td className="px-3 py-2 text-center">
          <input
            type="checkbox"
            name="is_active"
            form={`cat-${node.id}`}
            defaultChecked={node.isActive}
            className="h-4 w-4 accent-primary"
          />
        </td>
        <td className="px-3 py-2">
          <form id={`cat-${node.id}`} action={action}>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
            >
              Kaydet
            </Button>
          </form>
        </td>
      </tr>
      {node.children.map((child) => (
        <CategoryRow key={child.id} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const [{ roots }, sp] = await Promise.all([
    getAdminCategoryTree(supabase),
    searchParams,
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-2 text-2xl font-bold text-navy">Kategoriler</h1>
      <p className="mb-6 text-sm text-ink-600">
        Sıra numarası menü ve listelerdeki dizilimi belirler (küçük üstte; eşit
        ise TR ada göre). Pasif kategori sitede görünmez.
      </p>

      {sp.hata && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {sp.hata}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-3 py-3">Sıra</th>
              <th className="px-3 py-3">Ad (TR)</th>
              <th className="px-3 py-3">Ad (EN)</th>
              <th className="px-3 py-3">EN durumu</th>
              <th className="px-3 py-3 text-center">Aktif</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {roots.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-ink-600">
                  Kategori bulunamadı (veritabanına erişilemiyor olabilir).
                </td>
              </tr>
            )}
            {roots.map((node) => (
              <CategoryRow key={node.id} node={node} depth={0} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-ink-400">
        Slug'lar URL'leri belirlediği için buradan değiştirilemez. Yeni kategori
        ekleme/taşıma gerekiyorsa bana söylemen yeterli.
      </p>
    </div>
  );
}
