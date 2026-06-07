"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Sayfa aşağı kaydırılınca sağ altta beliren "yukarı çık" butonu. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Yukarı çık"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-card-hover transition-all duration-300 hover:bg-primary-hover",
        visible
          ? "visible translate-y-0 opacity-100"
          : "invisible translate-y-3 opacity-0"
      )}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19V5m-6 6 6-6 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
