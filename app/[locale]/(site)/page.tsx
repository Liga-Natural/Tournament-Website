import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEvents, getEditionAwards, getGalleryImages } from "@/lib/store";
import { getHomeHighlight } from "@/lib/queries";
import { Section, StarDivider } from "@/components/page-parts";
import { StatStrip } from "@/components/stat-strip";
import { BrandPanel } from "@/components/brand-panel";
import { Crest } from "@/components/crest";
import { EventPhotoCarousel } from "@/components/event-photo-carousel";

export const metadata: Metadata = { title: undefined };

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  const [events, highlight, galleryImages] = await Promise.all([getEvents(), getHomeHighlight(), getGalleryImages()]);
  const heroImage = events.find((ev) => ev.heroImage)?.heroImage ?? null;
  const flagshipAwards = await getEditionAwards("ev-2026");
  const premierMvp = flagshipAwards.find((a) => a.divisionName === "Premier Division");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/8] lg:aspect-[21/9]">
          {heroImage ? (
            <Image src={heroImage} alt="" fill sizes="100vw" priority className="object-cover" />
          ) : (
            <BrandPanel accent="gold" bare className="absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-navy-deep/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 text-center sm:pb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-light">{dict.home.heroKicker}</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-wide text-cream sm:text-6xl lg:text-7xl">
              {dict.meta.tagline}
            </h1>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href={`${base}/events`} className="btn btn-gold px-7 py-3.5 text-sm">
                {dict.home.heroCtaEvents}
              </Link>
              <Link href={`${base}/schedule`} className="btn btn-outline px-7 py-3.5 text-sm">
                {dict.nav.schedule}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Last result / next match highlight */}
      {highlight && (
        <Section className="py-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/40">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8a6a1f]">
                {highlight.kind === "upcoming" ? dict.home.nextMatchKicker : dict.home.lastResultKicker}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <Crest
                    name={highlight.item.home?.name ?? highlight.item.fixture.homeTeamNameFallback ?? "TBA"}
                    crestUrl={highlight.item.home?.crestUrl}
                    colorPrimary={highlight.item.home?.colorPrimary}
                    size={48}
                  />
                  <span className="text-center text-sm font-medium text-navy-deep">
                    {highlight.item.home?.name ?? highlight.item.fixture.homeTeamNameFallback ?? "TBA"}
                  </span>
                </div>
                <div className="shrink-0 text-center">
                  {highlight.kind === "last-result" ? (
                    <div className="font-display tabular text-3xl font-bold text-navy-deep">
                      {highlight.item.fixture.homeScore}–{highlight.item.fixture.awayScore}
                    </div>
                  ) : (
                    <div className="font-display text-xl font-bold text-navy/60">{dict.common.vs}</div>
                  )}
                  {highlight.item.fixture.date && (
                    <div className="mt-1 text-xs text-navy/60">
                      {new Date(highlight.item.fixture.date + "T12:00:00").toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <Crest
                    name={highlight.item.away?.name ?? highlight.item.fixture.awayTeamNameFallback ?? "TBA"}
                    crestUrl={highlight.item.away?.crestUrl}
                    colorPrimary={highlight.item.away?.colorPrimary}
                    size={48}
                  />
                  <span className="text-center text-sm font-medium text-navy-deep">
                    {highlight.item.away?.name ?? highlight.item.fixture.awayTeamNameFallback ?? "TBA"}
                  </span>
                </div>
              </div>
              {highlight.item.fixture.penaltyNote && (
                <p className="mt-3 text-center text-xs font-medium text-[#8a6a1f]">{highlight.item.fixture.penaltyNote}</p>
              )}
              <p className="mt-4 text-center text-xs text-navy/60">
                {highlight.kind === "last-result" ? dict.home.nextMatchNone : ""}
              </p>
            </div>

            {premierMvp && (
              <div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/40">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8a6a1f]">{dict.home.playerOfWeekKicker}</p>
                <div className="mt-4 flex items-center gap-4">
                  {premierMvp.mvpPhotoUrl ? (
                    <div className="crest-ring relative aspect-square w-20 shrink-0 overflow-hidden rounded-full">
                      <Image src={premierMvp.mvpPhotoUrl} alt={premierMvp.mvpName} fill sizes="80px" className="object-cover" />
                    </div>
                  ) : (
                    <BrandPanel accent="navy" className="aspect-square w-20 shrink-0 rounded-full" />
                  )}
                  <div>
                    <div className="font-display text-2xl font-bold text-navy-deep">{premierMvp.mvpName}</div>
                    <div className="text-sm text-navy/60">
                      {premierMvp.mvpTeam}
                      {premierMvp.mvpPosition ? ` · ${premierMvp.mvpPosition}` : ""}
                    </div>
                    {premierMvp.mvpStatLine && <div className="mt-2 text-sm font-medium text-[#8a6a1f]">{premierMvp.mvpStatLine}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Stats strip */}
      <Section className="py-10">
        <StatStrip
          stats={[
            { value: "200,000+", label: dict.home.statInstagram },
            { value: "8", label: dict.home.statClubs },
            { value: "2", label: dict.home.statPlayers },
            { value: "2", label: dict.home.statSeasons },
          ]}
        />
      </Section>

      {/* Events */}
      <Section>
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-cream sm:text-4xl">
            {dict.home.eventsHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">{dict.home.eventsBody}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const slides = galleryImages
              .filter((img) => img.eventId === ev.id && img.url)
              .map((img) => ({ url: img.url as string, alt: locale === "es" ? img.altEs : img.altEn }));
            return (
            <Link
              key={ev.id}
              href={`${base}/events/${ev.slug}`}
              className={`group overflow-hidden rounded-2xl border transition-colors ${
                ev.theme === "copa"
                  ? "cp-backdrop border-cp-gold/40 hover:border-cp-gold"
                  : "border-gold/25 bg-navy-raised/50 hover:border-gold"
              }`}
            >
              <div className="relative aspect-[4/3]">
                <EventPhotoCarousel slides={slides} fallbackLabel={ev.shortName} className="absolute inset-0" />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-light">
                  {dict.events[
                    ev.status === "upcoming" ? "statusUpcoming" : ev.status === "active" ? "statusActive" : "statusCompleted"
                  ]}
                </p>
                <h3 className={`mt-1 font-display text-xl font-bold uppercase tracking-wide ${ev.theme === "copa" ? "font-cp cp-shear text-white" : "text-cream"}`}>
                  {ev.name}
                </h3>
                {ev.venueName && <p className="mt-1 text-sm text-muted">{ev.venueName}</p>}
              </div>
            </Link>
            );
          })}
        </div>
      </Section>

      {/* Latest photos — horizontal scroll */}
      {(() => {
        const photos = galleryImages.filter((img) => img.url).slice(0, 8);
        if (photos.length === 0) return null;
        return (
          <Section>
            <div className="mb-6 flex items-end justify-between gap-3">
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-cream sm:text-4xl">
                {dict.home.photosHeading}
              </h2>
              <Link href={`${base}/past-editions`} className="shrink-0 text-sm font-medium text-gold-light hover:text-gold">
                {dict.home.photosCta}
              </Link>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {photos.map((img) => (
                <Link
                  key={img.id}
                  href={`${base}/past-editions`}
                  className="group relative aspect-[3/4] w-48 shrink-0 snap-start overflow-hidden rounded-2xl shadow-lg shadow-black/40 sm:w-56"
                >
                  <Image
                    src={img.url as string}
                    alt={locale === "es" ? img.altEs : img.altEn}
                    fill
                    sizes="224px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {img.caption && (
                    <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white">{img.caption}</p>
                  )}
                </Link>
              ))}
            </div>
          </Section>
        );
      })()}

      {/* History teaser */}
      <Section className="text-center">
        <StarDivider />
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-cream sm:text-4xl">
          {dict.home.historyHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">{dict.home.historyBody}</p>
        <Link href={`${base}/past-editions`} className="btn btn-outline mt-6 px-7 py-3.5 text-sm">
          {dict.home.historyCta}
        </Link>
      </Section>

      {/* Mission motif */}
      <Section className="text-center">
        <StarDivider />
        <p className="mx-auto max-w-3xl font-display text-3xl font-bold uppercase leading-tight tracking-wide text-gold-light sm:text-5xl">
          {dict.home.missionPullquote}
        </p>
      </Section>
    </>
  );
}
