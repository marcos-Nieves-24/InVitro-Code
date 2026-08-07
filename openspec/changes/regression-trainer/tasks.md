# Tasks: regression-trainer

> Reemplaza iframe demo_06 por `<RegressionTrainer/>` (OLS, 569 pts BCW). Gates: `npm run type-check` + `npm run build`. Voseo.

> **ARCHIVE RECONCILIATION (sdd-archive, 2026-08-06)**: All Phase 1–4 implementation tasks were persisted unchecked by `sdd-apply`, though complete on disk. Per the Task Completion Gate, sdd-archive performed exceptional mechanical reconciliation: `sdd/regression-trainer/apply-progress` (Engram obs #33) and `verify-report.md` prove every unchecked implementation task is complete, and the orchestrator's launch prompt explicitly authorized archive with final-state facts. Implementation tasks are now marked `[x]`. Verification tasks 5.2 and 5.4 remain open with accepted, documented caveats (WARN-02 / WARN-01 in `verify-report.md` and `archive-report.md`) — these are non-implementation tasks, not stale completion claims.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~700–800 |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High
800-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| U1 | Comp+registro | PR 1 | `npm run type-check` + `npm run build` | `/learn/ia/lesson02_how_ai_learns`: 569 pts, sliders, whiskers | revert comp; lección intacta |
| U2 | Lección+limpieza | PR 1 | `rg "dosis.?respuesta\|antifúngico\|sigmoidea" lesson.md` → 0 | §§9–10 navegables; README (8) | revert restaura iframe+README |

## Phase 1: Componente — crear `regression-trainer.tsx`

- [x] 1.1 Esqueleto PerceptronTrainer (AD1): `"use client"`, `dynamic(react-plotly.js)`, fetch `/data/perceptron-trainer.json`+AbortController, grid `lg:grid-cols-3`. Acepta: 569 pts, color `#6366f1`, sin leyenda (BCW Data; AD6)
- [x] 1.2 Spinner "Cargando datos de biopsias…"; error + "Reintentar" (reload). Acepta: retry OK (Loading/Error)
- [x] 1.3 OLS closed-form m,b,ECM,R² sin hardcode; "Calcular mejor recta" snap óptimo (OLS; AD2)
- [x] 1.4 Sliders m [−0.5,1.0]/step .005, b [0,30]/step .5, default óptimo; ECM+R² live (Sliders; AD3)
- [x] 1.5 Traces scatter+línea+whiskers `error_y` recomputan; layout 420 responsive (Whiskers; AD5/7)
- [x] 1.6 "Predecir": valida [xmin,xmax] → m·x+b; fuera de rango msg, sin predicción (Predict; AD4)
- [x] 1.7 "Reiniciar": limpia predicción, snap óptimo (Reset)
- [x] 1.8 A11y: aria-labels, `aria-live` en resultado, nada solo-color; voseo (A11y, Voseo)
- [x] 1.9 Footer cita UCI, link archive.ics.uci.edu (Citation)

## Phase 2: Registro MDX (dual)

- [x] 2.1 `src/components/lesson/index.ts`: `export { RegressionTrainer } from "./regression-trainer"` (Integration; AD8)
- [x] 2.2 `src/app/learn/[module]/[slug]/page.tsx`: import + components map. Acepta: `<RegressionTrainer />` compila (Integration; AD8)

## Phase 3: Contenido — `lesson02_how_ai_learns/lesson.md`

- [x] 3.1 §9 verbatim design: título "Regresión lineal en acción", ReflectionCheck BCW (blockId `reflection-l02-regresion`), `<RegressionTrainer />` sin InteractiveFrame, R²≈0.10 "datos reales ruidosos" (§9 Title/Reflection/Embed, Weak R²)
- [x] 3.2 §10 verbatim: ReflectionCheck+ConceptCard, regresión continua radio→textura, sin dosis-respuesta/sigmoidea (§10 Narrative)

## Phase 4: Limpieza

- [x] 4.1 Eliminar `public/interactives/demo_06_regression.html` (Demo cleanup)
- [x] 4.2 `src/content/modules/ia/README.md`: "(9)"→"(8)", quitar fila `| 6 | regression |`, mantener 6b (Demo cleanup)

## Phase 5: Verificación

- [x] 5.1 `npm run type-check` — 0 errores (exit 0, PASS — verify-report)
- [ ] 5.2 `npm run build` — exit 0, sin errores MDX (lint roto por diseño, no tocar) — **(abierta, WARN-02: env-blocked — Node 18.19.1 < 20.9 requerido por Next.js 16; gate no ejecutable. Aceptada por precedente PerceptronTrainer/KnnTrainer, que buildan OK en Vercel Node 22; verificación indirecta vía type-check + dual registro MDX. Ver archive-report WARN-02)**
- [x] 5.3 Manual: 569 pts, OLS, whiskers, ECM/R², predict in/out, reset, loading/error, cita, a11y, stacking — **(verificado por inspección de código + traza lógica según verify-report; strict_tdd:false, sin runner)**
- [ ] 5.4 `rg "concentración|fármaco|dosis.?respuesta|antifúngico|sigmoidea" lesson.md` → 0 — **(abierta, WARN-01: grep sobrebroad — 3 matches preexistentes en §§8/15 FUERA de scope (L167, L170, L314); el spec autoritativo solo prohíbe estos términos en §10, y §10 está limpio. Aceptada; limpieza de §8/§15 = cambio futuro. Ver archive-report WARN-01)**
- [x] 5.5 `ls public/interactives/` sin demo_06; README 8 demos (confirmado en disco: solo queda demo_06b_overfitting.html; README "(8)" con fila 6b)

## Apply Checkpoints

- P1: type-check OK → commit `feat(lesson): add RegressionTrainer component`
- P2-3: build OK → commit `feat(content): embed trainer §§9-10`
- P4: git status solo previsto → commit `chore(lesson): remove legacy demo`
- P5 → verify
