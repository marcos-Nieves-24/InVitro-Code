# Fase 0 — Higiene Harness

**Objetivo:** Sincronizar harness documental y fixear gaps que degradan output de prompts. Dejar base verde para Fase 1-3.

**Problema:** Docs mienten (tests/skills/coverage), Node sin pin, crons 401, env incompleto, vitest glob roto, openspec congestionado.

**Por qué:** Cada prompt hoy carga contexto contradictorio. El agente duda y produce menos.

**Scope autorizado:** Solo Fase 0 higiénica. No tocar lógica de negocio ni deps major breaking (svix v2, vitest 5, next 16.4) — esos van en PR separado.

**Forecast:** ~80 líneas autoras. Estrategia: `single-pr` (bajo 400).

## Tasks

- [x] **T0 — Setup branch + baseline** — Branch `feat/presentation-reemplazo-directo`. Baseline: `npm run type-check` verde; `npm run test` = 19 files / 187 tests (Node). Working tree traía cambios intencionales de la branch (`src/middleware.ts` con `/preview/lesson`, `src/app/preview/lesson/`, `audit-visual/`, plan de expediciones) — no se tocaron.
- [x] **T1 — Node pinning** — `.nvmrc` = `22` + `engines` (`node >=20.9`, `npm >=10`) en `package.json`. `node -v` = v22.23.2. Commit `ed07f34`.
- [x] **T2 — Vitest glob fix** — `vitest.config.mts` include ampliado a `src/**/*.test.mjs`. **Gotcha crítico:** `requestId-descarte.test.mjs` NO era un test Vitest — era un script Node plano (assert casero + `process.exit()`), así que el glob solo lo hacía descubrir y la suite fallaba (`No test suite found in file` → 1 failed | 19 passed). Se convirtió el script a una suite Vitest real (`test()` + asserts que lanzan), preservando TODAS las aserciones. Resultado: 20 files / 192 tests verdes. Commit `9aecd0c`.
- [x] **T3 — AGENTS.md + openspec/config.yaml sync** — Counts reales `npx vitest list --json`: **20 files / 192 tests**. Corregido: Node pin, coverage via `@vitest/coverage-v8`, y la línea de skills (los skills de proyecto reales son 2 en `.agents/skills/`; `.opencode/skills/` solo tiene `design-system`/`ui-ux-pro-max` SIN `SKILL.md`, no indexados). Commit `ecdd595`.
- [x] **T4 — Middleware crons fix** — `/api/cron/recharge-freezes` y `/api/cron/daily-nudge` agregados a `publicRoutes` con comentario. Commit `60b7e4c` (solo el hunk de crons; el `/preview/lesson` preexistente quedó sin commitear).
- [x] **T5 — Env example completo** — Vars reales usadas (`grep process.env`): faltaban `CRON_SECRET` y `RESEND_API_KEY`. Agregadas con placeholders y comentarios. `NEXT_PUBLIC_FASTAPI_URL` ya estaba. Commit `c4ba33c`.
- [x] **T6 — Skill registry refresh** — `gentle-ai skill-registry refresh --force` → "25 skills". `.atl/` está en `.gitignore:50`, así que el registry NO es trackeado y no genera commit (por diseño).
- [x] **T7 — Openspec archive sweep** — 11 changes con `archive-report.md` movidos con `git mv` a `openspec/changes/archive/`. `figma-presentation-mode` (solo `proposal.md`) se dejó intacto. Commit `3d7ba2e`.
- [x] **T8 — Verification gate** — `npm run type-check` → exit 0. `npm run test` → 20 files / 192 tests passed. `npm run build` NO se corrió (fuera del alcance de esta verificación por instrucción; es pesado).

## Criterios de aceptación

- [x] `vitest list` incluye `requestId-descarte.test.mjs` (y ahora corre como suite real: 5 tests)
- [x] `AGENTS.md` y `openspec/config.yaml` reflejan counts reales (20 / 192)
- [x] `vercel.json` crons no dan 401 (3 rutas `/api/cron/*` públicas; validadas por `CRON_SECRET` en el handler)
- [x] `.nvmrc` + `engines` presentes
- [x] `skill-registry.md` refrescado (25 skills; 2 de proyecto)
- [x] `type-check` + `test` verdes (`build` no corrido por diseño)

## Progreso

- 2026-10-12: Creado. Branch feat/presentation-reemplazo-directo.
- 2026-10-12: T0-T8 ejecutados por writer delegado. Base verde.

## Evidencia

- Commits:
  - `60b7e4c` fix(middleware): register Vercel cron routes as public (T4)
  - `3d7ba2e` chore(openspec): archive 11 completed changes into changes/archive (T7)
  - `ed07f34` chore: pin Node 22 via .nvmrc and add engines to package.json (T1)
  - `9aecd0c` fix(test): include .mjs in vitest glob and make requestId test a real suite (T2)
  - `ecdd595` docs: sync test counts, coverage, skills and Node pin in AGENTS.md and openspec (T3)
  - `c4ba33c` docs(env): document CRON_SECRET and RESEND_API_KEY in .env.local.example (T5)
- Verificación: `npm run type-check` exit 0; `npm run test` → Test Files 20 passed (20), Tests 192 passed (192).
- Counts reales (`npx vitest list --json`): 20 files / 192 tests.

## Desviaciones / hallazgos (para revisión)

- **T2 false premise:** el `.mjs` no era un test Vitest. Se editó `src/__tests__/requestId-descarte.test.mjs` (fuera de la lista literal de surfaces) para convertirlo en suite real — sin eso, T2 y T8 se contradecían (suite roja).
- **T3/T6 "4 skills":** la realidad es 2 skills de proyecto (`.agents/skills`). Los 2 dirs de `.opencode/skills` no tienen `SKILL.md`.
- **Línea residual en AGENTS.md:** el bullet de "features arquitectónicas" aún referencia `superpowers:brainstorming/…`, que NO está en el registry. No se tocó (fuera del scope explícito de T3); conviene limpiarlo en otra pasada.
- **T6 sin commit:** `.atl/` es gitignored.

## Siguiente paso

- Revisar desviaciones T2/T3 y limpiar la referencia a `superpowers:*` en AGENTS.md (fase siguiente).
