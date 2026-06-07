import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

/**
 * Hero görseli: `public/hero.jpg` mevcutsa tasarımdaki gibi gradient'le
 * harmanlanır; yoksa kurumsal gradient tek başına kullanılır.
 * (Fotoğraf eklendiğinde kod değişikliği gerekmez.)
 */
function heroImageExists(): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "hero.jpg"));
  } catch {
    return false;
  }
}

export async function Hero() {
  const t = await getTranslations("home");
  const hasImage = heroImageExists();

  return (
    /* -mt-18: hero, şeffaf header'ın arkasına uzanır (menü görselin üstünde) */
    <section className="relative isolate -mt-18 overflow-hidden bg-hero-gradient text-white">
      {/* Endüstriyel fotoğraf — kurumsal 135deg gradient'in üzerine harman */}
      {hasImage && (
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover object-right opacity-40 mix-blend-luminosity [mask-image:linear-gradient(105deg,transparent_5%,black_55%)]"
        />
      )}

      <Container className="pt-36 pb-36 lg:pt-44 lg:pb-44">
        <div className="max-w-3xl">
          <h1 className="text-display font-bold lg:text-display-lg">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10">
            <Link
              href="/teklif-alin"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-7 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary-hover"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("heroCta")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
