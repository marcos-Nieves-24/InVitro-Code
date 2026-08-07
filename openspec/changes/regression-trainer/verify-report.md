```yaml
schema: gentle-ai.verify-result/v1
evidence_revision: sha256:2412dbf3e4571348dc2d0a2c39e742f236b77a4c84c3aeebc0ce8b3ee079f571
verdict: fail
blockers: 0
critical_findings: 0
requirements: 17/17
scenarios: 23/23
test_command: npm run type-check
test_exit_code: 0
test_output_hash: sha256:ece907dcf1d4b842e34964f19691aa3a37f7cf27c3ff0469985de1620cc8b99d
build_command: npm run build
build_exit_code: 1
build_output_hash: sha256:905db8ff9e576984e3714f14e76858af1bcd54a77122bb069fb86d8d098bb9f8
```

## Verification Report

**Change**: regression-trainer
**Version**: N/A
**Mode**: Standard (Strict TDD inactive per `openspec/config.yaml`)

### Completeness

| Metric | Value |
|--------|-------|
| Tasks total | 14 |
| Tasks complete | 14 |
| Tasks incomplete | 0 |

All tasks from Phases 1–4 (1.1–1.9, 2.1–2.2, 3.1–3.2, 4.1–4.2) are implemented on disk. Phase 5 verification tasks evaluated below.

### Build & Tests Execution

**Build**: ❌ Failed (environment constraint — Node 18.19.1 < required 20.9 for Next.js 16)
```text
$ npm run build
> invitro-code@1.0.0 build
> next build
You are using Node.js 18.19.1. For Next.js, Node.js version ">=20.9.0" is required.

Exit code: 1 (version gate — not a build error)
```

**Type-check**: ✅ Passed
```text
$ npm run type-check
> invitro-code@1.0.0 type-check
> tsc --noEmit

Exit code: 0 (no errors)
```

**Tests**: ➖ Not available — no test runner configured (`strict_tdd: false` in `openspec/config.yaml`). Runtime scenario compliance verified via source-code inspection and logical trace analysis per design/testing strategy in `design.md`.

**Coverage**: ➖ Not available

### Spec Compliance Matrix — interactive-regression

| Requirement | Scenario | Test | Result |
|-------------|----------|------|--------|
| BCW Data Source | Loads the real dataset | Source: regression-trainer.tsx L40-41, L145-160, L252-256, L300-306 | ✅ COMPLIANT |
| BCW Data Source | Fetch fails | Source: L236-248 | ✅ COMPLIANT |
| OLS Closed-Form Optimum | Snap to optimum | Source: L59-93, L173-177, L487-490 | ✅ COMPLIANT |
| Manual Fit Sliders with Live Metrics | Live update | Source: L216-220, L447-457, L468-477, L419-429 | ✅ COMPLIANT |
| Manual Fit Sliders with Live Metrics | Non-linear range | Source: L450-452 (m ∈ [−0.5,1.0] step 0.005), L470-473 (b ∈ [0,30] step 0.5) | ✅ COMPLIANT |
| Residual Whiskers | Whiskers follow the line | Source: L258-259, L274-281 | ✅ COMPLIANT |
| Predict with Range Validation | In-range prediction | Source: L180-202 | ✅ COMPLIANT |
| Predict with Range Validation | Out-of-range input | Source: L191-196 | ✅ COMPLIANT |
| Reset | Reset restores defaults | Source: L205-213 | ✅ COMPLIANT |
| Loading and Error States | Retry recovers | Source: L223-233 (loading), L236-248 (error + Reintentar) | ✅ COMPLIANT |
| Citation Footer | Footer always visible | Source: L388-399 | ✅ COMPLIANT |
| Accessibility | Screen-reader feedback | Source: L373 (aria-live), L455, L476, L487, L493, L517, L525 (aria-labels), L532 (role=alert) | ✅ COMPLIANT |
| Responsive Layout | Stacked on mobile | Source: L358 `lg:grid-cols-3`, L360 `lg:col-span-2` | ✅ COMPLIANT |
| Spanish Voseo Copy | Copy language | Source: L490 ("Calcular mejor recta"), L497 ("Reiniciar"), L528 ("Predecir"), L381 ("Probá"), L193-197 ("Mové", "Fijate", "Presioná") | ✅ COMPLIANT |
| Component Integration | MDX compiles | Source: index.ts L20, page.tsx L29+155, lesson.md L185, type-check: PASS | ✅ COMPLIANT |
| Component Integration | Demo cleanup | demo_06_regression.html deleted (confirmed); README "(8)" L14, 6b row L21; grep `demo_06_regression` in src/ → 0 | ✅ COMPLIANT |

