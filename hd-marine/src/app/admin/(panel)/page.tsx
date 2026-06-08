import { redirect } from "next/navigation";

/** Panel kökü artık ayrı bir gösterge paneli değil — doğrudan Ürünler'e gider. */
export default function AdminRootPage() {
  redirect("/admin/urunler");
}
