import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { signOut } from "../giris/actions";
import { AdminNav } from "./admin-nav";

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-deep-navy md:flex">
        <div className="flex h-16 items-center border-b border-footer-border px-5">
          <Link href="/admin">
            <Image
              src="/logo-hd.png"
              alt="HD Marine"
              width={140}
              height={36}
              className="h-9 w-auto"
            />
          </Link>
        </div>
        <AdminNav />
        <div className="border-t border-footer-border p-4">
          <p className="mb-2 truncate text-xs text-footer-text" title={user.email}>
            {user.email}
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-semibold text-footer-text underline-offset-2 hover:text-white hover:underline"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </aside>

      {/* İçerik */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobil üst bar */}
        <header className="flex h-14 items-center justify-between bg-deep-navy px-4 md:hidden">
          <Link href="/admin">
            <Image
              src="/logo-hd.png"
              alt="HD Marine"
              width={110}
              height={28}
              className="h-7 w-auto"
            />
          </Link>
          <form action={signOut}>
            <button type="submit" className="text-xs font-semibold text-footer-text">
              Çıkış
            </button>
          </form>
        </header>
        <nav className="flex gap-1 overflow-x-auto bg-navy px-2 py-1.5 md:hidden">
          <AdminNav variant="horizontal" />
        </nav>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
