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
- [ ] T6 (pendiente) — C2PA metadata cleanup en favicon/logo (PR separado, requiere regenerar asset).
- [ ] T7 (pendiente) — `npm audit fix` (sin --force) para source-map-js / sprintf-js; Next 16.4.1 upgrade en PR aparte.
- [ ] T8 (pendiente) — consolidación backend o contrato inter-servicio + CI para FastAPI.

## Log

- L1 (request original): "analiza mi repo. Identifica problemas de arquitectura, de AGENTS.md, archivo aislados o abandonados. Revisa que no haya contaminación en el repo, problemas o compatibilidades. Que todo esté healthy"
- L2 (2026-10-15): autorización explícita "procede con el plan de saneamiento". Ejecutado T1–T5.
- T1–T5 verdes: `npm run type-check` exit 0; `npm run assets:check` OK; `npm run test` 22 files / 208 tests passed; `npm run build` completo.

## Commits

- (pendiente de commit) feat: saneamiento post-análisis (T1–T5)
