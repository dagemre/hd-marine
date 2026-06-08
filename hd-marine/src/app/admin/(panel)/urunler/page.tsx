import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import {
  listProducts,
  type ProductListParams,
} from "@/lib/admin/products";
import {
  getAdminCategoryTree,
  flattenCategories,
} from "@/lib/admin/categories";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/form";
import { Button, buttonStyles } from "@/components/ui/button";
import { ConfirmButton } from "../confirm-button";
import { deleteProduct } from "./actions";

export const metadata: Metadata = { title: "Ürünler" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  kategori?: string;
  durum?: string;
  ceviri?: string;
  sayfa?: string;
  hata?: string;
  silindi?: string;
}>;

function buildQuery(
  sp: Awaited<SearchParams>,
  overrides: Record<string, string | undefined>
): string {
  const merged = { ...sp, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

function EnStatusBadge({ status }: { status: string }) {
  if (status === "reviewed") return <Badge variant="success">EN onaylı</Badge>;
  if (status === "auto") return <Badge variant="warning">EN otomatik</Badge>;
  return <Badge variant="danger">EN yok</Badge>;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;

  const params: ProductListParams = {
    q: sp.q?.trim() || undefined,
    categoryId: sp.kategori || undefined,
    active:
      sp.durum === "aktif" || sp.durum === "pasif" ? sp.durum : undefined,
    enStatus:
      sp.ceviri === "auto" || sp.ceviri === "reviewed"
        ? sp.ceviri
        : undefined,
    page: Math.max(1, parseInt(sp.sayfa ?? "1", 10) || 1),
  };

  const [result, { roots }] = await Promise.all([
    listProducts(supabase, params),
    getAdminCategoryTree(supabase),
  ]);
  const categories = flattenCategories(roots);
  const catNames = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold text-navy">Ürünler</h1>
          <p className="text-sm text-ink-600">{result.total} kayıt</p>
        </div>
        <Link href="/admin/urunler/yeni" className={buttonStyles("primary", "sm")}>
          + Yeni ürün
        </Link>
      </div>

      {sp.silindi && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Ürün silindi.
        </p>
      )}
      {sp.hata && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {sp.hata}
        </p>
      )}

      {/* Filtreler */}
      <form
        method="GET"
        className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-brand-100 bg-white p-4 md:grid-cols-5"
      >
        <Input
          name="q"
          placeholder="Ürün adı ara…"
          defaultValue={sp.q ?? ""}
          className="col-span-2"
        />
        <Select name="kategori" defaultValue={sp.kategori ?? ""}>
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {" ".repeat(c.depth * 3)}
              {c.name}
            </option>
          ))}
        </Select>
        <Select name="durum" defaultValue={sp.durum ?? ""}>
          <option value="">Aktif + pasif</option>
          <option value="aktif">Aktif</option>
          <option value="pasif">Pasif</option>
        </Select>
        <div className="flex gap-2">
          <Select name="ceviri" defaultValue={sp.ceviri ?? ""}>
            <option value="">Tüm çeviriler</option>
            <option value="auto">EN otomatik</option>
            <option value="reviewed">EN onaylı</option>
          </Select>
          <Button type="submit" size="sm" className="h-auto shrink-0">
            Ara
          </Button>
        </div>
      </form>

      {/* Tablo */}
      <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3">Ana kategori</th>
              <th className="px-4 py-3 text-center">Görsel</th>
              <th className="px-4 py-3">Çeviri</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {result.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-600">
                  Filtrelere uyan ürün bulunamadı.
                </td>
              </tr>
            )}
            {result.items.map((p) => (
              <tr
                key={p.id}
                className="border-b border-brand-50 last:border-0 hover:bg-brand-50/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/urunler/${p.id}`}
                    className="font-semibold text-navy hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-ink-400">/{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {catNames.get(p.primaryCategoryId) ?? "—"}
                </td>
                <td
                  className={`px-4 py-3 text-center ${
                    p.imageCount === 0 ? "font-bold text-red-600" : "text-ink-600"
                  }`}
                >
                  {p.imageCount}
                </td>
                <td className="px-4 py-3">
                  <EnStatusBadge status={p.enStatus} />
                </td>
                <td className="px-4 py-3">
                  {p.isActive ? (
                    <Badge variant="success">Aktif</Badge>
                  ) : (
                    <Badge variant="danger">Pasif</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/urunler/${p.id}`}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary hover:bg-brand-50"
                    >
                      Düzenle
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <ConfirmButton
                        message={`"${p.name}" ürünü kalıcı olarak silinsin mi? Bu işlem geri alınamaz.`}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Sil
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      {result.pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {result.page > 1 && (
            <Link
              href={buildQuery(sp, { sayfa: String(result.page - 1) })}
              className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-navy hover:border-primary"
            >
              ← Önceki
            </Link>
          )}
          <span className="px-2 text-ink-600">
            Sayfa {result.page} / {result.pageCount}
          </span>
          {result.page < result.pageCount && (
            <Link
              href={buildQuery(sp, { sayfa: String(result.page + 1) })}
              className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-navy hover:border-primary"
            >
              Sonraki →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
