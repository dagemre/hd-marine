import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

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
