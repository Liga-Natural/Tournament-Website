import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPartners } from "@/lib/store";
import { PageHeader, Section, StarDivider, EmptyState } from "@/components/page-parts";
import { StatStrip } from "@/components/stat-strip";
import { BrandPanel } from "@/components/brand-panel";
import { PartnerEnquiryForm } from "@/components/partner-enquiry-form";

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  const partners = await getPartners();
  const current = partners.filter((p) => p.status === "current");
  const previous = partners.filter((p) => p.status === "previous");

  const perks = [
    { title: dict.partnersPage.perkJersey, body: dict.partnersPage.perkJerseyBody },
    { title: dict.partnersPage.perkGraphics, body: dict.partnersPage.perkGraphicsBody },
    { title: dict.partnersPage.perkSignage, body: dict.partnersPage.perkSignageBody },
    { title: dict.partnersPage.perkCredit, body: dict.partnersPage.perkCreditBody },
    { title: dict.partnersPage.perkContent, body: dict.partnersPage.perkContentBody },
  ];

  return (
    <>
      <PageHeader kicker={dict.partnersPage.subheading} title={dict.partnersPage.heading} />

      <Section className="pt-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-cream sm:text-4xl">
            {dict.partnersPage.pitchHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">{dict.partnersPage.pitchBody}</p>
        </div>
      </Section>

      <Section className="pt-0">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gold">
          {dict.partnersPage.statsHeading}
        </p>
        <StatStrip
          stats={[
            { value: "200,000+", label: dict.partnersPage.statInstagram },
            { value: "8", label: dict.partnersPage.statClubs },
            { value: "2", label: dict.partnersPage.statPlayers },
            { value: "4", label: dict.partnersPage.statMatches },
          ]}
        />
      </Section>

      <Section className="pt-0">
        <h2 className="mb-6 text-center font-display text-2xl font-bold uppercase tracking-wide text-gold-light">
          {dict.partnersPage.whatYouGetHeading}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-lg border border-gold/20 bg-navy-raised/50 p-5">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-cream">{perk.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{perk.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <StarDivider />
      </Section>

      <Section className="pt-0">
        <h2 className="mb-5 font-display text-2xl font-bold uppercase tracking-wide text-cream">
          {dict.partnersPage.currentHeading}
        </h2>
        {current.length === 0 ? (
          <EmptyState message={dict.partnersPage.currentEmpty} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {current.map((p) => (
              <PartnerCard key={p.id} name={p.name} description={locale === "es" ? p.descriptionEs : p.descriptionEn} />
            ))}
          </div>
        )}
      </Section>

      <Section className="pt-0">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-cream">{dict.partnersPage.previousHeading}</h2>
        <p className="mt-1 text-sm text-muted">{dict.partnersPage.previousSubheading}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previous.map((p) => (
            <PartnerCard
              key={p.id}
              name={p.name}
              description={locale === "es" ? p.descriptionEs : p.descriptionEn}
              instagram={p.instagram}
              badge={p.tier === "title" ? "Title Partner" : undefined}
            />
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="mx-auto max-w-2xl rounded-xl border border-gold/30 bg-navy-raised/60 p-6 sm:p-10">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-cream">{dict.partnersPage.formHeading}</h2>
          <p className="mt-2 text-sm text-muted">{dict.partnersPage.formBody}</p>
          <div className="mt-6">
            <PartnerEnquiryForm dict={dict} />
          </div>
        </div>
      </Section>
    </>
  );
}

function PartnerCard({
  name,
  description,
  instagram,
  badge,
}: {
  name: string;
  description: string;
  instagram?: string | null;
  badge?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gold/20 bg-navy-raised/50">
      <div className="relative aspect-[16/9]">
        <BrandPanel accent="navy" label={name} className="absolute inset-0" />
      </div>
      <div className="p-4">
        {badge && (
          <span className="mb-1.5 inline-block rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-light">
            {badge}
          </span>
        )}
        <h3 className="font-display text-lg font-bold text-cream">{name}</h3>
        <p className="mt-1 text-sm text-muted">{description}</p>
        {instagram && <p className="mt-1.5 text-xs text-gold-light">{instagram}</p>}
      </div>
    </div>
  );
}
