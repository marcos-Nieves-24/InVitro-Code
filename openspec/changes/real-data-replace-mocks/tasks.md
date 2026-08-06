# Tasks: real-data-replace-mocks

> Desglosa el diseño en tareas verificables. Principio [D1]: honestidad > completitud — vacío motivador antes que número falso. Español para UI. Verificación oficial: `npm run build` (REQ-NFR-01).

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1000–1200 (≈22 archivos: migración, helpers, endpoints, 6 páginas, componentes, env) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 schema+endpoints+env → PR2 helpers+dashboard/logros → PR3 misión/comunidad/proyectos/labs/limpieza |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain (PR1→tracker `feat/real-data-replace-mocks`; PR2→PR1 branch; PR3→PR2 branch; solo tracker a main) |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unidad | Meta | PR | Test enfocado | Runtime harness | Rollback |
|--------|------|-----|---------------|-----------------|----------|
| U1 | Schema+migración+helpers+endpoints+env | PR 1 | Aplicar migración 2×; `rpc get_leaderboard`/`get_leaderboard_rank`; 401 sin sesión | SQL editor + `curl -i POST /api/certify` (esperado 401/503) | `DROP TABLE/FUNCTION` + `git revert` — sin cambio de UI |
| U2 | Helpers UI + dashboard + logros | PR 2 (base U1) | `rg '68%|+40 XP|24 de 64' src/app/\(dashboard\)/` → 0; build | Deploy dev + navegar `/dashboard` `/logros` | Revertir solo dashboard/logros |
| U3 | Comunidad+proyectos+labs/misiones+componentes+limpieza | PR 3 (base U2) | `rg 'dev-user|1,248|0\.782|35%|0\.72' src/` → 0; `npm run build` | Session Clerk real; flag off/on replant | Revert por página |

## T1. Schema + migración

- [x] T1.1 `supabase-migration.sql`: crear `achievements` y `user_achievements` (PK compuesta) + RLS con `auth.jwt() ->> 'sub'`, nunca `auth.uid()` (REQ-ACH-01/02)
- [x] T1.2 Seed idempotente de 17 logros con `ON CONFLICT (slug) DO NOTHING` (REQ-ACH-03)
- [x] T1.3 Índices `idx_progress_user_comp` y `idx_reflection_user_comp` (REQ-LB-06)
- [x] T1.4 Funciones SQL `get_leaderboard` (izquierda `profiles` + `COALESCE(0)`) y `get_leaderboard_rank` (REQ-LB-01/02/03)
- [ ] T1.5 Verificación: re-ejecutar migración 2× no duplica seed; PK rechaza par repetido; rpc incluye usuarios con 0 XP (REQ-ACH-03, REQ-LB-01) — manual en SQL editor (aplica la fase verify)

## T2. Helpers / lib

- [x] T2.1 `src/lib/gamification/achievements.ts`: `evaluateAchievements()` con `ON CONFLICT DO NOTHING` (preserva `unlocked_at`) + `getWeeklyXp()` (semana desde lunes, filtra `completed_at` NULL) (REQ-ACH-04/06, REQ-UP-05)
- [x] T2.2 `src/lib/gamification/user.ts`: `getTotalXp`, `getLevelInfo`, `getDisplayName` (username→local-part email→"Investigador") (REQ-UI-01, D9)
- [x] T2.3 `src/lib/ui/empty-states.ts` + `src/components/ui/EmptyState.tsx` (constantes motivadoras en es) (REQ-ACH-07, REQ-LB-05, REQ-UP-01/02)
- [x] T2.4 `src/lib/content/modules.ts`: añadir `getNextLesson(completedKeys)` → {moduleSlug, lessonSlug, title, xp} (REQ-UP-02)
- [x] T2.5 `src/lib/gamification/utils.ts`: mover `rankTitle()` para reutilizar en dashboard+labs (D10)

## T3. Endpoints

