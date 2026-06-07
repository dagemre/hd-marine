import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCategoryTree, catT } from "@/lib/data/categories";
import { HeaderShell } from "./header-shell";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import type { NavItem, NavCategory } from "./nav-types";

export async function Header() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("nav");
  const tree = await getCategoryTree();

  const categories: NavCategory[] = tree.roots.map((node) => {
    const tr = catT(node, locale);
    return { name: tr.name, slug: tr.slug };
  });

  const items: NavItem[] = [
    { label: t("home"), pathname: "/" },
    { label: t("about"), pathname: "/hakkimizda" },
    { label: t("products"), pathname: "/urunler" },
    { label: t("sectors"), pathname: "/sektorler" },
    { label: t("catalogs"), pathname: "/kataloglar" },
    { label: t("contact"), pathname: "/iletisim" },
  ];

  return (
    <HeaderShell>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="HD Marine — Anasayfa">
          <Image
            src="/logo-hd.png"
            alt="HD Marine"
            width={207}
            height={48}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Masaüstü nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            item.pathname === "/urunler" ? (
              <div key={item.pathname} className="group relative">
                <Link
                  href="/urunler"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-100 transition-colors hover:text-white"
                >
                  {item.label}
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:rotate-180"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                {categories.length > 0 && (
                  <div className="invisible absolute left-0 top-full z-50 w-72 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-black/5 bg-white py-2 shadow-card-hover">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={{
                            pathname: "/urunler/[...slug]",
                            params: { slug: [cat.slug] },
                          }}
                          className="block px-4 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-brand-50 hover:text-primary"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.pathname}
                href={item.pathname}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-brand-100 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          <Link
            href="/teklif-alin"
            className="inline-flex h-10 items-center rounded-full bg-primary px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-hover"
          >
            {t("getQuote")}
          </Link>
        </div>

        {/* Mobil: TR/EN değiştirici hamburger'in yanında */}
        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher className="h-10" />
          <MobileMenu items={items} categories={categories} />
        </div>
      </div>
    </HeaderShell>
  );
}
