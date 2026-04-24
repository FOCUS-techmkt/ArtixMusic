-- ═══════════════════════════════════════════════
-- PRESSKIT.PRO — Supabase Schema v2
-- Each presskit is 100% unique via custom colors + layout
-- ═══════════════════════════════════════════════

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ───────────────────────────────────────────────
-- ENUMS
-- ───────────────────────────────────────────────
create type artist_role      as enum ('DJ', 'Producer', 'Both', 'Live Act');
create type genre_type       as enum ('Techno', 'House', 'Trap', 'Reggaeton', 'Afrobeats', 'Ambient', 'Other');
create type media_type       as enum ('image', 'video');
create type analytics_event  as enum ('page_view', 'contact_click', 'link_click', 'music_play');
create type layout_variant   as enum ('centered', 'editorial', 'split', 'raw');
create type onboarding_status as enum (
  'identity', 'sound', 'achievements', 'links', 'colors', 'layout', 'complete'
);

-- ───────────────────────────────────────────────
-- ARTISTS — one row per artist/tenant
-- ───────────────────────────────────────────────
create table public.artists (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  slug             text unique not null,
  artist_name      text not null,
  role             artist_role not null default 'DJ',
  genre            genre_type not null default 'House',
  sound_words      text[] default '{}',
  bio              text default '',
  achievements     jsonb default '[]',
  links            jsonb default '{}',
  photo_url        text,
  logo_url         text,

  -- ── Unique color identity (replaces fixed themes) ──
  primary_color    text not null default '#C026D3',   -- main brand color (hex)
  secondary_color  text not null default '#7C3AED',   -- supporting accent (hex)
  bg_dark          boolean not null default true,      -- dark or light bg
  layout_variant   layout_variant not null default 'centered',

  booking_email    text,
  is_published     boolean not null default false,
  onboarding_step  onboarding_status not null default 'identity',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ───────────────────────────────────────────────
-- SECTIONS
-- ───────────────────────────────────────────────
create table public.sections (
  id          uuid primary key default uuid_generate_v4(),
  artist_id   uuid references public.artists(id) on delete cascade not null,
  name        text not null,
  is_enabled  boolean not null default true,
  sort_order  integer not null default 0,
  unique(artist_id, name)
);

-- ───────────────────────────────────────────────
-- LIVE EVENTS
-- ───────────────────────────────────────────────
create table public.live_events (
  id          uuid primary key default uuid_generate_v4(),
  artist_id   uuid references public.artists(id) on delete cascade not null,
  venue_name  text not null,
  event_name  text,
  event_date  date not null,
  city        text,
  logo_url    text,
  created_at  timestamptz not null default now()
);

-- ───────────────────────────────────────────────
-- MEDIA
-- ───────────────────────────────────────────────
create table public.media (
  id          uuid primary key default uuid_generate_v4(),
  artist_id   uuid references public.artists(id) on delete cascade not null,
  url         text not null,
  type        media_type not null default 'image',
  caption     text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ───────────────────────────────────────────────
-- ANALYTICS
-- ───────────────────────────────────────────────
create table public.analytics (
  id          uuid primary key default uuid_generate_v4(),
  artist_id   uuid references public.artists(id) on delete cascade not null,
  event_type  analytics_event not null,
  referrer    text,
  country     text,
  created_at  timestamptz not null default now()
);

-- ───────────────────────────────────────────────
-- TRIGGERS
-- ───────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger on_artists_updated
  before update on public.artists
  for each row execute procedure public.handle_updated_at();

create or replace function public.create_default_sections()
returns trigger language plpgsql security definer as $$
begin
  insert into public.sections (artist_id, name, sort_order) values
    (new.id,'hero',0),(new.id,'bio',1),(new.id,'music',2),
    (new.id,'live',3),(new.id,'gallery',4),(new.id,'contact',5);
  return new;
end; $$;

create trigger on_artist_created_sections
  after insert on public.artists
  for each row execute procedure public.create_default_sections();

-- ───────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ───────────────────────────────────────────────
alter table public.artists     enable row level security;
alter table public.sections    enable row level security;
alter table public.live_events enable row level security;
alter table public.media       enable row level security;
alter table public.analytics   enable row level security;

-- Artists
create policy "artists_public_read"  on public.artists for select using (is_published);
create policy "artists_owner_read"   on public.artists for select using (auth.uid()=user_id);
create policy "artists_owner_insert" on public.artists for insert with check (auth.uid()=user_id);
create policy "artists_owner_update" on public.artists for update using (auth.uid()=user_id);
create policy "artists_owner_delete" on public.artists for delete using (auth.uid()=user_id);

-- Sections
create policy "sections_public_read" on public.sections for select
  using (exists(select 1 from public.artists a where a.id=artist_id and a.is_published));
create policy "sections_owner_all"   on public.sections for all
  using (exists(select 1 from public.artists a where a.id=artist_id and a.user_id=auth.uid()));

-- Live events
create policy "events_public_read" on public.live_events for select
  using (exists(select 1 from public.artists a where a.id=artist_id and a.is_published));
create policy "events_owner_all"   on public.live_events for all
  using (exists(select 1 from public.artists a where a.id=artist_id and a.user_id=auth.uid()));

-- Media
create policy "media_public_read" on public.media for select
  using (exists(select 1 from public.artists a where a.id=artist_id and a.is_published));
create policy "media_owner_all"   on public.media for all
  using (exists(select 1 from public.artists a where a.id=artist_id and a.user_id=auth.uid()));

-- Analytics
create policy "analytics_anyone_insert" on public.analytics for insert with check (true);
create policy "analytics_owner_read"    on public.analytics for select
  using (exists(select 1 from public.artists a where a.id=artist_id and a.user_id=auth.uid()));

-- ───────────────────────────────────────────────
-- INDEXES
-- ───────────────────────────────────────────────
create index idx_artists_slug    on public.artists(slug);
create index idx_artists_user    on public.artists(user_id);
create index idx_analytics_ac    on public.analytics(artist_id, created_at desc);
create index idx_events_ad       on public.live_events(artist_id, event_date desc);
create index idx_media_ao        on public.media(artist_id, sort_order);
