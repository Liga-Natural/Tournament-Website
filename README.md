# Liga Natural Tournaments

Public website and tournament management tool for Liga Natural Tournaments —
a soccer organization in Doral, Miami, running Liga Natural (Premier &
Junior Divisions) and Copa Piston.

- **Public site**: home, events, live standings, schedule & results, teams,
  past editions, partners, gallery, join the league, about, guidelines,
  FAQ, and contact — bilingual in English and Spanish.
- **Management tool**: access-code sign-in (no email/password) with two
  roles — organizer (full control) and referee (their assigned matches
  only). Standings compute automatically from submitted results.

See **[SETUP.md](./SETUP.md)** for how to connect Supabase (shared,
persistent storage), set the initial organizer code, and deploy.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4, with the Liga Natural brand system (navy/gold, Big
  Shoulders + Outfit, Copa Piston's red/chrome sub-theme) as design tokens
  in `app/globals.css`
- Supabase (Postgres) for shared, persistent data — with an automatic
  local-file fallback for zero-setup development (see `lib/persistence/`)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to
`/en`. Without Supabase env vars configured, the app runs in demo mode
against a local JSON file, seeded with the real Season 2025/2026 content
from `data/seed.ts`.

Sign in at `/en/signin` with the default organizer code `LIGANATURAL2026`
(change it immediately from the dashboard).

## Project structure

- `app/[locale]/(site)/…` — public, bilingual pages
- `app/[locale]/admin/…` — organizer dashboard (desk-oriented, dense)
- `app/[locale]/referee/…` — referee tools (mobile-first, large tap
  targets, plus/minus score steppers)
- `app/actions/` — server actions (auth, admin CRUD, referee result
  submission, public forms)
- `lib/store.ts` — the single data-access layer every page and action goes
  through; backed by either Supabase or the local file store
- `lib/standings.ts` — the standings computation engine
- `lib/i18n/` — English/Spanish dictionaries and locale routing
- `data/seed.ts` — real seed content (Season 2025/2026 results, teams,
  awards, partners)
- `supabase/` — SQL migration and seed script for production
