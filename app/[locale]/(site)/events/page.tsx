import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getEvents, getGalleryImages } from "@/lib/store";
import { PageHeader, Section, EmptyState } from "@/components/page-parts";
import { EventPhotoCarousel } from "@/components/event-photo-carousel";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const base = `/${locale}`;
  const [events, galleryImages] = await Promise.all([getEvents(), getGalleryImages()]);

  return (
    <>
      <PageHeader kicker="Liga Natural Tournaments" title={dict.events.heading} subtitle={dict.events.subheading} />
      <Section className="pt-0">
        {events.length === 0 ? (
          <EmptyState message={dict.events.empty} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => {
              const slides = galleryImages
                .filter((img) => img.eventId === ev.id && img.url)
                .map((img) => ({ url: img.url as string, alt: locale === "es" ? img.altEs : img.altEn }));
              return (
              <Link
                key={ev.id}
                href={`${base}/events/${ev.slug}`}
                className={`group overflow-hidden rounded-lg border transition-colors ${
                  ev.theme === "copa"
                    ? "cp-backdrop border-cp-gold/40 hover:border-cp-gold"
                    : "border-gold/25 bg-navy-raised/50 hover:border-gold"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <EventPhotoCarousel slides={slides} fallbackLabel={ev.shortName} className="absolute inset-0" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold-light">
                    {dict.events[
                      ev.status === "upcoming" ? "statusUpcoming" : ev.status === "active" ? "statusActive" : "statusCompleted"
                    ]}
                  </p>
                  <h2
                    className={`mt-1 font-display text-2xl font-bold uppercase tracking-wide ${
                      ev.theme === "copa" ? "font-cp cp-shear text-white" : "text-cream"
                    }`}
                  >
                    {ev.name}
                  </h2>
                  {ev.venueName && <p className="mt-1 text-sm text-muted">{ev.venueName}</p>}
                </div>
              </Link>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
