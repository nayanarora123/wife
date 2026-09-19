-- ============================================================
-- Love Story Platform — Database Migration
-- Run this in your Supabase SQL Editor to set up the schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- LOVE PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS love_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Love Story',
  subtitle TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  hero_name TEXT DEFAULT '',
  partner_name TEXT DEFAULT '',
  author_name TEXT DEFAULT '',
  relationship_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  relationship_start_time TIME NOT NULL DEFAULT '12:00:00',
  timezone TEXT DEFAULT 'Asia/Kolkata',
  browser_title TEXT DEFAULT '',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image_url TEXT,
  favicon_url TEXT,
  hero_message TEXT DEFAULT '',
  footer_text TEXT DEFAULT '',
  music_url TEXT,
  music_autoplay BOOLEAN DEFAULT FALSE,
  music_loop BOOLEAN DEFAULT TRUE,
  bg_effects_enabled BOOLEAN DEFAULT TRUE,
  bg_effects_type TEXT DEFAULT 'hearts' CHECK (bg_effects_type IN ('hearts', 'dots', 'sparkles', 'petals')),
  bg_effects_density INTEGER DEFAULT 4 CHECK (bg_effects_density BETWEEN 1 AND 10),
  bg_effects_speed INTEGER DEFAULT 3 CHECK (bg_effects_speed BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAGE SETTINGS (THEME)
-- ============================================================
CREATE TABLE IF NOT EXISTS page_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE UNIQUE,
  bg_color TEXT DEFAULT '#FFF1F4',
  primary_color TEXT DEFAULT '#D94F73',
  secondary_color TEXT DEFAULT '#9E2F50',
  card_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#6B263C',
  muted_text_color TEXT DEFAULT '#A76A7D',
  border_color TEXT DEFAULT '#F3C8D3',
  button_color TEXT DEFAULT '#D94F73',
  button_text_color TEXT DEFAULT '#FFFFFF',
  heading_font TEXT DEFAULT 'Playfair Display',
  body_font TEXT DEFAULT 'Inter',
  border_radius TEXT DEFAULT '16px',
  shadow_intensity TEXT DEFAULT 'md',
  preset_name TEXT
);

-- ============================================================
-- SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT DEFAULT '',
  enabled BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TIMELINE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  date DATE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  location TEXT,
  image_url TEXT,
  emoji TEXT DEFAULT '❤️',
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- REASONS
-- ============================================================
CREATE TABLE IF NOT EXISTS reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  emoji TEXT DEFAULT '💗',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- MEMORIES (PHOTO GALLERY)
-- ============================================================
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  date DATE,
  location TEXT,
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- SONGS
-- ============================================================
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT DEFAULT '',
  cover_url TEXT,
  description TEXT,
  youtube_url TEXT,
  spotify_url TEXT,
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- GAME QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS game_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  type TEXT DEFAULT 'quiz' CHECK (type IN ('quiz', 'marriage'))
);

-- ============================================================
-- GAME ANSWERS
-- ============================================================
CREATE TABLE IF NOT EXISTS game_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES game_questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  response_message TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- WHEEL ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS wheel_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  emoji TEXT DEFAULT '❤️',
  weight INTEGER DEFAULT 1,
  result_message TEXT DEFAULT '',
  color TEXT DEFAULT '#D94F73',
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- COMPATIBILITY ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS compatibility_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage BETWEEN 0 AND 100),
  order_index INTEGER DEFAULT 0
);

-- ============================================================
-- MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES love_pages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  file_type TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE love_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wheel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read: only published pages
CREATE POLICY "Public can read published pages" ON love_pages
  FOR SELECT USING (status = 'published');

-- Owners can do everything
CREATE POLICY "Owners can manage their pages" ON love_pages
  FOR ALL USING (auth.uid() = user_id);

-- Helper: check page ownership for related tables
CREATE OR REPLACE FUNCTION is_page_owner(p_page_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM love_pages WHERE id = p_page_id AND user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Apply ownership policies to all related tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['page_settings','sections','timeline_items','reasons','memories','songs','game_questions','wheel_items','compatibility_items','media']
  LOOP
    EXECUTE format('CREATE POLICY "Owners can manage" ON %I FOR ALL USING (is_page_owner(page_id))', tbl);
    EXECUTE format('CREATE POLICY "Public can read from published pages" ON %I FOR SELECT USING (
      EXISTS (SELECT 1 FROM love_pages WHERE id = page_id AND status = ''published'')
    )', tbl);
  END LOOP;
END $$;

CREATE POLICY "Owners manage answers" ON game_answers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM game_questions gq JOIN love_pages lp ON lp.id = gq.page_id WHERE gq.id = question_id AND lp.user_id = auth.uid())
  );

CREATE POLICY "Public read answers from published" ON game_answers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM game_questions gq JOIN love_pages lp ON lp.id = gq.page_id WHERE gq.id = question_id AND lp.status = 'published')
  );
