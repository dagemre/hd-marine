import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { JsonLd, organizationJsonLd } from "@/lib/seo/jsonld";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={organizationJsonLd()} />
      <Header />
      {/* -mt-18: içerik şeffaf header'ın arkasına uzanır (h-18 header) */}
      <main className="-mt-18 flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
