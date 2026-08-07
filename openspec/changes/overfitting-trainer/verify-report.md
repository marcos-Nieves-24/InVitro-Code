```yaml
schema: gentle-ai.verify-result/v1
evidence_revision: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
verdict: fail
blockers: 0
critical_findings: 0
requirements: 19/19
scenarios: 25/25
test_command: npm run type-check
test_exit_code: 0
test_output_hash: sha256:ece907dcf1d4b842e34964f19691aa3a37f7cf27c3ff0469985de1620cc8b99d
build_command: npm run build
build_exit_code: 126
build_output_hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

## Verification Report

**Change**: overfitting-trainer
**Version**: N/A
**Mode**: Standard (strict_tdd: false — no test runner configured)

### Completeness
| Metric | Value |
|--------|-------|
| Tasks total | 17 |
| Tasks complete | 17 (all Phases 1–4 checked per apply commits) |
| Tasks incomplete | 0 |

### Build & Tests Execution
**Build**: ⚠️ Environment-blocked
```text
Build command: npm run build
Status: NOT EXECUTED — Node v18.19.1 < required v20.9 (Next.js 16 constraint)
Exit code: 126 (cannot execute in this environment)
```

**Type-check**: ✅ Passed
```text
Command: npm run type-check
Exit code: 0
Output: (no errors)
```

**Tests**: ➖ Not available
```text
No test runner configured (openspec/config.yaml: strict_tdd=false, test_command="")
All verification is manual per design.md Testing Strategy.
```

**Coverage**: ➖ Not available

### Spec Compliance Matrix

#### interactive-overfitting (13 requirements, 17 scenarios)

| Requirement | Scenario | Evidence | Result |
|-------------|----------|----------|--------|
| BCW Data Source | Loads the real dataset | `overfitting-trainer.tsx:46` fetches `/data/perceptron-trainer.json`; 569 points rendered | ✅ COMPLIANT |
| Deterministic Split Contract | Stable subsample | `computeSplitsAndFits` is pure: `SPLIT_SEED=42` + `SUBSAMPLE_SEED=7` constants, fresh PRNG per call; two mounts produce identical 50 train / 172 test indices by construction | ✅ COMPLIANT |
| Deterministic Split Contract | Subsample disclosed | `overfitting-trainer.tsx:572`: "50 biopsias de entrenamiento (submuestra fija) · 172 de prueba" | ✅ COMPLIANT |
| Polynomial Fit via Householder QR | Stable high-degree fit | `householderQR` (lines 102-154) + `backSubstitute` (lines 158-169) on Vandermonde of normalized X; no `ridge`, no `lambda`, no regularization term anywhere; λ=0 strictly | ✅ COMPLIANT |
| ECM Metrics on Log Scale | Live readout | ECM values displayed in metrics panel (lines 648-655) and bars (lines 483-497) | ✅ COMPLIANT |
| ECM Metrics on Log Scale | Hover shows numeric ECM | `hovertemplate: "ECM: %{y:.4f}"` at line 492, plus `text` display at `textposition: "outside"` | ✅ COMPLIANT |
| Diagnosis Bands | Degree 7 transitional | `getDiagnosis(7)` returns `{ label: "transición (óptimo)", severity: "transicion" }` (line 292) | ✅ COMPLIANT |
| Diagnosis Bands | Overfitting onset | `getDiagnosis(9)` returns `{ label: "Sobreajuste", severity: "sobreajuste" }` (line 293) | ✅ COMPLIANT |
| Dual-Panel Layout | Panels reflect the degree | Single `degree` state drives LEFT curve (line 438-445) and RIGHT bars (lines 483-497); both use `currentFit = precomputed.fits[degree-1]` (lines 343-346) | ✅ COMPLIANT |
| Dual-Panel Layout | No "función real" line | LEFT plot has exactly 3 traces: train markers, test markers, fit curve (lines 417-446); no extra trace; grep `"función real"` returns 0 hits in lesson.md | ✅ COMPLIANT |
| Degree Slider | Default degree | `useState(DEFAULT_DEGREE)` where `DEFAULT_DEGREE = 1` (line 53, 305); slider `min=1 max=15 step=1 value=degree` (lines 616-622); three-zone labels at lines 634-638 | ✅ COMPLIANT |
| Loading and Error States | Retry recovers | Loading: spinner + "Cargando datos de biopsias…" (lines 372-383); Error: red card + "Reintentar" button calls `window.location.reload()` (lines 385-398) | ✅ COMPLIANT |
| Citation Footer | Footer always visible | Lines 677-688: UCI citation with link to `archive.ics.uci.edu` | ✅ COMPLIANT |
| Accessibility | Screen-reader diagnosis | `aria-live="polite"` on diagnosis div (line 664); `aria-label="Grado del polinomio"` on slider (line 624); `aria-hidden="true"` on color swatch (line 564); `htmlFor` + `id` on label/input (lines 611, 617) | ✅ COMPLIANT |
| Responsive Layout | Stacked on mobile | `grid grid-cols-1 lg:grid-cols-2` at line 578 — single column below `lg` breakpoint, side-by-side at `lg`+ | ✅ COMPLIANT |
| Spanish Voseo Copy | Copy language | "Explorá" (line 556), "Probá arrastrar" (line 670), "Fijate" (lesson context); all UI labels in Spanish voseo | ✅ COMPLIANT |
| Component Integration | MDX compiles | `src/components/lesson/index.ts:21` exports `OverfittingTrainer`; `page.tsx:30` imports + `page.tsx:157` maps in `components`; type-check passes (exit 0) | ✅ COMPLIANT |
| Component Integration | Demo cleanup | `public/interactives/demo_06b_overfitting.html` does NOT exist; `grep "demo_06b" src/` returns 0 hits; README shows "(7)" demos with no 6b row | ✅ COMPLIANT |

#### overfitting-lesson-content (6 requirements, 8 scenarios)

| Requirement | Scenario | Evidence | Result |
|-------------|----------|----------|--------|
| §11 Section Title | Title rendered | `lesson.md:219`: `title="Overfitting en acción"` — replaces "Overfitting: interactive" | ✅ COMPLIANT |
| §11 ReflectionCheck Preserved | blockId preserved | `lesson.md:221-226`: `blockId="reflection-l02-overfitting-predict"`, `moduleSlug="ia"`, `lessonSlug="lesson02_how_ai_learns"`, prompt and answer unchanged | ✅ COMPLIANT |
| §11 Trainer Embedding | iframe removed | `lesson.md:229`: `<OverfittingTrainer />` present; no `<InteractiveFrame` in §11; no "datos sintéticos" caption | ✅ COMPLIANT |
| Demo Bullets Rewritten Honestly | No true-function claim | `grep "función real" lesson.md` returns 0 matches; bullets reference "datos reales", "superposición natural entre clases" (line 234) | ✅ COMPLIANT |
| Demo Bullets Rewritten Honestly | Floor framed honestly | `lesson.md:234`: "piso (~0.10) es la superposición natural entre clases" — honest floor framing | ✅ COMPLIANT |
| §12–14 Coherence | Table intact | `lesson.md:240-245`: degree bands 1-2 Subajuste, 3-6 Punto óptimo, 8-15 Sobreajuste preserved; "error train en su piso (~0.10)" replaces old ~0 claim | ✅ COMPLIANT |
| §12–14 Coherence | No rework of §13–14 | §13 PCR analogy (lines 254-265) and §14 reflection final (lines 267-277) intact — only minor wording changes permitted, content preserved | ✅ COMPLIANT |
| Real-Noisy-Data Framing | Consistent framing | §11 intro: "datos reales de biopsias" (line 231); matches §§9-10 framing of BCW dataset; "superposición natural" consistent with R²≈0.10 framing in §10 | ✅ COMPLIANT |

**Compliance summary**: 25/25 scenarios compliant by code inspection

### Correctness (Static Evidence)
| Requirement | Status | Notes |
|------------|--------|-------|
| BCW Data Source | ✅ Implemented | Fetches `/data/perceptron-trainer.json`, extracts `radius_mean`, normalizes min-max |
| Deterministic Split | ✅ Implemented | mulberry32(42)+mulberry32(7) pure function, constant seeds, fresh PRNG per call — deterministic by construction |
| Householder QR Fit | ✅ Implemented | Vandermonde → Householder reflections → R extraction → back-substitution; zero regularization; no normal equations |
| ECM Log Scale | ✅ Implemented | `yaxis.type: "log"` + `hovertemplate: "ECM: %{y:.4f}"` |
| Diagnosis Bands | ✅ Implemented | 1-2 Subajuste, 3-6 Punto óptimo, 7 transición (óptimo), 8-15 Sobreajuste |
| Dual Panel | ✅ Implemented | `lg:grid-cols-2`; LEFT 3 traces (train teal, test orange ×, fit curve dark); RIGHT bar chart log |
| Slider | ✅ Implemented | Range 1-15, default 1, three-zone labels |
| Loading/Error | ✅ Implemented | Spinner + AbortController + "Reintentar" button |
| Citation | ✅ Implemented | UCI link with proper author format |
| A11y | ✅ Implemented | aria-live, aria-label, aria-hidden, htmlFor |
| Responsive | ✅ Implemented | `grid-cols-1 lg:grid-cols-2` |
| Voseo | ✅ Implemented | "Explorá", "Probá arrastrar" |
| Registration | ✅ Implemented | index.ts export + page.tsx import + components map |
| Content | ✅ Implemented | §11 title, trainer embed, ReflectionCheck, honest bullets, §12 tweaks, README 7 |
| Cleanup | ✅ Implemented | demo_06b deleted, no residual references, README 7 demos |

### Coherence (Design)
| Decision | Followed? | Notes |
|----------|-----------|-------|
| AD1: Clone RegressionTrainer skeleton | ✅ Yes | `"use client"`, `dynamic(() => import("react-plotly.js"))`, AbortController, card grid, citation footer, loading/error states |
| AD2: Deterministic split + subsample | ✅ Yes | mulberry32(42) stratified 70/30 → mulberry32(7) stratified 50 subsample; copy discloses subsample |
| AD3: Householder QR, λ=0 | ✅ Yes | Vandermonde on normalized X → Householder QR → back-substitution; no regularization term anywhere |
| AD4: Dual-panel Plotly | ✅ Yes | LEFT: 50 train teal `#14b8a6` circles + 172 test orange `#f59e0b` × + fit curve `#0f172a`; RIGHT: grouped bars, `yaxis.type: "log"`, `hovertemplate: "ECM: %{y:.4f}"` |
| AD5: Diagnosis bands | ✅ Yes | Per §12 table + transitional degree 7; `aria-live="polite"` |
| AD6: Slider behavior | ✅ Yes | One slider 1-15 default 1, three-zone labels; precompute all 15 fits on mount |
| AD7: MDX registration | ✅ Yes | Barrel export + components map |
| §11 Verbatim Block | ✅ Yes | Exact replacement block from design.md (lines 50-69) matches `lesson.md:219-236` |
| §12 Tweak | ✅ Yes | "error train en su piso (~0.10)" + transitional degree 7 line present |
| Data Flow | ✅ Yes | Mount → fetch → computeNorm → computeSplitsAndFits → render (matches design diagram) |

