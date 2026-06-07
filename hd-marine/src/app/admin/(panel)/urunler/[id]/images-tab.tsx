import Image from "next/image";
import type { AdminProductDetail } from "@/lib/admin/product-detail";
import { productImageUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { ConfirmButton } from "../../confirm-button";
import {
  deleteImage,
  setPrimaryImage,
  updateImageMeta,
  uploadImage,
} from "./actions";

function ImageCard({
  productId,
  image,
}: {
  productId: string;
  image: AdminProductDetail["images"][number];
}) {
  const save = updateImageMeta.bind(null, productId, image.id);
  const remove = deleteImage.bind(null, productId, image.id, image.storagePath);
  const makePrimary = setPrimaryImage.bind(null, productId, image.id);

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-3">
      <form id={`img-del-${image.id}`} action={remove} />
      <form id={`img-pri-${image.id}`} action={makePrimary} />
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-surface">
        <Image
          src={productImageUrl(image.storagePath)}
          alt={image.altTr ?? ""}
          fill
          sizes="200px"
          className="object-contain"
        />
        {image.isPrimary && (
          <span className="absolute left-2 top-2">
            <Badge variant="navy">Ana görsel</Badge>
          </span>
        )}
      </div>
      <form action={save} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="mb-0 shrink-0 text-xs">Sıra</Label>
          <Input
            name="sort_order"
            type="number"
            defaultValue={image.sortOrder}
            className="w-16 px-2 py-1 text-xs"
          />
        </div>
        <Input
          name="alt_tr"
          placeholder="Alt metin (TR)"
          defaultValue={image.altTr ?? ""}
          className="px-2 py-1.5 text-xs"
        />
        <Input
          name="alt_en"
          placeholder="Alt metin (EN)"
          defaultValue={image.altEn ?? ""}
          className="px-2 py-1.5 text-xs"
        />
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1">
            {!image.isPrimary && (
              <button
                type="submit"
                form={`img-pri-${image.id}`}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-brand-50"
              >
                Ana yap
              </button>
            )}
            <ConfirmButton
              form={`img-del-${image.id}`}
              message="Bu görsel kalıcı olarak silinsin mi?"
              className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Sil
            </ConfirmButton>
          </div>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-xs"
          >
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ImagesTab({
  productId,
  productSlug,
  images,
}: {
  productId: string;
  productSlug: string;
  images: AdminProductDetail["images"];
}) {
  const upload = uploadImage.bind(null, productId, productSlug);

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Bu ürünün görseli yok — sitede yer tutucu görünür. Aşağıdan
          yükleyebilirsiniz.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <ImageCard key={img.id} productId={productId} image={img} />
          ))}
        </div>
      )}

      <form
        action={upload}
        className="space-y-3 rounded-xl border border-dashed border-brand-200 p-4"
      >
        <p className="text-sm font-bold text-navy">Yeni görsel yükle</p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-brand-100"
          />
          <Input name="alt_tr" placeholder="Alt metin (TR), opsiyonel" />
          <Button type="submit" variant="outline">
            Yükle
          </Button>
        </div>
        <p className="text-xs text-ink-400">
          JPEG, PNG veya WebP; en fazla 5 MB. İlk yüklenen görsel otomatik ana
          görsel olur.
        </p>
      </form>
    </div>
  );
}
