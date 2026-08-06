# Design: real-data-replace-mocks

> Reemplaza mocks por datos reales. Principio rector [D1]: honestidad > completitud — vacío motivador antes que número falso. Patrón dominante ya existente en `niveles/page.tsx`: página server con `auth()` de Clerk + `createAdminClient()` + queries directas; componentes client reciben props.

## Technical Approach

1. **Schema** (adiciones a `supabase-migration.sql`): `achievements` + `user_achievements` + seed idempotente (17 logros) + RLS con `auth.jwt() ->> 'sub'` + funciones SQL de leaderboard.
2. **Evaluación de logros**: helper compartido `evaluateAchievements()` (lazy en GET `/api/achievements` + hook en POST `/api/progress`), idempotente vía PK + `ON CONFLICT DO NOTHING`.
3. **Endpoints** nuevos server-only con `createAdminClient()`: `GET /api/achievements`, `GET /api/leaderboard`.
4. **Certify [D2]**: flag `FEATURE_FLAG_CERTIFY` (default off) leído en servidor; prop `certifyEnabled` hasta `OutputPanel`; ruta rechaza 503.
5. **UI**: las 6 páginas dashboard pasan a `auth()` real (redirect, cero `dev-user`), `userName` real en sidebar, datos reales o `EmptyState` motivador; se eliminan no-ops y números fake.

## Architecture Decisions

| # | Decisión | Opciones | Tradeoff | Decisión |
|---|---|---|---|---|
| D1 | `condition_value` TEXT (no INTEGER) | INT numérico vs TEXT flexible | INT exige columnas extra para "módulo completo"; TEXT admite `'3'` y `'python'` | `TEXT`; evaluador normaliza con `Number()` cuando aplica |
| D2 | Evaluación de logros | (a) lazy solo en GET /api/achievements · (b) lazy + hook en POST /api/progress · (c) trigger DB | (a) simple pero "Logros Recientes" del dashboard queda stale hasta visitar /logros · (c) acopla lógica a la DB | **(b)** — helper central; en POST /api/progress se llama tras el streak, con try/catch no fatal |
| D3 | Idempotencia de `unlocked_at` | UPDATE reescribiendo fecha vs `INSERT ... ON CONFLICT DO NOTHING` | Reescribir viola REQ-ACH-04 (fecha no se mueve) | `DO NOTHING` multi-fila |
| D4 | Leaderboard server-side | Agregar en TS (fetch masivo) vs función SQL `.rpc()` vs vista materializada | TS no escala; MV agrega mantenimiento; `.rpc()` es correcto y barato para cientos de usuarios | **2 funciones SQL** (`get_leaderboard`, `get_leaderboard_rank`) + índices; MV diferida si >100 activos (REQ-LB-06 SHOULD) |
| D5 | Fuente del leaderboard | Solo filas con XP vs `profiles` LEFT JOIN | REQ-LB-01 exige que usuarios con 0 XP aparezcan | `profiles` LEFT JOIN con `COALESCE(0)` |
| D6 | Flag off → status | 403 vs 503 | 403 = prohibido; 503 = "no disponible todavía" (feature no habilitada) | **503** `{ certified: false }` |
| D7 | Prop del flag a OutputPanel | Context vs prop drilling | Context oculta flujo; drilling es explícito y son 3 saltos | Prop drilling: página lesson (server) → components map → `LessonCodeEditor` → `PyodideRunner` → `OutputPanel`; default `false` (seguro) |
| D8 | Página logros lee API o lib | `fetch()` interno a la ruta vs llamar la lib server-side | fetch a sí mismo agrega latencia/red | Página y ruta usan la MISMA lib `getAchievementsState()`; la ruta solo serializa JSON |
| D9 | `userName` fallback | Default hardcode vs derivado del perfil real | REQ-UI-01 prohíbe "Investigador InVitro-Code" | `username` → local-part de `email` → `"Investigador"` |
| D10 | `rankTitle` duplicado | dashboard local vs lib compartida | laboratorios necesita el mismo mapping | Mover `rankTitle` a `src/lib/gamification/utils.ts` y reusar en dashboard + laboratorios |
| D11 | Realtime `user_achievements` | Agregar a publicación vs no | No hay suscripciones client a logros (server-rendered); exponer filas de todos vía realtime es superficie innecesaria | **No** agregar a `supabase_realtime` |

