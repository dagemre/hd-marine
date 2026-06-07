"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Header'ın görsel kabuğu. Anasayfada menü hero görselinin ÜSTÜNDE şeffaf
 * durur; sayfa kaydırılınca koyu lacivert şerit belirir. Diğer sayfalarda
 * (açık zeminler) şerit her zaman görünür.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !isHome || scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        solid
          ? "bg-deep-navy/95 backdrop-blur supports-[backdrop-filter]:bg-deep-navy/90"
          : "bg-transparent"
      )}
    >
      {children}
    </header>
  );
}
