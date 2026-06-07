import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

const icons = [
  // Güvenilir (kalkan + onay)
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
    <path
      d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Yüksek kalite (madalya)
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
    <circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="m9.2 13.6-1.7 6.9 4.5-2.6 4.5 2.6-1.7-6.9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m10.2 9 1.2 1.2 2.4-2.4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Performans (yükselen grafik)
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
    <path
      d="M3 21h18M7 17v-5m5 5V8m5 9V5m-3 0h3v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Teknik destek (kulaklık)
  <svg key="4" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
    <path
      d="M4 13a8 8 0 1 1 16 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <rect x="3" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="17" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M19 19a3 3 0 0 1-3 3h-2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>,
];

/**
 * Hero'nun altına taşan beyaz şerit — tasarımdaki 4 madde
 * (başlık + kısa açıklama; anasayfadaki şeritten farklı içerik düzeni).
 */
export async function AboutFeatureStrip() {
  const t = await getTranslations("about");
  const items = [1, 2, 3, 4].map((n) => ({
    icon: icons[n - 1],
    title: t(`feature${n}Title` as "feature1Title"),
    text: t(`feature${n}Text` as "feature1Text"),
  }));

  return (
    <div className="relative z-10 -mt-20 lg:-mt-24">
      <Container>
        <div className="grid grid-cols-1 rounded-2xl bg-white py-2 shadow-card-hover sm:grid-cols-2 sm:py-0 lg:grid-cols-4 lg:divide-x lg:divide-brand-50">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-6 lg:py-8"
            >
              <span className="mt-0.5 shrink-0 text-primary [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-9 sm:[&>svg]:w-9">
                {item.icon}
              </span>
              <div>
                <h3 className="text-sm font-bold text-navy sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-600 sm:text-sm">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