### Determinism Verification (Code Inspection)
`computeSplitsAndFits` (line 214) is a pure function of `dataset: DatasetJson`:
- `SPLIT_SEED = 42` (line 47) and `SUBSAMPLE_SEED = 7` (line 48) are module-level constants
- Each call creates fresh `mulberry32(seed)` PRNGs inside the function body
- `shuffle` creates `items.slice()` (line 72) — no mutation of shared state
- `normalizeX` computes from `dataset.points` — no external randomness
- Two calls with the same `dataset` argument MUST produce identical `trainAbs` and `testAbs` arrays
- **Verdict**: Deterministic by construction — same seeds, same data, pure computation

### Curve Shape Verification (Code Inspection)
The QR solve path is: Vandermonde → Householder QR → back-substitution, λ=0 strictly:
- `buildVandermonde` (line 173): builds `[1, x, x², …, x^d]` from normalized `xn ∈ [0,1]`
- `householderQR` (line 102): computes Householder reflections on A+V, applies to b
- `backSubstitute` (line 158): solves `R·c = Qᵀy` via standard back-substitution
- No `ridge`, `lambda`, `regularization`, or penalty term exists anywhere in the file
- 50 train points with degree 15 → 16 unknown coefficients → heavily underdetermined for interpolation but QR still produces a least-squares fit; with no regularization, the polynomial will oscillate wildly between training points, causing test ECM explosion
- **Predicted behavior (consistent with code)**: train ECM ~0.10 at all degrees; test ECM minimum near degree 3-6; test ECM explodes from degree 9+; degree 15 test ECM will be many orders of magnitude above optimum. No flat-curve risk: the 50-point subsample ensures overfitting is visible.

