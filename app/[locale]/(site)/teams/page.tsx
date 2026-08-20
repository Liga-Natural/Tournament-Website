import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEvents, getTeams, getDivisions } from "@/lib/store";
import { PageHeader, Section } from "@/components/page-parts";
import { Crest } from "@/components/crest";

export default async function TeamsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  const events = await getEvents();

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.teamsPage.heading} subtitle={dict.teamsPage.subheading} />
      <Section className="pt-0 space-y-14">
        {await Promise.all(
          events.map(async (event) => {
            const [teams, divisions] = await Promise.all([getTeams(event.id), getDivisions(event.id)]);
            if (teams.length === 0) return null;
            const groups =
              divisions.length > 0
                ? divisions.map((d) => ({ division: d, teams: teams.filter((t) => t.divisionId === d.id) }))
                : [{ division: null, teams }];
            return (
              <div key={event.id}>
                <div className="mb-5 flex items-baseline justify-between gap-3">
                  <h2 className={`font-display text-2xl font-bold uppercase tracking-wide ${event.theme === "copa" ? "font-cp cp-shear text-cp-gold" : "text-gold-light"}`}>
                    {event.name}
                  </h2>
                  <Link href={`${base}/events/${event.slug}`} className="text-sm text-muted hover:text-gold-light">
                    {dict.common.viewAll}
                  </Link>
                </div>
                <div className="space-y-6">
                  {groups.map((g) => (
                    <div key={g.division?.id ?? "all"}>
                      {g.division && (
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted">{g.division.name}</h3>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {g.teams.map((team) => (
                          <div
                            key={team.id}
                            className="flex items-center gap-3 rounded-lg border border-l-4 border-gold/20 bg-navy-raised/50 p-3.5"
                            style={team.colorPrimary ? { borderLeftColor: team.colorPrimary } : undefined}
                          >
                            <Crest name={team.name} crestUrl={team.crestUrl} colorPrimary={team.colorPrimary} size={40} />
                            <span className="font-medium text-cream">{team.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </Section>
    </>
  );
}
