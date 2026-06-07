"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Header'ın görsel kabuğu. TÜM sayfalarda menü, sayfanın tepe bölümünün
 * ÜSTÜNDE şeffaf durur (içerik (site) layout'taki -mt-18 ile arkasına
 * uzanır); sayfa kaydırılınca koyu lacivert şerit belirir. Beyaz başlayan
 * sayfalar (kategori/ürün detay) header'ın arkasını kendi navy spacer'ıyla
 * doldurur.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled;

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
