"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import * as store from "@/lib/store";

async function requireOrganizer() {
  const session = await getSession();
  if (!session || session.role !== "organizer") {
    throw new Error("Not authorized");
  }
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}
function optStr(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v ? v : null;
}
function optInt(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function slugify(v: string): string {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---- Events ----
export async function createEventAction(formData: FormData) {
  await requireOrganizer();
  const name = str(formData, "name");
  await store.createEvent({
    slug: optStr(formData, "slug") ?? slugify(name),
    kind: (str(formData, "kind") || "league") as "league" | "cup",
    name,
    shortName: optStr(formData, "shortName") ?? name,
    seasonLabel: optStr(formData, "seasonLabel") ?? "",
    year: optInt(formData, "year") ?? new Date().getFullYear(),
    venueName: optStr(formData, "venueName"),
    venueAddress: optStr(formData, "venueAddress"),
    status: (str(formData, "status") || "upcoming") as "upcoming" | "active" | "completed",
    theme: (str(formData, "theme") || "liga") as "liga" | "copa",
    startDate: optStr(formData, "startDate"),
    endDate: optStr(formData, "endDate"),
    descriptionEn: str(formData, "descriptionEn"),
    descriptionEs: str(formData, "descriptionEs"),
    heroImage: null,
    order: optInt(formData, "order") ?? 99,
  });
  revalidatePath("/[locale]/admin/events", "page");
  revalidatePath("/[locale]/events", "page");
}

export async function deleteEventAction(formData: FormData) {
  await requireOrganizer();
  await store.deleteEvent(str(formData, "id"));
  revalidatePath("/[locale]/admin/events", "page");
  revalidatePath("/[locale]/events", "page");
}

// ---- Divisions ----
export async function createDivisionAction(formData: FormData) {
  await requireOrganizer();
  await store.createDivision({
    eventId: str(formData, "eventId"),
    name: str(formData, "name"),
    order: optInt(formData, "order") ?? 1,
  });
  revalidatePath("/[locale]/admin/events/[id]", "page");
}
export async function deleteDivisionAction(formData: FormData) {
  await requireOrganizer();
  await store.deleteDivision(str(formData, "id"));
  revalidatePath("/[locale]/admin/events/[id]", "page");
}

// ---- Teams ----
export async function createTeamAction(formData: FormData) {
  await requireOrganizer();
  const name = str(formData, "name");
  await store.createTeam({
    eventId: str(formData, "eventId"),
    divisionId: optStr(formData, "divisionId"),
    name,
    slug: slugify(name),
    crestUrl: null,
    colorPrimary: null,
    squadPhotoUrl: null,
  });
  revalidatePath("/[locale]/admin/events/[id]", "page");
}
export async function deleteTeamAction(formData: FormData) {
  await requireOrganizer();
  await store.deleteTeam(str(formData, "id"));
  revalidatePath("/[locale]/admin/events/[id]", "page");
}

// ---- Players ----
export async function createPlayerAction(formData: FormData) {
  await requireOrganizer();
  await store.createPlayer({
    teamId: str(formData, "teamId"),
    name: str(formData, "name"),
    shirtNumber: optInt(formData, "shirtNumber"),
    position: optStr(formData, "position"),
  });
  revalidatePath("/[locale]/admin/teams/[id]", "page");
}
export async function deletePlayerAction(formData: FormData) {
  await requireOrganizer();
  await store.deletePlayer(str(formData, "id"));
  revalidatePath("/[locale]/admin/teams/[id]", "page");
}

// ---- Fixtures ----
export async function createFixtureAction(formData: FormData) {
  await requireOrganizer();
  await store.createFixture({
    eventId: str(formData, "eventId"),
    divisionId: optStr(formData, "divisionId"),
    homeTeamId: optStr(formData, "homeTeamId"),
    awayTeamId: optStr(formData, "awayTeamId"),
    homeTeamNameFallback: optStr(formData, "homeTeamNameFallback"),
    awayTeamNameFallback: optStr(formData, "awayTeamNameFallback"),
    date: optStr(formData, "date"),
    time: optStr(formData, "time"),
    field: optStr(formData, "field"),
    venueOverride: optStr(formData, "venueOverride"),
    status: "scheduled",
    homeScore: null,
    awayScore: null,
    homeScoreHt: null,
    awayScoreHt: null,
    penaltyNote: null,
    refereeId: optStr(formData, "refereeId"),
    round: optStr(formData, "round"),
    notes: null,
  });
  revalidatePath("/[locale]/admin/events/[id]", "page");
}
export async function updateFixtureResultAction(formData: FormData) {
  await requireOrganizer();
  await store.submitResult(str(formData, "id"), {
    homeScore: optInt(formData, "homeScore") ?? 0,
    awayScore: optInt(formData, "awayScore") ?? 0,
    homeScoreHt: optInt(formData, "homeScoreHt"),
    awayScoreHt: optInt(formData, "awayScoreHt"),
  });
  const penaltyNote = optStr(formData, "penaltyNote");
  if (penaltyNote !== undefined) {
    await store.updateFixture(str(formData, "id"), { penaltyNote });
  }
  revalidatePath("/[locale]/admin/events/[id]", "page");
  revalidatePath("/[locale]/events/[slug]", "page");
}
export async function assignRefereeAction(formData: FormData) {
  await requireOrganizer();
  await store.updateFixture(str(formData, "id"), { refereeId: optStr(formData, "refereeId") });
  revalidatePath("/[locale]/admin/events/[id]", "page");
}
export async function deleteFixtureAction(formData: FormData) {
  await requireOrganizer();
  await store.deleteFixture(str(formData, "id"));
  revalidatePath("/[locale]/admin/events/[id]", "page");
}

// ---- Referees ----
export async function createRefereeAction(formData: FormData) {
  await requireOrganizer();
  await store.createReferee(str(formData, "name"));
  revalidatePath("/[locale]/admin/referees", "page");
}
export async function deleteRefereeAction(formData: FormData) {
  await requireOrganizer();
  await store.deleteReferee(str(formData, "id"));
  revalidatePath("/[locale]/admin/referees", "page");
}
export async function regenerateRefereeCodeAction(formData: FormData) {
  await requireOrganizer();
  await store.regenerateRefereeCode(str(formData, "id"));
  revalidatePath("/[locale]/admin/referees", "page");
}
export async function toggleRefereeActiveAction(formData: FormData) {
  await requireOrganizer();
  await store.updateReferee(str(formData, "id"), { active: str(formData, "active") === "true" });
  revalidatePath("/[locale]/admin/referees", "page");
}

// ---- Partners ----
export async function createPartnerAction(formData: FormData) {
  await requireOrganizer();
  await store.createPartner({
    name: str(formData, "name"),
    tier: (str(formData, "tier") || "season") as "title" | "season" | "current" | "previous",
    status: (str(formData, "status") || "current") as "current" | "previous",
    logoUrl: null,
    instagram: optStr(formData, "instagram"),
    descriptionEn: str(formData, "descriptionEn"),
    descriptionEs: str(formData, "descriptionEs"),
    order: optInt(formData, "order") ?? 99,
  });
  revalidatePath("/[locale]/admin/partners", "page");
  revalidatePath("/[locale]/partners", "page");
}
export async function deletePartnerAction(formData: FormData) {
  await requireOrganizer();
  await store.deletePartner(str(formData, "id"));
  revalidatePath("/[locale]/admin/partners", "page");
  revalidatePath("/[locale]/partners", "page");
}
