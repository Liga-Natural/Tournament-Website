-- Real Liga Natural Tournaments content — run after 0001_init.sql on a fresh project.
-- Mirrors data/seed.ts exactly. Safe to re-run (upserts by id).

insert into events (id, slug, kind, name, short_name, season_label, year, venue_name, venue_address, status, theme, start_date, end_date, description_en, description_es, hero_image, "order") values
('ev-2026', 'liga-natural-2026', 'league', 'Liga Natural — Season 2026', 'Season 2026', '2026', 2026, 'Doral Legacy Park', 'Doral, Florida', 'completed', 'liga', null, '2026-08-09',
 'The flagship Liga Natural season, contested across the Premier and Junior Divisions. Season 2026 is complete — Negronis FC lifted the Premier crown and Gatitos Repelaos took the Junior title.',
 'La temporada insignia de Liga Natural, disputada en la Division Premier y la Division Junior. La Temporada 2026 ya concluyo — Negronis FC se coronó campeon de la Premier y Gatitos Repelaos se llevo el titulo Junior.',
 null, 1),
('ev-copa-piston', 'copa-piston', 'cup', 'Copa Piston', 'Copa Piston', 'TBA', 2026, null, null, 'upcoming', 'copa', null, null,
 'A fast, 7-a-side tournament with its own identity. Dates, format, and venue are still being finalized — follow along for the announcement.',
 'Un torneo veloz de 7 contra 7 con identidad propia. Fechas, formato y sede aun se estan definiendo — mantente atento al anuncio.',
 null, 2),
('ev-2025', 'liga-natural-2025', 'league', 'Liga Natural — Season 2025', 'Season 2025', '2025', 2025, 'Doral Legacy Park', 'Doral, Florida', 'completed', 'liga', null, '2025-01-01',
 'The season that started the Negronis–Palmeras rivalry. Palmeras FC edged the Premier Division final on penalties; Pulpos FC swept the Junior Division.',
 'La temporada que dio inicio a la rivalidad Negronis-Palmeras. Palmeras FC se llevo la final de la Division Premier en penales; Pulpos FC se coronó en la Division Junior.',
 null, 3)
on conflict (id) do update set slug = excluded.slug, name = excluded.name, status = excluded.status;

insert into divisions (id, event_id, name, "order") values
('div-2026-premier', 'ev-2026', 'Premier Division', 1),
('div-2026-junior', 'ev-2026', 'Junior Division', 2),
('div-2025-premier', 'ev-2025', 'Premier Division', 1),
('div-2025-junior', 'ev-2025', 'Junior Division', 2)
on conflict (id) do nothing;

insert into teams (id, event_id, division_id, name, slug, crest_url, color_primary) values
('t-2026-negronis', 'ev-2026', 'div-2026-premier', 'Negronis FC', 'negronis-fc', null, null),
('t-2026-pulpos', 'ev-2026', 'div-2026-premier', 'Pulpos FC', 'pulpos-fc', null, null),
('t-2026-chonflis', 'ev-2026', 'div-2026-premier', 'Chonflis FC', 'chonflis-fc', null, null),
('t-2026-palmeras', 'ev-2026', 'div-2026-premier', 'Palmeras FC', 'palmeras-fc', null, null),
('t-2026-therians', 'ev-2026', 'div-2026-premier', 'Therians FC', 'therians-fc', null, null),
('t-2026-aguevoniados', 'ev-2026', 'div-2026-junior', 'Aguevoniados', 'aguevoniados', null, null),
('t-2026-gatitos', 'ev-2026', 'div-2026-junior', 'Gatitos Repelaos', 'gatitos-repelaos', null, null),
('t-2026-goofies', 'ev-2026', 'div-2026-junior', 'Goofies FC', 'goofies-fc', null, null),
('t-2025-negronis', 'ev-2025', 'div-2025-premier', 'Negronis FC', 'negronis-fc', null, null),
('t-2025-palmeras', 'ev-2025', 'div-2025-premier', 'Palmeras FC', 'palmeras-fc', null, null),
('t-2025-pulpos', 'ev-2025', 'div-2025-junior', 'Pulpos FC', 'pulpos-fc', null, null),
('t-2025-aguevoniados', 'ev-2025', 'div-2025-junior', 'Aguevoniados', 'aguevoniados', null, null)
on conflict (id) do nothing;

insert into players (id, team_id, name, shirt_number, position) values
('p-contarino-2026', 't-2026-negronis', 'Daniele Contarino', null, 'Forward'),
('p-contarino-2025', 't-2025-negronis', 'Daniele Contarino', null, 'Forward'),
('p-vasquez-2026', 't-2026-aguevoniados', 'Antwan Vasquez', null, 'Midfielder'),
('p-mata-2025', 't-2025-pulpos', 'Edgar Mata', null, null)
on conflict (id) do nothing;

