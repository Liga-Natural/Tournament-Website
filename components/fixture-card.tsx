import type { FixtureRecord, TeamRecord } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Crest } from "./crest";

function Side({ team, fallback }: { team: TeamRecord | null | undefined; fallback: string | null }) {
  const name = team?.name ?? fallback ?? "TBA";
  return (
    <div className="flex flex-1 items-center gap-2.5 min-w-0">
      <Crest name={name} crestUrl={team?.crestUrl} colorPrimary={team?.colorPrimary} size={32} />
      <span className="truncate text-sm font-medium text-navy-deep">{name}</span>
    </div>
  );
}

export function FixtureCard({
  fixture,
  homeTeam,
  awayTeam,
  dict,
}: {
  fixture: FixtureRecord;
  homeTeam: TeamRecord | null;
  awayTeam: TeamRecord | null;
  dict: Dictionary;
}) {
  const isDone = fixture.status === "completed";
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lg shadow-black/30">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-navy/60">
        <span>
          {fixture.round ? `${fixture.round} · ` : ""}
          {fixture.date
            ? new Date(fixture.date + "T12:00:00").toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : dict.common.tba}
          {fixture.time ? ` · ${fixture.time}` : ""}
        </span>
        <span>{fixture.field ?? fixture.venueOverride ?? ""}</span>
      </div>
      <div className="flex items-center gap-3">
        <Side team={homeTeam} fallback={fixture.homeTeamNameFallback} />
        <div className="shrink-0 text-center">
          {isDone ? (
            <div className="font-display tabular text-xl font-bold text-navy-deep">
              {fixture.homeScore}–{fixture.awayScore}
            </div>
          ) : (
            <div className="text-xs font-semibold uppercase text-navy/60">{dict.common.vs}</div>
          )}
          {isDone && fixture.homeScoreHt !== null && fixture.awayScoreHt !== null && (
            <div className="text-[10px] text-navy/50">
              {dict.common.halftime} {fixture.homeScoreHt}–{fixture.awayScoreHt}
            </div>
          )}
        </div>
        <Side team={awayTeam} fallback={fixture.awayTeamNameFallback} />
      </div>
      {fixture.penaltyNote && (
        <p className="mt-2 text-center text-xs font-medium text-[#8a6a1f]">
          {dict.common.penalties}: {fixture.penaltyNote}
        </p>
      )}
    </div>
  );
}
