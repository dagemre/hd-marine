import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SupportCta } from "@/components/contact/support-cta";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { JsonLd, organizationJsonLd } from "@/lib/seo/jsonld";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={organizationJsonLd()} />
      <Header />
      {/* -mt-18: içerik şeffaf header'ın arkasına uzanır (h-18 header)
          overflow-x-clip: mobilde olası birkaç piksellik yatay taşmayı keser
          (sticky'yi bozmaması için hidden değil clip) */}
      <main className="-mt-18 flex-1 overflow-x-clip">{children}</main>
      <SupportCta />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
