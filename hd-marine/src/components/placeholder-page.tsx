import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";

/**
 * Tasarımı ayrı chat'te yapılacak sayfalar için geçici içerik.
 * Route, başlık ve SEO iskeleti hazır; görsel katman sonra gelir.
 */
export async function PlaceholderPage({ title }: { title: string }) {
  const t = await getTranslations("placeholder");

  return (
    <>
      <Section tone="gradient" className="py-20 lg:py-28">
        <h1 className="text-display-sm font-bold lg:text-display-lg">{title}</h1>
      </Section>
      <Section tone="surface">
        <div className="mx-auto max-w-xl rounded-xl border border-dashed border-brand-300 bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-ink-900">{t("title")}</h2>
          <p className="mt-2 text-ink-600">{t("body")}</p>
        </div>
      </Section>
    </>
  );
}
