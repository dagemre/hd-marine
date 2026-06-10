import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MadeWith } from "./made-with";

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-footer-title">
      {children}
    </h3>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-footer-bg text-footer-text">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Marka */}
        <div>
          <Link href="/" aria-label="HD Marine — Anasayfa">
            <Image
              src="/logo-hd.png"
              alt="HD Marine"
              width={172}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-5 text-sm leading-relaxed">{t("tagline")}</p>
        </div>

        {/* İletişim */}
        <div>
          <FooterTitle>{t("contactTitle")}</FooterTitle>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`tel:${t("phone").replace(/\s/g, "")}`}
                className="transition-colors hover:text-white"
              >
                {t("phone")}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${t("email")}`}
                className="transition-colors hover:text-white"
              >
                {t("email")}
              </a>
            </li>
            <li>{t("workingHours")}</li>
            <li>
              <a
                href={`https://wa.me/905333085146?text=${encodeURIComponent(
                  "Merhaba, ürünleriniz hakkında bilgi almak istiyorum"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp: +90 533 308 51 46"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Türkiye Ofis */}
        <div>
          <FooterTitle>{t("trOfficeTitle")}</FooterTitle>
          <p className="text-sm leading-relaxed">{t("trAddress")}</p>
        </div>

        {/* Hollanda Ofis */}
        <div>
          <FooterTitle>{t("nlOfficeTitle")}</FooterTitle>
          <p className="text-sm leading-relaxed">{t("nlAddress")}</p>
        </div>
      </div>

      <div className="border-t border-footer-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:px-6 md:flex-row lg:px-8">
          <p>{t("copyright", { year })}</p>
          <MadeWith />
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="/urunler" className="transition-colors hover:text-white">
              {tNav("products")}
            </Link>
            <Link href="/sektorler" className="transition-colors hover:text-white">
              {tNav("sectors")}
            </Link>
            <Link href="/iletisim" className="transition-colors hover:text-white">
              {tNav("contact")}
            </Link>
            <Link
              href="/teklif-alin"
              className="transition-colors hover:text-white"
            >
              {tNav("getQuote")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
