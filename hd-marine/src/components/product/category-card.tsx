import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { productImageUrl } from "@/lib/storage";

export function CategoryCard({
  name,
  slugs,
  imagePath,
  productCountLabel,
}: {
  name: string;
  slugs: string[];
  imagePath: string | null;
  productCountLabel?: string;
}) {
  return (
    <Link
      href={{ pathname: "/urunler/[...slug]", params: { slug: slugs } }}
      className="group block"
    >
      <Card className="h-full overflow-hidden">
        <div className="flex aspect-[4/3] items-center justify-center bg-surface p-3">
          {imagePath ? (
            <Image
              src={productImageUrl(imagePath)}
              alt={name}
              width={320}
              height={240}
              className="max-h-full max-w-full w-auto object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-primary"
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-5">
          <div>
            <h3 className="font-bold text-ink-900 transition-colors group-hover:text-primary">
              {name}
            </h3>
            {productCountLabel && (
              <p className="mt-0.5 text-sm text-ink-400">{productCountLabel}</p>
            )}
          </div>
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Card>
    </Link>
  );
}
