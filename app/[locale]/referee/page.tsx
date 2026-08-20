import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { getFixtures, getTeam, getEvent } from "@/lib/store";
import { EmptyState } from "@/components/page-parts";
import { Crest } from "@/components/crest";

export default async function RefereeMatchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}/referee`;

  const session = await getSession();
  const allFixtures = await getFixtures();
  const mine = allFixtures.filter((f) => f.refereeId === session?.refereeId);

  const withContext = await Promise.all(
    mine.map(async (fx) => {
      const [home, away, event] = await Promise.all([
        fx.homeTeamId ? getTeam(fx.homeTeamId) : null,
        fx.awayTeamId ? getTeam(fx.awayTeamId) : null,
        getEvent(fx.eventId),
      ]);
      return { fx, home, away, event };
    })
  );

  const unplayed = withContext
    .filter((r) => r.fx.status !== "completed")
    .sort((a, b) => (a.fx.date ?? "9999").localeCompare(b.fx.date ?? "9999"));
  const completed = withContext
    .filter((r) => r.fx.status === "completed")
    .sort((a, b) => (b.fx.date ?? "0000").localeCompare(a.fx.date ?? "0000"));

  return (
    <div>
      <p className="mb-6 text-sm text-muted">{dict.referee.subheading}</p>

      {mine.length === 0 ? (
        <EmptyState message={dict.referee.empty} />
      ) : (
        <div className="space-y-8">
          {unplayed.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">
                {dict.referee.unplayed}
              </h2>
              <div className="space-y-3">
                {unplayed.map(({ fx, home, away, event }) => (
                  <MatchRow key={fx.id} href={`${base}/match/${fx.id}`} home={home} away={away} fx={fx} eventName={event?.name} />
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-muted">
                {dict.referee.completed}
              </h2>
              <div className="space-y-3">
                {completed.map(({ fx, home, away, event }) => (
                  <MatchRow key={fx.id} href={`${base}/match/${fx.id}`} home={home} away={away} fx={fx} eventName={event?.name} muted />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MatchRow({
  href,
  home,
  away,
  fx,
  eventName,
  muted,
}: {
  href: string;
  home: { name: string; crestUrl: string | null } | null;
  away: { name: string; crestUrl: string | null } | null;
  fx: { date: string | null; time: string | null; field: string | null; status: string; homeScore: number | null; awayScore: number | null; homeTeamNameFallback: string | null; awayTeamNameFallback: string | null };
  eventName?: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl border p-4 ${muted ? "border-gold/15 bg-navy-raised/25 opacity-80" : "border-gold/30 bg-navy-raised/60"}`}
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{eventName}</span>
        <span>
          {fx.date ?? "TBA"} {fx.time ?? ""}
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Crest name={home?.name ?? fx.homeTeamNameFallback ?? "TBA"} crestUrl={home?.crestUrl} size={36} />
          <span className="truncate text-base font-semibold text-cream">{home?.name ?? fx.homeTeamNameFallback ?? "TBA"}</span>
        </div>
        <span className="shrink-0 font-display text-lg font-bold text-gold-light">
          {fx.status === "completed" ? `${fx.homeScore}–${fx.awayScore}` : "vs"}
        </span>
        <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
          <span className="truncate text-right text-base font-semibold text-cream">{away?.name ?? fx.awayTeamNameFallback ?? "TBA"}</span>
          <Crest name={away?.name ?? fx.awayTeamNameFallback ?? "TBA"} crestUrl={away?.crestUrl} size={36} />
        </div>
      </div>
      {fx.field && <p className="mt-2 text-xs text-muted">{fx.field}</p>}
    </Link>
  );
}
