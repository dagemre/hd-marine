import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd, organizationJsonLd } from "@/lib/seo/jsonld";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={organizationJsonLd()} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
