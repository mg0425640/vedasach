-- Add SEO enhancement columns to articles table
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS image_caption text,
  ADD COLUMN IF NOT EXISTS focus_keyword text,
  ADD COLUMN IF NOT EXISTS secondary_keywords text[],
  ADD COLUMN IF NOT EXISTS schema_type text DEFAULT 'Article',
  ADD COLUMN IF NOT EXISTS last_updated timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS faq jsonb,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS noindex boolean DEFAULT false;

-- Auto-update last_updated on row changes (inline function, no extension needed)
CREATE OR REPLACE FUNCTION set_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER articles_set_last_updated
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_last_updated();
