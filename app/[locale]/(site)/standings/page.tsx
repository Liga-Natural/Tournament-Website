import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEvents, getTeams, getFixtures } from "@/lib/store";
import { standingsByDivision } from "@/lib/queries";
import { PageHeader, Section } from "@/components/page-parts";
import { StandingsTable } from "@/components/standings-table";
import { getDivisions } from "@/lib/store";

export default async function StandingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  const events = await getEvents();

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.standingsPage.heading} subtitle={dict.standingsPage.subheading} />
      <Section className="pt-0 space-y-14">
        {await Promise.all(
          events.map(async (event) => {
            const [teams, fixtures, divisions] = await Promise.all([
              getTeams(event.id),
              getFixtures(event.id),
              getDivisions(event.id),
            ]);
            if (teams.length === 0) return null;
            const standings = standingsByDivision(teams, fixtures);
            const groups = divisions.length > 0 ? divisions : [null];
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
                <div className="space-y-8">
                  {groups.map((division) => (
                    <div key={division?.id ?? "all"}>
                      {division && (
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted">{division.name}</h3>
                      )}
                      <StandingsTable rows={standings.get(division?.id ?? null) ?? []} dict={dict} />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted">{dict.eventDetail.standingsNote}</p>
              </div>
            );
          })
        )}
      </Section>
    </>
  );
}