## Migración SQL (adiciones a `supabase-migration.sql`)

```sql
-- 6. Achievements catalog
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
  ON achievements FOR SELECT USING ((auth.jwt() ->> 'sub') IS NOT NULL);

-- 7. User unlocks (PK compuesta → idempotencia)
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id TEXT NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users can read own unlocks" ON user_achievements;
CREATE POLICY "users can read own unlocks"
  ON user_achievements FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);
DROP POLICY IF EXISTS "users can insert own unlocks" ON user_achievements;
CREATE POLICY "users can insert own unlocks"
  ON user_achievements FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);

-- 8. Seed idempotente (17 logros, condiciones reales)
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

-- 9. Índices de leaderboard (REQ-LB-06)
CREATE INDEX IF NOT EXISTS idx_progress_user_comp ON progress(user_id, completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_reflection_user_comp ON reflection_completions(user_id, completed_at);

-- 10. Funciones SQL de leaderboard (REQ-LB-01/02/03; LEFT JOIN profiles → 0 XP incluidos)
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
  ORDER BY total_xp DESC, p.id
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
```

RLS nunca usa `auth.uid()` (REQ-ACH-02). El admin client (service role) no lo necesita; el RLS protege lecturas con anon key.

## Data Flow

```
[POST /api/progress] ──(completa lección)──▶ evaluateAchievements(userId) ──▶ user_achievements (DO NOTHING)
[GET /api/achievements] ──▶ evaluateAchievements(userId) + catálogo join unlocks ──▶ JSON {achievements, summary}
[GET /api/leaderboard] ──▶ rpc(get_leaderboard, 50) + rpc(get_leaderboard_rank) ──▶ JSON {entries, currentUser}

Páginas server (dashboard, logros, comunidad, laboratorios, niveles)
  ├─ auth() ── no session ──▶ redirect("/sign-in")     [nunca "dev-user"]
  ├─ createAdminClient() ──▶ progress/reflection/streaks/profiles/user_achievements
  └─ props ──▶ AppSidebar(userName) · LabMission(level,rank,mission,progress) · OutputPanel(certifyEnabled)
```

`certifyEnabled`: `lesson/[module]/[slug]/page.tsx` (server) lee `process.env.FEATURE_FLAG_CERTIFY === "true"` y lo inyecta vía components map: `CodeEditor: (p) => <LessonCodeEditor {...p} certifyEnabled={flag} />` → `PyodideRunner` → `OutputPanel`. `laboratorios/page.tsx` hace lo mismo vía `LabMission` (sin `exercise` el botón jamás se muestra; prop por defensa). La env `FEATURE_FLAG_CERTIFY` (default `false`) MUST documentarse en `.env.local.example` (REQ-CER-01).

## Endpoints

**GET `/api/achievements`** — `auth()` → 401 si no hay sesión. `createAdminClient()`. Llama `evaluateAchievements(userId, supabase)` y devuelve:

```ts
interface AchievementState {
  id: string; slug: string; title: string; description: string;
  icon: string; category: string; xpReward: number;
  unlocked: boolean; unlockedAt: string | null;
}
// 200 → { achievements: AchievementState[]; summary: { total: number; unlocked: number; percent: number } }
```

**GET `/api/leaderboard`** — `auth()` → 401. `.rpc("get_leaderboard", { limit_n: 50 })` + `.rpc("get_leaderboard_rank", { target_user_id: userId })`.

```ts
interface LeaderboardEntry { userId: string; username: string | null; totalXp: number; }
// 200 → { entries: LeaderboardEntry[]; currentUser: { position: number } | null }
```

