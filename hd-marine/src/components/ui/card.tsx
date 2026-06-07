import { cn } from "@/lib/cn";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-black/5 bg-white shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: DivProps) {
  return <div className={cn("p-5", className)} {...props} />;
}
