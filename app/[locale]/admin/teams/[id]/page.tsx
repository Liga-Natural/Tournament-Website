import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getTeam, getPlayers, getEvent } from "@/lib/store";
import { createPlayerAction, deletePlayerAction } from "@/app/actions/admin";
import { LabeledInput } from "../../events/page";

export default async function AdminTeamRosterPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const base = `/${locale}/admin`;

  const team = await getTeam(id);
  if (!team) notFound();
  const [players, event] = await Promise.all([getPlayers(team.id), getEvent(team.eventId)]);

  return (
    <div>
      <Link href={`${base}/events/${team.eventId}`} className="text-sm text-muted hover:text-gold-light">
        ← {event?.name ?? "Event"}
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-cream">{team.name} — Roster</h1>

      <div className="mt-6 overflow-hidden rounded-lg border border-gold/20">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-navy-raised text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">No.</th>
              <th className="px-3 py-2">Player</th>
              <th className="px-3 py-2">Position</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-t border-gold/10">
                <td className="px-3 py-2 tabular text-cream">{p.shirtNumber ?? "—"}</td>
                <td className="px-3 py-2 font-medium text-cream">{p.name}</td>
                <td className="px-3 py-2 text-muted">{p.position ?? "—"}</td>
                <td className="px-3 py-2 text-right">
                  <form action={deletePlayerAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-red-300 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={createPlayerAction} className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-gold/20 bg-navy-raised/40 p-4">
        <input type="hidden" name="teamId" value={team.id} />
        <div className="w-56">
          <LabeledInput name="name" label="Player name" required />
        </div>
        <div className="w-28">
          <LabeledInput name="shirtNumber" label="Shirt No." type="number" />
        </div>
        <div className="w-40">
          <LabeledInput name="position" label="Position" />
        </div>
        <button type="submit" className="gold-pill px-4 py-2 text-sm">
          Add Player
        </button>
      </form>
    </div>
  );
}
