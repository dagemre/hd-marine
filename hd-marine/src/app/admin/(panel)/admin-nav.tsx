"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string; exact?: boolean };

const items: NavItem[] = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/kategoriler", label: "Kategoriler" },
  { href: "/admin/ceviriler", label: "Çeviriler" },
];

export function AdminNav({
  variant = "vertical",
}: {
  variant?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  if (variant === "horizontal") {
    return (
      <>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold",
              isActive(item)
                ? "bg-primary text-white"
                : "text-footer-text hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <nav className="flex-1 space-y-1 p-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "block rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
            isActive(item)
              ? "bg-primary text-white"
              : "text-footer-text hover:bg-navy hover:text-white"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
