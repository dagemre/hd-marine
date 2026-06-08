"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";

export type ActionState = { ok: boolean; message?: string };
export const initialActionState: ActionState = { ok: false };

type ActionFn = (
  prev: ActionState,
  formData: FormData
) => Promise<ActionState>;

/** Sağ üstte beliren, kendiliğinden kaybolan başarı bildirimi. */
function SuccessToast({ state, message }: { state: ActionState; message: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (state.ok) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2800);
      return () => clearTimeout(t);
    }
  }, [state]);

  if (!show) return null;
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg">
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </div>
  );
}

/**
 * Sunucu action'ını useActionState ile sarmalar:
 * başarıda toast gösterir, hatada formun üstünde kırmızı uyarı basar.
 */
export function ActionForm({
  action,
  className,
  children,
  successMessage = "Kaydedildi",
  id,
}: {
  action: ActionFn;
  className?: string;
  children: React.ReactNode;
  successMessage?: string;
  id?: string;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form id={id} action={formAction} className={className}>
      <SuccessToast state={state} message={successMessage} />
      {!state.ok && state.message && (
        <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      )}
      {children}
    </form>
  );
}

/** İşlem sırasında "Kaydediliyor…" gösteren gönder butonu. */
export function SubmitButton({
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
    >
      {pending ? "Kaydediliyor…" : children}
    </Button>
  );
}
