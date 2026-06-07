import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardStats } from "@/lib/admin/dashboard";

export const metadata: Metadata = { title: "Panel" };
export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number;
  href: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-brand-100 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <p className="text-3xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-sm font-semibold text-ink-900">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-600">{hint}</p>}
    </Link>
  );
}

function OpenTaskList({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { id: string; name: string }[];
  emptyText: string;
}) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-5">
      <h2 className="mb-3 text-sm font-bold text-navy">
        {title}
        {items.length > 0 && (
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            {items.length}
          </span>
        )}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-ink-600">{emptyText}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/urunler/${p.id}`}
                className="text-sm text-primary hover:underline"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const stats = await getDashboardStats(supabase);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold text-navy">Panel</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ürün"
          value={stats.productCount}
          href="/admin/urunler"
          hint={
            stats.inactiveProductCount > 0
              ? `${stats.inactiveProductCount} pasif`
              : "tümü aktif"
          }
        />
        <StatCard
          label="Kategori"
          value={stats.categoryCount}
          href="/admin/kategoriler"
        />
        <StatCard
          label="Bekleyen ürün çevirisi"
          value={stats.autoProductTr}
          href="/admin/ceviriler"
          hint="EN, otomatik üretildi"
        />
        <StatCard
          label="Bekleyen kategori çevirisi"
          value={stats.autoCategoryTr}
          href="/admin/ceviriler?tablo=kategoriler"
          hint="EN, otomatik üretildi"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <OpenTaskList
          title="Görseli olmayan ürünler"
          items={stats.productsWithoutImages}
          emptyText="Tüm ürünlerin görseli var."
        />
        <OpenTaskList
          title="Açıklaması olmayan ürünler"
          items={stats.productsWithoutDescription}
          emptyText="Tüm ürünlerin açıklaması var."
        />
      </div>
    </div>
  );
}