- [x] T3.1 `src/app/api/achievements/route.ts`: GET, `auth()`→401, `evaluateAchievements()`+catálogo, responde 200 `{achievements, summary}` (REQ-ACH-05)
- [x] T3.2 `src/app/api/leaderboard/route.ts`: GET, `auth()`→401, rpc top 50 + rank propio, `{entries, currentUser}` (REQ-LB-01/02)
- [x] T3.3 `src/app/api/certify/route.ts`: 1º `auth()`→401, 2º flag off→503 `{certified:false}`, 3º E2B solo con flag on; nunca `certified:true` off (REQ-CER-03/05)
- [x] T3.4 `src/app/api/progress/route.ts`: tras streak, `evaluateAchievements()` en try/catch no fatal (REQ-ACH-04)

## T4. Páginas

- [ ] T4.1 `dashboard/page.tsx`: redirect sin sesión; Proyecto Actual = módulo en progreso %=real o EmptyState; Misión Actual = `getNextLesson`+`calcXpForLesson`; Logros Recientes reales; quitar 68%, +40 XP, campana, logros fake (REQ-UP-01/02, REQ-ACH-08)
- [ ] T4.2 `logros/page.tsx`: pintar desde API + `getWeeklyXp`; % real; quitar 38%/24 de 64/CATEGORIES/WEEKLY_XP/"Ver perfil"/"Explorar Desafíos"; vacío motivador si 0 (REQ-ACH-06/07)
- [ ] T4.3 `comunidad/page.tsx`: ranking real + `currentUser`; activos `streaks.current_streak>0`; quitar proyectos fake/1,248/feed/"Sincronizar"/foros/DIREC ⇒ vacíos honestos (REQ-LB-04/05)
- [ ] T4.4 `proyectos/page.tsx`: conservar descripción educativa de vino; quitar Countdown, METRICS, leaderboard fake, "#42", Recompensa inventada, "Carga"/"ENTRENAR"/"CANJEAR", código fake → editor real o EmptyState; HUD = XP/nivel real (REQ-NFR-03, OQ-1)
- [ ] T4.5 `laboratorios/page.tsx`: breadcrumb real; `LabMission` con props reales; "+40 XP"→`calcXpForLesson` (REQ-UP-03)
- [ ] T4.6 `niveles/page.tsx`: `?? "dev-user"`→`redirect("/sign-in")`; userName real (REQ-UI-02)

## T5. Componentes

- [ ] T5.1 `AppSidebar.tsx`: default `userName="Investigador"`; las 6 páginas pasan `getDisplayName(profile)` (REQ-UI-01)
- [ ] T5.2 `lesson/page.tsx` lee `FEATURE_FLAG_CERTIFY` y propaga por components map → `LessonCodeEditor`→`PyodideRunner`→`OutputPanel` (prop `certifyEnabled`); botón solo si `valid && certifyEnabled` (REQ-CER-02/04)
- [ ] T5.3 `LabMission.tsx`: props nivel/misión/progreso; quitar 35%/"Nivel 1"/"Misión 2"/R²0.72/MAE0.48/160; mostrar run real Pyodide o "Ejecutá el código..." (REQ-UP-03/04, OQ-2)
- [ ] T5.4 `InVitroTopBar.tsx`: quitar campana (REQ-UI-03)

## T6. Limpieza global

- [ ] T6.1 `rg 'dev-user' src/` → 0 (REQ-UI-02)
- [ ] T6.2 `rg '68%|+40 XP|1,248|0\\.782|0\\.42|38%|24 de 64|35%|de 14h 32m'` en páginas → 0 (REQ-NFR-03)
- [ ] T6.3 `rg` no-ops (campana/"Ver perfil"/"Explorar Desafíos"/"Sincronizar"/"CANJEAR"/"ENTRENAR"/"Carga tu Dataset") → 0 (REQ-UI-03)
- [ ] T6.4 `npm run build` pasa (REQ-NFR-01)

## T7. Env

- [x] `.env.local.example`: documentar `FEATURE_FLAG_CERTIFY=false` (default off) (REQ-CER-01/05)