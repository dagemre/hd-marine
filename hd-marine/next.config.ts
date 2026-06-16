import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin panel görsel yüklemeleri (varsayılan 1 MB yetmez)
      bodySizeLimit: "8mb",
    },
  },
  images: {
    // Vercel görsel optimizasyonu KAPALI: Hobby planının optimizasyon kotası
    // dolunca /_next/image 402 döndürüp görselleri kırıyordu. Görseller
    // doğrudan Supabase Storage'dan servis edilir (kotasız, dosyalar zaten
    // web boyutunda). CPU/önbreklemeyi etkilemez.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Local test/mock ortamı (sandbox doğrulama testleri)
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
