import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getEvent, getDivisions, getTeams, getFixtures, getReferees } from "@/lib/store";
import {
  createDivisionAction,
  deleteDivisionAction,
  createTeamAction,
  deleteTeamAction,
  createFixtureAction,
  deleteFixtureAction,
  updateFixtureResultAction,
  assignRefereeAction,
} from "@/app/actions/admin";
import { LabeledInput } from "../page";

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = (isLocale(rawLocale) ? rawLocale : "en") as Locale;
  const base = `/${locale}/admin`;

  const event = await getEvent(id);
  if (!event) notFound();
  const [divisions, teams, fixtures, referees] = await Promise.all([
    getDivisions(event.id),
    getTeams(event.id),
    getFixtures(event.id),
    getReferees(),
  ]);
  const teamName = (tid: string | null) => teams.find((t) => t.id === tid)?.name ?? "—";

  return (
    <div className="space-y-12">
      <div>
        <Link href={`${base}/events`} className="text-sm text-muted hover:text-gold-light">
          ← All events
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-wide text-cream">{event.name}</h1>
      </div>

      {/* Divisions */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">Divisions</h2>
        <ul className="mb-4 space-y-2">
          {divisions.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded border border-gold/20 bg-navy-raised/40 px-3 py-2 text-sm">
              <span className="text-cream">{d.name}</span>
              <form action={deleteDivisionAction}>
                <input type="hidden" name="id" value={d.id} />
                <button className="text-red-300 hover:underline">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={createDivisionAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="eventId" value={event.id} />
          <div className="w-48">
            <LabeledInput name="name" label="Division name" required />
          </div>
          <div className="w-24">
            <LabeledInput name="order" label="Order" type="number" />
          </div>
          <button type="submit" className="gold-pill px-4 py-2 text-sm">
            Add Division
          </button>
        </form>
      </section>

      {/* Teams */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">Teams</h2>
        <div className="mb-4 overflow-hidden rounded-lg border border-gold/20">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-navy-raised text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2">Division</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.id} className="border-t border-gold/10">
                  <td className="px-3 py-2 font-medium text-cream">{t.name}</td>
                  <td className="px-3 py-2 text-muted">{divisions.find((d) => d.id === t.divisionId)?.name ?? "—"}</td>
                  <td className="px-3 py-2 text-right space-x-3">
                    <Link href={`${base}/teams/${t.id}`} className="text-gold-light hover:underline">
                      Roster
                    </Link>
                    <form action={deleteTeamAction} className="inline">
                      <input type="hidden" name="id" value={t.id} />
                      <button className="text-red-300 hover:underline">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={createTeamAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="eventId" value={event.id} />
          <div className="w-56">
            <LabeledInput name="name" label="Team name" required />
          </div>
          <div className="w-48">
            <label className="mb-1 block text-xs font-medium text-muted">Division</label>
            <select name="divisionId" className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream">
              <option value="">—</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="gold-pill px-4 py-2 text-sm">
            Add Team
          </button>
        </form>
      </section>

      {/* Fixtures */}
      <section>
        <h2 className="mb-3 font-display text-xl font-bold uppercase tracking-wide text-gold-light">Fixtures &amp; Results</h2>
        <div className="mb-6 space-y-3">
          {fixtures.map((fx) => (
            <div key={fx.id} className="rounded-lg border border-gold/20 bg-navy-raised/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
                <span>
                  {fx.round ?? "Match"} · {fx.date ?? "TBA"} {fx.time ?? ""} · {fx.field ?? "—"}
                </span>
                <form action={deleteFixtureAction}>
                  <input type="hidden" name="id" value={fx.id} />
                  <button className="text-red-300 hover:underline">Delete</button>
                </form>
              </div>
              <div className="mt-1 font-medium text-cream">
                {fx.homeTeamId ? teamName(fx.homeTeamId) : fx.homeTeamNameFallback ?? "TBA"} vs{" "}
                {fx.awayTeamId ? teamName(fx.awayTeamId) : fx.awayTeamNameFallback ?? "TBA"}
                {fx.status === "completed" && (
                  <span className="ml-2 font-display tabular text-gold-light">
                    ({fx.homeScore}–{fx.awayScore})
                  </span>
                )}
              </div>

              <form action={updateFixtureResultAction} className="mt-3 flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={fx.id} />
                <div className="w-20">
                  <label className="mb-1 block text-xs font-medium text-muted">Home</label>
                  <input
                    name="homeScore"
                    type="number"
                    min={0}
                    defaultValue={fx.homeScore ?? ""}
                    className="w-full rounded border border-gold/25 bg-navy-deep px-2 py-1.5 text-sm text-cream"
                  />
                </div>
                <div className="w-20">
                  <label className="mb-1 block text-xs font-medium text-muted">Away</label>
                  <input
                    name="awayScore"
                    type="number"
                    min={0}
                    defaultValue={fx.awayScore ?? ""}
                    className="w-full rounded border border-gold/25 bg-navy-deep px-2 py-1.5 text-sm text-cream"
                  />
                </div>
                <div className="w-40">
                  <label className="mb-1 block text-xs font-medium text-muted">Penalty note (optional)</label>
                  <input
                    name="penaltyNote"
                    defaultValue={fx.penaltyNote ?? ""}
                    className="w-full rounded border border-gold/25 bg-navy-deep px-2 py-1.5 text-sm text-cream"
                  />
                </div>
                <button type="submit" className="rounded border border-gold/40 px-3 py-1.5 text-sm text-gold-light hover:bg-gold/10">
                  Save Result
                </button>
              </form>

              <form action={assignRefereeAction} className="mt-2 flex items-end gap-2">
                <input type="hidden" name="id" value={fx.id} />
                <div className="w-56">
                  <label className="mb-1 block text-xs font-medium text-muted">Assigned referee</label>
                  <select name="refereeId" defaultValue={fx.refereeId ?? ""} className="w-full rounded border border-gold/25 bg-navy-deep px-2 py-1.5 text-sm text-cream">
                    <option value="">Unassigned</option>
                    {referees.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="rounded border border-gold/40 px-3 py-1.5 text-sm text-gold-light hover:bg-gold/10">
                  Assign
                </button>
              </form>
            </div>
          ))}
        </div>

        <form action={createFixtureAction} className="grid gap-3 rounded-lg border border-gold/20 bg-navy-raised/40 p-4 sm:grid-cols-3">
          <input type="hidden" name="eventId" value={event.id} />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Division</label>
            <select name="divisionId" className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream">
              <option value="">—</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Home team</label>
            <select name="homeTeamId" className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream">
              <option value="">—</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Away team</label>
            <select name="awayTeamId" className="w-full rounded border border-gold/25 bg-navy-deep px-3 py-2 text-sm text-cream">
              <option value="">—</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <LabeledInput name="date" label="Date" type="date" />
          <LabeledInput name="time" label="Time" type="time" />
          <LabeledInput name="field" label="Field / venue" />
          <LabeledInput name="round" label="Round (e.g. Matchday 3, Final)" />
          <div className="sm:col-span-3">
            <button type="submit" className="gold-pill px-5 py-2.5 text-sm">
              Add Fixture
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
