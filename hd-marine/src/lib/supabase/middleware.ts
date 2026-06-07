import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";
import type { User } from "@supabase/supabase-js";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Middleware'de Supabase oturumunu yeniler (token refresh) ve kullanıcıyı döner.
 * /admin koruması bu fonksiyonun sonucuna göre yapılır.
 *
 * ÖNEMLİ: Dönen `response` cookie güncellemelerini taşır — admin
 * isteklerinde bu response (veya cookie'leri kopyalanmış bir redirect)
 * kullanılmalıdır, aksi halde oturum yenilemesi kaybolur.
 */
export async function updateSession(
  request: NextRequest
): Promise<{ response: NextResponse; user: User | null }> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { response, user: null };

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { response, user };
  } catch {
    // DB/ağ erişilemezse (ör. sandbox offline) girişsiz say
    return { response, user: null };
  }
}