**POST `/api/certify`** — orden: (1) `auth()` → 401; (2) `process.env.FEATURE_FLAG_CERTIFY !== "true"` → 503 `{ certified: false, message: "La certificación no está disponible todavía." }`; (3) solo con flag on se ejecuta el bloque E2B (MVP actual marcado como tal). Nunca `certified: true` con flag off (REQ-CER-03/05).

## Lógica de desbloqueo (`src/lib/gamification/achievements.ts`)

- `evaluateAchievements(userId, supabase)`: en paralelo consulta conteo de lecciones completadas (`progress.completed = true`), `totalXp` (progress + reflections), `current_streak`, conteo de reflexiones, y slugs completados por módulo. Cruza contra catálogo; para `module_completed` compara `getLessonCount(slug)` desde `src/lib/content/modules.ts`. Inserta en una sola operación multi-fila con `ON CONFLICT (user_id, achievement_id) DO NOTHING` (preserva `unlocked_at`, REQ-ACH-04). Devuelve catálogo + estado.
- `getWeeklyXp(userId, supabase)`: semana desde lunes (es-AR), suma `progress.xp_earned` + `reflection_completions.xp_earned` con `completed_at IS NOT NULL AND completed_at >= weekStart`; devuelve 7 valores por día (REQ-ACH-06, REQ-UP-05).

## Componentes y props

| Componente | Props (nuevo/actual) | Cambio |
|---|---|---|
| `AppSidebar` | `userName?` default → `"Investigador"` | Quitar default "Investigador InVitro-Code"; las 6 páginas pasan `userName` real |
| `InVitroShell` | sin cambios | pasa `userName`/`userMeta` |
| `LabMission` | `+ { level: number; rankName: string; missionLabel: string; progressPercent: number \| null; lessonTotal: number; completedLessonSlugs: string[] }` | breadcrumb real (REQ-UP-03), progreso real o `EmptyState` "sin progreso" (REQ-UP-04), quitar "35%"/"Nivel 1 - Novato"/"Misión 2" hardcodeados; recompensa = `calcXpForLesson` real |
| `OutputPanel` | `+ certifyEnabled?: boolean` (default `false`) | botón "Estoy listo" solo si `validationResult === "valid" && certifyEnabled` (REQ-CER-02) |
| `PyodideRunner` / `LessonCodeEditor` | `+ certifyEnabled?: boolean` | forward de prop |
| `ModuleProgress` | sin cambios (ya real) | — |
| `InVitroTopBar` | sin cambios | quitar campana (no-op, REQ-UI-03) |
| `EmptyState` (nuevo, `src/components/ui/EmptyState.tsx`) | `{ icon; title; description?; actionLabel?; href? }` | componente genérico de vacío motivador |

Mensajes de vacío como constantes en `src/lib/ui/empty-states.ts` (REQ-ACH-07, REQ-LB-04/05, REQ-UP-01/02): `"Completá tu primera lección para desbloquear logros"`, `"Sé el primero en aparecer en el ranking"`, `"Nadie con racha activa todavía — sé la primera chispa"`, `"Empezá tu primera lección para ver tu Proyecto Actual"`, `"Completá una lección para que tu Misión aparezca acá"`.

Páginas (server → props):

| Página | Cambios |
|---|---|
| `dashboard/page.tsx` | auth redirect; `userName` real; **Proyecto Actual** = módulo en progreso (≥1 completada, <100%, en orden de módulos) con % = `completed/total*100` o `EmptyState`; **Misión Actual** = próxima lección incompleta (helper `getNextLesson(completedKeys)` en `modules.ts`) con `+{calcXpForLesson} XP` o estado de completitud; **Logros Recientes** = `user_achievements` reales (limit 3) o vacío; quitar 68%, +40 XP, campana, logros fake |
| `logros/page.tsx` | usa `getAchievementsState()` + `getWeeklyXp()`; % real = `unlocked/total`; quitar CATEGORIES/WEEKLY_XP/38%/24 de 64/"Ver perfil completo"/"Explorar Desafíos"; vacío motivador si `unlocked === 0` |
| `comunidad/page.tsx` | ranking real + `currentUser`; activos = `profiles` ⋈ `streaks.current_streak > 0` (limit 10); quitar proyectos fake, "En Línea: 1,248", feed, "Sincronizar Feed", "Ver todos", foros; vacíos motivadores |
| `proyectos/page.tsx` | quitar `Countdown`, campana/config, METRICS fake (R² 0.782, MAE 0.42, epochs), LEADERBOARD fake + "#42"/"SIGUE ASÍ", "Carga tu Dataset", "ENTRENAR MODELO", "CANJEAR PREMIOS", "VER TODOS"; reemplazar HUD por XP/nivel reales o `EmptyState` |
| `laboratorios/page.tsx` | breadcrumb real `Nivel {level} · {rankName} · {misión}`; `LabMission` con datos reales; quitar "+40 XP" fijo (usar `calcXpForLesson`) |
| `niveles/page.tsx` | `?? "dev-user"` → `redirect("/sign-in")`; `userName` real |

