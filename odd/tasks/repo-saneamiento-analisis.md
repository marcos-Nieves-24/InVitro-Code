# Saneamiento repo (post-análisis)

**Objetivo:** aplicar el plan de saneamiento aprobado por el usuario tras el análisis del repositorio: higiene de dependencias, mitigación de superficie `/preview/*` y limpieza de archivos stray. Scope acotado — no consolida backend ni toca C2PA (riesgo alto, PR aparte).

**Branch:** chore/asset-curator-playwright  
**Entorno:** Node 22.23.2, npm 10.9.8  
**Runner de tests:** Vitest 4.1.10 (`environment: node`, 22 archivos / 208 tests)

## Specs (del plan aprobado)

- S1: `/preview/lesson` (lesson preview) deja de ser ruta pública anónima.
- S2: Se elimina `plotly.js-dist-min@^3.7.0` (inutilizado: ningún import en `src/`; el asset `public/interactives/assets/plotly-3.0.0.min.js` es standalone y no se toca).
- S3: Se agregan READMEs stray en `public/` (`labs/modules/`, `rive/`) que se servían como estáticos sin uso.
- S4: Se remueven dependencias/paquetes extraneous restantes (`@emnapi/runtime`).
- S5: Se agrega `npm run check` = type-check + test + assets:check + build.
- S6: AGENTS.md (parte "managed") se trata como harness-owned: no editar a mano; mantener la documentación de proyecto.
- S7: Los changes OpenSpec abiertos quedan reportados en el análisis (sin archivar sin señal explícita del dueño).

## Tasks

- [x] T1 — Middleware: remover "/preview/lesson" de `publicRoutes` en `src/middleware.ts`.
- [x] T2 — `package.json`: remover `plotly.js-dist-min`; agregar script `check`.
- [x] T3 — `git rm` de `public/labs/modules/README.md` y `public/rive/README.md`.
- [x] T4 — `npm install` + `npm prune` (remover extraneous `@emnapi/runtime` y 2 paquetes de la dep muerta).
- [x] T5 — Verificación gates: `type-check` OK, `assets:check` OK, `test` 208/208, `build` OK.
- [x] T6 — C2PA metadata removed from SVG layers in commit `08e9796`; favicon/logo assets pruned.
- [~] T7 — `npm audit fix` (non-force) + `next` bump to 16.4.1 (`cdba2bb`) applied. Remaining 10 vulns require force majors (e.g. gray-matter/js-yaml/sprintf-js/katex); deliberately deferred to separate PR to avoid breaking API. `npm audit fix` (sin --force) para source-map-js / sprintf-js; Next 16.4.1 upgrade en PR aparte.
- [x] T8 — Backend/frontend reflection dual-writer removed via canonical Next.js route (`cd5bcbc`) and `docs/adr/003-single-writer-progress.md` updated.

## Log

- L1 (request original): "analiza mi repo. Identifica problemas de arquitectura, de AGENTS.md, archivo aislados o abandonados. Revisa que no haya contaminación en el repo, problemas o compatibilidades. Que todo esté healthy"
- L2 (2026-10-15): autorización explícita "procede con el plan de saneamiento". Ejecutado T1–T5.
- T1–T5 verdes: `npm run type-check` exit 0; `npm run assets:check` OK; `npm run test` 22 files / 208 tests passed; `npm run build` completo.

## Commits

- 44b150a `chore(hygiene): remove unused plotly dep; add check script; de-public preview/lesson; prune extraneous; tidy public/`
- 16f4602 `chore(deps): npm audit fix (non-force) — reduce transitive vulns (no majors)`

## Supabase hardening (block B)

- [x] T9 — Migration `invitro_security_hardening` aplicada via MCP (read-write temporal).
  - `ALTER FUNCTION ... SET search_path` en `get_leaderboard`, `get_leaderboard_rank`, `is_admin`, `set_lab_progress_updated_at`.
  - `CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id`.
  - 30 RLS policies envueltas con `(SELECT auth.jwt() ...)`.
  - `REVOKE UPDATE` sobre columnas sensibles (`profiles`, `progress`, `streaks`).
- Post-check advisors:
  - security: **0 findings** (clear).
  - performance: remains `unused_index` (INFO, 5) y `multiple_permissive_policies` (WARN, 20). No crítico a la semántica; `rls_initplan` eliminado.
- `apply_migration` success auditable en Supabase.

## Actualización 2026-10-15 (bloque final saneamiento)
- T6 [x]: C2PA metadata removed from SVG layers; commit `08e9796`.
- T7 [~]: `npm audit fix` non-force + `next` bumped 16.2.10 → 16.4.1 (`cdba2bb`). 10 vulns restantes requieren cambios major (gray-matter, js-yaml/sprintf.js, katex, rehype-katex, remark-math, micromark, tailwind/typography); deferidos a PR aparte.
- T8 [x]: reflection single-writer canónico Next.js y docs ADR actualizadas. FastAPI restará deshabilitado (`progress: nextjs`).
- T9 [x]: hardening Supabase (search_path, índice FK, 30 RLS initplans, revoke de columnas sensibles): migración `invitro_security_hardening` aplicada y verificada; security advisors = 0. Performance queda `unused_index` INFO y `multiple_permissive_policies` WARN (no crítico).
- OpenSpec: 8 changes activos revisados (acento-neutro 22/23, console-overlay-responsive 4/9, perfil-admin-config 33/39, design-system-rollout 6/35, dashboard-hero-dna-model 0/12); no se archivó nada sin señal explícita del dueño. `archive/` contiene cierres legacy.

## Commits (actualizados)
- 380d818 `fix(preview): block /preview/* in production`
- cd5bcbc `feat(api): add canonical Next.js reflection route (single-writer)`
- e785a45 `docs(adr): extend single-writer progress to reflection completions`
- cdba2bb `chore(deps): bump next to 16.4.1`
