import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Cookie'siz anon Supabase istemcisi — YALNIZCA public (oturum gerektirmeyen)
 * okuma sorguları için (kategoriler, ürünler, sektörler).
 *
 * Neden ayrı istemci: `lib/supabase/server.ts` cookie'leri `next/headers`
 * üzerinden okur; bir Server Component cookie okuduğu an Next.js o sayfayı
 * ZORUNLU dinamik yapar ve önbelleğe alınamaz. Bu istemci `next/headers`/
 * cookies() çağırmadığı için onu kullanan public sayfalar dinamik olmaya
 * zorlanmaz → `revalidate` ile ISR önbelleğe alınabilir (CPU büyük düşer).
 *
 * Public veri RLS ile anon role'e açık olduğundan dönen veri, cookie'li
 * istemcinin (oturumsuz ziyaretçi) döndürdüğüyle birebir aynıdır.
 */
export function createPublicClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          /* public okuma: oturum yazılmaz */
        },
      },
    }
  );
}
