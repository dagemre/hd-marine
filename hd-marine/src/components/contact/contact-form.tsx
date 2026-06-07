"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  submitContactMessage,
  type ContactFormState,
} from "@/app/[locale]/(site)/iletisim/actions";

/* ---------- Tipler ---------- */

export type ProductOption = {
  /** TR slug — form değeri anahtarı */
  key: string;
  /** Görünen (locale) ad */
  label: string;
  /** DB'ye yazılacak TR ad */
  valueTr: string;
};

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

function SendIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m4 11.5 16-7-5 16-3.5-6L4 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m11.5 14.5 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const initialState: ContactFormState = { status: "idle" };

/**
 * "İletişime Geçin" formu (Context/İletişim.png sağ sütun):
 * isim, e-posta, telefon, ürün bilgisi Evet/Hayır, ürün/kategori
 * select'i (8 ana kategori + Diğer), mesaj, MESAJ GÖNDER.
 * Server action contact_messages'a yazar.
 */
export function ContactForm({ products }: { products: ProductOption[] }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    initialState
  );
  const rootRef = useRef<HTMLDivElement>(null);

  // Başarı/hata durumunda formun başına kaydır
  useEffect(() => {
    if (state.status !== "idle") {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  const err = (field: string): string | undefined => {
    const key = state.fieldErrors?.[field];
    return key ? t(`errors.${key}`) : undefined;
  };

  if (state.status === "success") {
    return (
      <div ref={rootRef} className="scroll-mt-24 py-10 text-center sm:py-16">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="m6 12.5 4 4 8-9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
          {t("newMessage")}
        </Button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <h2 className="text-2xl font-extrabold text-deep-navy sm:text-3xl">
        {t("formTitle")}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600 sm:text-base">
        {t("formIntro")}
      </p>

      <form action={formAction} className="mt-6 space-y-5" noValidate>
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

        <div>
          <Label htmlFor="cf-name">
            {t("nameLabel")}
            <RequiredMark />
          </Label>
          <Input
            id="cf-name"
            name="fullName"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={!!err("fullName")}
          />
          <FieldError message={err("fullName")} />
        </div>

        <div>
          <Label htmlFor="cf-email">
            {t("emailLabel")}
            <RequiredMark />
          </Label>
          <Input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!err("email")}
          />
          <FieldError message={err("email")} />
        </div>

        <div>
          <Label htmlFor="cf-phone">
            {t("phoneLabel")}
            <RequiredMark />
          </Label>
          <Input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            aria-invalid={!!err("phone")}
          />
          <FieldError message={err("phone")} />
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-semibold text-ink-900">
            {t("productInfoLabel")}
            <RequiredMark />
          </legend>
          <div className="mt-1 flex items-center gap-8">
            {(["yes", "no"] as const).map((value) => (
              <label
                key={value}
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink-900"
              >
                <input
                  type="radio"
                  name="productInfo"
                  value={value}
                  className="h-4.5 w-4.5 accent-primary"
                />
                {value === "yes" ? t("productInfoYes") : t("productInfoNo")}
              </label>
            ))}
          </div>
          <FieldError message={err("productInfo")} />
        </fieldset>

        <div>
          <Label htmlFor="cf-product">{t("productSelectLabel")}</Label>
          <div className="relative">
            <Select id="cf-product" name="productInterest" defaultValue="">
              <option value="">{t("productSelectPlaceholder")}</option>
              {products.map((p) => (
                <option key={p.key} value={p.valueTr}>
                  {p.label}
                </option>
              ))}
            </Select>
            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div>
          <Label htmlFor="cf-message">
            {t("messageLabel")}
            <RequiredMark />
          </Label>
          <Textarea
            id="cf-message"
            name="message"
            rows={6}
            placeholder={t("messagePlaceholder")}
            aria-invalid={!!err("message")}
          />
          <FieldError message={err("message")} />
        </div>

        {state.formError ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {t(`errors.${state.formError}`)}
          </p>
        ) : null}

        <div className="pt-1">
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full px-8 uppercase tracking-wide"
          >
            {isPending ? t("submitting") : t("submit")}
            <SendIcon />
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-ink-400">
            {t("privacyNote")}
          </p>
        </div>
      </form>
    </div>
  );
}
