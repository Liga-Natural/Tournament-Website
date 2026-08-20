import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getTeamBySlug, getPlayers, getEventBySlug } from "@/lib/store";
import { Section, EmptyState } from "@/components/page-parts";
import { Crest } from "@/components/crest";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; eventSlug: string; teamSlug: string }>;
}) {
  const { locale: rawLocale, eventSlug, teamSlug } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const dict = getDictionary(locale);

  const [event, team] = await Promise.all([getEventBySlug(eventSlug), getTeamBySlug(eventSlug, teamSlug)]);
  if (!event || !team) notFound();
  const players = await getPlayers(team.id);

  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-8 pt-16 text-center">
        <Crest name={team.name} crestUrl={team.crestUrl} size={96} />
        <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-wide text-cream sm:text-5xl">
          {team.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {event.name}
        </p>
        {!team.crestUrl && <p className="mt-3 text-xs text-muted">{dict.teamsPage.crestPending}</p>}
      </div>

      {team.squadPhotoUrl && (
        <Section className="pt-0">
          <div className="relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-lg border border-gold/25 bg-navy-deep">
            <Image
              src={team.squadPhotoUrl}
              alt={`${team.name} squad photo`}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </Section>
      )}

      <Section className="pt-0">
        <h2 className="mb-4 font-display text-2xl font-bold uppercase tracking-wide text-gold-light">
          {dict.teamsPage.rosterHeading}
        </h2>
        {players.length === 0 ? (
          <EmptyState message={dict.teamsPage.rosterEmpty} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-gold/25">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-navy-raised text-[11px] uppercase tracking-wide text-muted">
                  <th className="w-14 py-2.5 pl-3 font-semibold">{dict.teamsPage.shirtNumber}</th>
                  <th className="py-2.5 pl-2 font-semibold">{dict.teamsPage.playerName}</th>
                  <th className="py-2.5 pr-3 font-semibold">{dict.teamsPage.playerPosition}</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className="border-t border-gold/10 odd:bg-navy-raised/30">
                    <td className="py-2.5 pl-3 font-display tabular text-base font-bold text-gold-light">
                      {p.shirtNumber ?? "—"}
                    </td>
                    <td className="py-2.5 pl-2 text-sm font-medium text-cream">{p.name}</td>
                    <td className="py-2.5 pr-3 text-sm text-muted">{p.position ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </>
  );
}
