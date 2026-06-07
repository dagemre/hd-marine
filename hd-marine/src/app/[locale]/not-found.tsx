import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-primary">404</p>
      <h1 className="text-display-sm font-bold">{t("title")}</h1>
      <p className="max-w-md text-ink-600">{t("body")}</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