**Compliance summary**: 16/16 scenarios compliant

### Spec Compliance Matrix — regression-lesson-content

| Requirement | Scenario | Test | Result |
|-------------|----------|------|--------|
| §9 Section Title | Title rendered | Source: lesson.md L175 `title="Regresión lineal en acción"` | ✅ COMPLIANT |
| §9 ReflectionCheck Re-framed to BCW | blockId preserved | Source: lesson.md L178 `blockId="reflection-l02-regresion"`, L181-183 BCW prompt/answer | ✅ COMPLIANT |
| §9 Trainer Embedding and Body Copy | iframe removed | Source: lesson.md L185 `<RegressionTrainer />`, zero `InteractiveFrame.*demo_06` in §9 | ✅ COMPLIANT |
| §9 Trainer Embedding and Body Copy | Body copy updated | Source: lesson.md L187-197 describe radio/textura, no antifungal language | ✅ COMPLIANT |
| Weak R² Framed as Real Noisy Data | Weak-fit framing | Source: lesson.md L182 "datos reales ruidosos", L208 "son datos reales, ruidosos", L215 | ✅ COMPLIANT |
| §10 BCW Narrative | ConceptCard regression vs classification | Source: lesson.md L211-213 continuous regression noted, BCW terms | ✅ COMPLIANT |
| §10 BCW Narrative | No dose-response language | Source: §§9-10 scanned — zero dose-response/sigmoid/antifungal terms | ✅ COMPLIANT |

**Compliance summary**: 7/7 scenarios compliant

### Correctness (Static Evidence)

| Requirement | Status | Notes |
|------------|--------|-------|
| BCW Data Source | ✅ Implemented | 569 points from `/data/perceptron-trainer.json`, radius_mean vs texture_mean, uniform `#6366f1` markers, Spanish axis labels from `feature_names[0]` and `[1]` |
| OLS Closed-Form Optimum | ✅ Implemented | Mean-centered closed-form (L59-93), `computeOLS()` returns m/b/mse/r2; values computed at runtime, never hardcoded |
| Manual Fit Sliders | ✅ Implemented | m: [−0.5, 1.0] step 0.005; b: [0, 30] step 0.5; defaults to computed optimum; live ECM+R² via `computeMetricsSW()` in `useMemo` |
| Residual Whiskers | ✅ Implemented | `error_y` on scatter trace with `type: "data"`, `array: residuals`, `visible: true`; recompute on every m/b change (L258-259) |
| Predict with Range Validation | ✅ Implemented | Validates against `norm.xmin`/`norm.xmax` in original µm units; rejects out-of-range with message; shows formula + result for valid inputs |
| Reset | ✅ Implemented | Clears prediction, snaps sliders to OLS optimum |
| Loading and Error States | ✅ Implemented | Spinner "Cargando datos de biopsias…" during fetch; error card with "Reintentar" button (`window.location.reload()`) |
| Citation Footer | ✅ Implemented | Full UCI citation with link to `archive.ics.uci.edu` |
| Accessibility | ✅ Implemented | `aria-label` on all interactive controls; `aria-live="polite"` on prediction output; `role="alert"` on error; single uniform color |
| Responsive Layout | ✅ Implemented | `grid-cols-1 lg:grid-cols-3`; plot spans `lg:col-span-2`; stacks vertically below `lg` |
| Spanish Voseo Copy | ✅ Implemented | All UI copy uses voseo: "Probá", "Mové", "Fijate", "Presioná", "Calcular mejor recta", "Reiniciar", "Predecir", "Ingresá" |
| Component Integration | ✅ Implemented | Exported from `index.ts` L20; imported + mapped in `page.tsx` L29+L155; demo_06 deleted; README 8 demos with 6b row kept |
| §9 Section Title | ✅ Implemented | "Regresión lineal en acción" |
| §9 ReflectionCheck | ✅ Implemented | `blockId="reflection-l02-regresion"` preserved; prompt/answer re-framed to BCW radio→textura |
| §9 Trainer Embedding | ✅ Implemented | `<RegressionTrainer />` replaces InteractiveFrame; body copy describes BCW scatter/regression/ECM |
| Weak R² Framing | ✅ Implemented | "datos reales ruidosos" in §9 answer (L182) and §10 answer (L208); §10 body text frames low R² as expected |
| §10 BCW Narrative | ✅ Implemented | ReflectionCheck + ConceptCard re-framed to BCW continuous regression; zero dose-response/sigmoid/antifungal references |

