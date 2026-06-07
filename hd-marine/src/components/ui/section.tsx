import { cn } from "@/lib/cn";
import { Container } from "./container";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** surface: açık gri zemin · white: beyaz · navy: koyu lacivert · gradient: hero */
  tone?: "surface" | "white" | "navy" | "gradient";
};

const tones = {
  surface: "bg-surface",
  white: "bg-white",
  navy: "bg-deep-navy text-white",
  gradient: "bg-hero-gradient text-white",
};

export function Section({
  tone = "surface",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(tones[tone], "py-16 lg:py-24", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl lg:mb-14",
        align === "center" && "mx-auto text-center"
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-widest",
            onDark ? "text-brand-300" : "text-primary"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-display-sm font-bold lg:text-display">{title}</h2>
      {subtitle && (
        <p className={cn("mt-4 text-lg", onDark ? "text-brand-100" : "text-ink-600")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
