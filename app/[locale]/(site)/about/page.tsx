import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageHeader, Section, StarDivider } from "@/components/page-parts";
import { StatStrip } from "@/components/stat-strip";
import { BrandPanel } from "@/components/brand-panel";

const copy = {
  en: {
    mission:
      "From a few teams with a dream to a thriving movement, Liga Natural is more than just a league—it's a home for every player who dreams big. We started with nothing but passion, and today, we invite every young athlete, every dreamer, to join us. Because here, everyone plays, everyone grows, and everyone belongs.",
    founderNote:
      "Adrian — \"Chino\" to everyone who plays — started Liga Natural and still organizes it personally. This isn't a franchise or a corporate academy. It's one person from Doral who built a competition his community shows up for, season after season.",
  },
  es: {
    mission:
      "De unos pocos equipos con un sueño a un movimiento en pleno crecimiento, Liga Natural es más que una liga—es un hogar para todo jugador que sueña en grande. Empezamos sin nada más que pasión, y hoy invitamos a cada joven atleta, a cada soñador, a unirse a nosotros. Porque aquí, todos juegan, todos crecen, y todos pertenecen.",
    founderNote:
      "Adrian — \"Chino\" para todos los que juegan — fundó Liga Natural y todavía la organiza personalmente. Esto no es una franquicia ni una academia corporativa. Es una sola persona de Doral que construyó una competencia a la que su comunidad se presenta, temporada tras temporada.",
  },
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);
  const c = copy[locale];

  return (
    <>
      <PageHeader kicker={dict.meta.tagline} title={dict.aboutPage.heading} imageUrl="/gallery/junior-goalkeeper-action.jpg" />

      <Section className="pt-4">
        <p className="mx-auto text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          {dict.aboutPage.missionKicker}
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-cream/90 sm:text-xl">{c.mission}</p>
      </Section>

      <Section className="pt-0 text-center">
        <StarDivider />
        <p className="mx-auto max-w-3xl font-display text-3xl font-extrabold uppercase leading-tight tracking-wide text-gold-light sm:text-5xl">
          {dict.home.missionPullquote}
        </p>
      </Section>

      <Section className="pt-0">
        <StarDivider />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{dict.aboutPage.storyKicker}</p>
          <blockquote className="mt-4 font-display text-2xl font-bold italic leading-snug text-cream sm:text-3xl">
            &ldquo;{dict.aboutPage.storyQuote}&rdquo;
          </blockquote>
          <p className="mt-6 text-base leading-relaxed text-muted">{c.founderNote}</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gold-light">{dict.aboutPage.founderLine}</p>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-gold/25">
            <BrandPanel accent="navy" label="Doral Legacy Park" className="absolute inset-0" />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gold">{dict.aboutPage.factsHeading}</p>
        <StatStrip
          stats={[
            { value: "2", label: dict.aboutPage.factSeasons },
            { value: "2", label: dict.aboutPage.factDivisions },
            { value: "8", label: dict.aboutPage.factClubs },
            { value: "4", label: dict.aboutPage.factFinals },
          ]}
        />
      </Section>
    </>
  );
}
