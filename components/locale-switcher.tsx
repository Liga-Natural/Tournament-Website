"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  segments[0] = locale === "en" ? "es" : "en";
  const target = "/" + segments.join("/");
  const other = locale === "en" ? "es" : "en";

  return (
    <Link
      href={target}
      className="text-xs font-semibold tracking-widest text-muted hover:text-gold-light transition-colors px-2 py-1"
      aria-label={other === "es" ? "Cambiar a español" : "Switch to English"}
    >
      {other.toUpperCase()}
    </Link>
  );
}
