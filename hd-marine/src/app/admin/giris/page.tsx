import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Giriş" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo-hd.png"
            alt="HD Marine"
            width={180}
            height={48}
            priority
            className="h-12 w-auto"
          />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-1 text-xl font-bold text-navy">Yönetim Paneli</h1>
          <p className="mb-6 text-sm text-ink-600">
            Devam etmek için giriş yapın.
          </p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-footer-text">
          Hesabınız yoksa site yöneticisiyle iletişime geçin.
        </p>
      </div>
    </div>
  );
}
