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
ALTER PUBLICATION supabase_realtime ADD TABLE achievements;
ALTER PUBLICATION supabase_realtime ADD TABLE user_achievements;

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
