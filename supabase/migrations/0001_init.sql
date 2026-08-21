-- Liga Natural Tournaments — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create table if not exists events (
  id text primary key,
  slug text unique not null,
  kind text not null check (kind in ('league', 'cup')),
  name text not null,
  short_name text not null,
  season_label text not null,
  year int not null,
  venue_name text,
  venue_address text,
  status text not null check (status in ('upcoming', 'active', 'completed')),
  theme text not null check (theme in ('liga', 'copa')),
  start_date date,
  end_date date,
  description_en text not null default '',
  description_es text not null default '',
  hero_image text,
  "order" int not null default 0
);

create table if not exists divisions (
  id text primary key,
  event_id text not null references events(id) on delete cascade,
  name text not null,
  "order" int not null default 0
);

create table if not exists teams (
  id text primary key,
  event_id text not null references events(id) on delete cascade,
  division_id text references divisions(id) on delete set null,
  name text not null,
  slug text not null,
  crest_url text,
  color_primary text,
  squad_photo_url text
);

create table if not exists players (
  id text primary key,
  team_id text not null references teams(id) on delete cascade,
  name text not null,
  shirt_number int,
  position text
);

create table if not exists fixtures (
  id text primary key,
  event_id text not null references events(id) on delete cascade,
  division_id text references divisions(id) on delete set null,
  home_team_id text references teams(id) on delete set null,
  away_team_id text references teams(id) on delete set null,
  home_team_name_fallback text,
  away_team_name_fallback text,
  date date,
  time text,
  field text,
  venue_override text,
  status text not null check (status in ('scheduled', 'completed', 'postponed')),
  home_score int,
  away_score int,
  home_score_ht int,
  away_score_ht int,
  penalty_note text,
  referee_id text references referees(id) on delete set null,
  round text,
  notes text
);

create table if not exists referees (
  id text primary key,
  name text not null,
  code text unique not null,
  active boolean not null default true
);

-- fixtures.referee_id references referees, which must exist first
alter table fixtures
  drop constraint if exists fixtures_referee_id_fkey;
alter table fixtures
  add constraint fixtures_referee_id_fkey foreign key (referee_id) references referees(id) on delete set null;

create table if not exists edition_awards (
  id text primary key,
  event_id text not null references events(id) on delete cascade,
  division_name text not null,
  champion text not null,
  runner_up text not null,
  final_score_line text not null,
  final_notes text,
  mvp_name text not null,
  mvp_team text not null,
  mvp_position text,
  mvp_stat_line text,
  mvp_photo_url text,
  mvp_action_photo_url text
);

alter table teams add column if not exists squad_photo_url text;
alter table edition_awards add column if not exists mvp_photo_url text;
alter table edition_awards add column if not exists mvp_action_photo_url text;
alter table gallery_images add column if not exists event_id text references events(id) on delete set null;

create table if not exists partners (
  id text primary key,
  name text not null,
  tier text not null check (tier in ('title', 'season', 'current', 'previous')),
  status text not null check (status in ('current', 'previous')),
  logo_url text,
  instagram text,
  description_en text not null default '',
  description_es text not null default '',
  "order" int not null default 0
);

create table if not exists gallery_images (
  id text primary key,
  event_id text references events(id) on delete set null,
  url text,
  alt_en text not null default '',
  alt_es text not null default '',
  caption text,
  orientation text not null default 'landscape',
  accent_color text not null default 'gold'
);

create table if not exists contact_submissions (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  reason text not null check (reason in ('sponsorship', 'team-registration', 'referee', 'general')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists partner_enquiries (
  id text primary key,
  name text not null,
  company text,
  email text not null,
  phone text,
  interest text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists join_submissions (
  id text primary key,
  type text not null check (type in ('team', 'player', 'referee')),
  name text not null,
  email text not null,
  phone text,
  details text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value text not null
);

insert into app_settings (key, value)
values ('organizer_code', 'LIGANATURAL2026')
on conflict (key) do nothing;

-- Row Level Security: the app talks to Supabase using the service-role key
-- from server-only code, so it bypasses RLS entirely. Enabling RLS with no
-- public policies below simply blocks the anon/public key from touching
-- these tables directly, which is what we want since the anon key is never
-- exposed with read/write intent — all access goes through server actions.
alter table events enable row level security;
alter table divisions enable row level security;
alter table teams enable row level security;
alter table players enable row level security;
alter table fixtures enable row level security;
alter table referees enable row level security;
alter table edition_awards enable row level security;
alter table partners enable row level security;
alter table gallery_images enable row level security;
alter table contact_submissions enable row level security;
alter table partner_enquiries enable row level security;
alter table join_submissions enable row level security;
alter table app_settings enable row level security;
