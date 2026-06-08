import Image from "next/image";

/**
 * Anasayfa hero'sundaki gradyen + renk efektinin tek elden uygulanması.
 * Tüm iç sayfa hero'ları (Hakkımızda, Sektörler, İletişim, Teklif Alın)
 * bunu kullanır → görsel dil her sayfada aynı.
 *
 * - Görsel filtresi: brightness(0.55) contrast(1.1) saturate(0.9)
 * - Mobil: üst koyu → alta şeffaflaşan dikey gradyen
 * - sm+: soldan koyu → sağda ürün net (iki katman, 90deg)
 *
 * Sarmalayan <section> `relative isolate overflow-hidden bg-deep-navy` olmalı.
 */
export function HeroBackground({ src }: { src: string }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover [filter:brightness(0.55)_contrast(1.1)_saturate(0.9)]"
      />
      {/* Mobil: dikey gradyen (orta bölge okunaklı, altta görsel net) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,27,70,0.86)_0%,rgba(4,27,70,0.80)_55%,rgba(6,43,107,0.40)_82%,rgba(13,94,255,0.08)_100%)] sm:hidden"
      />
      {/* sm+ Katman 1 — ana lacivert, sağa doğru şeffaflaşır */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(4,27,70,0.80)_0%,rgba(4,27,70,0.42)_50%,rgba(4,27,70,0.06)_100%)] sm:block"
      />
      {/* sm+ Katman 2 — soldan sağa mavi geçiş */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(4,27,70,0.85)_0%,rgba(6,43,107,0.45)_45%,rgba(13,94,255,0.05)_100%)] sm:block"
      />
    </>
  );
}
