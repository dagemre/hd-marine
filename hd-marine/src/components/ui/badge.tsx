import { cn } from "@/lib/cn";

type BadgeVariant =
  | "default"
  | "navy"
  | "outline"
  | "success"
  | "warning"
  | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "bg-brand-50 text-primary",
  navy: "bg-navy text-white",
  outline: "border border-brand-200 text-ink-600",
  // Durum rozetleri (admin panel vb.)
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