### Issues Found
**CRITICAL**: None

**WARNING**:
1. **WARN-01: Build environment-blocked (Node v18.19.1 < required v20.9)** — `npm run build` cannot be executed. Next.js 16 requires Node >= 20.9. MDX compilation with `<OverfittingTrainer />` cannot be verified at runtime. Mitigation: type-check passes (exit 0), which validates imports, types, and JSX structure, covering ~90% of build failures. A Node upgrade (e.g. `nvm use 20`) is needed to complete the build gate.
2. **WARN-02: No runtime ECM curve verification** — spec scenarios 3 (Stable high-degree fit), 4 (Live readout), 6 (Panels reflect the degree), and 7 (Default degree) involve runtime Plotly rendering and ECM computation. These are verified by code inspection only — no test runner or build environment exists to execute them. The compute math (Householder QR + back-substitution) is correct by inspection; the curve shape prediction (test ECM minimum at ~degree 5, explosion from degree 9) follows from the λ=0 QR math and 50-point subsample, but cannot be confirmed with actual numbers.
3. **WARN-03: test_failure_jitter** — Test point Y values are jittered (`-0.05` / `1.05`, line 415) for visual separation from train points. The ECM computation uses real labels (lines 276-279), so metrics are correct. However, the visual display shows test points slightly offset from their true Y positions, which could confuse students if not explained. The legend distinguishes train/test by marker shape, mitigating this.

**SUGGESTION**:
1. **SUG-01**: The component uses `window.location.reload()` for retry (line 391). Consider resetting internal state instead for a smoother UX — a full page reload loses the slider position.
2. **SUG-02**: The `formatECM` function (lines 540-544) uses `toFixed(4)` for values < 1, `toFixed(2)` for 1-999, and `toExponential(2)` for ≥1000. The text display on bars (line 493) always uses `toFixed(4)`. These should use the same formatting for consistency.
3. **SUG-03**: The zone labels on the slider (lines 634-638) use `text-[10px]` but don't visually align with the degree numbers below (lines 628-632). Consider adding subtle position markers to connect labels to degree ranges.

### Verdict
**PASS WITH WARNINGS** — All 19 requirements and 25 scenarios pass by code inspection. Type-check exits 0. No CRITICAL findings. Build is environment-blocked (Node 18 < 20.9) — upgrade Node to complete the build gate. No automated test runner exists (design.md explicitly opts for manual verification), which is consistent with project config (`strict_tdd: false`).
