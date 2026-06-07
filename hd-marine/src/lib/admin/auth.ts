import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Sayfa/aksiyon başında çağrılır: oturum yoksa girişe yönlendirir.
 * (Middleware zaten korur; bu, server action'lar ve doğrudan render
 * için ikinci savunma hattıdır.)
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/giris");
  return { supabase, user };
}
