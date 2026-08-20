import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

export function StickyMobileBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-gold/30 bg-navy-deep/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link href={`${base}/partners`} className="flex flex-col items-center gap-0.5 py-2.5 text-gold-light">
        <StarIcon />
        <span className="text-[11px] font-semibold">{dict.stickyBar.partner}</span>
      </Link>
      <Link
        href={`${base}/join`}
        className="flex flex-col items-center gap-0.5 border-x border-gold/20 bg-gold/10 py-2.5 text-gold-light"
      >
        <BallIcon />
        <span className="text-[11px] font-semibold">{dict.stickyBar.join}</span>
      </Link>
      <Link href={`${base}/contact`} className="flex flex-col items-center gap-0.5 py-2.5 text-gold-light">
        <MailIcon />
        <span className="text-[11px] font-semibold">{dict.stickyBar.contact}</span>
      </Link>
    </nav>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7-5.4-4.7 7.1-.6L12 2z" />
    </svg>
  );
}
function BallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7l3.5 2.6-1.3 4.1H9.8l-1.3-4.1L12 7z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
