import { getTranslations } from "next-intl/server";

/**
 * "Konumumuz" sütunu (Context/İletişim.png sol taraf):
 * başlık + kısa metin + Google Haritalar embed'i (API anahtarı gerektirmez).
 * Adres footer sözlüğünden okunur (tek kaynak).
 */
export async function ContactMap() {
  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `HD Marine, ${tFooter("trAddress")}`
  )}&output=embed`;

  return (
    <div className="flex h-full flex-col">
      <h2 className="text-2xl font-extrabold text-deep-navy sm:text-3xl">
        {t("locationTitle")}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600 sm:text-base">
        {t("locationText")}
      </p>

      <div className="mt-6 flex-1 overflow-hidden rounded-2xl border border-brand-100 shadow-sm">
        <iframe
          src={mapSrc}
          title={t("mapTitle")}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-105 w-full border-0 lg:min-h-130"
        />
      </div>
    </div>
  );
}
