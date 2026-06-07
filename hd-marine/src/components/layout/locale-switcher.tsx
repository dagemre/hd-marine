"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * TR/EN değiştirici. Dinamik ürün/kategori sayfalarında slug'lar
 * diller arasında farklıdır; mevcut slug'larla geçiş yapılır ve
 * catch-all çözümleyici canonical yola 308 ile yönlendirir.
 */
export function LocaleSwitcher({
  onDark = true,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.replace(
      // @ts-expect-error — dinamik segment param'ları runtime'da geçerli
      { pathname, params },
      { locale: next }
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg p-0.5",
        onDark ? "bg-white/10" : "bg-brand-50",
        className
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "inline-flex items-center justify-center self-stretch rounded-md px-2.5 py-1 text-xs font-bold uppercase transition-colors",
            l === locale
              ? "bg-primary text-white"
              : onDark
                ? "text-brand-100 hover:text-white"
                : "text-ink-600 hover:text-primary"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
