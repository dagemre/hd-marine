import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminCategoryTree,
  flattenCategories,
} from "@/lib/admin/categories";
import { NewProductForm } from "./new-product-form";

export const metadata: Metadata = { title: "Yeni ürün" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const { roots } = await getAdminCategoryTree(supabase);
  const categories = flattenCategories(roots);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-1">
        <Link href="/admin/urunler" className="text-sm text-primary hover:underline">
          ← Ürünler
        </Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Yeni ürün ekle</h1>
      <NewProductForm categories={categories} />
    </div>
  );
}
