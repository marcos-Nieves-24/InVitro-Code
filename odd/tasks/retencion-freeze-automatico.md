# Retención — Freeze Automático

## Objetivo
Implementar streak freeze automático para evitar pérdida de racha por 1 día de ausencia, principal driver de retención D1/D7 (estilo Duolingo). Sin intervención del usuario: si faltó 1 día y tiene freeze disponible, se auto-consume.

## Problema
`src/lib/gamification/streak.ts:23` resetea racha a 1 tras faltar 1 día. Sin grace period → usuarios pierden rachas largas por 1 falta → churn.

## Por qué
- Retención es prioridad elegida por el usuario.
- Freeze automático es la palanca con mayor ROI probado en learning apps.
- `notification_prefs` y cron existen pero no se usan para retención.

## Scope
- Dominio puro para freeze (sin infra)
- Lógica en `computeStreak` + `advanceStreak`
- Migration `streaks` columnas `freezes_available`, `last_freeze_used`
- Cron recarga lunes 00:00 UTC
- Badge UI en dashboard + HUD
- Tests unitarios

## Fuera de scope (próximos PRs)
- Meta diaria + nudge email (PR-2)
- cmd+K + bookmarks (PR-3)
- Freeze manual con XP cost, push notifications, PWA

## Tasks
- [x] T1 — Dominio: `src/domain/streak.ts` + `src/application/ports/StreakRepository.ts` (puras, testeables) — route: delegated
- [x] T2 — Infra + migración: `supabase-migration.sql` columnas freeze + `src/lib/supabase/streakRepository.ts` adapter + `computeStreak` con auto-freeze — route: delegated
- [x] T3 — Cron recarga: `src/app/api/cron/recharge-freezes/route.ts` + `vercel.json` — route: delegated
- [x] T4 — UI badge: `StreakFreezeBadge` + integración `GamingHUD`/`DashboardContainer`/`LabStreakPill` — route: delegated
- [x] T5 — Tests + verificación: vitest 6+ casos freeze + `type-check` + `build` — route: delegated

## Criterios de aceptación
- [x] Gap 1 día con freeze=1 → racha no resetea, freeze consume, `last_freeze_used=today`
- [x] Gap 1 día con freeze=0 → racha resetea a 1
- [x] Gap 2+ días con freeze=1 → racha resetea, freeze intacto
- [x] Lunes recarga `freezes_available=1` si era 0
- [x] `type-check` y `build` verdes, tests nuevos verdes

## Restricciones
- Dependency direction: domain ← application ← infrastructure ← presentation
- RLS Clerk `auth.jwt() ->> 'sub'`, service-role para cron
- Español en UI, neutral

## Progreso
- Branch: `feat/retencion-freeze-automatico` desde `main@b6e67b7`
- Commits:
  - 5763122 feat(streak): dominio puro freeze automatico con puertos (T1)
  - 73ad417 feat(streak): migration freeze + logica auto-freeze en computeStreak (T2)
  - c9f60d2 feat(cron): recarga semanal de freeze lunes 00:00 UTC (T3)
  - 68f098b feat(gamification): StreakFreezeBadge + integracion HUD/dashboard (T4)
  - (T5) feat(test): casos freeze gap 1/2, idempotencia, recarga y defaults
- Verificación:
  - type-check: PASS (tsc --noEmit)
  - build: PASS (next build 28/28 static pages, cron routes /api/cron/recharge-freezes incluida)
  - test: PASS 13 files / 113 tests (vitest node, incluye 22 nuevos freeze tests)
  - Manual: UPDATE streaks last_active_date = today-2, POST /api/progress → racha preservada (6) y freeze 0, ver src/lib/gamification/__tests__/streak-freeze.test.ts
- Decisiones:
  - `applyAutoFreeze` incrementa racha (prev+1) para continuidad Duolingo; documentado en T5. Alternativa preservar sin incrementar sería gap invisible.
  - `computeStreak(todayOverride?)` inyecta today para tests sin depender de utcDay mock.
  - Cron simple `WHERE freezes_available=0` — idempotente lunes, no necesita check día en DB.
  - `StreakRow` en domain es source of truth; infra reexporta y extiende con freeze opcional para compat backward.

## Siguiente paso
PR listo — verificar `supabase-migration.sql` §16 en staging antes de merge.

## Heurística líneas
Forecast ~380 líneas (add+del), 1 PR. No excede 400. Real: ~350 líneas.
