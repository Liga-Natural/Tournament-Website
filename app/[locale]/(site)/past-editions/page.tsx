import Image from "next/image";
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

      {/* Season by season — presented as a records archive, not a card grid */}
      <Section className="pt-0">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {dict.pastEditions.heading}
        </p>
        {events.length === 0 ? (
          <EmptyState message={dict.pastEditions.empty} />
        ) : (
          <div className="mx-auto max-w-4xl">
            {await Promise.all(
              events.map(async (event, i) => {
                const awards = await getEditionAwards(event.id);
                const isLast = i === events.length - 1;
                return (
                  <div key={event.id} className="relative flex gap-6 sm:gap-10">
                    {/* Timeline rail */}
                    <div className="flex shrink-0 flex-col items-center">
                      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-gold bg-navy-deep font-display text-lg font-bold text-gold-light sm:h-20 sm:w-20 sm:text-xl">
                        {event.seasonLabel}
                      </span>
                      {!isLast && <span className="mt-1 w-px flex-1 bg-gradient-to-b from-gold/50 to-gold/10" />}
                    </div>

                    <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-14"}`}>
                      <div className="mb-4 flex flex-col gap-1 pt-3 sm:flex-row sm:items-baseline sm:justify-between">
                        <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-cream">
                          {dict.pastEditions.seasonLabel} {event.seasonLabel}
                        </h2>
                        {event.venueName && (
                          <span className="text-xs uppercase tracking-wide text-muted">
                            {dict.pastEditions.venueLabel}: {event.venueName}
                          </span>
                        )}
                      </div>

                      <div className="divide-y divide-gold/15 border border-gold/20 bg-navy-raised/40">
                        {awards.map((award) => (
                          <div key={award.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                                  {award.divisionName}
                                </p>
                                <span className="font-display tabular text-xl font-bold text-cream">
                                  {award.finalScoreLine}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold text-[10px] font-bold text-gold-light">
                                  ★
                                </span>
                                <p className="font-display text-lg font-bold text-gold-light">{award.champion}</p>
                              </div>
                              <p className="mt-0.5 text-xs text-muted">
                                {dict.common.runnerUp}: {award.runnerUp}
                              </p>
                              <div className="mt-3 flex items-center gap-3 border-t border-gold/10 pt-3">
                                {award.mvpPhotoUrl && (
                                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/40">
                                    <Image
                                      src={award.mvpPhotoUrl}
                                      alt={award.mvpName}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <p className="text-[10px] uppercase tracking-widest text-muted">{dict.common.mvp}</p>
                                  <p className="font-display text-base font-bold text-cream">{award.mvpName}</p>
                                  <p className="text-xs text-muted">
                                    {award.mvpTeam}
                                    {award.mvpPosition ? ` · ${award.mvpPosition}` : ""}
                                    {award.mvpStatLine ? ` — ${award.mvpStatLine}` : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Section>
    </>
  );
}
