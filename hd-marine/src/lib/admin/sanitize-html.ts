/**
 * Görsel editörden gelen HTML'i güvenli bir alt kümeye indirger.
 * Frontend bu içeriği dangerouslySetInnerHTML ile bastığı için XSS'e karşı
 * sunucu tarafında temizlemek zorunludur.
 *
 * İzin verilen etiketler: p, br, strong, em, ul, ol, li, h3, h4, a (href).
 * <div>, <span>, style, script gibi her şey kaldırılır; div/span gibi
 * sarmalayıcıların iç metni korunur (etiket çıkar, içerik kalır).
 */
const ALLOWED = new Set([
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h3",
  "h4",
  "a",
]);

function safeHref(attrs: string): string {
  const m = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)')/i);
  const raw = m ? (m[2] ?? m[3] ?? "").trim() : "";
  if (!raw) return "";
  if (/^(https?:|mailto:|tel:|\/)/i.test(raw)) {
    const escaped = raw.replace(/"/g, "&quot;");
    return ` href="${escaped}" rel="noopener noreferrer" target="_blank"`;
  }
  return "";
}

export function sanitizeRichHtml(input: string | null | undefined): string | null {
  if (!input) return null;

  let html = input;

  // script/style bloklarını içerikleriyle birlikte sil
  html = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");

  // etiketleri tek tek değerlendir
  html = html.replace(
    /<(\/?)([a-zA-Z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
    (_full, slash: string, rawTag: string, attrs: string) => {
      const tag = rawTag.toLowerCase();
      const close = slash === "/";
      if (!ALLOWED.has(tag)) return ""; // izinsiz etiketi kaldır, içeriği bırak
      if (tag === "br") return "<br>";
      if (tag === "a") return close ? "</a>" : `<a${safeHref(attrs)}>`;
      return close ? `</${tag}>` : `<${tag}>`;
    }
  );

  // b/i eski etiketlerini normalize et (regex sonrası kalmaz ama güvenlik için)
  html = html
    .replace(/<(\/?)b>/gi, "<$1strong>")
    .replace(/<(\/?)i>/gi, "<$1em>");

  // tamamen boş içerik
  const textOnly = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
  if (!textOnly) return null;

  return html.trim();
}

/**
 * Var olan HTML içeriğini editörde göstermeden önce hafifçe temizler.
 * (Aynı sanitizasyon, sunucu/istemci ortak kullanımı için.)
 */
export const richHtmlForEditor = sanitizeRichHtml;
