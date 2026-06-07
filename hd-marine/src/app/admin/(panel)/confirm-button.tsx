"use client";

/**
 * Form submit'inden önce onay isteyen buton (silme işlemleri için).
 * `form` prop'u ile başka bir formu da tetikleyebilir (iç içe form yasağına çözüm).
 */
export function ConfirmButton({
  message,
  className,
  form,
  children,
}: {
  message: string;
  className?: string;
  form?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      form={form}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
