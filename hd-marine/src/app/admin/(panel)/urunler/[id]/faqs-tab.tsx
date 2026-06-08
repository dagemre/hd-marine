"use client";

import type { AdminProductDetail } from "@/lib/admin/product-detail";
import { Input, Label } from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { ConfirmButton } from "../../confirm-button";
import { addFaq, deleteFaq, saveFaq } from "./actions";

function FaqCard({
  productId,
  faq,
  index,
}: {
  productId: string;
  faq: AdminProductDetail["faqs"][number];
  index: number;
}) {
  const save = saveFaq.bind(null, productId, faq.id);
  const remove = deleteFaq.bind(null, productId, faq.id);

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4">
      <form id={`faq-del-${faq.id}`} action={remove} />
      <ActionForm action={save} successMessage="Soru kaydedildi" className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-navy">Soru {index + 1}</p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-ink-600">Sıra</label>
            <Input
              name="sort_order"
              type="number"
              defaultValue={faq.sortOrder}
              className="w-16 px-2 py-1 text-xs"
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Soru (TR)</Label>
            <Input name="question_tr" defaultValue={faq.tr?.question ?? ""} />
            <Label className="mt-2">Cevap (TR)</Label>
            <RichTextEditor
              name="answer_tr"
              defaultValue={faq.tr?.answer ?? ""}
              placeholder="Cevabı buraya yazın…"
              minHeight={110}
            />
          </div>
          <div>
            <Label>Soru (EN)</Label>
            <Input name="question_en" defaultValue={faq.en?.question ?? ""} />
            <Label className="mt-2">Cevap (EN)</Label>
            <RichTextEditor
              name="answer_en"
              defaultValue={faq.en?.answer ?? ""}
              placeholder="Answer…"
              minHeight={110}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <ConfirmButton
            form={`faq-del-${faq.id}`}
            message="Bu soru-cevap silinsin mi?"
            className="h-9 rounded-lg px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Sil
          </ConfirmButton>
          <SubmitButton variant="outline" size="sm">
            Kaydet
          </SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}

export function FaqsTab({
  productId,
  faqs,
}: {
  productId: string;
  faqs: AdminProductDetail["faqs"];
}) {
  const add = addFaq.bind(null, productId);

  return (
    <div className="space-y-4">
      {faqs.length === 0 && (
        <p className="text-sm text-ink-600">Bu ürünün SSS kaydı yok.</p>
      )}
      {faqs.map((f, i) => (
        <FaqCard key={f.id} productId={productId} faq={f} index={i} />
      ))}

      <ActionForm
        action={add}
        successMessage="Yeni soru eklendi"
        className="space-y-3 rounded-xl border border-dashed border-brand-200 p-4"
      >
        <p className="text-sm font-bold text-navy">Yeni soru ekle</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Soru (TR) *</Label>
            <Input name="question_tr" placeholder="Soru (TR)" required />
            <Label className="mt-2">Cevap (TR) *</Label>
            <RichTextEditor
              name="answer_tr"
              placeholder="Cevabı buraya yazın…"
              minHeight={110}
            />
          </div>
          <div>
            <Label>Soru (EN)</Label>
            <Input name="question_en" placeholder="Soru (EN)" />
            <Label className="mt-2">Cevap (EN)</Label>
            <RichTextEditor
              name="answer_en"
              placeholder="Answer…"
              minHeight={110}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <SubmitButton variant="outline">Ekle</SubmitButton>
        </div>
      </ActionForm>
    </div>
  );
}
