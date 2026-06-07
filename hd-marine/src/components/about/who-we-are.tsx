import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

/**
 * "HD MARINE KİMDİR?" bölümü: solda liman fotoğrafı + yüzen "Uzman Kadro"
 * kartı, sağda tanıtım metni ve iletişim CTA'sı.
 */
export async function WhoWeAre() {
  const t = await getTranslations("about");

  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Fotoğraf + yüzen kart */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[5/6]">
              <Image
                src="/hero2.jpg"
                alt="HD Marine — endüstriyel liman"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-4 flex max-w-xs items-start gap-3.5 rounded-xl bg-primary p-5 text-white shadow-card-hover sm:left-0 sm:-translate-x-4 lg:-translate-x-8 lg:p-6">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                {/* Ekip */}
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3.5 19c.6-2.9 2.9-4.5 5.5-4.5s4.9 1.6 5.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15.5 5.3a3 3 0 1 1 .9 5.9M17.5 14.7c1.7.5 2.7 1.7 3 4.3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <h3 className="font-bold">{t("expertCardTitle")}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-100">
                  {t("expertCardText")}
                </p>
              </div>
            </div>
          </div>

          {/* Metin bloğu */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t("whoEyebrow")}
            </p>
            <h2 className="mt-3 text-display-sm font-bold text-navy lg:text-display">
              {t("whoTitle")}
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-ink-600">
              <p>{t("whoP1")}</p>
              <p>{t("whoP2")}</p>
              <p>{t("whoP3")}</p>
            </div>
            <Link
              href="/iletisim"
              className="mt-9 inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-7 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary-hover"
            >
              {t("whoCta")}
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
