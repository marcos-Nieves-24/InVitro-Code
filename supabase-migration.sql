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
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  bio TEXT,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  notification_prefs JSONB DEFAULT '{"email": true, "streak": true}'::jsonb,
  is_banned BOOLEAN DEFAULT false,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enforce theme CHECK for tables created before this migration (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_theme_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_theme_check CHECK (theme IN ('light','dark','system'));
  END IF;
END $$;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql STABLE;

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

-- 5. Realtime: expose tables to the realtime publication (idempotent per table)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profiles') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'progress') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE progress;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'streaks') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE streaks;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'reflection_completions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE reflection_completions;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'achievements') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE achievements;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'user_achievements') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_achievements;
  END IF;
END $$;

-- 6. Achievements catalog (real-data-replace-mocks, REQ-ACH-01)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Trophy',
  category TEXT NOT NULL DEFAULT 'Novato',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  condition_type TEXT NOT NULL,      -- lessons_completed | total_xp | current_streak | reflections_completed | module_completed
  condition_value TEXT NOT NULL      -- '1', '500', 'python', ...
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated can read achievements" ON achievements;
CREATE POLICY "authenticated can read achievements"
  ON achievements FOR SELECT
  USING ((auth.jwt() ->> 'sub') IS NOT NULL);

-- 7. User unlocks (composite PK -> idempotency, REQ-ACH-01/02)
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id TEXT NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own unlocks" ON user_achievements;
CREATE POLICY "users can read own unlocks"
  ON user_achievements FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can insert own unlocks" ON user_achievements;
CREATE POLICY "users can insert own unlocks"
  ON user_achievements FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- 8. Seed idempotente (17 logros, condiciones reales, REQ-ACH-03)
INSERT INTO achievements (slug, title, description, icon, category, xp_reward, condition_type, condition_value) VALUES
  ('primer-paso',        'Primeros Pasos',        'Completá tu primera lección.',            'GraduationCap', 'Novato',        20,  'lessons_completed',    '1'),
  ('explorador',         'Explorador de Datos',   'Completá 5 lecciones.',                   'Database',      'Novato',        40,  'lessons_completed',    '5'),
  ('reflexivo',          'Reflexivo',             'Completá tu primera reflexión.',          'Brain',         'Novato',        20,  'reflections_completed','1'),
  ('constancia',         'Constancia',            'Alcanzá una racha de 3 días.',            'Flame',         'Novato',        30,  'current_streak',       '3'),
  ('semana-en-llamas',   'Semana en Llamas',      'Alcanzá una racha de 7 días.',            'Flame',         'Analista',      60,  'current_streak',       '7'),
  ('coleccionista-xp',   'Coleccionista de XP',   'Acumulá 500 XP.',                         'Gem',           'Analista',      50,  'total_xp',             '500'),
  ('racha-campeon',      'Racha Campeón',         'Alcanzá una racha de 14 días.',           'Flame',         'Analista',     100,  'current_streak',       '14'),
  ('python-fundamentos', 'Fundamentos de Python', 'Completá el módulo de Python.',           'Terminal',      'Analista',      80,  'module_completed',     'python'),
  ('ia-fundamentos',     'Fundamentos de IA',     'Completá el módulo de IA.',               'Brain',         'Analista',      80,  'module_completed',     'ia'),
  ('estadistica-basica', 'Estadística Básica',    'Completá el módulo de Estadística.',      'BarChart3',     'Analista',      80,  'module_completed',     'estadistica'),
  ('pensador-profundo',  'Pensador Profundo',     'Completá 10 reflexiones.',                'Brain',         'Investigador', 100,  'reflections_completed','10'),
  ('ml-practico',        'ML Práctico',           'Completá el módulo de Machine Learning.', 'Cpu',           'Investigador', 100,  'module_completed',     'machine-learning'),
  ('etica-en-ia',        'Ética en IA',           'Completá el módulo de Ética.',            'Shield',        'Investigador',  80,  'module_completed',     'etica'),
  ('xp-mil',             'Mil de XP',             'Acumulá 1.000 XP.',                       'Gem',           'Investigador', 120,  'total_xp',             '1000'),
  ('mitad-de-camino',    'Mitad de Camino',       'Acumulá 2.500 XP.',                       'Gem',           'Investigador', 150,  'total_xp',             '2500'),
  ('maestro-ml',         'Maestro de ML',         'Completá 30 lecciones.',                  'Rocket',        'Investigador', 150,  'lessons_completed',    '30'),
  ('investigador-experto','Investigador Experto', 'Acumulá 5.000 XP.',                       'Crown',         'Investigador', 200,  'total_xp',             '5000')
