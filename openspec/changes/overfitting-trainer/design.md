# Design: OverfittingTrainer — Replace demo_06b_overfitting.html

## Technical Approach

Clone `RegressionTrainer` structural skeleton (AbortController fetch, dynamic Plotly, card/grid layout, Spanish voseo, a11y, citation footer) and replace its OLS logic with: mulberry32(42) stratified 70/30 split → mulberry32(7) stratified subsample 50 train points → Householder QR polynomial fit degrees 1–15 (X=normalized radius_mean, Y=binary label). Dual-panel: LEFT scatter (50 train teal circles + 172 test orange ×) + fit curve; RIGHT log-scale ECM bars. Diagnosis per §12 table. No regularization — the overfitting is real.

## Architecture Decisions

| # | Decision | Options | Tradeoff | Decision |
|---|---|---|---|---|
| AD1 | Component skeleton | (a) Clone RegressionTrainer pattern · (b) Standalone | (a) proven: AbortController, Plotly dynamic import, card grid, citation footer, loading/error states; (b) diverges | **(a)** — mirror `"use client"` + `dynamic(() => import("react-plotly.js"))` + `lg:grid-cols-3` + same button classes |
| AD2 | Deterministic split + subsample | (a) mulberry32(42) stratified 70/30 → mulberry32(7) stratified subsample 50 · (b) precompute JSON · (c) full 397 train | (c) flat curve (no overfitting at deg 15); (b) adds maintenance; (a) exact same code as knn-trainer `computeAccuracyData` | **(a)** — reuses `mulberry32`, `shuffle` from knn-trainer.tsx; 50 train stratified (proportional benign/malign), all 172 test, computed once on mount |
| AD3 | Polynomial fit | (a) Householder QR on min-max normalized Vandermonde · (b) Normal equations + Gaussian elimination · (c) QR + any ridge λ>0 | (b) borderline instability at deg≥10; (c) kills the signal (deg 15 test ECM drops from 471k→0.0986); (a) stable, honest curve, ~40 lines | **(a)** — build Vandermonde V[n×d] over normalized x (x∈[0,1] via `(x−xmin)/(xmax−xmin)`), QR via Householder reflections, solve R₁c = Q₁ᵀy via back-substitution. λ=0 strictly. No regularization |
| AD4 | Dual-panel Plotly | (a) LEFT scatter+fit + RIGHT log ECM bars · (b) single panel overlaid · (c) linear ECM bars | (b) cramped; (c) deg 15 bar (471k) dwarfs deg 1–8 bars; (a) matches HTML demo layout + lab's `set_yscale('log')` | **(a)** — LEFT: 50 train teal circles (`#14b8a6`, size 8) + 172 test orange × (`#f59e0b`, symbol "x", size 5) + fit curve (dark line `#0f172a`, width 2). RIGHT: grouped bars, `yaxis.type: "log"`, `hovertemplate: "ECM: %{y:.4f}"`. No "función real" trace |
| AD5 | Diagnosis bands | (a) Per §12 table + transitional degree 7 · (b) Per HTML demo thresholds (≤6 optimal) | (b) mismatches lesson; (a) matches table, verified against data | **(a)** — 1–2 "Subajuste", 3–6 "Punto óptimo", 7 "transición (óptimo)", 8–15 "Sobreajuste". Displayed in metrics panel with `aria-live="polite"` |
| AD6 | Slider behavior | (a) One slider drives both panels · (b) Separate controls | (b) complex, unnecessary | **(a)** — degree 1–15, default 1, three-zone labels (subajuste/óptimo/sobreajuste). Precompute all 15 fits on mount; slider selects index — instant update, no debounce needed (QR on 50 points is trivial) |
| AD7 | MDX registration | (a) Export from index.ts + map in page.tsx · (b) Named import | (a) established pattern | **(a)** — `export { OverfittingTrainer }` at barrel, `OverfittingTrainer` in components map |

## Data Flow

