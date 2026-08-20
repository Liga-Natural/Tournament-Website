import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getAllFixturesWithContext } from "@/lib/queries";
import { PageHeader, Section, EmptyState } from "@/components/page-parts";
import { FixtureCard } from "@/components/fixture-card";

export default async function SchedulePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  const all = await getAllFixturesWithContext();
  const upcoming = all
    .filter((r) => r.fixture.status === "scheduled")
    .sort((a, b) => (a.fixture.date ?? "9999").localeCompare(b.fixture.date ?? "9999"));
  const results = all
    .filter((r) => r.fixture.status === "completed")
    .sort((a, b) => (b.fixture.date ?? "0000").localeCompare(a.fixture.date ?? "0000"));

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.schedulePage.heading} subtitle={dict.schedulePage.subheading} />
      <Section className="pt-0 space-y-14">
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-gold-light">
            {dict.schedulePage.upcomingHeading}
          </h2>
          {upcoming.length === 0 ? (
            <EmptyState message={dict.schedulePage.noUpcoming} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {upcoming.map((r) => (
                <FixtureCard key={r.fixture.id} fixture={r.fixture} homeTeam={r.home} awayTeam={r.away} dict={dict} />
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-gold-light">
            {dict.schedulePage.resultsHeading}
          </h2>
          {results.length === 0 ? (
            <EmptyState message={dict.schedulePage.noResults} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((r) => (
                <FixtureCard key={r.fixture.id} fixture={r.fixture} homeTeam={r.home} awayTeam={r.away} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
