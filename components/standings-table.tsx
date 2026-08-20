import type { StandingsRow } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Crest } from "./crest";

function FormBadge({ result }: { result: "W" | "D" | "L" }) {
  const styles = {
    W: "bg-gold text-navy-deep",
    D: "bg-muted/40 text-cream",
    L: "bg-navy-deep text-muted border border-muted/40",
  } as const;
  return (
    <span className={`inline-grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${styles[result]}`}>
      {result}
    </span>
  );
}

export function StandingsTable({ rows, dict }: { rows: StandingsRow[]; dict: Dictionary }) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-gold/20 bg-navy-raised/50 p-6 text-center text-muted">{dict.eventDetail.noStandings}</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gold/25">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-navy-raised text-[11px] uppercase tracking-wide text-muted">
            <th className="w-8 py-2.5 pl-3 font-semibold">{dict.common.position}</th>
            <th className="py-2.5 pl-2 font-semibold">{dict.common.team}</th>
            <th className="w-8 py-2.5 text-center font-semibold tabular">{dict.common.played}</th>
            <th className="hidden w-8 py-2.5 text-center font-semibold tabular sm:table-cell">{dict.common.won}</th>
            <th className="hidden w-8 py-2.5 text-center font-semibold tabular sm:table-cell">{dict.common.lost}</th>
            <th className="hidden w-16 py-2.5 text-center font-semibold tabular md:table-cell">
              {dict.common.goalsForAgainst}
            </th>
            <th className="w-10 py-2.5 text-center font-semibold tabular">{dict.common.goalDiff}</th>
            <th className="w-10 py-2.5 pr-3 text-center font-semibold tabular">{dict.common.points}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.team.id} className="border-t border-gold/10 odd:bg-navy-raised/30">
              <td className="py-2.5 pl-3 font-display text-base font-bold text-gold-light tabular">{i + 1}</td>
              <td className="py-2.5 pl-2">
                <div className="flex items-center gap-2.5">
                  <Crest name={r.team.name} crestUrl={r.team.crestUrl} size={28} />
                  <span className="text-sm font-medium text-cream">{r.team.name}</span>
                  {r.form.length > 0 && (
                    <span className="hidden gap-0.5 lg:flex">
                      {r.form.map((f, idx) => (
                        <FormBadge key={idx} result={f} />
                      ))}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-2.5 text-center text-sm tabular text-cream/90">{r.played}</td>
              <td className="hidden py-2.5 text-center text-sm tabular text-cream/90 sm:table-cell">{r.won}</td>
              <td className="hidden py-2.5 text-center text-sm tabular text-cream/90 sm:table-cell">{r.lost}</td>
              <td className="hidden py-2.5 text-center text-sm tabular text-cream/90 md:table-cell">
                {r.goalsFor}:{r.goalsAgainst}
              </td>
              <td className="py-2.5 text-center text-sm tabular text-cream/90">
                {r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}
              </td>
              <td className="py-2.5 pr-3 text-center font-display text-base font-bold tabular text-gold-light">
                {r.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
