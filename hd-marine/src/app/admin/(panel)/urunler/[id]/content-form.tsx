"use client";

import type { Database } from "@/lib/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ActionForm, SubmitButton } from "@/components/admin/action-form";
import { updateTranslation } from "./actions";

type ProductTr = Database["public"]["Tables"]["product_translations"]["Row"];

/** jsonb highlights → textarea satırları */
function highlightLines(value: ProductTr["highlights"]): string {
  if (!Array.isArray(value)) return "";
  return value.filter((v): v is string => typeof v === "string").join("\n");
}

/** jsonb feature_cards → "Başlık | Açıklama" satırları */
function featureCardLines(value: ProductTr["feature_cards"]): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((v) => {
      if (!v || typeof v !== "object") return null;
      const card = v as { title?: unknown; description?: unknown };
      if (typeof card.title !== "string" || !card.title) return null;
      const desc = typeof card.description === "string" ? card.description : "";
      return desc ? `${card.title} | ${desc}` : card.title;
    })
    .filter(Boolean)
    .join("\n");
}

/** TR/EN içerik formu — aynı bileşen iki sekmede kullanılır */
export function ContentForm({
  productId,
  locale,
  data,
}: {
  productId: string;
  locale: "tr" | "en";
  data: ProductTr | null;
}) {
  if (!data) {
    return (
      <p className="text-sm text-ink-600">
        Bu dil için çeviri kaydı yok. (Migrasyonda tüm ürünlere TR+EN
        oluşturulmuştu — bu durum beklenmiyor.)
      </p>
    );
  }

  const action = updateTranslation.bind(null, productId, locale);

  return (
    <ActionForm action={action} className="max-w-3xl space-y-4">
      {locale === "en" && (
        <div className="flex items-center gap-2">
          {data.translation_status === "reviewed" ? (
            <Badge variant="success">Onaylı çeviri</Badge>
          ) : (
            <Badge variant="warning">Otomatik çeviri — kontrol bekliyor</Badge>
          )}
        </div>
      )}

      <div>
        <Label htmlFor={`name-${locale}`}>Ürün adı *</Label>
        <Input
          id={`name-${locale}`}
          name="name"
          defaultValue={data.name}
          required
        />
        <p className="mt-1 text-xs text-ink-400">
          Adres (otomatik):{" "}
          <span className="font-mono text-ink-600">/{data.slug}</span> — ürün
          adı değişince adres ve tüm bağlantılar kendiliğinden güncellenir.
        </p>
      </div>

      <div>
        <Label htmlFor={`summary-${locale}`}>Özet</Label>
        <Textarea
          id={`summary-${locale}`}
          name="summary"
          rows={2}
          defaultValue={data.summary ?? ""}
        />
      </div>

      <div>
        <Label>Açıklama</Label>
        <RichTextEditor
          name="description"
          defaultValue={data.description ?? ""}
          placeholder="Ürün açıklamasını buraya yazın…"
          minHeight={220}
        />
      </div>

      <div>
        <Label>Kullanım alanları</Label>
        <RichTextEditor
          name="usage_areas"
          defaultValue={data.usage_areas ?? ""}
          placeholder="Bu ürünün nerelerde kullanıldığını yazın…"
          minHeight={140}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`hl-${locale}`}>Öne çıkan özellikler</Label>
          <Textarea
            id={`hl-${locale}`}
            name="highlights"
            rows={4}
            defaultValue={highlightLines(data.highlights)}
            placeholder={"Yüksek Performans\nDüşük Titreşim\nUzun Ömürlü\nEnerji Verimli"}
          />
          <p className="mt-1 text-xs text-ink-400">
            Her satıra bir özellik (en çok 6). Ürün başlığının altında ikonlu
            rozet olarak görünür; boşsa bölüm gizlenir.
          </p>
        </div>
        <div>
          <Label htmlFor={`fc-${locale}`}>Özellik şeridi kartları</Label>
          <Textarea
            id={`fc-${locale}`}
            name="feature_cards"
            rows={4}
            defaultValue={featureCardLines(data.feature_cards)}
            placeholder={
              "Yüksek Verimlilik | Enerji tasarrufu sağlayan yüksek performans.\nKolay Bakım | Pratik bakım imkanı ve yedek parça desteği."
            }
          />
          <p className="mt-1 text-xs text-ink-400">
            Her satıra bir kart: <code>Başlık | Açıklama</code> (en çok 5).
            Galeri altındaki beyaz şeritte görünür; boşsa şerit gizlenir.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor={`mt-${locale}`}>SEO başlık</Label>
          <Input
            id={`mt-${locale}`}
            name="meta_title"
            defaultValue={data.meta_title ?? ""}
          />
        </div>
        <div>
          <Label htmlFor={`md-${locale}`}>SEO açıklama</Label>
          <Input
            id={`md-${locale}`}
            name="meta_description"
            defaultValue={data.meta_description ?? ""}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-brand-100 pt-4">
        {locale === "en" ? (
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <input
              type="checkbox"
              name="reviewed"
              defaultChecked={data.translation_status === "reviewed"}
              className="h-4 w-4 accent-primary"
            />
            Çeviriyi onaylandı olarak işaretle
          </label>
        ) : (
          <span />
        )}
        <SubmitButton>Kaydet</SubmitButton>
      </div>
    </ActionForm>
  );
}