insert into fixtures (id, event_id, division_id, home_team_id, away_team_id, home_team_name_fallback, away_team_name_fallback, date, time, field, venue_override, status, home_score, away_score, home_score_ht, away_score_ht, penalty_note, referee_id, round, notes) values
('fx-2026-premier-final', 'ev-2026', 'div-2026-premier', 't-2026-negronis', 't-2026-palmeras', null, null, '2026-08-09', null, 'Doral Legacy Park', null, 'completed', 4, 2, 2, 1, null, null, 'Grand Final', null),
('fx-2026-junior-final', 'ev-2026', 'div-2026-junior', 't-2026-gatitos', null, null, 'Opponent to be confirmed', '2026-08-09', null, 'Doral Legacy Park', null, 'completed', 2, 2, null, null, 'Gatitos Repelaos won 5–4 on penalties', null, 'Junior Division Final', null),
('fx-2025-premier-final', 'ev-2025', 'div-2025-premier', 't-2025-negronis', 't-2025-palmeras', null, null, null, null, 'Doral Legacy Park', null, 'completed', 3, 3, null, null, 'Palmeras FC won 5–4 on penalties', null, 'Premier Division Final', null),
('fx-2025-junior-final', 'ev-2025', 'div-2025-junior', 't-2025-pulpos', 't-2025-aguevoniados', null, null, null, null, 'Doral Legacy Park', null, 'completed', 3, 1, null, null, null, null, 'Junior Division Final', null)
on conflict (id) do nothing;

insert into edition_awards (id, event_id, division_name, champion, runner_up, final_score_line, final_notes, mvp_name, mvp_team, mvp_position, mvp_stat_line) values
('award-2026-premier', 'ev-2026', 'Premier Division', 'Negronis FC', 'Palmeras FC', '4–2 (2–1 HT)', 'Grand Final — August 9, 2026', 'Daniele Contarino', 'Negronis FC', 'Forward', '7 goals · 4 assists · 3 Man of the Match awards'),
('award-2026-junior', 'ev-2026', 'Junior Division', 'Gatitos Repelaos', 'Opponent to be confirmed', '2–2 (won 5–4 on penalties)', 'Junior Division Final — August 9, 2026', 'Antwan Vasquez', 'Aguevoniados', 'Midfielder', '5 goals · 3 assists · 1 Man of the Match award'),
('award-2025-premier', 'ev-2025', 'Premier Division', 'Palmeras FC', 'Negronis FC', '3–3 (Palmeras won 5–4 on penalties)', 'Premier Division Final', 'Daniele Contarino', 'Negronis FC', 'Forward', 'Tournament MVP — despite Negronis'' final defeat'),
('award-2025-junior', 'ev-2025', 'Junior Division', 'Pulpos FC', 'Aguevoniados', '3–1', 'Junior Division Final', 'Edgar Mata', 'Pulpos FC', null, null)
on conflict (id) do nothing;

insert into partners (id, name, tier, status, logo_url, instagram, description_en, description_es, "order") values
('partner-latina-trader', 'Latina Trader VIP', 'title', 'previous', null, '@latinatradervip',
 'Title and presenting partner. Featured on jerseys, matchday graphics, and the season''s "presented by" credit line.',
 'Patrocinador titular y presentador. Presente en las camisetas, en las graficas de cada jornada y en el credito "presentado por" de la temporada.',
 1),
('partner-synergy', 'Synergy Employment Services', 'season', 'previous', null, null, 'Season partner.', 'Patrocinador de temporada.', 2)
on conflict (id) do nothing;

insert into gallery_images (id, url, alt_en, alt_es, caption, orientation, accent_color) values
('g1', null, 'Grand Final day, Doral Legacy Park', 'Dia de la Gran Final, Doral Legacy Park', 'Grand Final · Aug 9, 2026', 'landscape', 'gold'),
('g2', null, 'Premier Division match action', 'Accion de un partido de la Division Premier', 'Premier Division', 'portrait', 'navy'),
('g3', null, 'Junior Division players on the ball', 'Jugadores de la Division Junior con el balon', 'Junior Division', 'square', 'gold'),
('g4', null, 'Trophy lift celebration', 'Celebracion con el trofeo', 'Champions', 'landscape', 'navy'),
('g5', null, 'Referee crew before kickoff', 'Equipo arbitral antes del pitazo inicial', 'Referee crew', 'square', 'gold'),
('g6', null, 'Sideline crowd supporting their team', 'Aficion apoyando a su equipo desde la linea', 'Sideline support', 'portrait', 'navy'),
('g7', null, 'Kickoff at Doral Legacy Park', 'Saque inicial en Doral Legacy Park', 'Kickoff', 'landscape', 'gold'),
('g8', null, 'Penalty shootout tension', 'Tension en la tanda de penales', 'Penalties', 'square', 'navy')
on conflict (id) do nothing;
