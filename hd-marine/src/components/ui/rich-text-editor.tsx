"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Cmd = {
  label: string;
  title: string;
  run: (exec: (c: string, v?: string) => void) => void;
  bold?: boolean;
};

const COMMANDS: Cmd[] = [
  { label: "B", title: "Kalın", bold: true, run: (e) => e("bold") },
  { label: "I", title: "İtalik", run: (e) => e("italic") },
  { label: "Başlık", title: "Ara başlık", run: (e) => e("formatBlock", "H3") },
  { label: "Metin", title: "Normal paragraf", run: (e) => e("formatBlock", "P") },
  { label: "• Liste", title: "Madde işaretli liste", run: (e) => e("insertUnorderedList") },
  { label: "1. Liste", title: "Numaralı liste", run: (e) => e("insertOrderedList") },
  { label: "Biçimi temizle", title: "Seçili metnin biçimini kaldır", run: (e) => e("removeFormat") },
];

/**
 * Yazılımcı olmayan kullanıcılar için basit görsel (WYSIWYG) editör.
 * HTML etiketleri görünmez; çıktı gizli input ile forma gönderilir.
 * Sunucu tarafında ayrıca sanitizeRichHtml ile temizlenir.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Buraya yazın…",
  minHeight = 170,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultValue);

  const sync = () => setHtml(ref.current?.innerHTML ?? "");

  const exec = (command: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, value);
    sync();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-brand-200 focus-within:border-primary">
      <div className="flex flex-wrap gap-1 border-b border-brand-100 bg-brand-50/60 px-2 py-1.5">
        {COMMANDS.map((c) => (
          <button
            key={c.label}
            type="button"
            title={c.title}
            onMouseDown={(e) => {
              e.preventDefault(); // seçimi kaybetme
              c.run(exec);
            }}
            className={cn(
              "rounded-md px-2 py-1 text-xs text-ink-700 transition-colors hover:bg-white hover:text-primary",
              c.bold && "font-bold",
              c.label === "I" && "italic"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={sync}
        onBlur={sync}
        className="rich-text rte-area px-4 py-3 text-sm text-ink-900 focus:outline-none"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
