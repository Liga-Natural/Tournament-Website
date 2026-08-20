import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { signOutAction } from "@/app/actions/auth";
import { LeagueBadge } from "@/components/league-badge";

export default async function RefereeLayout({
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
  if (!session || session.role !== "referee") redirect(`/${locale}/signin`);

  return (
    <div className="min-h-dvh bg-navy-deep">
      <div className="field-backdrop" aria-hidden="true" />
      <header className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <LeagueBadge size={36} />
          <span className="font-display text-lg font-bold uppercase tracking-wide text-gold-light">
            {dict.referee.heading}
          </span>
        </div>
        <form action={signOutAction.bind(null, locale)}>
          <button type="submit" className="rounded-md border border-gold/30 px-3.5 py-2 text-sm text-cream/85">
            {dict.referee.signOut}
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-xl px-4 py-6 pb-16">{children}</main>
    </div>
  );
}