```
mount ──▶ fetch /data/perceptron-trainer.json (AbortController)
  ├─ loading ──▶ spinner "Cargando datos de biopsias…"
  ├─ error   ──▶ red card + "Reintentar"
  └─ success ──▶ computeNorm() ──▶ splitAndPrecompute() (once)
                    │
                    ├─ mulberry32(42) stratified 70/30 ──▶ 397 train / 172 test
                    ├─ mulberry32(7) stratified subsample  ──▶ 50 train (fixed)
                    ├─ degrees 1..15: Householder QR fit ──▶ coefs[d], preds[d], ecmTrain[d], ecmTest[d]
                    │
                    └─ render:
                       ├─ LEFT Plot: 50 train teal circles + 172 test orange × + fit curve (degree)
                       ├─ RIGHT Plot: two grouped bars (train/test) on log scale (degree)
                       └─ Panel: sliders(degree) + ECM(train) + ECM(test) + diagnosis + citation
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/lesson/overfitting-trainer.tsx` | **Create** | Client component: mulberry32 split+subsample, Householder QR fits, dual-panel Plotly, slider, diagnosis, a11y, citation |
| `src/components/lesson/index.ts` | Modify | Add `export { OverfittingTrainer } from "./overfitting-trainer"` |
| `src/app/learn/[module]/[slug]/page.tsx` | Modify | Import `OverfittingTrainer` + add to `components` map |
| `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md` | Modify | §11: replace iframe→trainer, rewrite bullets, title→"Overfitting en acción"; §12: minor coherence (7 transición, replace "error train ~0"→"error train en su piso (~0.10)") |
| `public/interactives/demo_06b_overfitting.html` | **Delete** | Legacy iframe replaced by React component |
| `src/content/modules/ia/README.md` | Modify | Demo count 8→7, remove row `\| 6b \| overfitting \|` |

## §11 Verbatim Replacement Block

```mdx
<Section number={11} title="Overfitting en acción" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l02-overfitting-predict"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  prompt="Si un modelo tiene error CERO en los datos de entrenamiento, ¿creés que funcionará igual de bien con datos nuevos?"
  answer="No. Error cero en entrenamiento es señal de sobreajuste: el modelo memorizó los datos de entrenamiento pero no generalizará a datos nuevos. Es como un estudiante que memoriza las respuestas del examen anterior pero no entiende los conceptos."
/>

<OverfittingTrainer />

**¿Qué muestra este demo?**
- El panel izquierdo muestra **50 biopsias de entrenamiento** (submuestra fija) y las **172 de prueba** (conjunto completo), con una curva polinomial ajustada sobre el radio medio del núcleo para predecir si la biopsia es benigna o maligna
- El panel derecho muestra el **Error Cuadrático Medio (ECM)** en escala logarítmica — a grados bajos el modelo es demasiado rígido (**subajuste**), a grados altos la curva memoriza cada punto y el error de prueba explota por varios órdenes de magnitud (**sobreajuste**)
- Con datos reales el error de entrenamiento NUNCA llega a cero — el piso (~0.10) es la superposición natural entre clases: un polinomio del radio medio, por más complejo que sea, no puede separar perfectamente biopsias benignas de malignas

</Section>
```

## §12 Tweak — single line change

Replace in the 8–15 row: `error train ~0` → `error train en su piso (~0.10)`. Add after table: `El grado 7 es transicional — su ECM de prueba sigue siendo óptimo (~0.098), pero es el último grado antes del colapso.`

## Testing Strategy

No test runner configured (`strict_tdd: false`). Verification is manual:

| Layer | What | How |
|-------|------|-----|
| Build gate | Component compiles with MDX | `npm run build` — no module-not-found or MDX parse errors |
| Type check | Props, Plotly config, state types | `npm run type-check` |
| Manual: determinism | Same split on two mounts | Open lesson twice in incognito tabs — verify identical 50 train indices, identical curve |
| Manual: trainer | Scatter (50 train + 172 test), fit curve, log ECM bars, diagnosis bands, slider 1–15, loading/error states, citation | Visual inspection per all spec scenarios |
| Manual: ECM numbers | Train ECM ~0.10 at all degrees, test ECM explodes deg 9+ (≥100× optimum), degree 5 is min test ECM | Read metrics panel at deg 1, 5, 9, 15 |
| Manual: content | §11 bullets: no "función real", honest floor, subsample disclosed; §12 table intact + transitional 7 | Read lesson at `/learn/ia/lesson02_how_ai_learns` |
| Manual: cleanup | `demo_06b_overfitting.html` deleted, README 7 demos, row removed | `ls public/interactives/`, read README |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure client-side React component.

## Migration / Rollout

- Delete `public/interactives/demo_06b_overfitting.html`; README header `(8)`→`(7)`; remove row `| 6b | overfitting |`.
- No DB migration, no feature flag, no phased rollout. Single atomic commit.
- Rollback: `git revert` restores all files.

## Open Questions

- None. All five spec-phase questions resolved: (1) Householder QR specified — Vandermonde→Householder reflections→R₁c=Q₁ᵀy back-substitution, λ=0; (2) dual-panel Plotly specified — teal circles + orange × + log-scale bars with hovertemplate; (3) determinism contract: mulberry32(42)→70/30→mulberry32(7)→50 stratified subsample; (4) diagnosis bands + §11 verbatim block provided; (5) no perf concerns — QR on 50 points is ~microseconds.
