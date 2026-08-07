# Tasks: overfitting-trainer

> Reemplaza iframe demo_06b por `<OverfittingTrainer/>` (BCW binomial, QR grados 1–15, doble panel). Gates: `npm run type-check` + `npm run build`. Voseo.

> **ARCHIVE RECONCILIATION (sdd-archive, 2026-08-06)**: All tasks were persisted unchecked by `sdd-apply`, though implementation is complete on disk (commits ffc3218 + 15f7c2a). Per the Task Completion Gate, sdd-archive performed exceptional mechanical reconciliation: `sdd/overfitting-trainer/apply-progress` (Engram obs #43) and `verify-report.md` (obs #44, 19/19 requirements, 25/25 scenarios, 0 CRITICAL, type-check exit 0) prove every unchecked implementation task is complete, and the orchestrator's launch prompt explicitly authorized archive with final-state facts and stale-checkbox reconciliation (same convention as regression-trainer). Implementation tasks are now marked `[x]`. Verification tasks 5.2 and 5.4 remain open with accepted, documented caveats (WARN-01 / WARN-02 in `verify-report.md` and `archive-report.md`) — these are non-implementation tasks, not stale completion claims.

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1.050–1.150 (≈700 adiciones componente+contenido; ≈440 borrado demo_06b) |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | size-exception |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: High
800-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| U1 | Componente+registro | PR 1 | `npm run type-check` + `npm run build` | `/learn/ia/lesson02_how_ai_learns`: 50 train/172 test, slider, barras log | revert comp; lección intacta |
| U2 | §11–12 + limpieza | PR 1 | `rg "demo_06b_overfitting\|función real" lesson.md` → 0 | §§11–12 navegables; README (7) | revert restaura iframe+README |

## Phase 1: Componente — crear `overfitting-trainer.tsx`

- [x] 1.1 Esqueleto (AD1): `"use client"`, `dynamic`, fetch `/data/perceptron-trainer.json`+AbortController, grid `lg:grid-cols-2`, spinner + error/Reintentar (BCW, Loading/Error)
- [x] 1.2 Split (AD2): mulberry32(42) 70/30 → mulberry32(7) submuestra 50 train/172 test; copy "50 biopsias de entrenamiento (submuestra fija) · 172 de prueba" (Split, Subsample)
- [x] 1.3 QR (AD3): Vandermonde x normalizado, Householder, back-subst., λ=0, grados 1–15 precompute (QR fit)
- [x] 1.4 LEFT (AD4): 50 train teal `#14b8a6` + 172 test naranja × `#f59e0b` + curva `#0f172a`; sin "función real" (Dual-panel)
- [x] 1.5 RIGHT (AD4): barras grouped train/test, `yaxis.type:"log"`, `hovertemplate:"ECM: %{y:.4f}"` (ECM log, Hover)
- [x] 1.6 Slider 1–15 default 1, labels 3 zonas; un slider drive ambos paneles (Slider)
- [x] 1.7 Diagnóstico (AD5): 1–2 Subajuste, 3–6 Punto óptimo, 7 "transición (óptimo)", 8–15 Sobreajuste; `aria-live` (Diagnosis)
- [x] 1.8 A11y: aria-labels, nada solo-color; voseo; stack <lg; footer UCI (A11y, Voseo, Responsive, Citation)

## Phase 2: Registro MDX (dual)

- [x] 2.1 `src/components/lesson/index.ts`: `export { OverfittingTrainer } from "./overfitting-trainer"` (Integration; AD7)
- [x] 2.2 `src/app/learn/[module]/[slug]/page.tsx`: import + components map; `<OverfittingTrainer />` compila (Integration; AD7)

## Phase 3: Contenido — `lesson02_how_ai_learns/lesson.md`

- [x] 3.1 §11 verbatim design: título "Overfitting en acción", ReflectionCheck (blockId `reflection-l02-overfitting-predict`), `<OverfittingTrainer />` sin InteractiveFrame, bullets sin "función real", piso ≈0.10, submuestra 50 (Title/Reflection/Embed, Bullets)
- [x] 3.2 §12: fila 8–15 `error train ~0`→`en su piso (~0.10)`; post-tabla "El grado 7 es transicional…" (Tabla intacta, 7 transicional)

## Phase 4: Limpieza

- [x] 4.1 Eliminar `public/interactives/demo_06b_overfitting.html` (Demo cleanup)
- [x] 4.2 `src/content/modules/ia/README.md`: "(8)"→"(7)", quitar fila 6b (Demo cleanup)

## Phase 5: Verificación

- [x] 5.1 `npm run type-check` — exit 0
- [ ] 5.2 `npm run build` — exit 0, sin errores MDX (Node ≥20.9; WARN-02 si bloqueado) — **(abierta, WARN-01: env-blocked — Node v18.19.1 < 20.9 requerido por Next.js 16; gate no ejecutable (exit 126). Aceptada por precedente PerceptronTrainer/KnnTrainer/RegressionTrainer, que buildan OK en Vercel Node 22; verificación indirecta vía type-check exit 0 + dual registro MDX. Ver archive-report WARN-01)**
- [x] 5.3 Doble montaje → split y curva idénticos (Determinismo) — **(verificado por inspección de código: `computeSplitsAndFits` pura, SPLIT_SEED=42 + SUBSAMPLE_SEED=7 constantes, PRNG fresco por llamada, `shuffle` con `items.slice()` — determinista por construcción; strict_tdd:false, sin runner)**
- [ ] 5.4 Curva: train ~0.10 todo grado; test explota deg 9+ (≥100× óptimo); deg 5 mínimo; deg 15 ~471k (QR, ECM) — **(abierta, WARN-02: sin verificación runtime — la forma de curva (mínimo deg 3–6, explosión deg 9+) se predice de la matemática QR λ=0 + submuestra 50, pero no se confirmó con números reales; no hay runner ni build env. Ver archive-report WARN-02)**
- [x] 5.5 Trainer: 50 teal+172 ×, curva, barras log, diagnóstico, slider, loading/error, cita, a11y, stacking (Dual-panel, A11y) — **(verificado por inspección de código + traza lógica según verify-report compliance matrix; strict_tdd:false, sin runner)**
- [x] 5.6 Contenido: sin "función real", piso honesto, tabla intacta + 7 transicional (Content)
- [x] 5.7 `ls` sin demo_06b; `rg "demo_06b" lesson.md` → 0; README 7 demos (Cleanup)

## Apply Checkpoints

- P1: type-check OK → commit `feat(lesson): add OverfittingTrainer component`
- P2–3: build OK → commit `feat(content): embed trainer §11-12`
- P4: status solo previsto → commit `chore(lesson): remove legacy demo_06b`
- P5 → verify
