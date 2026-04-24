-- ═══════════════════════════════════════════════════════════════
-- PRESSKIT.PRO — Migration v3: Growth OS fields + fan_subscribers
-- Run this in Supabase SQL Editor (after schema-v2)
-- ═══════════════════════════════════════════════════════════════

-- ── New fields on ARTISTS ──────────────────────────────────────
ALTER TABLE public.artists
  ADD COLUMN IF NOT EXISTS tagline             TEXT,
  ADD COLUMN IF NOT EXISTS spotify_playlist_url TEXT,
  ADD COLUMN IF NOT EXISTS supporters          JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS available_dates     TEXT,
  ADD COLUMN IF NOT EXISTS monthly_listeners   TEXT,
  ADD COLUMN IF NOT EXISTS total_shows         TEXT,
  ADD COLUMN IF NOT EXISTS countries_count     TEXT,
  ADD COLUMN IF NOT EXISTS booking_url         TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url       TEXT,
  ADD COLUMN IF NOT EXISTS ra_url              TEXT,
  ADD COLUMN IF NOT EXISTS beatport_url        TEXT;

-- ── New fields on PRESSKITS (old table, backward-compat) ───────
ALTER TABLE public.presskits
  ADD COLUMN IF NOT EXISTS tagline             TEXT,
  ADD COLUMN IF NOT EXISTS spotify_playlist_url TEXT,
  ADD COLUMN IF NOT EXISTS supporters          JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS available_dates     TEXT,
  ADD COLUMN IF NOT EXISTS booking_url         TEXT;

-- ── FAN SUBSCRIBERS — core of the fan database ────────────────
CREATE TABLE IF NOT EXISTS public.fan_subscribers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_slug  TEXT NOT NULL,
  email        TEXT NOT NULL,
  name         TEXT,
  source       TEXT DEFAULT 'presskit',   -- 'presskit' | 'landing' | etc.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(artist_slug, email)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS fan_subscribers_slug_idx ON public.fan_subscribers(artist_slug);
CREATE INDEX IF NOT EXISTS fan_subscribers_email_idx ON public.fan_subscribers(email);

-- RLS
ALTER TABLE public.fan_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (public presskit page)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fan_subscribers' AND policyname = 'Public subscribe') THEN
    CREATE POLICY "Public subscribe" ON public.fan_subscribers FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Artists can read their own subscribers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fan_subscribers' AND policyname = 'Artist reads own fans') THEN
    CREATE POLICY "Artist reads own fans" ON public.fan_subscribers
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.artists
          WHERE artists.slug = fan_subscribers.artist_slug
            AND artists.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Artists can delete their own subscribers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fan_subscribers' AND policyname = 'Artist deletes own fans') THEN
    CREATE POLICY "Artist deletes own fans" ON public.fan_subscribers
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM public.artists
          WHERE artists.slug = fan_subscribers.artist_slug
            AND artists.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- ── ANALYTICS: add 'fan_subscribe' event type ─────────────────
-- If your DB allows ALTER TYPE, uncomment:
-- ALTER TYPE analytics_event ADD VALUE IF NOT EXISTS 'fan_subscribe';

-- ── Helper function: count subscribers for an artist ──────────
CREATE OR REPLACE FUNCTION public.get_fan_count(p_slug TEXT)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER FROM public.fan_subscribers WHERE artist_slug = p_slug;
$$;
