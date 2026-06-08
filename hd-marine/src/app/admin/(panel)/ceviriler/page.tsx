import { redirect } from "next/navigation";

/**
 * Çeviriler ekranı kaldırıldı. İngilizce içerik artık ürün düzenleme
 * sayfasındaki "İçerik (EN)" sekmesinden yönetiliyor.
 */
export default function CevirilerRedirect() {
  redirect("/admin/urunler");
}
