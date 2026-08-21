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
} from "@/lib/types";

/**
 * Seed content for Liga Natural Tournaments.
 * Every fact here is drawn from real organization data supplied by Adrian.
 * Anything not yet confirmed (full season schedules, non-final rosters,
 * 2026 Junior final opponent) is left out rather than invented — see
 * README setup notes for what's still needed from the organizer.
 */

export const INITIAL_ORGANIZER_CODE = "LIGANATURAL2026";

export const events: EventRecord[] = [
  {
    id: "ev-2026",
    slug: "liga-natural-2026",
    kind: "league",
    name: "Liga Natural — Season 2026",
    shortName: "Season 2026",
    seasonLabel: "2026",
    year: 2026,
    venueName: "Doral Legacy Park",
    venueAddress: "Doral, Florida",
    status: "completed",
    theme: "liga",
    startDate: null,
    endDate: "2026-08-09",
    descriptionEn:
      "The flagship Liga Natural season, contested across the Premier and Junior Divisions. Season 2026 is complete — Negronis FC lifted the Premier crown and Gatitos Repelaos took the Junior title.",
    descriptionEs:
      "La temporada insignia de Liga Natural, disputada en la Division Premier y la Division Junior. La Temporada 2026 ya concluyo — Negronis FC se coronó campeon de la Premier y Gatitos Repelaos se llevo el titulo Junior.",
    heroImage: "/gallery/junior-goalkeeper-action.jpg",
    order: 1,
  },
  {
    id: "ev-copa-piston",
    slug: "copa-piston",
    kind: "cup",
    name: "Copa Piston",
    shortName: "Copa Piston",
    seasonLabel: "TBA",
    year: 2026,
    venueName: null,
    venueAddress: null,
    status: "upcoming",
    theme: "copa",
    startDate: null,
    endDate: null,
    descriptionEn:
      "A fast, 7-a-side tournament with its own identity. Dates, format, and venue are still being finalized — follow along for the announcement.",
    descriptionEs:
      "Un torneo veloz de 7 contra 7 con identidad propia. Fechas, formato y sede aun se estan definiendo — mantente atento al anuncio.",
    heroImage: null,
    order: 2,
  },
  {
    id: "ev-2025",
    slug: "liga-natural-2025",
    kind: "league",
    name: "Liga Natural — Season 2025",
    shortName: "Season 2025",
    seasonLabel: "2025",
    year: 2025,
    venueName: "Doral Legacy Park",
    venueAddress: "Doral, Florida",
    status: "completed",
    theme: "liga",
    startDate: null,
    endDate: "2025-07-24",
    descriptionEn:
      "The season that started the Negronis–Palmeras rivalry. Palmeras FC edged the Premier Division final on penalties; Pulpos FC swept the Junior Division.",
    descriptionEs:
      "La temporada que dio inicio a la rivalidad Negronis-Palmeras. Palmeras FC se llevo la final de la Division Premier en penales; Pulpos FC se coronó en la Division Junior.",
    heroImage: null,
    order: 3,
  },
];

export const divisions: DivisionRecord[] = [
  { id: "div-2026-premier", eventId: "ev-2026", name: "Premier Division", order: 1 },
  { id: "div-2026-junior", eventId: "ev-2026", name: "Junior Division", order: 2 },
  { id: "div-2025-premier", eventId: "ev-2025", name: "Premier Division", order: 1 },
  { id: "div-2025-junior", eventId: "ev-2025", name: "Junior Division", order: 2 },
];

function team(
  id: string,
  eventId: string,
  divisionId: string,
  name: string,
  slug: string,
  crestUrl: string | null = null,
  colorPrimary: string | null = null,
  squadPhotoUrl: string | null = null
): TeamRecord {
  return { id, eventId, divisionId, name, slug, crestUrl, colorPrimary, squadPhotoUrl };
}

// Real crest colors — used as subtle per-club accents (crest ring, card edge) alongside the navy/gold brand.
// Balanced to a consistent saturation/lightness band so no club reads
// darker, brighter, or more washed-out than the rest.
const CLUB_COLORS = {
  negronis: "#2d4fb4", // royal blue
  palmeras: "#29a364", // emerald green
  pulpos: "#3e4398", // indigo
  aguevoniados: "#cfa230", // amber gold
  chonflis: "#acb0b9", // chrome silver
  goofies: "#6a88a0", // steel blue-gray
  therians: "#be2d39", // crimson red
  gatitos: "#b08f3b", // brass gold
} as const;