ON CONFLICT (slug) DO NOTHING;

-- 9. Leaderboard indexes (REQ-LB-06)
CREATE INDEX IF NOT EXISTS idx_progress_user_comp ON progress(user_id, completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_reflection_user_comp ON reflection_completions(user_id, completed_at);

-- 10. Leaderboard functions (REQ-LB-01/02/03; LEFT JOIN profiles -> 0 XP users included)
CREATE OR REPLACE FUNCTION get_leaderboard(limit_n INT)
RETURNS TABLE(user_id TEXT, username TEXT, total_xp BIGINT) LANGUAGE sql STABLE AS $$
  SELECT p.id, p.username, COALESCE(x.total_xp, 0)::bigint
  FROM profiles p
  LEFT JOIN (
    SELECT user_id, SUM(xp) AS total_xp FROM (
      SELECT user_id, xp_earned AS xp FROM progress WHERE completed = TRUE AND completed_at IS NOT NULL
      UNION ALL
      SELECT user_id, xp_earned FROM reflection_completions WHERE completed_at IS NOT NULL
    ) xr GROUP BY user_id
  ) x ON x.user_id = p.id
  ORDER BY x.total_xp DESC NULLS LAST, p.id
  LIMIT limit_n;
$$;

CREATE OR REPLACE FUNCTION get_leaderboard_rank(target_user_id TEXT)
RETURNS INTEGER LANGUAGE sql STABLE AS $$
  SELECT COUNT(*)::int + 1 FROM (
    SELECT user_id, SUM(xp) AS total_xp FROM (
      SELECT user_id, xp_earned AS xp FROM progress WHERE completed = TRUE AND completed_at IS NOT NULL
      UNION ALL
      SELECT user_id, xp_earned FROM reflection_completions WHERE completed_at IS NOT NULL
    ) xr GROUP BY user_id
  ) x
  WHERE x.total_xp > COALESCE((
    SELECT SUM(xp) FROM (
      SELECT xp_earned AS xp FROM progress WHERE user_id = target_user_id AND completed = TRUE AND completed_at IS NOT NULL
      UNION ALL
      SELECT xp_earned FROM reflection_completions WHERE user_id = target_user_id AND completed_at IS NOT NULL
    ) me
  ), 0);
$$;

-- ──────────────────────────────────────────────────────────
-- 11. Modules table (replaces filesystem dependency for lesson counts)
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS modules (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    lesson_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with actual content from src/content/modules/
INSERT INTO modules (slug, name, lesson_count) VALUES
    ('python', 'Python', 17),
    ('ia', 'Fundamentos de IA', 4),
    ('estadistica', 'Estadística', 10),
    ('machine-learning', 'Machine Learning', 10)
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- 12. Gender preference column (dashboard-gaming-refactor PR-1)
-- ──────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender TEXT CHECK (gender IN ('f','m','x'));
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────
-- 13. Lab progress — lifecycle persistence (labs-lifecycle-persistence PR1)
-- Additive, idempotent. Clerk is the ONLY auth provider (see header).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lab_progress (
  user_id           TEXT        NOT NULL,
  module_slug       TEXT        NOT NULL,
  lesson_slug       TEXT        NOT NULL,
  completion_status TEXT        NOT NULL CHECK (completion_status IN ('not_started','in_progress','completed')),
  completion_date   TIMESTAMPTZ,
  last_position     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, module_slug, lesson_slug)
);

ALTER TABLE lab_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own lab_progress" ON lab_progress;
CREATE POLICY "users can read own lab_progress"
  ON lab_progress FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can insert own lab_progress" ON lab_progress;
CREATE POLICY "users can insert own lab_progress"
  ON lab_progress FOR INSERT
  WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

DROP POLICY IF EXISTS "users can update own lab_progress" ON lab_progress;
CREATE POLICY "users can update own lab_progress"
  ON lab_progress FOR UPDATE
  USING ((auth.jwt() ->> 'sub') = user_id);

CREATE OR REPLACE FUNCTION set_lab_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_lab_progress_updated_at ON lab_progress;
CREATE TRIGGER trg_lab_progress_updated_at
  BEFORE INSERT OR UPDATE ON lab_progress
  FOR EACH ROW EXECUTE FUNCTION set_lab_progress_updated_at();

CREATE INDEX IF NOT EXISTS idx_lab_progress_user_module ON lab_progress(user_id, module_slug);
CREATE INDEX IF NOT EXISTS idx_lab_progress_user_status ON lab_progress(user_id, completion_status);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'lab_progress'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE lab_progress;
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────
-- 14. Consent logs + retention base (compliance-hibrido-consent-supresion COMP-01)
-- Ley 1581 art.9/art.6/art.26 + Ley 527 — hybrid model foundation.
-- Clerk is the ONLY auth provider (see header): RLS uses auth.jwt() ->> 'sub'.
-- Idempotent: IF NOT EXISTS / DO blocks, same pattern as §12 gender column.
-- Retention notes (see §4 legal/data-inventory.md):
--   - Consent evidence (consent_logs): retain while account active + 6 months
--     after suppression (art.8). After that, purge or anonymize. Register in RNBD.
--   - profiles.consent_status/consent_version/pending_since: lifecycle of
--     authorization (verified|pending|blocked). pending purged after 24h (COMP-07).
--   - lab_progress.last_position.codeSnapshot: purge to '{}' after 30-90 days
--     without activity or on completed (minimization, §4 recommendation).
--   - Storage avatars/* and all user tables: cascade on user.deleted (COMP-06).
-- ──────────────────────────────────────────────────────────

-- 14a. Profiles — consent lifecycle columns (idempotent per column)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'consent_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN consent_status TEXT
      CHECK (consent_status IN ('verified','pending','blocked'))
      DEFAULT 'pending';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'consent_version'
  ) THEN
    ALTER TABLE profiles ADD COLUMN consent_version TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'pending_since'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pending_since TIMESTAMPTZ;
  END IF;
END $$;

-- 14b. Consent evidence table (Ley 527 conservable: timestamp + ip/ua + hash + version)
CREATE TABLE IF NOT EXISTS consent_logs (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             TEXT        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  policy_version      TEXT        NOT NULL,
  accepted_text_hash  TEXT        NOT NULL,
  purposes            TEXT[]      NOT NULL,
  ip                  INET,
  user_agent          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14c. Indexes for consent verification queries
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_policy ON consent_logs(policy_version);

-- 14d. RLS — Clerk JWT only (see header). Service-role (createAdminClient) bypasses RLS,
-- so admin insert needs no policy; kept as comment for audit clarity.
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own consent_logs" ON consent_logs;
CREATE POLICY "users can read own consent_logs"
  ON consent_logs FOR SELECT
  USING ((auth.jwt() ->> 'sub') = user_id);

-- Admin insert via service-role (SUPABASE_SERVICE_ROLE_KEY) bypasses RLS — no policy needed.
-- Users can read own consent status via existing profiles SELECT policy
-- "users can read own profile" (USING auth.jwt() ->> 'sub' = id) — no new policy.

-- 14e. Retention documentation (SQL comments, auditable in catalog)
COMMENT ON TABLE consent_logs IS 'Ley 1581 art.9/art.26 + Ley 527: conservable consent evidence (policy_version, accepted_text_hash, purposes, ip, user_agent, created_at). Retain while account active + 6 months after suppression; purge thereafter. See legal/data-inventory.md §4.';
COMMENT ON COLUMN consent_logs.policy_version IS 'Version of politica-privacidad.md accepted (e.g. 2026-10-06-v1).';
COMMENT ON COLUMN consent_logs.accepted_text_hash IS 'SHA-256 hash of the accepted policy text for integrity (Ley 527).';
COMMENT ON COLUMN consent_logs.purposes IS 'Purposes covered by this consent (e.g. {F-01,F-02,F-03,F-04,F-05,F-06,F-07,transferencia-EEUU,sensible-gender-x}).';
COMMENT ON COLUMN profiles.consent_status IS 'Hybrid consent lifecycle: verified (full access), pending (24h grace, limited), blocked (sensitive or expired). Default pending.';
COMMENT ON COLUMN profiles.consent_version IS 'Policy version associated with consent_status (mirrors consent_logs.policy_version).';
COMMENT ON COLUMN profiles.pending_since IS 'When pending started; purge if pending_since < NOW() - 24h (COMP-07). codeSnapshot retention: 30-90d after last activity (see legal/data-inventory.md §4).';
