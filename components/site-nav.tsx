"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { LocaleSwitcher } from "./locale-switcher";
import { LeagueBadge } from "./league-badge";
import type { Session } from "@/lib/types";

interface NavLink {
  href: string;
  label: string;
}

function NavDropdown({ label, links, pathname }: { label: string; links: NavLink[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = links.some((l) => pathname === l.href);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1 rounded px-2.5 py-1.5 text-sm font-medium transition-colors ${
          active ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
        }`}
      >
        {label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className={open ? "rotate-180" : ""}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-44 border border-gold/25 bg-navy-raised py-1.5 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm ${
                pathname === l.href ? "text-gold-light" : "text-cream/85 hover:bg-navy-deep hover:text-gold-light"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteNav({
  locale,
  dict,
  session,
}: {
  locale: Locale;
  dict: Dictionary;
  session: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = `/${locale}`;

  const competitionLinks: NavLink[] = [
    { href: `${base}/events`, label: dict.nav.events },
    { href: `${base}/standings`, label: dict.nav.standings },
    { href: `${base}/schedule`, label: dict.nav.schedule },
    { href: `${base}/teams`, label: dict.nav.teams },
  ];
  const infoLinks: NavLink[] = [
    { href: `${base}/guidelines`, label: dict.nav.guidelines },
    { href: `${base}/faq`, label: dict.nav.faq },
  ];
  const primaryLinks: NavLink[] = [
    { href: `${base}`, label: dict.nav.home },
    { href: `${base}/past-editions`, label: dict.nav.pastEditions },
    { href: `${base}/gallery`, label: dict.nav.gallery },
    { href: `${base}/join`, label: dict.nav.join },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];
  const allMobileLinks: NavLink[] = [
    { href: `${base}`, label: dict.nav.home },
    ...competitionLinks,
    { href: `${base}/past-editions`, label: dict.nav.pastEditions },
    { href: `${base}/gallery`, label: dict.nav.gallery },
    { href: `${base}/join`, label: dict.nav.join },
    { href: `${base}/about`, label: dict.nav.about },
    ...infoLinks,
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  const manageHref = session
    ? session.role === "organizer"
      ? `${base}/admin`
      : `${base}/referee`
    : `${base}/signin`;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-navy-deep/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={base} className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <LeagueBadge size={38} />
          <span className="font-display text-lg font-bold uppercase tracking-wide text-cream leading-none">
            Liga Natural
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Primary">
          <Link
            href={primaryLinks[0].href}
            className={`rounded px-2.5 py-1.5 text-sm font-medium transition-colors ${
              pathname === primaryLinks[0].href ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
            }`}
          >
            {primaryLinks[0].label}
          </Link>
          <NavDropdown label={dict.nav.competitions} links={competitionLinks} pathname={pathname} />
          {primaryLinks.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded px-2.5 py-1.5 text-sm font-medium transition-colors ${
                pathname === l.href ? "text-gold-light" : "text-cream/85 hover:text-gold-light"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <NavDropdown label={dict.nav.info} links={infoLinks} pathname={pathname} />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher locale={locale} />
          <Link href={manageHref} className="text-xs font-semibold text-muted hover:text-gold-light">
            {dict.nav.manage}
          </Link>
          <Link href={`${base}/partners`} className="btn btn-gold">
            {dict.nav.partner}
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded border border-gold/40 text-gold-light xl:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-navy-deep px-4 pb-6 pt-2 xl:hidden">
          <nav className="flex flex-col" aria-label="Primary mobile">
            {allMobileLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-gold/10 py-3 text-base font-medium text-cream/90"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link href={manageHref} onClick={() => setOpen(false)} className="text-sm font-semibold text-muted">
              {dict.nav.manage}
            </Link>
            <LocaleSwitcher locale={locale} />
          </div>
          <Link
            href={`${base}/partners`}
            onClick={() => setOpen(false)}
            className="btn btn-gold mt-4 w-full"
          >
            {dict.nav.partner}
          </Link>
        </div>
      )}
    </header>
  );
}