export const teams: TeamRecord[] = [
  // 2026 Premier Division (5 clubs)
  team("t-2026-negronis", "ev-2026", "div-2026-premier", "Negronis FC", "negronis-fc", "/crests/negronis.jpg", CLUB_COLORS.negronis),
  team("t-2026-pulpos", "ev-2026", "div-2026-premier", "Pulpos FC", "pulpos-fc", "/crests/pulpos.jpg", CLUB_COLORS.pulpos),
  team("t-2026-chonflis", "ev-2026", "div-2026-premier", "Chonflis FC", "chonflis-fc", "/crests/chonflis.jpg", CLUB_COLORS.chonflis),
  team("t-2026-palmeras", "ev-2026", "div-2026-premier", "Palmeras FC", "palmeras-fc", "/crests/palmeras.jpg", CLUB_COLORS.palmeras),
  team("t-2026-therians", "ev-2026", "div-2026-premier", "Therians FC", "therians-fc", "/crests/therians.jpg", CLUB_COLORS.therians),
  // 2026 Junior Division (3 clubs)
  team(
    "t-2026-aguevoniados",
    "ev-2026",
    "div-2026-junior",
    "Aguevoniados",
    "aguevoniados",
    "/crests/aguevoniados.jpg",
    CLUB_COLORS.aguevoniados,
    "/teams/aguevoniados-squad-2026.jpg"
  ),
  team("t-2026-gatitos", "ev-2026", "div-2026-junior", "Gatitos Repelaos", "gatitos-repelaos", "/crests/gatitos.png", CLUB_COLORS.gatitos),
  team("t-2026-goofies", "ev-2026", "div-2026-junior", "Goofies FC", "goofies-fc", "/crests/goofies.jpg", CLUB_COLORS.goofies),
  // 2025 — confirmed finalists only (full 2025 rosters were not supplied)
  team("t-2025-negronis", "ev-2025", "div-2025-premier", "Negronis FC", "negronis-fc", "/crests/negronis.jpg", CLUB_COLORS.negronis),
  team("t-2025-palmeras", "ev-2025", "div-2025-premier", "Palmeras FC", "palmeras-fc", "/crests/palmeras.jpg", CLUB_COLORS.palmeras),
  team("t-2025-pulpos", "ev-2025", "div-2025-junior", "Pulpos FC", "pulpos-fc", "/crests/pulpos.jpg", CLUB_COLORS.pulpos),
  team(
    "t-2025-aguevoniados",
    "ev-2025",
    "div-2025-junior",
    "Aguevoniados",
    "aguevoniados",
    "/crests/aguevoniados.jpg",
    CLUB_COLORS.aguevoniados
  ),
];

// Only real, confirmed players (season MVPs) are seeded. Full rosters are
// added by the organizer through the management tool as they're finalized.
export const players: PlayerRecord[] = [
  { id: "p-contarino-2026", teamId: "t-2026-negronis", name: "Daniele Contarino", shirtNumber: null, position: "Forward" },
  { id: "p-contarino-2025", teamId: "t-2025-negronis", name: "Daniele Contarino", shirtNumber: null, position: "Forward" },
  { id: "p-vasquez-2026", teamId: "t-2026-aguevoniados", name: "Antwan Vasquez", shirtNumber: null, position: "Midfielder" },
  { id: "p-mata-2025", teamId: "t-2025-pulpos", name: "Edgar Mata", shirtNumber: null, position: null },
];

export const referees: RefereeRecord[] = [];

export const fixtures: FixtureRecord[] = [
  {
    id: "fx-2026-premier-final",
    eventId: "ev-2026",
    divisionId: "div-2026-premier",
    homeTeamId: "t-2026-negronis",
    awayTeamId: "t-2026-palmeras",
    homeTeamNameFallback: null,
    awayTeamNameFallback: null,
    date: "2026-08-09",
    time: null,
    field: "Doral Legacy Park",
    venueOverride: null,
    status: "completed",
    homeScore: 4,
    awayScore: 2,
    homeScoreHt: 2,
    awayScoreHt: 1,
    penaltyNote: null,
    refereeId: null,
    round: "Grand Final",
    notes: null,
  },
  {
    id: "fx-2026-junior-final",
    eventId: "ev-2026",
    divisionId: "div-2026-junior",
    homeTeamId: "t-2026-gatitos",
    awayTeamId: "t-2026-aguevoniados",
    homeTeamNameFallback: null,
    awayTeamNameFallback: null,
    date: "2026-07-28",
    time: null,
    field: "Doral Legacy Park",
    venueOverride: null,
    status: "completed",
    homeScore: 2,
    awayScore: 2,
    homeScoreHt: null,
    awayScoreHt: null,
    penaltyNote: "Gatitos Repelaos won 5–4 on penalties",
    refereeId: null,
    round: "Junior Division Final",
    notes: null,
  },
  {
    id: "fx-2025-premier-final",
    eventId: "ev-2025",
    divisionId: "div-2025-premier",
    homeTeamId: "t-2025-negronis",
    awayTeamId: "t-2025-palmeras",
    homeTeamNameFallback: null,
    awayTeamNameFallback: null,
    date: "2025-07-24",
    time: null,
    field: "Doral Legacy Park",
    venueOverride: null,
    status: "completed",
    homeScore: 3,
    awayScore: 3,
    homeScoreHt: null,
    awayScoreHt: null,
    penaltyNote: "Palmeras FC won 5–4 on penalties",
    refereeId: null,
    round: "Premier Division Final",
    notes: null,
  },
  {
    id: "fx-2025-junior-final",
    eventId: "ev-2025",
    divisionId: "div-2025-junior",
    homeTeamId: "t-2025-pulpos",
    awayTeamId: "t-2025-aguevoniados",
    homeTeamNameFallback: null,
    awayTeamNameFallback: null,
    date: "2025-07-23",
    time: null,
    field: "Doral Legacy Park",
    venueOverride: null,
    status: "completed",
    homeScore: 3,
    awayScore: 1,
    homeScoreHt: null,
    awayScoreHt: null,
    penaltyNote: null,
    refereeId: null,
    round: "Junior Division Final",
    notes: null,
  },
];

