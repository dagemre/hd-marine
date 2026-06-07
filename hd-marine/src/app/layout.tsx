import type { Metadata } from "next";
import "./globals.css";

// NOT: Kurumsal font Faz 2'de (tasarım sistemi) next/font/local ile
// self-hosted eklenecek. Şimdilik sistem font yığını kullanılıyor.

export const metadata: Metadata = {
  title: {
    default: "HD Marine – Endüstriyel Ürünler",
    template: "%s | HD Marine",
  },
  description:
    "Endüstriyel tesislerde çözüm ortağınız. Endüstriyel pompalar, sızdırmazlık elemanları, boru tamir ekipmanları ve daha fazlası.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
