import { getSupabaseStatus } from "@/lib/supabase/status";

export default async function Home() {
  const status = await getSupabaseStatus();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-brand-950 px-6 text-white">
      <div className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">
          HD Marine
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Endüstriyel Tesislerde
          <br />
          Çözüm Ortağınız
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-100/80">
          Yeni website geliştirme ortamı çalışıyor. Bu sayfa Faz 2-4&apos;te
          gerçek anasayfa tasarımıyla değiştirilecek.
        </p>
      </div>

      <div className="rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-sm">
        <p className="font-medium">Sistem Durumu</p>
        <ul className="mt-2 space-y-1 text-brand-100/80">
          <li>✅ Next.js çalışıyor</li>
          <li>
            {status.ok
              ? `✅ Supabase bağlantısı kuruldu (${status.message})`
              : `⏳ Supabase: ${status.message}`}
          </li>
        </ul>
      </div>
    </main>
  );
}
