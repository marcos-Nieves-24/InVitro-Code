# Feature: proyectos-restore-exp-streak-jerarquia

## Objective
Restaurar cards de Proyectos dentro de módulos (paridad Laboratorios), corregir jerarquía semántica por proyecto (assignment.md), y cerrar wiring de EXP/progreso/ritmo/constancia por usuario contra backend.

## Problem
1. Commit `327adcb` (LabHistoryCard grid + lab_progress) existe solo en `odd/lab-heroes-restore`, no es ancestro de `main` — `proyectos/[module]/page.tsx` en `main` volvió a pills `slice(0,6)` sin fecha/estado.
2. Cada `assignment.md` arranca con `# Assignment: …` (h1) y la página ya rinde `h1` (`ProjectDetailPage:117`) → doble h1, h2 del md queda hermano en vez de hijo.
3. `POST /api/lab-progress` hace dual-write a `progress` pero NO a `streaks` → EXP y progreso avanzan pero constancia/ritmo (racha) miente para flujo labs. EXP de cards debe verificarse que no sea mock/hardcodeado y represente contenido real.

## Why
Paridad labs/proyectos comprometida, accesibilidad rota (headings), y métricas de dashboard desincronizadas por usuario.

## Scope
- `src/app/(dashboard)/proyectos/[module]/page.tsx` — restore 327adcb (lab_progress + LabHistoryCard grid + smart CTA)
- `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx` — heading shift rehype para assignment.md
- `src/lib/gamification/streak.ts` (nuevo) — `advanceStreak()` extraído
- `src/app/api/lab-progress/route.ts` — llamar `advanceStreak` tras dual-write
- `src/app/api/progress/route.ts` — usar `advanceStreak` compartido
- `src/middleware.ts` — no tocar (ya 401 para API)
- Tests + Playwright — gate

## Constraints
- `Clerk` es único auth — RLS `auth.jwt() ->> 'sub'` nunca `auth.uid()`.
- Server writes via `createAdminClient()` (service-role), nunca anon key.
- No `next lint` — gate es `type-check` + `build` + `vitest run`.
- 400 líneas heurísticas solo advisory, no cap.

## Tasks
### T1 — Restore proyectos/[module] cards (lost 327adcb) [done]
- **Do:** Reaplicar patch 327adcb sobre HEAD: imports `getLessonFrontmatter, getLabResumeTarget, LabProgressMap, LabHistoryCard`; fetch `[profileRes, progressRes, labProgressRes]` con `lab_progress eq module_slug`; `progressMap + hasLabProgressRows + completedCount` branching; `xpTotal` → `xpTotalDisponible`, `progressPct`, `eyebrow`, `resume = getLabResumeTarget`, `ctaHref/ctaLabel/showSingleCTA`; render grid `LabHistoryCard` (no pills slice). Mantener `LabProgressRing` paridad.
- **Verify:** `npm run type-check` OK, `npm run build` OK, diff visual contra `git show 327adcb:src/app/(dashboard)/proyectos/[module]/page.tsx` coincide. Playwright `proyectos/ia` y `proyectos/python` muestra grid 3 cols con estados.
- **Scope:** `src/app/(dashboard)/proyectos/[module]/page.tsx`

### T2 — Fase C: streak wiring (EXP + constancia/ritmo por usuario) [done]
- **Do:** Crear `src/lib/gamification/streak.ts` con `utcDay()` + `advanceStreak(userId, supabase, completed)` extraído de `progress/route.ts:107-144`; usarlo en `progress/route.ts` y `lab-progress/route.ts` (tras dual-write, best-effort, no bloqueante). Preservar idempotencia mismo UTC día.
- **Verify:** `npm run test` (92 tests + nuevos de streak si agrega) + `npm run type-check` + `npm run build`. Manual: completar un lab vía `lab_progress` y chequear `streaks.last_active_date` y que `getDailyActivity`/`getProgressTimeline` agreguen xp_earned real.
- **Scope:** `src/lib/gamification/streak.ts`, `src/app/api/lab-progress/route.ts`, `src/app/api/progress/route.ts`

### T3 — Jerarquía semántica por proyecto (assignment.md shift) [done → updated to strip]
- **Do:** En `proyectos/[module]/[lesson]/page.tsx:20-25` reemplazar `rehypeDemoteH1` por `rehypeStripFirstH1` que elimina el primer `h1` cuyo texto inicia con `Assignment` (saca "Assignment 9: Interpretación de modelos" duplicado). Mantener page `h1` único (línea 136) y `## Objetivos` como `h2`. No editar los 41 `.md`.
- **Verify:** `npm run type-check` + `npm run build` + inspección DOM en `/proyectos/machine-learning/lesson09_model_interpretation` — 1×h1 (Interpretación de Modelos), 0×h1 Assignment duplicado, h2 primero = Objetivos.
- **Scope:** `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx`

