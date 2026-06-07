import { cn } from "@/lib/cn";

export type AccordionItem = { title: string; content: React.ReactNode };

/**
 * Erişilebilir, JS gerektirmeyen accordion (native details/summary).
 * SSS blokları ve mobil filtreler için.
 */
export function Accordion({
  items,
  className,
}: {
  items: AccordionItem[];
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-black/5 rounded-xl border border-black/5 bg-white", className)}>
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink-900 transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
            {item.title}
            <svg
              className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <div className="px-5 pb-5 text-ink-600">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
