import {
  getEvents,
  getDivisions,
  getTeams,
  getFixtures,
  getEditionAwards,
} from "./store";
import { computeStandings } from "./standings";
import type { EventRecord, FixtureRecord, TeamRecord } from "./types";

export async function getEventFull(slug: string) {
  const events = await getEvents();
  const event = events.find((e) => e.slug === slug);
  if (!event) return null;
  const [divisions, teams, fixtures, awards] = await Promise.all([
    getDivisions(event.id),
    getTeams(event.id),
    getFixtures(event.id),
    getEditionAwards(event.id),
  ]);
  return { event, divisions, teams, fixtures, awards };
}

export function teamsById(teams: TeamRecord[]): Map<string, TeamRecord> {
  return new Map(teams.map((t) => [t.id, t]));
}

export function standingsByDivision(teams: TeamRecord[], fixtures: FixtureRecord[]) {
  const divisionIds = Array.from(new Set(teams.map((t) => t.divisionId).filter(Boolean))) as string[];
  const map = new Map<string | null, ReturnType<typeof computeStandings>>();
  if (divisionIds.length === 0) {
    map.set(null, computeStandings(teams, fixtures));
    return map;
  }
  for (const divId of divisionIds) {
    const divTeams = teams.filter((t) => t.divisionId === divId);
    const divFixtures = fixtures.filter((f) => f.divisionId === divId);
    map.set(divId, computeStandings(divTeams, divFixtures));
  }
  return map;
}

/** All fixtures across every event, most useful for the site-wide schedule page. */
export async function getAllFixturesWithContext() {
  const events = await getEvents();
  const results: { event: EventRecord; fixture: FixtureRecord; home: TeamRecord | null; away: TeamRecord | null }[] = [];
  for (const event of events) {
    const [teams, fixtures] = await Promise.all([getTeams(event.id), getFixtures(event.id)]);
    const byId = teamsById(teams);
    for (const fixture of fixtures) {
      results.push({
        event,
        fixture,
        home: fixture.homeTeamId ? byId.get(fixture.homeTeamId) ?? null : null,
        away: fixture.awayTeamId ? byId.get(fixture.awayTeamId) ?? null : null,
      });
    }
  }
  return results;
}

/** Featured highlight for the homepage: next scheduled fixture, or the most recent result if none. */
export async function getHomeHighlight() {
  const all = await getAllFixturesWithContext();
  const upcoming = all
    .filter((r) => r.fixture.status === "scheduled")
    .sort((a, b) => (a.fixture.date ?? "9999").localeCompare(b.fixture.date ?? "9999"));
  if (upcoming.length > 0) return { kind: "upcoming" as const, item: upcoming[0] };

  const completed = all
    .filter((r) => r.fixture.status === "completed")
    .sort((a, b) => (b.fixture.date ?? "0000").localeCompare(a.fixture.date ?? "0000"));
  if (completed.length > 0) return { kind: "last-result" as const, item: completed[0] };

  return null;
}
