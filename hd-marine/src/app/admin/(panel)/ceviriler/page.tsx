import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "../confirm-button";
import {
  approveAllCategoryTranslations,
  approveAllProductTranslations,
  approveCategoryTranslation,
  approveProductTranslation,
} from "./actions";

export const metadata: Metadata = { title: "Çeviriler" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SearchParams = Promise<{ tablo?: string; sayfa?: string }>;

export default async function AdminTranslationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const table = sp.tablo === "kategoriler" ? "kategoriler" : "urunler";
  const page = Math.max(1, parseInt(sp.sayfa ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  // Bekleyen sayıları (sekme başlıkları için)
  const head = { count: "exact" as const, head: true };
  const [productPending, categoryPending] = await Promise.all([
    supabase
      .from("product_translations")
      .select("*", head)
      .eq("locale", "en")
      .eq("translation_status", "auto"),
    supabase
      .from("category_translations")
      .select("*", head)
      .eq("locale", "en")
      .eq("translation_status", "auto"),
  ]);

  type Row = {
    id: string;
    parentId: string;
    nameEn: string;
    nameTr: string;
  };
  let rows: Row[] = [];
  let total = 0;

  if (table === "urunler") {
    const { data, count } = await supabase
      .from("product_translations")
      .select("id, product_id, name", { count: "exact" })
      .eq("locale", "en")
      .eq("translation_status", "auto")
      .order("name")
      .range(from, from + PAGE_SIZE - 1);
    total = count ?? 0;
    const ids = (data ?? []).map((r) => r.product_id);
    const trMap = new Map<string, string>();
    if (ids.length > 0) {
      const { data: trRows } = await supabase
        .from("product_translations")
        .select("product_id, name")
        .eq("locale", "tr")
        .in("product_id", ids);
      for (const r of trRows ?? []) trMap.set(r.product_id, r.name);
    }
    rows = (data ?? []).map((r) => ({
      id: r.id,
      parentId: r.product_id,
      nameEn: r.name,
      nameTr: trMap.get(r.product_id) ?? "—",
    }));
  } else {
    const { data, count } = await supabase
      .from("category_translations")
      .select("id, category_id, name", { count: "exact" })
      .eq("locale", "en")
      .eq("translation_status", "auto")
      .order("name")
      .range(from, from + PAGE_SIZE - 1);
    total = count ?? 0;
    const ids = (data ?? []).map((r) => r.category_id);
    const trMap = new Map<string, string>();
    if (ids.length > 0) {
      const { data: trRows } = await supabase
        .from("category_translations")
        .select("category_id, name")
        .eq("locale", "tr")
        .in("category_id", ids);
      for (const r of trRows ?? []) trMap.set(r.category_id, r.name);
    }
    rows = (data ?? []).map((r) => ({
      id: r.id,
      parentId: r.category_id,
      nameEn: r.name,
      nameTr: trMap.get(r.category_id) ?? "—",
    }));
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const tabClass = (active: boolean) =>
    cn(
      "rounded-lg px-4 py-2 text-sm font-semibold",
      active
        ? "bg-primary text-white"
        : "bg-white text-navy hover:bg-brand-50 border border-brand-200"
    );

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-2 text-2xl font-bold text-navy">Çeviri kontrolü</h1>
      <p className="mb-6 text-sm text-ink-600">
        Migrasyonda EN içerikler otomatik üretildi. Buradan göz atıp tek tek
        veya toplu onaylayabilirsin; düzeltme gerekenler için "Düzenle" ile
        ilgili kayda git.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/ceviriler" className={tabClass(table === "urunler")}>
          Ürünler ({productPending.count ?? 0})
        </Link>
        <Link
          href="/admin/ceviriler?tablo=kategoriler"
          className={tabClass(table === "kategoriler")}
        >
          Kategoriler ({categoryPending.count ?? 0})
        </Link>
        <div className="ml-auto">
          {total > 0 && (
            <form
              action={
                table === "urunler"
                  ? approveAllProductTranslations
                  : approveAllCategoryTranslations
              }
            >
              <ConfirmButton
                message={`${total} bekleyen çevirinin TÜMÜ onaylansın mı? Bu işlem geri alınamaz (durumları tek tek değiştirmek gerekir).`}
                className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-navy hover:border-primary hover:text-primary"
              >
                Tümünü onayla ({total})
              </ConfirmButton>
            </form>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-ink-600">
              <th className="px-4 py-3">Türkçe</th>
              <th className="px-4 py-3">İngilizce (otomatik)</th>
              <th className="px-4 py-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-ink-600">
                  Bekleyen çeviri yok — hepsi onaylandı.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-brand-50 last:border-0 hover:bg-brand-50/50"
              >
                <td className="px-4 py-2.5 text-ink-900">{r.nameTr}</td>
                <td className="px-4 py-2.5 text-ink-600">{r.nameEn}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {table === "urunler" ? (
                      <Link
                        href={`/admin/urunler/${r.parentId}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Düzenle
                      </Link>
                    ) : (
                      <Link
                        href="/admin/kategoriler"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Düzenle
                      </Link>
                    )}
                    <form
                      action={(table === "urunler"
                        ? approveProductTranslation
                        : approveCategoryTranslation
                      ).bind(null, r.id)}
                    >
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs"
                      >
                        Onayla
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <Link
              href={`/admin/ceviriler?tablo=${table}&sayfa=${page - 1}`}
              className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 font-semibold text-navy hover:border-primary"
            >
              ← Önceki
            </Link>
          )}
          <span className="px-2 text-ink-600">
            Sayfa {page} / {pageCount}
          </span>
          {page < pageCount && (
            <Link
              href={`/admin/ceviriler?tablo=${table}&sayfa=${page + 1}`}
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
