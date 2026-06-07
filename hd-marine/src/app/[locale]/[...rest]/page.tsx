import { notFound } from "next/navigation";

// [locale] altında eşleşmeyen tüm yollar → 404 (not-found.tsx render edilir)
export default function CatchAllNotFound() {
  notFound();
}