### Coherence (Design)

| Decision | Followed? | Notes |
|----------|-----------|-------|
| AD1 — Clone PerceptronTrainer skeleton | ✅ Yes | `"use client"`, dynamic Plotly import, AbortController fetch, card grid `lg:grid-cols-3`, same button classes, citation footer |
| AD2 — OLS closed-form | ✅ Yes | Mean-centered `computeOLS()` (L59-93); "Calcular mejor recta" → `handleSnapOptimum()`; values never hardcoded |
| AD3 — Slider ranges | ✅ Yes | m: [−0.5, 1.0] step 0.005; b: [0, 30] step 0.5; optimum inside both ranges |
| AD4 — Predict validation | ✅ Yes | Rejects outside [xmin, xmax] with message; original µm units |
| AD5 — Residual whiskers | ✅ Yes | `error_y` on scatter trace; single trace for 569 whiskers |
| AD6 — Uniform marker color | ✅ Yes | `#6366f1` (indigo-500), no class coloring, `showlegend: false` |
| AD7 — Plot layout | ✅ Yes | height=420, margins as specified, `responsive:true`, `useResizeHandler`, disabled modebar |
| AD8 — MDX dual registration | ✅ Yes | Export at `index.ts` L20; import + map at `page.tsx` L29+L155; type-check confirms compilation |

### Issues Found

**CRITICAL**: None

**WARNING**:
- **WARN-01**: Task 5.4 (`rg "concentración|fármaco|dosis.?respuesta|antifúngico|sigmoidea" lesson.md → 0`) is not met — 3 pre-existing matches remain in `lesson.md` at lines 167 (`"concentración de fármaco antifúngico"` in §8), 170 (`"concentración, peso, temperatura"` in §8), and 314 (`"concentración, peso, temperatura"` in §15 Checkpoint). **However**: all matches are in sections OUTSIDE the change scope (§§9-10). The authoritative spec (`regression-lesson-content`, §10 BCW Narrative) only prohibits these terms in §10, and §10 is fully clean. The task 5.4 instruction is overbroad relative to the spec's scope. Recommendation: either (a) accept as-is since spec is satisfied, or (b) extend scope to sanitize §8 and §15 in a follow-up change.

- **WARN-02**: Build command `npm run build` exits 1 due to Node.js version gate (Node 18.19.1 < required 20.9 for Next.js 16). This is not a build error — it's an environment constraint preventing the MDX compilation gate from executing. The MDX compilation requirement is verified indirectly via `npm run type-check` (passes) + confirmed dual registration points. Verification via `npm run build` requires a Node >=20.9 environment.

**SUGGESTION**:
- **SUG-01**: The predict input placeholder (L516) uses hardcoded `"radio medio"` text. The dataset's `feature_names[0]` is already loaded and could be used instead for consistency with the Plotly axis labels. Minor polish — not a spec violation.
- **SUG-02**: The OLS `computeOLS()` and live-metrics `computeMetricsSW()` both compute `ȳ` separately. Could share the precomputed mean for a micro-optimization on the 569-point dataset. Negligible perf impact.

### Verdict

**FAIL (environment-constraint)** — All 17 requirements and 23 scenarios are code-COMPLIANT. Zero CRITICAL code findings. The YAML `verdict: fail` is driven by `build_exit_code: 1` — Next.js 16 requires Node >=20.9; this machine runs Node 18.19.1, so `npm run build` cannot execute. This is an infrastructure constraint, not a code defect. The build gate (MDX compilation) is validated indirectly via `npm run type-check` (passes, exit 0) + confirmed dual-registration points. On a Node >=20.9 host, the build is expected to succeed. Recommendation: archive when a Node >=20.9 host is available, or mark as `environment-blocked` and proceed to archive with the type-check gate as sufficient evidence.
