-- M6: font_id on artists + new sections (links, testimonials)

-- Add font_id to artists
ALTER TABLE artists ADD COLUMN IF NOT EXISTS font_id text DEFAULT NULL;

-- Ensure new section types exist for all artists
-- (insert missing sections for existing artists)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM artists LOOP
    INSERT INTO sections (artist_id, name, is_enabled, sort_order, config)
    SELECT r.id, s.name, false, s.sort_order, s.config::jsonb
    FROM (VALUES
      ('links',        98, '{"section_title":"Links","links":[],"bg_image":null,"overlay_opacity":0.5,"overlay_color":"#000000"}'),
      ('testimonials', 99, '{"section_title":"Lo que dicen","testimonials":[],"bg_image":null,"overlay_opacity":0.6,"overlay_color":"#000000"}')
    ) AS s(name, sort_order, config)
    WHERE NOT EXISTS (
      SELECT 1 FROM sections WHERE artist_id = r.id AND name = s.name
    );
  END LOOP;
END $$;
