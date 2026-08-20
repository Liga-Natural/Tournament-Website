import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { LeagueBadge } from "./league-badge";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const base = `/${locale}`;
  return (
    <footer className="gold-frame relative border-t border-gold/20 pb-24 pt-12 lg:pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="star-divider mb-8">★</div>
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <LeagueBadge size={32} />
              <div className="font-display text-2xl font-bold uppercase tracking-wide text-gold-light">
                Liga Natural
              </div>
            </div>
            <p className="mt-2 max-w-xs text-sm text-muted">{dict.meta.tagline}</p>
          </div>
          <div className="text-sm text-cream/85">
            <a href="mailto:liganatural12@gmail.com" className="block hover:text-gold-light">
              {dict.footer.email}
            </a>
            <a
              href="https://instagram.com/liga.natural"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block hover:text-gold-light"
            >
              {dict.footer.instagram}
            </a>
            <p className="mt-3 max-w-xs text-muted">{dict.footer.sponsorLine}</p>
          </div>
          <div className="text-sm">
            <Link href={`${base}/partners`} className="btn btn-gold">
              {dict.nav.partner}
            </Link>
            <Link href={`${base}/signin`} className="mt-4 block text-muted hover:text-gold-light">
              {dict.footer.manageLink}
            </Link>
          </div>
        </div>
        <p className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
