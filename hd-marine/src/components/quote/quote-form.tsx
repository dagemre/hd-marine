"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  submitQuoteRequest,
  type QuoteFormState,
} from "@/app/[locale]/(site)/teklif-alin/actions";

/* ---------- Tipler ---------- */

export type GroupOption = {
  /** TR slug — ikon eşlemesi ve form değeri için anahtar */
  key: string;
  /** Görünen (locale) ad */
  label: string;
  /** DB'ye yazılacak TR ad */
  valueTr: string;
};

export type SectorOption = {
  /** TR slug (sector_slug kolonu + ?sektor= parametresi) */
  slug: string;
  label: string;
};

/* ---------- Ürün grubu ikonları (TR slug → ikon) ---------- */

function GroupIcon({ slug }: { slug: string }) {
  const cls = "h-5 w-5";
  switch (slug) {
    case "yaglama-cihazlari": // damla
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3.5s6 6.6 6 11a6 6 0 1 1-12 0c0-4.4 6-11 6-11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9.2 14.5a3 3 0 0 0 2.4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "endustriyel-pompalar": // pervane/pompa
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 10a5 5 0 0 0-1.5-3.6M14 12c1.5 0 2.9-.5 3.6-1.5M10 12c-1.5 0-2.9.5-3.6 1.5M12 14a5 5 0 0 1 1.5 3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "sizdirmazlik-elemanlari": // conta/halka
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "endustriyel-kimyasallar": // erlen
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M10 3.5h4M10.8 3.5v5l-5.1 8.6A2 2 0 0 0 7.4 20h9.2a2 2 0 0 0 1.7-2.9l-5.1-8.6v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.2 14.5h7.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "termal-etiket": // etiket
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 4h7l9 9-7 7-9-9V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="1.4" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );
    case "otomatik-boya-ekipmanlari": // sprey
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="8" y="8.5" width="8" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 8.5v-2h3v2M12 3v1.5M16.5 4.5l-1 1M7.5 4.5l1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "boru-tamir-ekipmanlari": // anahtar
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M14.5 6.5a4 4 0 0 0-5.2 5.2L4 17l3 3 5.3-5.3a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.5-.6-.6-2.5 2.7-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "diyaframli-pompa-yedek-parcalari": // dişli
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 4v2.2M12 17.8V20M20 12h-2.2M6.2 12H4m13.2-5.2-1.6 1.6M8.4 15.6l-1.6 1.6m10.4 0-1.6-1.6M8.4 8.4 6.8 6.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default: // diğer — üç nokta
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8.3" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="15.7" cy="12" r="1" fill="currentColor" />
        </svg>
      );
  }
}

/* ---------- Yardımcılar ---------- */

