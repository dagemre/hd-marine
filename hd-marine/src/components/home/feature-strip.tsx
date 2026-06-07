import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

const icons = [
  // Mühendislik (dişli/teknik)
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
    <path
      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
  // Verimlilik (yükselen grafik)
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
    <path
      d="M3 21h18M7 17v-5m5 5V8m5 9V5m-3 0h3v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Kalite ve güven (kalkan + onay)
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-9 w-9">
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

/** Hero'nun alt kenarına taşan beyaz özellik şeridi (tasarımdaki 4 madde). */
export async function FeatureStrip() {
  const t = await getTranslations("home");
  const labels = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <div className="relative z-10 -mt-20 lg:-mt-24">
      <Container>
        <div className="grid grid-cols-2 rounded-2xl bg-white py-2 shadow-card-hover sm:py-0 lg:grid-cols-4 lg:divide-x lg:divide-brand-50">
          {labels.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-6 lg:py-8"
            >
              <span className="shrink-0 text-primary [&>svg]:h-7 [&>svg]:w-7 sm:[&>svg]:h-9 sm:[&>svg]:w-9">
                {icons[i]}
              </span>
              <p className="text-xs font-bold leading-snug text-navy sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
