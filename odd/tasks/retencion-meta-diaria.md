# Retención — Meta Diaria + Nudge (PR-2)

## Objetivo
Añadir meta diaria configurable y recordatorio (nudge) para cerrar el loop de retención: streak freeze (PR-1) evita perder, meta diaria da motivo para volver.

## Problema
Sin meta diaria el usuario no tiene objetivo corto. `notification_prefs` existe pero nunca dispara nada. `DailyActivity` existe pero no hay goal ni nudge.

## Scope
- DB: `profiles.daily_goal_xp INT DEFAULT 50 CHECK (10..500)` + `profiles.last_nudge_at TIMESTAMPTZ`
- Dominio: `src/domain/dailyGoal.ts` (pure)
- API: `GET/POST /api/profile/daily-goal` + `GET /api/cron/daily-nudge` (19:00 America/Bogota ~ 00:00 UTC)
- UI: `DailyGoalRing` en Dashboard + slider en `configuracion`
- Cron: `vercel.json` nudge diario

## Fuera de scope
- Push VAPID, Resend real (solo best-effort log si no hay key)
- cmd+K, bookmarks (PR-3)
- Gamificación de racha (PR-1 ya hecho)

## Tasks
- [x] T1 — Dominio `src/domain/dailyGoal.ts` + migration `supabase-migration.sql §17` — route: delegated
- [x] T2 — API `src/app/api/profile/daily-goal/route.ts` + `src/app/api/cron/daily-nudge/route.ts` + `vercel.json` — route: delegated
- [x] T3 — UI `DailyGoalRing` + `DailyGoalSettings` + integración Dashboard/Configuracion — route: delegated
- [x] T4 — Tests + verificación `type-check` `build` — route: delegated

## Criterios
- [x] `daily_goal_xp` persiste, default 50, validado 10..500
- [x] Hoy XP < goal y nudge no enviado hoy → cron retorna `nudged: N` (log, no spam)
- [x] Dashboard muestra anillo meta diaria (XP hoy / goal %)
- [x] Config permite cambiar meta (slider 10..200 step 10)
- [x] `type-check` + `build` + tests verdes

## Branch
`feat/retencion-freeze-automatico` (continuación, stacked PR). Forecast ~340 líneas.

## Progreso
- Commits:
  - f45b69e feat(daily-goal): dominio puro clamp/progress/nudge + migration §17 (T1)
  - f5a858e feat(daily-goal): APIs perfil + cron nudge diario 00:00 UTC (T2)
  - a4d0cb8 feat(daily-goal): anillo dashboard + slider configuracion e integracion (T3)
  - 182de2b feat(daily-goal): tests dominio clamp/progress/nudge 17 casos (T4)
- Verificación:
  - type-check: PASS (tsc --noEmit)
  - build: PASS (next build 28/28 static pages, cron routes /api/cron/daily-nudge incluida)
  - test: PASS 14 files / 130 tests (vitest node, incluye 17 nuevos dailyGoal tests)
  - Manual: clampDailyGoal 5→10, 250→200, 57→60, NaN→50, "80"→80; dailyGoalProgress 30/50→60%; shouldNudge evita spam diario via last_nudge_at slice
- Decisiones:
  - `clampDailyGoal` fallback DEFAULT para null/undefined y "" (missing body), no solo NaN, para UX consistente.
  - `vercel.json` daily-nudge 0 0 * * * (00:00 UTC = 19:00 Bogotá) cercano a nudge vespertino, best-effort log si no hay RESEND_API_KEY.
  - `DashboardContainer` todayXp via `daily[daily.length-1].xp` (getDailyActivity último bucket = hoy); `configuracion` recalcula todayXp con query gte 00:00 UTC para mostrar en slider.
  - `daily-nudge` respeta `notification_prefs.email === false` y solo nudges si shouldNudge, luego UPDATE last_nudge_at para idempotencia diaria.

## Heurística
Single PR slice, no excede 400. Reutiliza `isAuthorized` pattern y `getDailyActivity`. Real: ~360 líneas add.
