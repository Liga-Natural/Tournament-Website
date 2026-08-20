import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSession } from "@/lib/session";
import { getFixture, getTeam, getEvent } from "@/lib/store";
import { ScoreStepperForm } from "@/components/score-stepper-form";

export default async function RefereeMatchPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}/referee`;

  const session = await getSession();
  const fixture = await getFixture(id);
  if (!fixture) notFound();
  if (!session || session.role !== "referee" || fixture.refereeId !== session.refereeId) {
    redirect(base);
  }

  const [home, away, event] = await Promise.all([
    fixture.homeTeamId ? getTeam(fixture.homeTeamId) : null,
    fixture.awayTeamId ? getTeam(fixture.awayTeamId) : null,
    getEvent(fixture.eventId),
  ]);

  return (
    <div>
      <Link href={base} className="text-sm text-muted hover:text-gold-light">
        ← {dict.referee.heading}
      </Link>

      <div className="mt-3 mb-6">
        <p className="text-xs uppercase tracking-widest text-gold">{event?.name}</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-cream">
          {fixture.round ?? dict.referee.matchDetails}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {fixture.date ?? dict.common.tba} {fixture.time ?? ""} {fixture.field ? `· ${fixture.field}` : ""}
        </p>
      </div>

      <ScoreStepperForm
        fixtureId={fixture.id}
        homeName={home?.name ?? fixture.homeTeamNameFallback ?? "TBA"}
        awayName={away?.name ?? fixture.awayTeamNameFallback ?? "TBA"}
        homeCrest={home?.crestUrl}
        awayCrest={away?.crestUrl}
        initialHome={fixture.homeScore ?? 0}
        initialAway={fixture.awayScore ?? 0}
        dict={dict}
      />
    </div>
  );
}
