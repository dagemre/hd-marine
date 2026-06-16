import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import {
  getCategoryTree,
  categorySubtreeIds,
  catT,
} from "@/lib/data/categories";
import { getRepresentativeImages } from "@/lib/data/products";
import { productImageUrl } from "@/lib/storage";

/** Tek ürün-grubu kartı (tasarımdaki dikey kart). */
function GroupCard({
  name,
  slug,
  imagePath,
}: {
  name: string;
  slug: string;
  imagePath: string | null;
}) {
  return (
    <Link
      href={{ pathname: "/urunler/[...slug]", params: { slug: [slug] } }}
      className="group mr-5 flex w-60 shrink-0 flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover sm:w-64"
    >
      <div className="flex h-40 items-center justify-center">
        {imagePath ? (
          <Image
            src={productImageUrl(imagePath)}
            alt={name}
            width={240}
            height={180}
            className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-primary">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <h3 className="mt-5 min-h-[3em] text-lg font-bold leading-snug text-ink-900 transition-colors group-hover:text-primary">
        {name}
      </h3>
      <span
        aria-hidden
        className="mt-4 flex h-8 w-8 items-center justify-center rounded-full text-primary transition-transform group-hover:translate-x-1"
      >
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8h11M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

/**
 * "ÜRÜNLERİMİZ" bölümü (Emre'nin tasarımı): solda sabit başlık bloğu + buton,
 * sağda ana ürün gruplarının soldan sağa SÜREKLİ akan şeridi (hover'da durur).
 */
export async function CategoryCarousel() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tree = await getCategoryTree();
  const repImages = await getRepresentativeImages(
    tree.roots.flatMap((n) => categorySubtreeIds(n))
  );

  const cards = tree.roots.map((node) => {
    const tr = catT(node, locale);
    // Temsilci görsel: kategori alt ağacındaki ilk ürün görseli; yoksa kendi image_path
    let repPath: string | null = null;
    for (const id of categorySubtreeIds(node)) {
      const img = repImages.get(id);
      if (img) {
        repPath = img.storagePath;
        break;
      }
    }
    return {
      id: node.id,
      name: tr.name,
      slug: tr.slug,
      imagePath: repPath ?? node.imagePath,
    };
  });

  return (
    <section className="bg-surface pt-8 pb-20 lg:pt-10 lg:pb-28">
      <Container className="lg:flex lg:items-stretch lg:gap-10">
        {/* Sol başlık bloğu */}
        <div className="shrink-0 lg:w-[360px]">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {t("categoriesEyebrow")}
          </p>
          <h2 className="text-display-sm font-bold text-ink-900 lg:text-display">
            {t("categoriesTitle")}
          </h2>
          <p className="mt-4 max-w-md text-base text-ink-600 lg:text-lg">
            {t("categoriesSubtitle")}
          </p>
          <Link
            href="/urunler"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-brand-200 bg-white px-7 text-sm font-bold uppercase tracking-wide text-navy transition-colors hover:border-primary hover:text-primary"
          >
            {t("allProductsCta")}
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
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

        {/* Sağda sürekli akan kart şeridi */}
        {cards.length === 0 ? (
          <p className="mt-10 text-ink-400">{tCommon("loadError")}</p>
        ) : (
          <div className="marquee-viewport mt-10 min-w-0 flex-1 overflow-hidden lg:mt-0">
            <div className="marquee-track flex w-max py-2">
              {[...cards, ...cards].map((c, i) => (
                <GroupCard
                  key={`${c.id}-${i}`}
                  name={c.name}
                  slug={c.slug}
                  imagePath={c.imagePath}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
