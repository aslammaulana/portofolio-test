-- ============================================================
-- Portfolio Website — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: profile
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profile (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name   text NOT NULL DEFAULT '',
  tagline     text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  avatar_url  text,
  updated_at  timestamptz DEFAULT now()
);

-- Insert default empty profile row
INSERT INTO public.profile (full_name, tagline, description)
VALUES ('Your Name', 'Your Tagline Here', 'A brief description about yourself.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- TABLE: skills
-- ============================================================
CREATE TABLE IF NOT EXISTS public.skills (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  category   text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- TABLE: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        text NOT NULL,
  description  text NOT NULL DEFAULT '',
  image_url    text,
  external_url text,
  sort_order   int NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- TABLE: experiences
-- ============================================================
CREATE TABLE IF NOT EXISTS public.experiences (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name text NOT NULL,
  location     text NOT NULL DEFAULT '',
  year_start   text NOT NULL,
  year_end     text,
  description  text NOT NULL DEFAULT '',
  sort_order   int NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_name text NOT NULL,
  organizer   text NOT NULL DEFAULT '',
  year        text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order  int NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: languages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.languages (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_name text NOT NULL,
  level         text NOT NULL DEFAULT 'Intermediate',
  sort_order    int NOT NULL DEFAULT 0
);

-- ============================================================
-- TABLE: contacts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  whatsapp_url  text NOT NULL DEFAULT '',
  email         text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  linkedin_url  text NOT NULL DEFAULT '',
  updated_at    timestamptz DEFAULT now()
);

-- Insert default empty contacts row
INSERT INTO public.contacts (whatsapp_url, email, instagram_url, linkedin_url)
VALUES ('', '', '', '')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profile    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts   ENABLE ROW LEVEL SECURITY;

-- Public SELECT for all tables
CREATE POLICY "Public read profile"      ON public.profile      FOR SELECT USING (true);
CREATE POLICY "Public read skills"       ON public.skills       FOR SELECT USING (true);
CREATE POLICY "Public read projects"     ON public.projects     FOR SELECT USING (true);
CREATE POLICY "Public read experiences"  ON public.experiences  FOR SELECT USING (true);
CREATE POLICY "Public read courses"      ON public.courses      FOR SELECT USING (true);
CREATE POLICY "Public read languages"    ON public.languages    FOR SELECT USING (true);
CREATE POLICY "Public read contacts"     ON public.contacts     FOR SELECT USING (true);

-- Authenticated-only write for all tables
CREATE POLICY "Auth write profile"      ON public.profile      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write skills"       ON public.skills       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write projects"     ON public.projects     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write experiences"  ON public.experiences  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write courses"      ON public.courses      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write languages"    ON public.languages    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write contacts"     ON public.contacts     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these via Supabase Dashboard > Storage, or via SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read avatars"   ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth upload avatars"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update avatars"   ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete avatars"   ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Public read projects"  ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Auth upload projects"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update projects"  ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects"  ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
