import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

export type DarkCrumb = {
  label: string;
  /** Verilirse /urunler/[...slug] linki; verilmezse /urunler köküne ya da aktif sayfaya işaret eder */
  slugs?: string[];
  /** true ise /urunler köküne link */
  root?: boolean;
};

const stripIcons = [
  // Yüksek Kalite — kalkan + onay
  <svg key="q" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
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
  // Güvenilir Performans — dişli
  <svg key="p" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>,
  // Geniş Ürün Yelpazesi — kutu
  <svg key="r" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>,
  // Teknik Destek — kulaklık
  <svg key="s" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M4 13a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="3" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <rect x="17" y="13" width="4" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M19 19a3 3 0 0 1-3 3h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
];

function Chevron() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-brand-300" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Ürünler/kategori sayfalarının ortak hero'su (Context/ürünler.png):
 * koyu lacivert zemin + sağda endüstriyel görsel, breadcrumb, sola hizalı
 * büyük başlık + alt metin, altta yarı saydam 4 maddelik özellik şeridi.
 */
export async function ProductsHero({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: DarkCrumb[];
}) {
  const t = await getTranslations("products");
  const tCommon = await getTranslations("common");

  const features = [1, 2, 3, 4].map((i) => ({
    title: t(`feature${i}Title`),
    sub: t(`feature${i}Sub`),
  }));

  return (
    <section className="relative isolate overflow-hidden bg-deep-navy text-white">
      <Image
        src="/hero1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover object-right opacity-40 mix-blend-luminosity [mask-image:linear-gradient(100deg,transparent_32%,black_75%)]"
      />

      {/* pt: h-18 şeffaf header payı dahil */}
      <Container className="pt-28 pb-10 lg:pt-32 lg:pb-12">
        {/* Breadcrumb — koyu zemin renkleri */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="text-brand-200 transition-colors hover:text-white">
                {tCommon("breadcrumbHome")}
              </Link>
            </li>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={i} className="flex items-center gap-1.5">
                  <Chevron />
                  {isLast ? (
                    <span aria-current="page" className="font-semibold text-white">
                      {crumb.label}
                    </span>
                  ) : crumb.root ? (
                    <Link href="/urunler" className="text-brand-200 transition-colors hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : crumb.slugs ? (
                    <Link
                      href={{ pathname: "/urunler/[...slug]", params: { slug: crumb.slugs } }}
                      className="text-brand-200 transition-colors hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-brand-200">{crumb.label}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <h1 className="mt-7 max-w-3xl text-display font-extrabold uppercase leading-[1.08] tracking-[-0.01em] sm:text-display-lg lg:text-[3.6rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-brand-100 sm:text-lg">
            {subtitle}
          </p>
        )}

        {/* Özellik şeridi — yarı saydam panel */}
        <div className="mt-10 grid grid-cols-1 rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-sm sm:grid-cols-2 sm:divide-x sm:divide-white/10 lg:mt-12 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={feature.title} className="flex items-center gap-3.5 px-5 py-4 lg:px-6 lg:py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white">
                {stripIcons[i]}
              </span>
              <div>
                <p className="text-sm font-bold">{feature.title}</p>
                <p className="mt-0.5 text-xs text-brand-200">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
