-- ═══════════════════════════════════════════════
-- PRESSKIT.PRO — Seed (2 artistas demo, colores únicos)
-- Reemplaza los UUIDs con IDs reales de auth.users
-- ═══════════════════════════════════════════════
do $$
declare
  u1 uuid := '00000000-0000-0000-0000-000000000001';
  u2 uuid := '00000000-0000-0000-0000-000000000002';
  a1 uuid := uuid_generate_v4();
  a2 uuid := uuid_generate_v4();
begin

-- ── NXGHT: Techno DJ — rojo industrial, layout raw ──
insert into public.artists (
  id, user_id, slug, artist_name, role, genre,
  sound_words, bio, achievements, links,
  photo_url, primary_color, secondary_color, bg_dark, layout_variant,
  booking_email, is_published, onboarding_step
) values (
  a1, u1, 'nxght', 'NXGHT', 'DJ', 'Techno',
  array['oscuro','hipnótico','implacable'],
  'NXGHT es un DJ y arquitecto sonoro nacido en Berlín y con base en Barcelona cuyas sesiones difuminan la línea entre la pista de baile y el vacío. Conocido por sus sets de 6 horas y su meticulosa aproximación al diseño de sonido, NXGHT ha construido un seguimiento de culto en el circuito underground europeo.',
  '[{"title":"Fabric Residency 2024","description":"Residente mensual en Fabric London — uno de solo 8 artistas a nivel global"},{"title":"Sonar Festival 2023","description":"Headliner en SonarNight — 4,200 asistentes"},{"title":"20M Streams","description":"Reproducciones acumuladas en SoundCloud y Spotify durante 2024"},{"title":"ARTS Label","description":"Firmado con ARTS Amsterdam — 3 EPs publicados"}]',
  '{"soundcloud":"https://soundcloud.com/nxght-official","spotify":"https://open.spotify.com/artist/demo1","instagram":"https://instagram.com/nxght_official","youtube":"https://youtube.com/@nxght"}',
  'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1920&q=80',
  '#DC2626', '#7F1D1D', true, 'raw',
  'booking@nxght.com', true, 'complete'
);

insert into public.live_events (artist_id, venue_name, event_name, event_date, city) values
  (a1,'Fabric','Fabric Fridays Residency','2024-03-15','London'),
  (a1,'Berghain','Panorama Bar Guest Slot','2024-01-27','Berlin'),
  (a1,'Sonar Festival','SonarNight Main Stage','2023-06-16','Barcelona'),
  (a1,'De School','Closing Night Set','2023-04-22','Amsterdam'),
  (a1,'Tresor','New Year''s Eve Special','2022-12-31','Berlin'),
  (a1,'Output','The Bunker NYC','2022-11-05','New York');

insert into public.media (artist_id, url, type, caption, sort_order) values
  (a1,'https://images.unsplash.com/photo-1594488506255-7c39def26de1?w=800&q=80','image','Fabric London — Marzo 2024',0),
  (a1,'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80','image','Sonar Festival Barcelona',1),
  (a1,'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80','image','Berghain — Enero 2024',2),
  (a1,'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80','image','Sesión de estudio',3),
  (a1,'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80','image','De School closing night',4),
  (a1,'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80','image','Tresor NYE 2022',5);

-- ── SOLARA: Afrobeats Producer — ámbar cálido, layout editorial ──
insert into public.artists (
  id, user_id, slug, artist_name, role, genre,
  sound_words, bio, achievements, links,
  photo_url, primary_color, secondary_color, bg_dark, layout_variant,
  booking_email, is_published, onboarding_step
) values (
  a2, u2, 'solara', 'SOLARA', 'Producer', 'Afrobeats',
  array['vibrante','anímica','cinematográfica'],
  'SOLARA es una productora nacida en Lagos y con base en Londres cuya música tiende puentes entre los ritmos de África Occidental y la música de club contemporánea. Su EP debut "Golden Hour" entró en listas en 12 países y abrió la puerta a colaboraciones con los nombres más emocionantes de la escena global de Afrobeats.',
  '[{"title":"Golden Hour EP","description":"EP debut — en listas de 12 países, 5M streams en el primer mes"},{"title":"Coachella 2024","description":"Set de producción en vivo en el escenario Sahara"},{"title":"BBC Radio 1Xtra","description":"Productora destacada — Essential Mix 2023"},{"title":"Collab Burna Boy","description":"Coprodujo 2 temas en álbum ganador de premios"}]',
  '{"soundcloud":"https://soundcloud.com/solara-music","spotify":"https://open.spotify.com/artist/demo2","instagram":"https://instagram.com/solara.music","youtube":"https://youtube.com/@solaramusic"}',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1920&q=80',
  '#F59E0B', '#D97706', false, 'editorial',
  'bookings@solaramusic.com', true, 'complete'
);

insert into public.live_events (artist_id, venue_name, event_name, event_date, city) values
  (a2,'Coachella','Sahara Stage','2024-04-13','Indio, CA'),
  (a2,'O2 Brixton Academy','Golden Hour Tour','2024-02-24','London'),
  (a2,'Afro Nation','Main Stage','2023-07-01','Portimão'),
  (a2,'Glastonbury','West Holts Stage','2023-06-25','Somerset'),
  (a2,'SXSW','Official Showcase','2023-03-17','Austin, TX');

insert into public.media (artist_id, url, type, caption, sort_order) values
  (a2,'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80','image','Coachella 2024 — Sahara Stage',0),
  (a2,'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80','image','Estudio — sesiones Golden Hour',1),
  (a2,'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80','image','Afro Nation Portugal',2),
  (a2,'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80','image','Glastonbury 2023',3),
  (a2,'https://images.unsplash.com/photo-1565035010268-a3816f98589a?w=800&q=80','image','Foto de prensa — Londres 2024',4);

insert into public.analytics (artist_id, event_type, country) values
  (a1,'page_view','DE'),(a1,'page_view','GB'),(a1,'page_view','ES'),
  (a1,'contact_click','US'),(a1,'music_play','NL'),
  (a2,'page_view','NG'),(a2,'page_view','GB'),(a2,'music_play','US');

end $$;