export const editionAwards: EditionAward[] = [
  {
    id: "award-2026-premier",
    eventId: "ev-2026",
    divisionName: "Premier Division",
    champion: "Negronis FC",
    runnerUp: "Palmeras FC",
    finalScoreLine: "4–2 (2–1 HT)",
    finalNotes: "Grand Final — August 9, 2026",
    mvpName: "Daniele Contarino",
    mvpTeam: "Negronis FC",
    mvpPosition: "Forward",
    mvpStatLine: "7 goals · 4 assists · 3 Man of the Match awards",
    mvpPhotoUrl: "/mvp/daniele-contarino-portrait.jpg",
    mvpActionPhotoUrl: "/gallery/negronis-daniele-strike.jpg",
  },
  {
    id: "award-2026-junior",
    eventId: "ev-2026",
    divisionName: "Junior Division",
    champion: "Gatitos Repelaos",
    runnerUp: "Aguevoniados",
    finalScoreLine: "2–2 (won 5–4 on penalties)",
    finalNotes: "Junior Division Final — July 28, 2026",
    mvpName: "Antwan Vasquez",
    mvpTeam: "Aguevoniados",
    mvpPosition: "Midfielder",
    mvpStatLine: "5 goals · 3 assists · 1 Man of the Match award",
    mvpPhotoUrl: "/mvp/antwan-vasquez-portrait.jpg",
    mvpActionPhotoUrl: "/gallery/antwan-vasquez-celebration.jpg",
  },
  {
    id: "award-2025-premier",
    eventId: "ev-2025",
    divisionName: "Premier Division",
    champion: "Palmeras FC",
    runnerUp: "Negronis FC",
    finalScoreLine: "3–3 (Palmeras won 5–4 on penalties)",
    finalNotes: "Premier Division Final — July 24, 2025",
    mvpName: "Daniele Contarino",
    mvpTeam: "Negronis FC",
    mvpPosition: "Forward",
    mvpStatLine: "Tournament MVP — despite Negronis' final defeat",
    mvpPhotoUrl: "/mvp/daniele-contarino-portrait.jpg",
    mvpActionPhotoUrl: "/gallery/daniele-contarino-2025-champion.jpg",
  },
  {
    id: "award-2025-junior",
    eventId: "ev-2025",
    divisionName: "Junior Division",
    champion: "Pulpos FC",
    runnerUp: "Aguevoniados",
    finalScoreLine: "3–1",
    finalNotes: "Junior Division Final — July 23, 2025",
    mvpName: "Edgar Mata",
    mvpTeam: "Pulpos FC",
    mvpPosition: null,
    mvpStatLine: null,
    mvpPhotoUrl: null,
    mvpActionPhotoUrl: null,
  },
];

export const partners: PartnerRecord[] = [
  {
    id: "partner-latina-trader",
    name: "Latina Trader VIP",
    tier: "title",
    status: "previous",
    logoUrl: "/partners/latina-trader-vip.jpg",
    instagram: "@latinatradervip",
    descriptionEn:
      "Title and presenting partner for the 2026 season. Featured on jerseys, matchday graphics, and the season's \"presented by\" credit line.",
    descriptionEs:
      "Patrocinador titular y presentador de la temporada 2026. Presente en las camisetas, en las graficas de cada jornada y en el credito \"presentado por\" de la temporada.",
    order: 1,
  },
  {
    id: "partner-synergy",
    name: "Synergy Employment Services",
    tier: "season",
    status: "previous",
    logoUrl: null,
    instagram: null,
    descriptionEn: "Season partner.",
    descriptionEs: "Patrocinador de temporada.",
    order: 2,
  },
];

