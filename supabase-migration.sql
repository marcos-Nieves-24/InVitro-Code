-- Run this in your Supabase SQL Editor
--
-- InVitro-Code schema
-- Identity model: Clerk is the ONLY auth provider. Supabase Auth is NOT used.
-- The Clerk user id is stored as TEXT in `id`/`user_id`.
-- RLS must therefore compare against the Clerk-issued JWT `sub` claim
-- (auth.jwt() ->> 'sub'), NOT auth.uid() (Supabase Auth identity, unused here).

-- 0. Realtime publication (required for postgres_changes subscriptions in gamification components)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- 1. Profiles (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own profile" ON profiles;
CREATE POLICY "users can read own profile"
  ON profiles FOR SELECT
  USING ((auth.jwt() ->> 'sub') = id);

DROP POLICY IF EXISTS "users can update own profile" ON profiles;
CREATE POLICY "users can update own profile"
  ON profiles FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = id);

-- 2. Progress tracking
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  module_slug TEXT NOT NULL,
  lesson_slug TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_slug, lesson_slug)
);

ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own progress" ON progress;
CREATE POLICY "users can read own progress"
  ON progress FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can insert own progress" ON progress;
CREATE POLICY "users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can update own progress" ON progress;
CREATE POLICY "users can update own progress"
  ON progress FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- 3. Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own streaks" ON streaks;
CREATE POLICY "users can read own streaks"
  ON streaks FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can insert own streaks" ON streaks;
CREATE POLICY "users can insert own streaks"
  ON streaks FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can update own streaks" ON streaks;
CREATE POLICY "users can update own streaks"
  ON streaks FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

-- 4. Reflection completions (used by api/progress/reflection and XPBar realtime)
CREATE TABLE IF NOT EXISTS reflection_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  block_id TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, block_id)
);

ALTER TABLE reflection_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own reflections" ON reflection_completions;
CREATE POLICY "users can read own reflections"
  ON reflection_completions FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can insert own reflections" ON reflection_completions;
CREATE POLICY "users can insert own reflections"
  ON reflection_completions FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- 5. Realtime: expose tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE progress;
ALTER PUBLICATION supabase_realtime ADD TABLE streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE reflection_completions;
