import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "../globals.css";

/**
 * /admin root layout — [locale] ağacından bağımsız ikinci kök.
 * Admin arayüzü yalnızca Türkçedir; i18n routing'e girmez.
 */
export const metadata: Metadata = {
  title: {
    default: "HD Marine Yönetim",
    template: "%s | HD Marine Yönetim",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="bg-surface">{children}</body>
    </html>
  );
}
