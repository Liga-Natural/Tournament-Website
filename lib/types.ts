export type EventKind = "league" | "cup";
export type EventStatus = "upcoming" | "active" | "completed";

export interface EventRecord {
  id: string;
  slug: string;
  kind: EventKind;
  name: string;
  shortName: string;
  seasonLabel: string;
  year: number;
  venueName: string | null;
  venueAddress: string | null;
  status: EventStatus;
  theme: "liga" | "copa"; // visual sub-theme
  startDate: string | null; // ISO date
  endDate: string | null;
  descriptionEn: string;
  descriptionEs: string;
  heroImage: string | null;
  order: number; // display priority, lower = more prominent
}

export interface DivisionRecord {
  id: string;
  eventId: string;
  name: string;
  order: number;
}

export interface TeamRecord {
  id: string;
  eventId: string;
  divisionId: string | null;
  name: string;
  slug: string;
  crestUrl: string | null;
  colorPrimary: string | null;
  squadPhotoUrl: string | null;
}

export interface PlayerRecord {
  id: string;
  teamId: string;
  name: string;
  shirtNumber: number | null;
  position: string | null;
}

export type FixtureStatus = "scheduled" | "completed" | "postponed";

export interface FixtureRecord {
  id: string;
  eventId: string;
  divisionId: string | null;
  homeTeamId: string | null;
  awayTeamId: string | null;
  /** Display name used when a side has no team record yet (e.g. opponent TBC) */
  homeTeamNameFallback: string | null;
  awayTeamNameFallback: string | null;
  date: string | null; // ISO date
  time: string | null; // HH:mm
  field: string | null;
  venueOverride: string | null;
  status: FixtureStatus;
  homeScore: number | null;
  awayScore: number | null;
  homeScoreHt: number | null;
  awayScoreHt: number | null;
  penaltyNote: string | null; // e.g. "Palmeras won 5-4 on penalties"
  refereeId: string | null;
  round: string | null; // e.g. "Grand Final", "Matchday 3"
  notes: string | null;
}

export interface RefereeRecord {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface OrganizerAuth {
  code: string;
}

export interface EditionAward {
  id: string;
  eventId: string;
  divisionName: string;
  champion: string;
  runnerUp: string;
  finalScoreLine: string; // e.g. "4-2 (2-1 HT)"
  finalNotes: string | null;
  mvpName: string;
  mvpTeam: string;
  mvpPosition: string | null;
  mvpStatLine: string | null;
  mvpPhotoUrl: string | null;
}

export interface PartnerRecord {
  id: string;
  name: string;
  tier: "title" | "season" | "current" | "previous";
  status: "current" | "previous";
  logoUrl: string | null;
  instagram: string | null;
  descriptionEn: string;
  descriptionEs: string;
  order: number;
}

export interface GalleryImageRecord {
  id: string;
  url: string | null;
  altEn: string;
  altEs: string;
  caption: string | null;
  orientation: "landscape" | "portrait" | "square";
  accentColor: string; // used for branded fallback panel
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  reason: "sponsorship" | "team-registration" | "referee" | "general";
  message: string;
  createdAt: string;
}

export interface PartnerEnquiry {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  interest: string;
  message: string;
  createdAt: string;
}

export interface JoinSubmission {
  id: string;
  type: "team" | "player" | "referee";
  name: string;
  email: string;
  phone: string | null;
  details: string;
  createdAt: string;
}

export interface StandingsRow {
  team: TeamRecord;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[]; // most recent last
}

export type SessionRole = "organizer" | "referee";

export interface Session {
  role: SessionRole;
  refereeId?: string;
}
