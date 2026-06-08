import { HeroBackground } from "@/components/ui/hero-background";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";

/* Tasarımdaki hero içi 4 madde — yuvarlak çerçeveli ince ikonlar */
const icons = [
  // Yüksek kalite (madalya)
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
  // Güvenilir çözümler (kalkan + onay)
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
  // Sektöre özel (hedef)
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="4.75" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </svg>,
  // Uzman destek (kulaklık)
  <svg key="4" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
 * Sektörler sayfa başlığı (tasarımdaki navy hero):
 * "HD MARINE" rozeti + H1 + alt metin + hero İÇİNDE 4 özellik maddesi.
 * Arka plan: kurumsal gradient + hero.jpg (sağdan görünür, luminosity harman).
 */
export async function SectorsHero() {
  const t = await getTranslations("sectors");

  const items = [1, 2, 3, 4].map((n, i) => ({
    icon: icons[i],
    title: t(`feature${n}Title` as "feature1Title"),
    text: t(`feature${n}Text` as "feature1Text"),
  }));

  return (
    <section className="relative isolate overflow-hidden bg-deep-navy text-white">
      <HeroBackground src="/hero.jpg" />

      {/* pt: h-18 header payı (içerik şeffaf header'ın arkasına uzanıyor) */}
      <Container className="pt-30 pb-14 lg:pt-34 lg:pb-16">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest ring-1 ring-white/25">
          {t("badge")}
        </span>

        <h1 className="mt-6 text-display font-extrabold sm:text-display-lg lg:text-[4.25rem] lg:leading-[1.06] lg:tracking-[-0.02em]">
          {t("heroTitle")}
        </h1>
        <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-100 sm:text-lg">
          {t("heroSubtitle")}
        </p>

        {/* Hero içi 4 özellik maddesi (tasarımdaki koyu zemin şeridi) */}
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-white/15 pt-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30">
                {item.icon}
              </span>
              <div>
                <h2 className="text-sm font-bold sm:text-base">{item.title}</h2>
                <p className="mt-0.5 text-xs leading-relaxed text-brand-200 sm:text-sm">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
