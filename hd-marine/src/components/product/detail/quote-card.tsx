"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { submitProductQuote, type ProductQuoteState } from "./quote-action";

export type QuoteGroupOption = { value: string; label: string };

const initialState: ProductQuoteState = { status: "idle" };

function Star() {
  return (
    <span className="text-red-500" aria-hidden>
      {" "}
      *
    </span>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="m21 3-9.5 9.5M21 3l-6.5 18-3-7.5L4 10.5 21 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tasarımdaki sağ sütun: "Fiyat Teklifi Alın" form kartı */
export function QuoteCard({
  productId,
  groups,
  defaultGroup,
  /** Aynı sayfada birden çok örnek olduğunda id çakışmasını önler */
  idPrefix = "pq",
}: {
  productId: string;
  groups: QuoteGroupOption[];
  defaultGroup?: string;
  idPrefix?: string;
}) {
  const t = useTranslations("product");
  const locale = useLocale();
  const fid = (name: string) => `${idPrefix}-${name}`;
  const [state, formAction, pending] = useActionState(
    submitProductQuote,
    initialState
  );

  const fieldError = (name: string) => {
    const key = state.fieldErrors?.[name];
    return key ? (
      <p className="mt-1 text-xs text-red-600">{t(key)}</p>
    ) : null;
  };

  return (
    <aside className="h-fit rounded-2xl border border-black/5 bg-white p-6 shadow-card lg:sticky lg:top-24 lg:p-7">
      <h2 className="text-xl font-bold text-navy">{t("requestQuote")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        {t("quoteIntro")}
      </p>

      {state.status === "success" ? (
        <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="m5 13 4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="mt-3 font-bold text-emerald-800">
            {t("formSuccessTitle")}
          </p>
          <p className="mt-1 text-sm text-emerald-700">{t("formSuccessText")}</p>
        </div>
      ) : (
        <form action={formAction} className="mt-5 space-y-4" noValidate>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="locale" value={locale} />
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />

          <div>
            <Label htmlFor={fid("name")}>
              {t("formName")}
              <Star />
            </Label>
            <Input
              id={fid("name")}
              name="fullName"
              autoComplete="name"
              placeholder={t("formNamePlaceholder")}
            />
            {fieldError("fullName")}
          </div>

          <div>
            <Label htmlFor={fid("email")}>
              {t("formEmail")}
              <Star />
            </Label>
            <Input
              id={fid("email")}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("formEmailPlaceholder")}
            />
            {fieldError("email")}
          </div>

          <div>
            <Label htmlFor={fid("phone")}>
              {t("formPhone")}
              <Star />
            </Label>
            <Input
              id={fid("phone")}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t("formPhonePlaceholder")}
            />
            {fieldError("phone")}
          </div>

          <div>
            <Label htmlFor={fid("group")}>
              {t("formGroup")}
              <Star />
            </Label>
            <div className="relative">
              <Select
                id={fid("group")}
                name="productGroup"
                defaultValue={defaultGroup ?? ""}
                className="pr-10"
              >
                <option value="" disabled>
                  {t("formGroupSelect")}
                </option>
                {groups.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </Select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {fieldError("productGroup")}
          </div>

          <div>
            <Label htmlFor={fid("message")}>{t("formMessage")}</Label>
            <Textarea
              id={fid("message")}
              name="message"
              rows={4}
              placeholder={t("formMessagePlaceholder")}
            />
          </div>

          {state.formError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {t("errorGeneric")}
            </p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            <SendIcon />
            {t("send")}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-400">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5 shrink-0">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 8h.01M12 11v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {t("responseNote")}
          </p>
        </form>
      )}
    </aside>
  );
}
