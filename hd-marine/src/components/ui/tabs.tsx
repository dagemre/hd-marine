"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { label: string; content: React.ReactNode };

export function Tabs({
  items,
  className,
}: {
  items: TabItem[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex flex-wrap gap-1 border-b border-black/10"
      >
        {items.map((item, i) => (
          <button
            key={i}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            onClick={() => setActive(i)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
              active === i
                ? "border-primary text-primary"
                : "border-transparent text-ink-600 hover:text-ink-900"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className="pt-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
