"use client";

import type { AdminProductDetail } from "@/lib/admin/product-detail";
import { Input } from "@/components/ui/form";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { ConfirmButton } from "../../confirm-button";
import { addSpec, deleteSpec, saveSpec } from "./actions";

const cell = "px-2 py-1.5";

function SpecRow({
  productId,
  spec,
}: {
  productId: string;
  spec: AdminProductDetail["specs"][number];
}) {
  const save = saveSpec.bind(null, productId, spec.id);
  const remove = deleteSpec.bind(null, productId, spec.id);

  return (
    <tr className="border-b border-brand-50 align-top last:border-0">
      <td className={cell}>
        <Input
          name="sort_order"
          form={`spec-${spec.id}`}
          type="number"
          defaultValue={spec.sortOrder}
          className="w-16 px-2 py-1.5 text-xs"
        />
      </td>
      <td className={cell}>
        <Input
          name="label_tr"
          form={`spec-${spec.id}`}
          defaultValue={spec.tr?.label ?? ""}
          className="px-2 py-1.5 text-xs"
        />
      </td>
      <td className={cell}>
        <Input
          name="value_tr"
          form={`spec-${spec.id}`}
          defaultValue={spec.tr?.value ?? ""}
          className="px-2 py-1.5 text-xs"
        />
      </td>
      <td className={cell}>
        <Input
          name="label_en"
          form={`spec-${spec.id}`}
          defaultValue={spec.en?.label ?? ""}
          className="px-2 py-1.5 text-xs"
        />
      </td>
      <td className={cell}>
        <Input
          name="value_en"
          form={`spec-${spec.id}`}
          defaultValue={spec.en?.value ?? ""}
          className="px-2 py-1.5 text-xs"
        />
      </td>
      <td className={`${cell} whitespace-nowrap`}>
        <ActionForm
          id={`spec-${spec.id}`}
          action={save}
          successMessage="Özellik kaydedildi"
          className="inline"
        >
          <SubmitButton variant="outline" size="sm" className="h-8 px-3 text-xs">
            Kaydet
          </SubmitButton>
        </ActionForm>{" "}
        <form action={remove} className="inline">
          <ConfirmButton
            message="Bu özellik silinsin mi?"
            className="h-8 rounded-lg px-2 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Sil
          </ConfirmButton>
        </form>
      </td>
    </tr>
  );
}

export function SpecsTab({
  productId,
  specs,
}: {
  productId: string;
  specs: AdminProductDetail["specs"];
}) {
  const add = addSpec.bind(null, productId);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-ink-600">
              <th className={cell}>Sıra</th>
              <th className={cell}>Özellik (TR)</th>
              <th className={cell}>Değer (TR)</th>
              <th className={cell}>Özellik (EN)</th>
              <th className={cell}>Değer (EN)</th>
              <th className={cell}></th>
            </tr>
          </thead>
          <tbody>
            {specs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-6 text-center text-ink-600">
                  Bu ürünün teknik özelliği yok.
                </td>
              </tr>
            )}
            {specs.map((s) => (
              <SpecRow key={s.id} productId={productId} spec={s} />
            ))}
          </tbody>
        </table>
      </div>

      <ActionForm
        action={add}
        successMessage="Özellik eklendi"
        className="rounded-xl border border-dashed border-brand-200 p-4"
      >
        <p className="mb-3 text-sm font-bold text-navy">Yeni özellik ekle</p>
        <div className="grid gap-3 md:grid-cols-5">
          <Input name="label_tr" placeholder="Özellik (TR) *" required />
          <Input name="value_tr" placeholder="Değer (TR) *" required />
          <Input name="label_en" placeholder="Özellik (EN)" />
          <Input name="value_en" placeholder="Değer (EN)" />
          <SubmitButton variant="outline">Ekle</SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
