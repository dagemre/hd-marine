/** Supabase Storage public URL üreticileri */

export function storageUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export const productImageUrl = (path: string) =>
  storageUrl("product-images", path);

/**
 * NOT: categories.image_path şu an product-images bucket'ındaki temsilci
 * ürün görsellerini işaret eder (7 Haz 2026 SQL ataması) — kartlar
 * productImageUrl kullanır. Bu bucket, ileride özel kategori görseli
 * yüklenirse kullanılmak üzere duruyor.
 */
export const categoryImageUrl = (path: string) =>
  storageUrl("category-images", path);

export const siteAssetUrl = (path: string) => storageUrl("site-assets", path);
