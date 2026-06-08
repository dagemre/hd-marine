import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { sectorIcons } from "./sector-icons";

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
    // Sayfa zemini zaten "surface" (body). Kart, masaüstünde SABİT yükseklikli
    // (h-[200px]) ve negatif margin'i tam yarısı kadardır (-mt-[100px]) →
    // yarısı hero görselinin üstünde, yarısı alttaki açık zeminde durur.
    <div className="relative z-10">
      <Container>
        <div className="-mt-12 flex items-center rounded-2xl bg-white px-4 py-5 shadow-card-hover sm:-mt-14 sm:px-6 lg:-mt-[60px] lg:h-[150px] lg:px-8 lg:py-0">
          <div className="grid w-full grid-cols-3 gap-y-6 sm:grid-cols-4 sm:gap-y-8 lg:grid-cols-8 lg:gap-x-2">
            {KEYS.map((key) => (
              <div
                key={key}
                className={
                  // Mobilde 3'lü dizilim; 8. öğe (Tekstil) mobilde gizli
                  "flex flex-col items-center px-1 text-center" +
                  (key === "tekstil" ? " hidden sm:flex" : "")
                }
              >
                <span className="text-primary [&>svg]:h-8 [&>svg]:w-8 sm:[&>svg]:h-9 sm:[&>svg]:w-9">
                  {sectorIcons[key]}
                </span>
                <p className="mt-3 text-xs font-bold leading-snug text-navy sm:text-sm">
                  {t(key)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
