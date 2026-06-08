"use client";

import type { FlatCategory } from "@/lib/admin/categories";
import { Input, Label, Select } from "@/components/ui/form";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { createProduct } from "./actions";

export function NewProductForm({
  categories,
}: {
  categories: FlatCategory[];
}) {
  return (
    <ActionForm
      action={createProduct}
      className="max-w-2xl space-y-5 rounded-xl border border-brand-100 bg-white p-6"
    >
      <div>
        <Label htmlFor="name">Ürün adı *</Label>
        <Input id="name" name="name" placeholder="Örn. Diyaframlı Pompa DP-50" required />
        <p className="mt-1 text-xs text-ink-400">
          Adres (URL) bu addan otomatik üretilir. Detayları kaydettikten sonra
          ekleyeceksiniz.
        </p>
      </div>

      <div>
        <Label htmlFor="primary_category_id">Ana kategori *</Label>
        <Select id="primary_category_id" name="primary_category_id" required defaultValue="">
          <option value="" disabled>
            Kategori seçin…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {" ".repeat(c.depth * 3) + c.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="brand">Marka (isteğe bağlı)</Label>
        <Input id="brand" name="brand" placeholder="Örn. HD Marine" />
      </div>

      <div className="flex justify-end border-t border-brand-100 pt-4">
        <SubmitButton>Oluştur ve düzenlemeye geç</SubmitButton>
      </div>
    </ActionForm>
  );
}
