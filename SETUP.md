# Setup Guide — Liga Natural Tournaments

This app runs in one of two modes, chosen automatically based on environment
variables:

- **Demo mode** (default, no setup required): data lives in a local JSON
  file (`data/.db.json`) on the server. Great for trying the site out or for
  `npm run dev`, but it is **not shared across serverless instances** and
  will reset if the file is deleted. Do not use this for the real,
  production site.
- **Supabase mode** (recommended for production): data lives in a real
  Postgres database, shared instantly across every visitor, referee, and
  the organizer — exactly what "a result a referee submits must immediately
  be visible to everyone else" requires.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the project dashboard, open **SQL Editor**.
3. Paste and run the contents of `supabase/migrations/0001_init.sql`. This
   creates every table the app needs.
4. Paste and run the contents of `supabase/seed.sql`. This loads the real
   Liga Natural content — Season 2025 and 2026 results, teams, awards,
   partners, and the initial organizer access code.

## 2. Set environment variables

In your hosting provider (e.g. Vercel → Project → Settings → Environment
Variables), or in a local `.env.local` file, set:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SESSION_SECRET=a-long-random-string
```

Both keys are found in Supabase → Project Settings → API.

**Important:** `SUPABASE_SERVICE_ROLE_KEY` is a secret with full database
access — it is only ever used in server-side code (server actions, server
components), never sent to the browser. Do not prefix it with
`NEXT_PUBLIC_`.

`SESSION_SECRET` signs the sign-in cookie for organizers and referees. Any
long random string works — generate one with `openssl rand -base64 32`.

Once `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are both
set, the app automatically switches from demo mode to Supabase — no code
changes needed.

## 3. First sign-in

The seed data sets the initial **organizer access code** to:

```
LIGANATURAL2026
```

Sign in at `/en/signin` (or `/es/signin`) with this code, then go to
**Settings** in the dashboard and change it immediately — anyone with this
code has full control over the site (events, teams, results, referees).

Referees don't need a code from you upfront: add each referee by name in
**Admin → Referees**, and the app generates their personal access code
automatically. Share that code with them directly.

## 4. Deploy

This is a standard Next.js app — deploys cleanly to Vercel (`vercel deploy`)
or any Node.js host that supports the Next.js App Router. Make sure the
three environment variables above are set on whichever platform you use.

## What's still needed from Adrian

The following content is intentionally left as honest placeholders because
the real facts weren't available yet — see the task notes for the full
list:

- Copa Piston dates, format, entry fee
- Liga Natural next-season dates
- Sponsorship tiers and pricing for the Partner page
- Junior Division team names/rosters for seasons before 2026 (only the
  finalists' names were available for 2025)
- The 2026 Junior Division final opponent (currently shown as "Opponent to
  be confirmed")
- Top scorers, full end-of-season standings tables, and match-by-match
  schedules for 2025 and 2026
- Real photography, team crests, and MVP portraits — the site uses branded
  navy/gold panels as honest placeholders everywhere a real photo is
  missing, never stock imagery or grey boxes

Once photography and crests are ready, they can be added by an organizer
with basic comfort editing image URLs — ask your builder to wire up
Supabase Storage (or any CDN) and update the relevant `crestUrl` / image
fields.