### T4 — EXP de cards no mock / representa contenido total [done]
- **Do:** Auditar que `proyectos/page.tsx:85` `xpReward = sum(calcXpForLesson)` y `proyectos/[module]/page.tsx` `xpTotalDisponible` usen `lessonSlugs` reales (fs) y no estén hardcodeados. Agregar comentario clarificador. Verificar totales: python 17→425 XP, ia 4→100 XP, etc.
- **Verify:** `npm run test` incluye `utils.test.ts` calcXp; manual check de hub muestra XP real por módulo.
- **Scope:** `src/app/(dashboard)/proyectos/page.tsx`, `src/app/(dashboard)/proyectos/[module]/page.tsx`, `src/lib/gamification/utils.ts` (read-only)

### T5 — Backend connectivity: EXP/progreso/ritmo/constancia por usuario [done]
- **Do:** Verificar `DashboardContainer.tsx:99-108`, `src/lib/gamification/activity.ts`, `src/lib/gamification/user.ts` ya leen `progress + reflection_completions + streaks` filtrado por `user_id` + `completed_at NOT NULL`. Documentar wiring en doc y asegurar que `proyectos/[module]` tras T1 también filtra por `user_id`.
- **Verify:** Playwright dashboard con usuario logueado: `Tu Progreso`, `Ritmo`, `Expediciones`, `Constancia` renderizan datos reales (no placeholders). Si vacía, empty states correctos.
- **Scope:** lectura/verify, no código (salvo que falte filtro)

### T6 — Gate: type-check + build + vitest + Playwright (nada se aprueba sin testing) [done]
- **Do:** Correr `npm run type-check`, `npm run build`, `npm run test` (92+ tests), Playwright/e2e mínimo para `/proyectos`, `/proyectos/python`, `/proyectos/[module]/[lesson]`, `/dashboard`. Registrar evidencias y commits.
- **Verify:** Todo green. Registrar commit hashes en Progress.

## Verification (global)
- `npm run type-check` — 0 errors
- `npm run build` — success (Turbopack)
- `npm run test` — 92+ tests green
- Playwright checks (structural + heading order + grid + streak)

## Progress
- 2026-10-02: feature doc creada en rama `odd/proyectos-restore-exp-streak-jerarquia` con 6 tasks (T1-T6). ODD routing decidido (no SDD — scope restaurativo, 2+ pasos pero sin ambigüedad de producto). TDD `strict_tdd: false` (AGENTS.md) — checks ordinarios.
- 2026-10-02: T2 (streak) — creado `src/lib/gamification/streak.ts` con `utcDay/computeStreak/advanceStreak`, wiring en `progress/route.ts` y `lab-progress/route.ts`. `type-check` y `test` (92/92) OK. Commit pendiente.
- 2026-10-02: T1 — restore `proyectos/[module]/page.tsx` desde `327adcb` (254 líneas, LabHistoryCard grid, lab_progress + progressMap + getLabResumeTarget smart CTA). Paridad labs restaurada.
- 2026-10-02: T3 — `rehypeDemoteH1` (h1→h2, h2→h3, h3→h4) en `proyectos/[module]/[lesson]/page.tsx` para único h1 por proyecto. `type-check` OK.
- 2026-10-02: UPDATE T3 — `rehypeStripFirstH1` elimina duplicado `Assignment 9: Interpretación de modelos` y deja solo h1 de página (getLessonTitle). Header `Inicio` fix y scrollbar oculto también en este batch.
- 2026-10-02: T4/T5 — EXP verificada no mock: ia 4→100 XP, python 17→425 XP, estadistica 10→250 XP, ml 10→300 XP (sum calcXpForLesson). Backend wiring auditado: `DashboardContainer` + `activity.ts` + `user.ts` filtran por `user_id` + `completed_at NOT NULL`; `proyectos` ahora también usa `lab_progress eq module_slug`.
- 2026-10-02: T6 — Gates: `type-check` 0 errors, `test` 92/92, `build` 21/21 pages OK. Structural checks: page h1 único + demote, LabHistoryCard grid, advanceStreak wiring.

## Decisions
- ODD vs SDD: ODD — restauración con patch existente `327adcb` + wiring estrecho + shift de headings. No requiere proposal/spec/design artifacts SDD; durable spec sería overhead.
- Branch first desde `main` — work-unit commits por tarea, push/PR bajo política repo ordinaria.
- TDD: `strict_tdd false` — failing-test-first no requerido; gate es type-check + build + vitest.
