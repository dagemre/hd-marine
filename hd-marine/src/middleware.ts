import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const handleI18n = createMiddleware(routing);

/* ------------------------------------------------------------------
   301 yönlendirmeleri — `redirects` tablosundan (migrasyonda üretildi).
   Modül düzeyinde cache'lenir (TTL 5 dk); DB erişilemezse sessizce atlanır.
   ------------------------------------------------------------------ */
const REDIRECTS_TTL_MS = 5 * 60 * 1000;
let redirectMap: Map<string, { to: string; status: number }> | null = null;
let redirectMapLoadedAt = 0;

function normalizePath(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

async function getRedirectMap() {
  const now = Date.now();
  if (redirectMap && now - redirectMapLoadedAt < REDIRECTS_TTL_MS) {
    return redirectMap;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return redirectMap;

  try {
    const res = await fetch(
      `${url}/rest/v1/redirects?select=old_path,new_path,status_code`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(3000),
      }
    );
    if (res.ok) {
      const rows: { old_path: string; new_path: string; status_code: number }[] =
        await res.json();
      redirectMap = new Map(
        rows.map((r) => [
          normalizePath(r.old_path),
          { to: normalizePath(r.new_path), status: r.status_code || 301 },
        ])
      );
      redirectMapLoadedAt = now;
    }
  } catch {
    // Ağ yoksa (ör. sandbox) yönlendirme kontrolü atlanır; eski cache korunur.
  }
  return redirectMap;
}

export default async function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  /* ---- /admin: i18n ve 301 kontrolü YOK; oturum yenileme + koruma ---- */
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const { response, user } = await updateSession(request);
    const isLoginPage = pathname === "/admin/giris";

    if (!user && !isLoginPage) {
      const target = NextResponse.redirect(new URL("/admin/giris", request.url));
      response.cookies.getAll().forEach((c) => target.cookies.set(c));
      return target;
    }
    if (user && isLoginPage) {
      const target = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.getAll().forEach((c) => target.cookies.set(c));
      return target;
    }
    return response;
  }

  const redirects = await getRedirectMap();
  const hit = redirects?.get(pathname);
  if (hit) {
    const target = new URL(hit.to, request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, hit.status);
  }

  return handleI18n(request);
}

export const config = {
  // _next, api ve dosya uzantılı istekler hariç tüm yollar
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
