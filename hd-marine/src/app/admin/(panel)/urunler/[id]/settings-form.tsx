import type { AdminProductDetail } from "@/lib/admin/product-detail";
import type { FlatCategory } from "@/lib/admin/categories";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/form";
import { updateSettings } from "./actions";

export function SettingsForm({
  product,
  categories,
}: {
  product: AdminProductDetail;
  categories: FlatCategory[];
}) {
  const action = updateSettings.bind(null, product.id);
  const assigned = new Set(product.categoryIds);

  return (
    <form
      action={action}
      className="space-y-4 rounded-xl border border-brand-100 bg-white p-5"
    >
      <h2 className="text-sm font-bold text-navy">Genel ayarlar</h2>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product.isActive}
            className="h-4 w-4 accent-primary"
          />
          Aktif (sitede görünür)
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={product.isFeatured}
            className="h-4 w-4 accent-primary"
          />
          Öne çıkan
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="brand">Marka</Label>
          <Input id="brand" name="brand" defaultValue={product.brand ?? ""} />
        </div>
        <div>
          <Label htmlFor="sku">Stok kodu (SKU)</Label>
          <Input id="sku" name="sku" defaultValue={product.sku ?? ""} />
        </div>
        <div>
          <Label htmlFor="primary_category_id">Ana kategori *</Label>
          <Select
            id="primary_category_id"
            name="primary_category_id"
            defaultValue={product.primaryCategoryId}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {" ".repeat(c.depth * 3) + c.name}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-xs text-ink-400">
            Canonical URL bu kategorinin zincirinden üretilir.
          </p>
        </div>
      </div>

      <div>
        <Label>Bağlı kategoriler</Label>
        <div className="grid max-h-56 gap-1 overflow-y-auto rounded-lg border border-brand-100 p-3 md:grid-cols-2">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-sm text-ink-900"
              style={{ paddingLeft: `${c.depth * 16}px` }}
            >
              <input
                type="checkbox"
                name="category_ids"
                value={c.id}
                defaultChecked={assigned.has(c.id)}
                className="h-4 w-4 shrink-0 accent-primary"
              />
              {c.name}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-ink-400">
          Ana kategori işaretli değilse kaydederken otomatik eklenir.
        </p>
      </div>

      <div className="flex justify-end border-t border-brand-100 pt-4">
        <Button type="submit">Ayarları kaydet</Button>
      </div>
    </form>
  );
}
