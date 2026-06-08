import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { productImageUrl } from "@/lib/storage";

export function ProductCard({
  name,
  slugs,
  imagePath,
  imageAlt,
  brand,
  categoryName,
}: {
  name: string;
  /** Canonical yol: primary kategori zinciri + ürün slug'ı */
  slugs: string[];
  imagePath: string | null;
  imageAlt?: string | null;
  brand?: string | null;
  categoryName?: string;
}) {
  const t = useTranslations("common");

  return (
    <Link
      href={{ pathname: "/urunler/[...slug]", params: { slug: slugs } }}
      className="group block h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden">
        <div className="relative flex aspect-square items-center justify-center bg-white p-3">
          {imagePath ? (
            <Image
              src={productImageUrl(imagePath)}
              alt={imageAlt ?? name}
              width={400}
              height={400}
              className="max-h-full max-w-full w-auto object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface text-ink-400"
            >
              <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="m3 16 5-5 4 4 3-3 6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {brand && (
            <Badge className="absolute left-4 top-4">{brand}</Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col border-t border-black/5 p-5">
          {categoryName && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
              {categoryName}
            </p>
          )}
          <h3 className="font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary">
            {name}
          </h3>
          <p className="mt-auto pt-4 text-sm font-semibold text-primary">
            {t("viewDetails")} →
          </p>
        </div>
      </Card>
    </Link>
  );
}
