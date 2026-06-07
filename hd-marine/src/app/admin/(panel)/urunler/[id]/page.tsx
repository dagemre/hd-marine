import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminProduct } from "@/lib/admin/product-detail";
import {
  getAdminCategoryTree,
  flattenCategories,
} from "@/lib/admin/categories";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { ContentForm } from "./content-form";
import { SettingsForm } from "./settings-form";
import { SpecsTab } from "./specs-tab";
import { FaqsTab } from "./faqs-tab";
import { ImagesTab } from "./images-tab";

export const metadata: Metadata = { title: "Ürün düzenle" };
export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hata?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  const [product, { roots }] = await Promise.all([
    getAdminProduct(supabase, id),
    getAdminCategoryTree(supabase),
  ]);
  if (!product) notFound();

  const categories = flattenCategories(roots);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-1">
        <Link
          href="/admin/urunler"
          className="text-sm text-primary hover:underline"
        >
          ← Ürünler
        </Link>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">
          {product.tr?.name ?? "Ürün"}
        </h1>
        {product.isActive ? (
          <Badge variant="success">Aktif</Badge>
        ) : (
          <Badge variant="danger">Pasif</Badge>
        )}
        {product.en?.translation_status === "auto" && (
          <Badge variant="warning">EN çeviri kontrol bekliyor</Badge>
        )}
      </div>

      {sp.hata && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {sp.hata}
        </p>
      )}

      <div className="space-y-6">
        <SettingsForm product={product} categories={categories} />

        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <Tabs
            items={[
              {
                label: "İçerik (TR)",
                content: (
                  <ContentForm
                    productId={product.id}
                    locale="tr"
                    data={product.tr}
                  />
                ),
              },
              {
                label:
                  product.en?.translation_status === "auto"
                    ? "İçerik (EN) ⚠"
                    : "İçerik (EN)",
                content: (
                  <ContentForm
                    productId={product.id}
                    locale="en"
                    data={product.en}
                  />
                ),
              },
              {
                label: `Özellikler (${product.specs.length})`,
                content: (
                  <SpecsTab productId={product.id} specs={product.specs} />
                ),
              },
              {
                label: `SSS (${product.faqs.length})`,
                content: <FaqsTab productId={product.id} faqs={product.faqs} />,
              },
              {
                label: `Görseller (${product.images.length})`,
                content: (
                  <ImagesTab
                    productId={product.id}
                    productSlug={product.tr?.slug ?? product.id}
                    images={product.images}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
