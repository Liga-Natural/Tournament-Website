import Link from "next/link";
import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { signOutAction } from "@/app/actions/auth";
import { LeagueBadge } from "@/components/league-badge";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const session = await getSession();
  if (!session || session.role !== "organizer") redirect(`/${locale}/signin`);

  const base = `/${locale}/admin`;
  const nav = [
    { href: base, label: dict.admin.nav.overview },
    { href: `${base}/events`, label: dict.admin.nav.events },
    { href: `${base}/referees`, label: dict.admin.nav.referees },
    { href: `${base}/partners`, label: dict.admin.nav.partners },
    { href: `${base}/inbox`, label: dict.admin.nav.inbox },
    { href: `${base}/settings`, label: dict.admin.nav.settings },
  ];

  return (
    <div className="min-h-dvh bg-navy-deep">
      <div className="field-backdrop" aria-hidden="true" />
      <header className="border-b border-gold/20 bg-navy-deep/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <LeagueBadge size={32} />
            <span className="font-display text-lg font-bold uppercase tracking-wide text-gold-light">
              {dict.admin.dashboard}
            </span>
          </div>
          <form action={signOutAction.bind(null, locale)}>
            <button type="submit" className="text-sm text-muted hover:text-gold-light">
              {dict.admin.signOut}
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 pb-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded px-3 py-1.5 font-medium text-cream/80 hover:bg-navy-raised hover:text-gold-light"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
