import { TABLES } from "./persistence/adapter";
import { FileAdapter } from "./persistence/file-adapter";
import { SupabaseAdapter } from "./persistence/supabase-adapter";
import type {
  EventRecord,
  DivisionRecord,
  TeamRecord,
  PlayerRecord,
  FixtureRecord,
  RefereeRecord,
  EditionAward,
  PartnerRecord,
  GalleryImageRecord,
  ContactSubmission,
  PartnerEnquiry,
  JoinSubmission,
  Session,
} from "./types";

const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const isDemoMode = !useSupabase;

const adapter = useSupabase ? new SupabaseAdapter() : new FileAdapter();

function id(prefix: string): string {
  const rand = typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${prefix}-${rand}`;
}

function refCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 ambiguity
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// ---------- Reads ----------

export async function getEvents(): Promise<EventRecord[]> {
  const rows = await adapter.getAll<EventRecord>(TABLES.events);
  return rows.sort((a, b) => a.order - b.order);
}

export async function getEventBySlug(slug: string): Promise<EventRecord | null> {
  const rows = await adapter.getAll<EventRecord>(TABLES.events);
  return rows.find((r) => r.slug === slug) ?? null;
}

export async function getEvent(id: string): Promise<EventRecord | null> {
  return adapter.getById<EventRecord>(TABLES.events, id);
}

export async function getDivisions(eventId?: string): Promise<DivisionRecord[]> {
  const rows = await adapter.getAll<DivisionRecord>(TABLES.divisions);
  const filtered = eventId ? rows.filter((r) => r.eventId === eventId) : rows;
  return filtered.sort((a, b) => a.order - b.order);
}

export async function getTeams(eventId?: string): Promise<TeamRecord[]> {
  const rows = await adapter.getAll<TeamRecord>(TABLES.teams);
  const filtered = eventId ? rows.filter((r) => r.eventId === eventId) : rows;
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getTeam(id: string): Promise<TeamRecord | null> {
  return adapter.getById<TeamRecord>(TABLES.teams, id);
}

export async function getTeamBySlug(eventSlug: string, teamSlug: string): Promise<TeamRecord | null> {
  const event = await getEventBySlug(eventSlug);
  if (!event) return null;
  const rows = await getTeams(event.id);
  return rows.find((t) => t.slug === teamSlug) ?? null;
}

export async function getPlayers(teamId: string): Promise<PlayerRecord[]> {
  const rows = await adapter.getAll<PlayerRecord>(TABLES.players);
  return rows
    .filter((r) => r.teamId === teamId)
    .sort((a, b) => (a.shirtNumber ?? 999) - (b.shirtNumber ?? 999));
}

export async function getFixtures(eventId?: string): Promise<FixtureRecord[]> {
  const rows = await adapter.getAll<FixtureRecord>(TABLES.fixtures);
  const filtered = eventId ? rows.filter((r) => r.eventId === eventId) : rows;
  return filtered.sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
}

export async function getFixture(id: string): Promise<FixtureRecord | null> {
  return adapter.getById<FixtureRecord>(TABLES.fixtures, id);
}

export async function getReferees(): Promise<RefereeRecord[]> {
  const rows = await adapter.getAll<RefereeRecord>(TABLES.referees);
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getReferee(id: string): Promise<RefereeRecord | null> {
  return adapter.getById<RefereeRecord>(TABLES.referees, id);
}

export async function getEditionAwards(eventId?: string): Promise<EditionAward[]> {
  const rows = await adapter.getAll<EditionAward>(TABLES.editionAwards);
  return eventId ? rows.filter((r) => r.eventId === eventId) : rows;
}

export async function getPartners(): Promise<PartnerRecord[]> {
  const rows = await adapter.getAll<PartnerRecord>(TABLES.partners);
  return rows.sort((a, b) => a.order - b.order);
}

export async function getGalleryImages(): Promise<GalleryImageRecord[]> {
  return adapter.getAll<GalleryImageRecord>(TABLES.galleryImages);
}

// ---------- Auth ----------

export async function verifyCode(rawCode: string): Promise<Session | null> {
  const code = rawCode.trim();
  if (!code) return null;
  const organizerCode = (await adapter.getKV("organizer_code")) ?? "";
  if (organizerCode && code.toUpperCase() === organizerCode.toUpperCase()) {
    return { role: "organizer" };
  }
  const referees = await getReferees();
  const match = referees.find((r) => r.active && r.code.toUpperCase() === code.toUpperCase());
  if (match) return { role: "referee", refereeId: match.id };
  return null;
}

export async function setOrganizerCode(newCode: string): Promise<void> {
  await adapter.setKV("organizer_code", newCode.trim());
}

// ---------- Organizer mutations ----------

export async function createEvent(input: Omit<EventRecord, "id">): Promise<EventRecord> {
  return adapter.insert(TABLES.events, { ...input, id: id("ev") });
}
export async function updateEvent(eventId: string, patch: Partial<EventRecord>): Promise<EventRecord | null> {
  return adapter.update(TABLES.events, eventId, patch);
}
export async function deleteEvent(eventId: string): Promise<void> {
  const [divs, tms, fxs] = await Promise.all([getDivisions(eventId), getTeams(eventId), getFixtures(eventId)]);
  await Promise.all(fxs.map((f) => adapter.remove(TABLES.fixtures, f.id)));
  for (const t of tms) {
    const pls = await getPlayers(t.id);
    await Promise.all(pls.map((p) => adapter.remove(TABLES.players, p.id)));
    await adapter.remove(TABLES.teams, t.id);
  }
  await Promise.all(divs.map((d) => adapter.remove(TABLES.divisions, d.id)));
  const awards = await getEditionAwards(eventId);
  await Promise.all(awards.map((a) => adapter.remove(TABLES.editionAwards, a.id)));
  await adapter.remove(TABLES.events, eventId);
}

export async function createDivision(input: Omit<DivisionRecord, "id">): Promise<DivisionRecord> {
  return adapter.insert(TABLES.divisions, { ...input, id: id("div") });
}
export async function updateDivision(divId: string, patch: Partial<DivisionRecord>): Promise<DivisionRecord | null> {
  return adapter.update(TABLES.divisions, divId, patch);
}
export async function deleteDivision(divId: string): Promise<void> {
  await adapter.remove(TABLES.divisions, divId);
}

export async function createTeam(input: Omit<TeamRecord, "id">): Promise<TeamRecord> {
  return adapter.insert(TABLES.teams, { ...input, id: id("team") });
}
export async function updateTeam(teamId: string, patch: Partial<TeamRecord>): Promise<TeamRecord | null> {
  return adapter.update(TABLES.teams, teamId, patch);
}
export async function deleteTeam(teamId: string): Promise<void> {
  const pls = await getPlayers(teamId);
  await Promise.all(pls.map((p) => adapter.remove(TABLES.players, p.id)));
  await adapter.remove(TABLES.teams, teamId);
}

export async function createPlayer(input: Omit<PlayerRecord, "id">): Promise<PlayerRecord> {
  return adapter.insert(TABLES.players, { ...input, id: id("player") });
}
export async function updatePlayer(playerId: string, patch: Partial<PlayerRecord>): Promise<PlayerRecord | null> {
  return adapter.update(TABLES.players, playerId, patch);
}
export async function deletePlayer(playerId: string): Promise<void> {
  await adapter.remove(TABLES.players, playerId);
}

export async function createFixture(input: Omit<FixtureRecord, "id">): Promise<FixtureRecord> {
  return adapter.insert(TABLES.fixtures, { ...input, id: id("fx") });
}
export async function updateFixture(fixtureId: string, patch: Partial<FixtureRecord>): Promise<FixtureRecord | null> {
  return adapter.update(TABLES.fixtures, fixtureId, patch);
}
export async function deleteFixture(fixtureId: string): Promise<void> {
  await adapter.remove(TABLES.fixtures, fixtureId);
}

export async function submitResult(
  fixtureId: string,
  result: { homeScore: number; awayScore: number; homeScoreHt?: number | null; awayScoreHt?: number | null }
): Promise<FixtureRecord | null> {
  return adapter.update<FixtureRecord>(TABLES.fixtures, fixtureId, {
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    homeScoreHt: result.homeScoreHt ?? null,
    awayScoreHt: result.awayScoreHt ?? null,
    status: "completed",
  });
}

export async function createReferee(name: string): Promise<RefereeRecord> {
  const existing = await getReferees();
  let code = refCode();
  while (existing.some((r) => r.code === code)) code = refCode();
  return adapter.insert(TABLES.referees, { id: id("ref"), name, code, active: true });
}
export async function updateReferee(refereeId: string, patch: Partial<RefereeRecord>): Promise<RefereeRecord | null> {
  return adapter.update(TABLES.referees, refereeId, patch);
}
export async function deleteReferee(refereeId: string): Promise<void> {
  await adapter.remove(TABLES.referees, refereeId);
}
export async function regenerateRefereeCode(refereeId: string): Promise<RefereeRecord | null> {
  const existing = await getReferees();
  let code = refCode();
  while (existing.some((r) => r.code === code)) code = refCode();
  return adapter.update<RefereeRecord>(TABLES.referees, refereeId, { code });
}

export async function createEditionAward(input: Omit<EditionAward, "id">): Promise<EditionAward> {
  return adapter.insert(TABLES.editionAwards, { ...input, id: id("award") });
}

export async function createPartner(input: Omit<PartnerRecord, "id">): Promise<PartnerRecord> {
  return adapter.insert(TABLES.partners, { ...input, id: id("partner") });
}
export async function updatePartner(partnerId: string, patch: Partial<PartnerRecord>): Promise<PartnerRecord | null> {
  return adapter.update(TABLES.partners, partnerId, patch);
}
export async function deletePartner(partnerId: string): Promise<void> {
  await adapter.remove(TABLES.partners, partnerId);
}

// ---------- Public submissions ----------

export async function addContactSubmission(input: Omit<ContactSubmission, "id" | "createdAt">): Promise<ContactSubmission> {
  return adapter.insert(TABLES.contactSubmissions, { ...input, id: id("contact"), createdAt: new Date().toISOString() });
}
export async function addPartnerEnquiry(input: Omit<PartnerEnquiry, "id" | "createdAt">): Promise<PartnerEnquiry> {
  return adapter.insert(TABLES.partnerEnquiries, { ...input, id: id("enquiry"), createdAt: new Date().toISOString() });
}
export async function addJoinSubmission(input: Omit<JoinSubmission, "id" | "createdAt">): Promise<JoinSubmission> {
  return adapter.insert(TABLES.joinSubmissions, { ...input, id: id("join"), createdAt: new Date().toISOString() });
}
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const rows = await adapter.getAll<ContactSubmission>(TABLES.contactSubmissions);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function getPartnerEnquiries(): Promise<PartnerEnquiry[]> {
  const rows = await adapter.getAll<PartnerEnquiry>(TABLES.partnerEnquiries);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function getJoinSubmissions(): Promise<JoinSubmission[]> {
  const rows = await adapter.getAll<JoinSubmission>(TABLES.joinSubmissions);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
