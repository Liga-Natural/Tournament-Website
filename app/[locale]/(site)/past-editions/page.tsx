import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEvents, getEditionAwards } from "@/lib/store";
import { PageHeader, Section, StarDivider, EmptyState } from "@/components/page-parts";
import { BrandPanel } from "@/components/brand-panel";

export default async function PastEditionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  const events = (await getEvents()).filter((e) => e.status === "completed").sort((a, b) => b.year - a.year);

  return (
    <>
      <PageHeader kicker="The Record Book" title={dict.pastEditions.heading} subtitle={dict.pastEditions.subheading} />

      {/* Rivalry storyline */}
      <Section className="pt-0">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-navy-raised to-navy-deep p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{dict.pastEditions.rivalryKicker}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-wide text-cream sm:text-4xl">
            {dict.pastEditions.rivalryHeading}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-cream/85">{dict.pastEditions.rivalryBody}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
            <div className="rounded-lg border border-gold/20 bg-navy-deep/60 p-4 text-center">
              <div className="font-display text-2xl font-bold text-gold-light">2025</div>
              <div className="mt-1 text-xs text-muted">Palmeras won on penalties</div>
            </div>
            <div className="rounded-lg border border-gold/20 bg-navy-deep/60 p-4 text-center">
              <div className="font-display text-2xl font-bold text-gold-light">2026</div>
              <div className="mt-1 text-xs text-muted">Negronis won 4–2</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Repeat MVP storyline */}
      <Section className="pt-0">
        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-navy-raised to-navy-deep p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <BrandPanel accent="navy" className="aspect-[4/5] w-40 shrink-0 rounded-lg" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{dict.pastEditions.repeatMvpKicker}</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-wide text-cream sm:text-3xl">
                {dict.pastEditions.repeatMvpHeading}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/85">{dict.pastEditions.repeatMvpBody}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <StarDivider />
      </Section>

      {/* Season by season */}
      <Section className="pt-0 space-y-16">
        {events.length === 0 ? (
          <EmptyState message={dict.pastEditions.empty} />
        ) : (
          await Promise.all(
            events.map(async (event) => {
              const awards = await getEditionAwards(event.id);
              return (
                <div key={event.id}>
                  <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-cream">
                      {dict.pastEditions.seasonLabel} {event.seasonLabel}
                    </h2>
                    {event.venueName && (
                      <span className="text-sm text-muted">
                        {dict.pastEditions.venueLabel}: {event.venueName}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {awards.map((award) => (
                      <div key={award.id} className="overflow-hidden rounded-lg border border-gold/25 bg-navy-raised/50">
                        <div className="relative aspect-[4/5]">
                          <BrandPanel accent="gold" label={`${award.champion} · ${event.seasonLabel}`} className="absolute inset-0" />
                        </div>
                        <div className="p-5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-gold">{award.divisionName}</p>
                          <p className="mt-1 text-xs text-muted">{award.finalNotes}</p>
                          <div className="mt-3 flex items-baseline justify-between">
                            <div>
                              <p className="text-xs uppercase text-muted">{dict.common.champion}</p>
                              <p className="font-display text-xl font-bold text-gold-light">{award.champion}</p>
                            </div>
                            <div className="font-display tabular text-2xl font-bold text-cream">{award.finalScoreLine}</div>
                          </div>
                          <p className="mt-1 text-sm text-muted">
                            {dict.common.runnerUp}: {award.runnerUp}
                          </p>
                          <div className="mt-4 border-t border-gold/15 pt-4">
                            <p className="text-xs uppercase text-muted">{dict.common.mvp}</p>
                            <p className="font-display text-lg font-bold text-cream">{award.mvpName}</p>
                            <p className="text-xs text-muted">
                              {award.mvpTeam}
                              {award.mvpPosition ? ` · ${award.mvpPosition}` : ""}
                            </p>
                            {award.mvpStatLine && <p className="mt-1 text-sm text-gold-light">{award.mvpStatLine}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )
        )}
      </Section>
    </>
  );
}