Helper nuevo `src/lib/gamification/user.ts`: `getTotalXp(userId, supabase)`, `getLevelInfo(userId, supabase)`, `getDisplayName(profile)` — elimina la duplicación de totalXp en 6 páginas.

## Testing Strategy

| Capa | Qué | Cómo |
|---|---|---|
| SQL (manual) | Idempotencia seed (re-ejecutar no duplica), PK compuesta rechaza duplicados, RLS oculta filas ajenas, `get_leaderboard` incluye 0 XP | Ejecutar `supabase-migration.sql` 2× en SQL editor + queries de verificación |
| Build gate | REQ-NFR-01 | `npm run build` (verificación oficial) |
| Manual | Flag off: sin botón + `/api/certify` → 503; flag on: botón visible | `FEATURE_FLAG_CERTIFY` ausente/`false`/`true` + llamada directa a la ruta |
| Manual | Cero `"dev-user"`, cero números fake (68%, +40 XP, R² 0.782, 1,248, 38%, 24 de 64, 35%, countdown) | `rg "dev-user|68%|1,248|0\.782|countdown"` en `src/` + auditoría de render |
| Manual | `completed_at` NULL no rompe XP semanal ni leaderboard | Filas viejas con NULL + re-calcular |
| Unit (opcional) | `evaluateAchievements`, `getNextLesson`, `calcLevel` | `src/__tests__/` manuales (sin runner configurado) |

## Threat Matrix

| Boundary | Applicability | Design response | Planned RED tests |
|---|---|---|---|
| Documentation-like paths | N/A — sin ejecución de markdown/scripts | — | — |
| Git repository selection | N/A — sin comandos git | — | — |
| Commit state | N/A — sin commits en la fase | — | — |
| Push state | N/A — sin pushes | — | — |
| PR commands | N/A — sin automatización de PR | — | — |

Sin shell/subprocess/VCS/PR automation. El límite de **auth de rutas API** (401 sin sesión, 503 flag off, RLS `sub`) no pertenece a esta matriz y se cubre con los escenarios REQ-ACH-05, REQ-LB-01 y REQ-CER-03.

## Migration / Rollout

- Aplicación manual de `supabase-migration.sql` en el SQL editor (convención del proyecto); las adiciones son aditivas y re-ejecutables (`IF NOT EXISTS`, `CREATE OR REPLACE`, seed `DO NOTHING`).
- Rollback: `DROP TABLE IF EXISTS user_achievements, achievements; DROP FUNCTION IF EXISTS get_leaderboard; DROP FUNCTION IF EXISTS get_leaderboard_rank;` + `git revert` de la UI. Flag default off = sin cambio de comportamiento en producción (REQ-CER-05).
- Sin data migration de filas existentes.

## Open Questions

- [ ] `proyectos/page.tsx`: ¿se conserva la descripción del reto (contenido educativo) sin métricas, o se recorta a un `EmptyState`? El diseño propone conservar descripción + XP/nivel reales.
- [ ] Los valores ilustrativos del lab (R² 0.72, MAE 0.48, 160 muestras) son contenido pedagógico de la misión, no progreso del usuario: confirmar que no caen en REQ-NFR-03 (no están en la lista prohibida).
