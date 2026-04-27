-- ═══════════════════════════════════════════════════════════════
-- PRESSKIT.PRO — Migration v4
-- Run in Supabase SQL Editor (after migration-v3)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Add config JSONB column to sections (THE CRITICAL FIX) ──
ALTER TABLE public.sections
  ADD COLUMN IF NOT EXISTS config JSONB NOT NULL DEFAULT '{}';

-- ── 2. Add logo_url + font_id to artists ──────────────────────
ALTER TABLE public.artists
  ADD COLUMN IF NOT EXISTS logo_url  TEXT,
  ADD COLUMN IF NOT EXISTS font_id   TEXT NOT NULL DEFAULT 'space';

-- ── 3. Fix the sections trigger — all 10 section types ────────
CREATE OR REPLACE FUNCTION public.create_default_sections()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.sections (artist_id, name, sort_order, config, is_enabled) VALUES
    (NEW.id, 'hero',         0, '{}', true),
    (NEW.id, 'bio',          1, '{}', true),
    (NEW.id, 'music',        2, '{}', true),
    (NEW.id, 'community',    3, '{}', true),
    (NEW.id, 'supporters',   4, '{}', true),
    (NEW.id, 'releases',     5, '{}', true),
    (NEW.id, 'live',         6, '{}', true),
    (NEW.id, 'gallery',      7, '{}', true),
    (NEW.id, 'contact',      8, '{}', true),
    (NEW.id, 'fan-capture',  9, '{}', false)
  ON CONFLICT (artist_id, name) DO NOTHING;
  RETURN NEW;
END; $$;

-- ── 4. Backfill missing sections for existing artists ─────────
-- Inserts any section that doesn't exist yet (idempotent)
DO $$
DECLARE
  section_names TEXT[] := ARRAY[
    'hero','bio','music','community','supporters',
    'releases','live','gallery','contact','fan-capture'
  ];
  sort_orders   INT[]  := ARRAY[0,1,2,3,4,5,6,7,8,9];
  enabled_flags BOOL[] := ARRAY[true,true,true,true,true,true,true,true,true,false];
  a             RECORD;
  i             INT;
BEGIN
  FOR a IN SELECT id FROM public.artists LOOP
    FOR i IN 1..array_length(section_names, 1) LOOP
      INSERT INTO public.sections (artist_id, name, sort_order, config, is_enabled)
      VALUES (a.id, section_names[i], sort_orders[i], '{}', enabled_flags[i])
      ON CONFLICT (artist_id, name) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ── 5. Create Storage bucket presskit-assets ─────────────────
-- (Run this block — it's idempotent via ON CONFLICT DO NOTHING)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'presskit-assets',
  'presskit-assets',
  true,
  15728640,  -- 15 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ── 6. Storage RLS policies ───────────────────────────────────
-- Public read (anyone can view uploaded images)
DO $$ BEGIN
  CREATE POLICY "presskit_assets_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'presskit-assets');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can upload to their own folder (path: userId/folder/file)
DO $$ BEGIN
  CREATE POLICY "presskit_assets_auth_upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'presskit-assets'
      AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can replace/update their own files
DO $$ BEGIN
  CREATE POLICY "presskit_assets_owner_update"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'presskit-assets'
      AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can delete their own files
DO $$ BEGIN
  CREATE POLICY "presskit_assets_owner_delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'presskit-assets'
      AND auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
