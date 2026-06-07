import Image from "next/image";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

/**
 * Ortak iç sayfa hero'su (referans: eski sitenin sayfa başlıkları):
 * kurumsal gradient + endüstriyel görsel arka plan, ortalanmış
 * rozet (pill) + büyük H1 + opsiyonel alt metin.
 *
 * Şeffaf header kuralı gereği pt'de h-18 header payı dahildir
 * (bkz. hd-marine yeni sayfa kuralı).
 */
export function PageHero({
  badge,
  title,
  subtitle,
  className,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-hero-gradient text-white",
        className
      )}
    >
      <Image
        src="/hero1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-30 mix-blend-luminosity [mask-image:linear-gradient(to_bottom,black_35%,transparent_96%)]"
      />

      {/* pt: h-18 header payı (içerik şeffaf header'ın arkasına uzanıyor) */}
      <Container className="pt-34 pb-20 text-center lg:pt-42 lg:pb-28">
        {badge && (
          <p className="mx-auto inline-flex items-center rounded-full border border-white/35 px-5 py-1.5 text-sm font-semibold tracking-wide text-brand-100">
            {badge}
          </p>
        )}
        <h1 className="mt-5 text-display font-extrabold sm:text-display-lg lg:text-[4.25rem] lg:leading-[1.06] lg:tracking-[-0.02em]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-brand-100 sm:text-lg">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
