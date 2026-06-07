/**
 * Geliştirme aşaması durum kontrolü — placeholder anasayfada gösterilir.
 * Faz 2-4'te gerçek sayfalar geldiğinde kaldırılacak.
 */
export async function getSupabaseStatus(): Promise<{
  ok: boolean;
  message: string;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("DOLDURULACAK")) {
    return { ok: false, message: ".env.local bekleniyor (anahtarlar girilmedi)" };
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    return res.ok
      ? { ok: true, message: new URL(url).hostname }
      : { ok: false, message: `bağlantı hatası (HTTP ${res.status})` };
  } catch {
    return { ok: false, message: "sunucuya ulaşılamadı" };
  }
}
