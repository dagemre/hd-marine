import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

const icons = [
  // Çözüm odaklı (işaretli liste / hedef)
  <svg key="1" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
    <path
      d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-3 7 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
  // Verimlilik (pano + grafik)
  <svg key="2" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 13l2.5-2.5L13 13l3-3.5M8 17h8M8 7h8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Servis güvencesi (beğeni)
  <svg key="3" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
    <path
      d="M7 11v9m0-9 3.8-7.1a1.5 1.5 0 0 1 2.8.7V9h4.9a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 17.3 19l-7.3 1M7 11H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Kalite öncelikli (konuşma + onay)
  <svg key="4" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
    <path
      d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"
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
];

/** Tasarımdaki "Mühendislik Esaslı Çözümler" gradient bandı. */
export async function SolutionsBand() {
  const t = await getTranslations("home");

  const items = [1, 2, 3, 4].map((n, i) => ({
    icon: icons[i],
    title: t(`solution${n}Title` as "solution1Title"),
    text: t(`solution${n}Text` as "solution1Text"),
  }));

  return (
    <section className="relative isolate overflow-hidden bg-hero-gradient py-20 text-white lg:py-28">
      {/* Arka plan görseli — gradient üzerine harman (tasarımdaki gibi) */}
      <Image
        src="/hero2.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-30 mix-blend-luminosity [mask-image:linear-gradient(to_top,black_0%,transparent_70%)]"
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-16">
          {/* Sol blok */}
          <div>
            <h2 className="text-display-sm font-bold lg:text-display">
              {t("solutionsTitle")}
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-brand-100">
              {t("solutionsText")}
            </p>
            <Link
              href="/hakkimizda"
              className="mt-8 inline-flex h-12 items-center rounded-full border border-white/40 px-7 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-navy"
            >
              {t("solutionsCta")}
            </Link>
          </div>

          {/* 4 sütun */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {items.map((item) => (
              <div key={item.title} className="text-center sm:text-left lg:text-center">
                <span className="mx-0 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg sm:mx-0 lg:mx-auto">
                  {item.icon}
                </span>
                <h3 className="mt-5 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100">
                  {item.text}
                </p>
                <Link
                  href="/hakkimizda"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-200 transition-colors hover:text-white"
                >
                  {t("solutionsMore")}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M2 8h11M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