function RequiredMark() {
  return (
    <span className="ml-0.5 text-red-500" aria-hidden>
      *
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

const initialState: QuoteFormState = { status: "idle" };

/**
 * Teklif Talep Formu (tasarıma sadık):
 * isim/e-posta, telefon/şirket, sektör select (?sektor ön-seçimli),
 * ürün grubu çipleri (8 ana kategori + Diğer, çoklu seçim),
 * detay textarea, tahmini ihtiyaç + teslimat yeri, Gönder + gizlilik notu.
 */
export function QuoteForm({
  groups,
  sectors,
  initialSector,
}: {
  groups: GroupOption[];
  sectors: SectorOption[];
  initialSector?: string;
}) {
  const t = useTranslations("quote");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitQuoteRequest,
    initialState
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const cardRef = useRef<HTMLDivElement>(null);

  // Başarı/hata durumunda kartın başına kaydır
  useEffect(() => {
    if (state.status !== "idle") {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  const toggleGroup = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const err = (field: string): string | undefined => {
    const key = state.fieldErrors?.[field];
    return key ? t(`errors.${key}`) : undefined;
  };

  return (
    <div
      ref={cardRef}
      className="scroll-mt-24 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
    >
      {state.status === "success" ? (
        /* ---------- Başarı durumu ---------- */
        <div className="py-10 text-center sm:py-16">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m6 12.5 4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="mt-6 text-2xl font-extrabold text-deep-navy">
            {t("successTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600">
            {t("successText")}
          </p>
          <Button
            type="button"
            className="mt-8 rounded-full"
            onClick={() => window.location.reload()}
          >
            {t("newRequest")}
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-extrabold text-deep-navy sm:text-2xl">
            {t("formTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
            {t("formIntro")}
          </p>

          <form action={formAction} className="mt-8" noValidate>
            {/* Honeypot — gerçek kullanıcılar görmez */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <input type="hidden" name="locale" value={locale} />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="qf-name">
                  {t("nameLabel")}
                  <RequiredMark />
                </Label>
                <Input
                  id="qf-name"
                  name="fullName"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  aria-invalid={!!err("fullName")}
                />
                <FieldError message={err("fullName")} />
              </div>
              <div>
                <Label htmlFor="qf-email">
                  {t("emailLabel")}
                  <RequiredMark />
                </Label>
                <Input
                  id="qf-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  aria-invalid={!!err("email")}
                />
                <FieldError message={err("email")} />
              </div>
              <div>
                <Label htmlFor="qf-phone">
                  {t("phoneLabel")}
                  <RequiredMark />
                </Label>
                <Input
                  id="qf-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder={t("phonePlaceholder")}
                  aria-invalid={!!err("phone")}
                />
                <FieldError message={err("phone")} />
              </div>
              <div>
                <Label htmlFor="qf-company">{t("companyLabel")}</Label>
                <Input
                  id="qf-company"
                  name="company"
                  autoComplete="organization"
                  placeholder={t("companyPlaceholder")}
                />
              </div>
              <div>
                <Label htmlFor="qf-sector">{t("sectorLabel")}</Label>
                <div className="relative">
                  <Select
                    id="qf-sector"
                    name="sectorSlug"
                    defaultValue={initialSector ?? ""}
                  >
                    <option value="">{t("sectorPlaceholder")}</option>
                    {sectors.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            {/* Ürün grubu çipleri */}
            <fieldset className="mt-7">
              <legend className="mb-1.5 block text-sm font-semibold text-ink-900">
                {t("productGroupLabel")}
                <RequiredMark />
              </legend>
              <div className="mt-1.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((g) => {
                  const active = selected.has(g.key);
                  return (
                    <button
                      key={g.key}
                      type="button"
                      role="checkbox"
                      aria-checked={active}
                      onClick={() => toggleGroup(g.key)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                        active
                          ? "border-primary bg-brand-50 text-primary"
                          : "border-brand-200 bg-white text-ink-900 hover:border-primary/60 hover:text-primary"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0",
                          active ? "text-primary" : "text-brand-400"
                        )}
                      >
                        <GroupIcon slug={g.key} />
                      </span>
                      {g.label}
                    </button>
                  );
                })}
              </div>
              {groups
                .filter((g) => selected.has(g.key))
                .map((g) => (
                  <input
                    key={g.key}
                    type="hidden"
                    name="productGroups"
                    value={g.valueTr}
                  />
                ))}
              <FieldError message={err("productGroups")} />
            </fieldset>

            {/* Detaylar */}
            <div className="mt-7">
              <Label htmlFor="qf-message">
                {t("detailsLabel")}
                <RequiredMark />
              </Label>
              <Textarea
                id="qf-message"
                name="message"
                rows={5}
                placeholder={t("detailsPlaceholder")}
                aria-invalid={!!err("message")}
              />
              <FieldError message={err("message")} />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="qf-need">
                  {t("needLabel")}
                  <RequiredMark />
                </Label>
                <div className="relative">
                  <Select
                    id="qf-need"
                    name="estimatedNeed"
                    defaultValue=""
                    aria-invalid={!!err("estimatedNeed")}
                  >
                    <option value="" disabled>
                      {t("needPlaceholder")}
                    </option>
                    {([1, 2, 3, 4] as const).map((no) => (
                      <option key={no} value={t(`needOption${no}`)}>
                        {t(`needOption${no}`)}
                      </option>
                    ))}
                  </Select>
                  <SelectChevron />
                </div>
                <FieldError message={err("estimatedNeed")} />
              </div>
              <div>
                <Label htmlFor="qf-delivery">{t("deliveryLabel")}</Label>
                <Input
                  id="qf-delivery"
                  name="deliveryLocation"
                  placeholder={t("deliveryPlaceholder")}
                />
              </div>
            </div>

            {state.formError && (
              <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {t(`errors.${state.formError}`)}
              </p>
            )}

            {/* Gönder */}
            <div className="mt-8 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full gap-2.5 sm:w-auto sm:min-w-56"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 3 3 10.5l7 3m11-10.5L13.5 21l-3-7.5M21 3 10.5 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isPending ? t("submitting") : t("submit")}
              </Button>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-400">
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {t("privacyNote")}
            </p>
          </form>
        </>
      )}
    </div>
  );
}

/** Select sağındaki ok (appearance-none olduğundan elle çizilir) */
function SelectChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
