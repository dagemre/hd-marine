import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

/* Mavi çizgi ikonlar (primary renk currentColor ile) */
const icons: Record<string, React.ReactNode> = {
  // Kimya — erlen / deney şişesi
  kimya: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M13 4h6M14 4v8L7 25a2 2 0 0 0 1.8 3h14.4A2 2 0 0 0 25 25l-7-13V4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10.5 19h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  // Enerji — şimşek
  enerji: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M18 3 7 18h7l-2 11 11-15h-7l2-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  // Gıda & İçecek — bardak / pipet
  gida: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M8 9h13l-1.4 16.2A2 2 0 0 1 17.6 27h-6.2a2 2 0 0 1-2-1.8L8 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.6 14h11.8M19 9l3-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  // İlaç — kapsül
  ilac: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="4.5" y="11.5" width="23" height="9" rx="4.5" transform="rotate(-45 4.5 11.5)" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12 12 8 8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  // Denizcilik — çapa
  denizcilik: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 9.4V27M9 16H7c0 5 4 9 9 9s9-4 9-9h-2M11 14l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Kağıt — belge
  kagit: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M8 4h11l5 5v19H8V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 4v5h5M12 15h8M12 19h8M12 23h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  // Otomotiv — araba
  otomotiv: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M5 20v-3l3-7a2 2 0 0 1 1.9-1.3h12.2A2 2 0 0 1 24 10l3 7v3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 20h22v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H9v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  // Tekstil — iplik makarası / iğne
  tekstil: (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="11" cy="11" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="m15 15 12 12M24 23l3 4-4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const KEYS = [
  "kimya",
  "enerji",
  "gida",
  "ilac",
  "denizcilik",
  "kagit",
  "otomotiv",
  "tekstil",
] as const;

/**
 * Hero'nun altına taşan beyaz sektör şeridi (Emre'nin 8 Haz tasarımı):
 * 8 sektör, mavi çizgi ikon + 2 satır etiket. Bilgilendirme amaçlı,
 * tıklanabilir değil.
 */
export async function SectorStrip() {
  const t = await getTranslations("industries");

  return (
    // Arka plan (surface) hero sınırından BAŞLAR; kart negatif margin ile
    // bu sınırın ÜZERİNE, hero görselinin üstüne taşar.
    <div className="relative z-10 bg-surface pb-2">
      <Container>
        <div className="-mt-20 grid grid-cols-2 gap-y-8 rounded-2xl bg-white px-4 py-8 shadow-card-hover sm:-mt-24 sm:grid-cols-4 sm:px-6 lg:-mt-28 lg:grid-cols-8 lg:gap-x-2 lg:px-8 lg:py-10">
          {KEYS.map((key) => (
            <div
              key={key}
              className="flex flex-col items-center px-1 text-center"
            >
              <span className="text-primary [&>svg]:h-9 [&>svg]:w-9">
                {icons[key]}
              </span>
              <p className="mt-3 text-xs font-bold leading-snug text-navy sm:text-sm">
                {t(key)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