export const galleryImages: GalleryImageRecord[] = [
  { id: "g1", eventId: "ev-2026", url: null, altEn: "Grand Final day, Doral Legacy Park", altEs: "Dia de la Gran Final, Doral Legacy Park", caption: "Grand Final · Aug 9, 2026", orientation: "landscape", accentColor: "gold" },
  { id: "g2", eventId: "ev-2026", url: "/gallery/negronis-daniele-strike.jpg", altEn: "Daniele Contarino striking the ball for Negronis FC", altEs: "Daniele Contarino disparando el balon con Negronis FC", caption: "Premier Division", orientation: "portrait", accentColor: "navy" },
  { id: "g3", eventId: "ev-2026", url: "/gallery/junior-goalkeeper-action.jpg", altEn: "Junior Division goalkeeper in action", altEs: "Portero de la Division Junior en accion", caption: "Junior Division", orientation: "portrait", accentColor: "gold" },
  { id: "g4", eventId: "ev-2026", url: "/gallery/junior-trophy-lift.jpg", altEn: "Trophy lift celebration", altEs: "Celebracion con el trofeo", caption: "Champions", orientation: "portrait", accentColor: "navy" },
  { id: "g5", eventId: "ev-2026", url: "/gallery/junior-referee-handshake.jpg", altEn: "Referee crew before kickoff", altEs: "Equipo arbitral antes del pitazo inicial", caption: "Referee crew", orientation: "portrait", accentColor: "gold" },
  { id: "g6", eventId: "ev-2026", url: null, altEn: "Sideline crowd supporting their team", altEs: "Aficion apoyando a su equipo desde la linea", caption: "Sideline support", orientation: "portrait", accentColor: "navy" },
  { id: "g7", eventId: "ev-2026", url: null, altEn: "Kickoff at Doral Legacy Park", altEs: "Saque inicial en Doral Legacy Park", caption: "Kickoff", orientation: "landscape", accentColor: "gold" },
  { id: "g8", eventId: "ev-2026", url: null, altEn: "Penalty shootout tension", altEs: "Tension en la tanda de penales", caption: "Penalties", orientation: "square", accentColor: "navy" },
  {
    id: "g9",
    eventId: "ev-2026",
    url: "/gallery/gatitos-finals-bound.png",
    altEn: "Gatitos Repelaos matchday graphic announcing their Junior Division final berth",
    altEs: "Grafica de jornada de Gatitos Repelaos anunciando su pase a la final de la Division Junior",
    caption: "Gatitos Repelaos — Finals Bound",
    orientation: "portrait",
    accentColor: "navy",
  },
  {
    id: "g10",
    eventId: "ev-2026",
    url: "/gallery/junior-atla-strike.jpg",
    altEn: "Match action on the run",
    altEs: "Accion de partido en movimiento",
    caption: "Match action",
    orientation: "portrait",
    accentColor: "gold",
  },
  {
    id: "g11",
    eventId: "ev-2026",
    url: "/gallery/premier-header-juggle.jpg",
    altEn: "Warming up before kickoff",
    altEs: "Calentando antes del pitazo inicial",
    caption: "Pregame warmup",
    orientation: "portrait",
    accentColor: "navy",
  },
  {
    id: "g12",
    eventId: "ev-2026",
    url: "/gallery/junior-pumas-dribble.jpg",
    altEn: "Dribbling past a defender",
    altEs: "Regateando a un defensor",
    caption: "Match action",
    orientation: "portrait",
    accentColor: "gold",
  },
  {
    id: "g13",
    eventId: "ev-2026",
    url: "/gallery/antwan-vasquez-celebration.jpg",
    altEn: "Antwan Vasquez celebrating with Aguevoniados",
    altEs: "Antwan Vasquez celebrando con Aguevoniados",
    caption: "Aguevoniados — celebration",
    orientation: "portrait",
    accentColor: "gold",
  },
  {
    id: "g14",
    eventId: "ev-2026",
    url: "/gallery/antwan-vasquez-laugh.jpg",
    altEn: "Antwan Vasquez sharing a laugh on the pitch",
    altEs: "Antwan Vasquez riendo en la cancha",
    caption: "Aguevoniados — celebration",
    orientation: "portrait",
    accentColor: "navy",
  },
  {
    id: "g15",
    eventId: "ev-2025",
    url: "/gallery/daniele-contarino-2025-champion.jpg",
    altEn: "Daniele Contarino with his 2025 tournament medal",
    altEs: "Daniele Contarino con su medalla de la temporada 2025",
    caption: "Negronis FC — Season 2025 MVP",
    orientation: "portrait",
    accentColor: "gold",
  },
];
