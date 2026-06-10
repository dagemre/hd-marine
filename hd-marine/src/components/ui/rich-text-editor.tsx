"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Cmd = {
  label: string;
  title: string;
  command: string;
  value?: string;
  bold?: boolean;
  italic?: boolean;
};

const COMMANDS: Cmd[] = [
  { label: "B", title: "Kalın", command: "bold", bold: true },
  { label: "I", title: "İtalik", command: "italic", italic: true },
  { label: "Başlık", title: "Ara başlık", command: "formatBlock", value: "H3" },
  { label: "Metin", title: "Normal paragraf", command: "formatBlock", value: "P" },
  { label: "• Liste", title: "Madde işaretli liste", command: "insertUnorderedList" },
  { label: "1. Liste", title: "Numaralı liste", command: "insertOrderedList" },
  { label: "Biçimi temizle", title: "Seçili metnin biçimini kaldır", command: "removeFormat" },
];

/**
 * Yazılımcı olmayan kullanıcılar için basit görsel (WYSIWYG) editör.
 *
 * KONTROLSÜZ (uncontrolled) tasarım: içerik bir kez ref ile yüklenir, her
 * tuş vuruşunda React state güncellenmez. Böylece React contentEditable'ın
 * çocuklarını yeniden yazıp yazılanı silmez (eski "controlled + dangerouslySet
 * InnerHTML" deseni boş alanlarda yazmayı engelliyordu). Değer, gizli input'a
 * yazılır ve form gönderiminde sunucuda sanitizeRichHtml ile temizlenir.
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
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Başlangıç içeriğini bir kez (mount) yükle.
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = defaultValue;
    if (inputRef.current) inputRef.current.value = defaultValue;
    // defaultValue kasıtlı olarak bağımlılık değil: yalnızca ilk yüklemede.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = () => {
    if (inputRef.current && editorRef.current) {
      inputRef.current.value = editorRef.current.innerHTML;
    }
  };

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
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
              e.preventDefault(); // seçimi/odak kaybını önle
              exec(c.command, c.value);
            }}
            className={cn(
              "rounded-md px-2 py-1 text-xs text-ink-700 transition-colors hover:bg-white hover:text-primary",
              c.bold && "font-bold",
              c.italic && "italic"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={sync}
        onBlur={sync}
        className="rich-text rte-area px-4 py-3 text-sm text-ink-900 focus:outline-none"
        style={{ minHeight }}
      />
      <input ref={inputRef} type="hidden" name={name} defaultValue={defaultValue} />
    </div>
  );
}
