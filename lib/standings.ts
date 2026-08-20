import type { FixtureRecord, StandingsRow, TeamRecord } from "./types";

/**
 * Computes a live standings table from completed fixtures.
 * 3 points for a win, 1 for a draw, 0 for a loss.
 * Sort: points, then goal difference, then goals for, then team name.
 */
export function computeStandings(teams: TeamRecord[], fixtures: FixtureRecord[]): StandingsRow[] {
  const rows = new Map<string, StandingsRow>();
  for (const team of teams) {
    rows.set(team.id, {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      form: [],
    });
  }

  const completed = fixtures
    .filter((f) => f.status === "completed" && f.homeScore !== null && f.awayScore !== null)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  for (const fx of completed) {
    const home = fx.homeTeamId ? rows.get(fx.homeTeamId) : undefined;
    const away = fx.awayTeamId ? rows.get(fx.awayTeamId) : undefined;
    const hs = fx.homeScore as number;
    const as = fx.awayScore as number;

    if (home) {
      home.played += 1;
      home.goalsFor += hs;
      home.goalsAgainst += as;
      if (hs > as) {
        home.won += 1;
        home.points += 3;
        home.form.push("W");
      } else if (hs === as) {
        home.drawn += 1;
        home.points += 1;
        home.form.push("D");
      } else {
        home.lost += 1;
        home.form.push("L");
      }
    }
    if (away) {
      away.played += 1;
      away.goalsFor += as;
      away.goalsAgainst += hs;
      if (as > hs) {
        away.won += 1;
        away.points += 3;
        away.form.push("W");
      } else if (as === hs) {
        away.drawn += 1;
        away.points += 1;
        away.form.push("D");
      } else {
        away.lost += 1;
        away.form.push("L");
      }
    }
  }

  const list = Array.from(rows.values()).map((r) => ({
    ...r,
    goalDiff: r.goalsFor - r.goalsAgainst,
    form: r.form.slice(-5),
  }));

  list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });

  return list;
}
