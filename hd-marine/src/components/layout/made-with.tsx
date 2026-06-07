"use client";

import { useEffect, useRef } from "react";

/**
 * Footer'daki "Made with ❤ Mre Creative" imzası.
 * Masaüstünde hover ile, mobilde IntersectionObserver (%90 görünürlük)
 * ile `is-beating` class'ı üzerinden kalp atışı animasyonu oynar.
 */
export function MadeWith() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-beating");
            clearTimeout(timer);
            timer = setTimeout(() => el.classList.remove("is-beating"), 2600);
          } else {
            // Görünümden çıkınca sıfırla ki her görünüşte yeniden tetiklensin
            el.classList.remove("is-beating");
            clearTimeout(timer);
          }
        }
      },
      { threshold: 0.9 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <a
      ref={ref}
      href="https://m-re.org/"
      target="_blank"
      rel="noopener"
      className="madewith"
    >
      Made with <span className="heart">❤</span>{" "}
      <span className="madewith__name">Mre Creative</span>
    </a>
  );
}
