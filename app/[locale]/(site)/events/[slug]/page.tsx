import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEventFull, teamsById } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/page-parts";
import { FixtureCard } from "@/components/fixture-card";
import { Crest } from "@/components/crest";
import { CssTabs } from "@/components/css-tabs";
import type { DivisionRecord, TeamRecord, FixtureRecord } from "@/lib/types";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  const data = await getEventFull(slug);
  if (!data) notFound();
  const { event, divisions, teams, fixtures } = data;
  const byId = teamsById(teams);
  const isCopa = event.theme === "copa";

  const divisionGroups: { division: DivisionRecord | null; teams: TeamRecord[]; fixtures: FixtureRecord[] }[] =
    divisions.length > 0
      ? divisions.map((d) => ({
          division: d,
          teams: teams.filter((t) => t.divisionId === d.id),
          fixtures: fixtures.filter((f) => f.divisionId === d.id),
        }))
      : [{ division: null, teams, fixtures }];

  return (
    <div className={isCopa ? "cp-backdrop" : ""}>
      {isCopa && <div className="cp-checker" aria-hidden="true" />}
      {isCopa ? (
        <div className="mx-auto max-w-3xl px-6 pb-4 pt-14 text-center">
          <p className="font-cp cp-shear text-sm font-bold uppercase tracking-[0.25em] text-cp-gold">FÚTBOL A TODA MÁQUINA</p>
          <h1 className="mt-3 font-cp cp-shear text-5xl font-normal uppercase leading-[0.9] tracking-wide text-white sm:text-6xl">
            {event.name}
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-white/80">
            {locale === "es" ? "PRESENTADO POR LIGA NATURAL" : "HOSTED BY LIGA NATURAL"}
          </p>
        </div>
      ) : (
        <PageHeader
          kicker={event.seasonLabel}
          title={event.name}
          subtitle={event.venueName ? `${dict.common.venue}: ${event.venueName}` : undefined}
        />
      )}
      {isCopa && <div className="cp-checker" aria-hidden="true" />}

      <div className="mx-auto max-w-5xl px-6 pt-8 pb-20">
        <CssTabs
          name={`event-${event.slug}`}
          tabs={[
            {
              id: "schedule",
              label: dict.eventDetail.tabSchedule,
              content: (
                <div className="space-y-10">
                  {divisionGroups.map((g) => (
                    <div key={g.division?.id ?? "all"}>
                      {g.division && (
                        <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">
                          {g.division.name}
                        </h3>
                      )}
                      {g.fixtures.length === 0 ? (
                        <EmptyState message={dict.eventDetail.noFixtures} />
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {g.fixtures.map((fx) => (
                            <FixtureCard
                              key={fx.id}
                              fixture={fx}
                              homeTeam={fx.homeTeamId ? byId.get(fx.homeTeamId) ?? null : null}
                              awayTeam={fx.awayTeamId ? byId.get(fx.awayTeamId) ?? null : null}
                              dict={dict}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "teams",
              label: dict.eventDetail.tabTeams,
              content: (
                <div className="space-y-10">
                  {divisionGroups.map((g) => (
                    <div key={g.division?.id ?? "all"}>
                      {g.division && (
                        <h3 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">
                          {g.division.name}
                        </h3>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {g.teams.map((team) => (
                          <TeamLink key={team.id} team={team} base={base} eventSlug={event.slug} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

function TeamLink({ team, base, eventSlug }: { team: TeamRecord; base: string; eventSlug: string }) {
  return (
    <Link
      href={`${base}/teams/${eventSlug}/${team.slug}`}
      className="flex items-center gap-3 rounded-lg border border-gold/20 bg-navy-raised/50 p-3.5 hover:border-gold"
    >
      <Crest name={team.name} crestUrl={team.crestUrl} size={40} />
      <span className="font-medium text-cream">{team.name}</span>
    </Link>
  );
}
