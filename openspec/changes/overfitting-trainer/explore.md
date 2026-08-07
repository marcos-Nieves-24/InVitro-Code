# Exploration: OverfittingTrainer (replace `demo_06b_overfitting.html`)

Change: `overfitting-trainer` · Phase: explore · Artifact store: openspec + engram

## Problem statement

Lesson 2 ("¿Cómo aprende la IA?") Section 11 embeds a static HTML iframe
(`public/interactives/demo_06b_overfitting.html`) as its interactive overfitting
demo. The rest of the lesson already uses first-class React client components
(`PerceptronTrainer`, `KnnTrainer`, `RegressionTrainer`) fed by the **real** BCW
dataset (`public/data/perceptron-trainer.json`, 569 biopsias). The iframe is the
last holdout: it runs on **synthetic** data, ships its own duplicated
checkpoints, is not themed, and shows no real-data narrative. This change
replaces it with a new `OverfittingTrainer` component following the exact
patterns of the other three trainers, deletes the iframe, and updates
`ia/README.md`.

The central design question explored here: **which target variable should the
polynomial fit**, and — the finding that shapes everything else — **why the
textbook overfitting curve does NOT emerge from the full dataset at degrees
1–15, and what the component must do about it**.

## Current state

### Lesson content (verbatim anchors)

`src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md`

- **Section 11 "Overfitting: interactive"** (lines 219–238): intro sentence,
  a `ReflectionCheck` with `blockId="reflection-l02-overfitting-predict"`
  (prompt: "Si un modelo tiene error CERO en los datos de entrenamiento…"),
  the iframe at line 231:
  `<InteractiveFrame src="/interactives/demo_06b_overfitting.html" height="800px" caption="simulación educativa sobre datos sintéticos" />`,
  and three bullets ("¿Qué muestra este demo?": left panel train/test scatter +
  fit curve, right panel ECM bars, dashed gray line = "función real subyacente").
  The "función real" bullet **cannot survive** the move to real data.
- **Section 12 "Tres regímenes de complejidad"** (lines 240–252): degree table —
  **1–2 subajuste, 3–6 óptimo, 8–15 sobreajuste** — plus ConceptCard
  (minimize error en datos nuevos, not train).
- **Section 13** (PCR analogy) and **Section 14** (`blockId="reflection-l02-overfitting"`, final
  reflection) stay untouched.

### The demo being replaced (437 lines, read fully)

- **Data**: synthetic cubic `trueFunc(x) = 0.5 + 0.8x − 0.3x² + 0.05x³`,
  20 train + 20 test points, LCG seeded noise (seed 42), x ∈ [−0.2, 1.8].
- **Fit**: Vandermonde + normal equations + Gaussian elimination, degrees 1–15.
- **Layout**: degree slider (1–15) with three range labels (subajuste/óptimo/
  sobreajuste); metrics panel (ECM train, ECM test, diagnosis); left plot
  (scatter train azul + test rojo, green fit curve, dashed gray "función real");
  right plot (grouped ECM bars).
- **Diagnosis**: degree-based — `≤2` subajuste, `≤6` óptimo, `>6` sobreajuste.
  Note the mismatch: the demo says overfitting starts at degree 7; the lesson
  table says 8–15.
- **Checkpoints**: an in-demo MCQ (3 questions) — **not** to be replicated; the
  lesson has its own ReflectionChecks and Section 15 checkpoint.
- **Gaps**: synthetic data, no dataset citation, no R² (not needed — ECM only),
  threshold inconsistent with the table, iframe not themed/responsive.

### What the replacement must preserve

Degree slider 1–15 with three-zone labels · left panel scatter (train/test) +
fit curve · right panel train/test ECM bars · live ECM readout · diagnosis text.

### Lab and notebook (what the student does — verbatim)

`lab.md` Parte 5 (lines 156–213) and `notebook.ipynb` cells 13–14:
`X_bcw = bcw.data[:, 0]` (**mean radius**, single feature),
`y_bcw = bcw.target` (**binary 0/1 label**), `train_test_split(test_size=0.3,
random_state=42, stratify=True)`, `PolynomialFeatures(d)` + `LinearRegression`
for `d in range(1, 13)`, `mean_squared_error` train/test, plot with
`ax.set_yscale('log')`, title "Subajuste vs. sobreajuste en BCW".

The trainer's target choice should mirror this **1:1** if it wants to be the
"live, real-data version of what you did in the lab".

### Trainers to mirror (patterns to reuse)

- `src/components/lesson/regression-trainer.tsx` (543 lines): client fetch of
  `/data/perceptron-trainer.json`, loading/error states, dynamic `react-plotly.js`,
  metrics panel, slider + buttons, UCI citation footer.
- `src/components/lesson/knn-trainer.tsx` (907 lines): **the machinery to reuse** —
  `mulberry32(42)` PRNG, per-class Fisher-Yates shuffle, stratified 70/30 split
  (397 train / 172 test), precomputed curves computed client-side on mount.
- Registration: `src/components/lesson/index.ts` export + import and map in
  `src/app/learn/[module]/[slug]/page.tsx` (components map, lines ~138–155).

### Dataset facts (computed from the real JSON)

n=569 · benigno 357 / maligno 212 · radius_mean 6.98–28.11 · texture_mean
9.71–39.28 · corr(radius, texture) = 0.324 (**R² = 0.105**) — the same weak
signal RegressionTrainer already teaches in Section 9.

## KEY DECISION: target variable + the curve problem (evidence)

### Finding 1 — the full dataset does NOT overfit at degrees 1–15

Fitted on all 397 train points (same split machinery as knn-trainer), degrees
1–15, train/test ECM:

| Target | deg 1 | deg 5 | deg 10 | deg 15 | Shape |
|---|---|---|---|---|---|
| **A** binary label | 0.109 / 0.111 | 0.091 / 0.096 | 0.087 / 0.095 | 0.087 / 0.095 | **Flat. Test never rises.** |
| **B** texture_mean | 15.97 / 17.93 | 15.78 / 17.73 | 15.75 / 17.85 | 15.61 / 18.07 | **Flat. Test never rises.** |

**Why**: with 397 train points, a degree-15 polynomial (16 params) is still far
from interpolation — it never approaches train ECM ≈ 0, and it never gets
flexible enough to memorize noise. The textbook curve only appears when
degree ≈ train-set size (the demo used 20 points).

**Consequence**: a component that fits the whole dataset silently produces a
boring, flat chart — the feature is pedagogically dead. **A deterministic
train subsample is MANDATORY** (design decision, evidence below).

### Finding 2 — with a subsample, Option A produces the classic curve

Stable Householder-QR solve, min-max normalized x, subsample of train points
(seed 7), full 172 test points:

**Option A — X = radius_mean, Y = binary label**, kTrain=50:

| deg | 1 | 3 | 5 | 8 | 9 | 10 | 15 |
|---|---|---|---|---|---|---|---|
| train ECM | 0.114 | 0.102 | 0.100 | 0.100 | 0.100 | 0.100 | 0.096 |
| test ECM | 0.115 | 0.103 | **0.098** | 0.102 | 0.353 | 0.709 | 471 861 |

- Test minimum at **degree 5** → lands inside the table's "**3–6 óptimo**".
- Test error explodes from **degree 9** → lands inside the table's "**8–15 sobreajuste**".
- Train floor ≈ 0.10 = Bayes error (the radius-overlap of the two classes; no
  polynomial of radius can separate them further). Honest, explainable.
- **kTrain=30** moves the optimum to degree 3 (still in "3–6") but explodes
  earlier (deg 5–6); **kTrain=100** drifts the optimum to degree 7 (outside the
  table). **kTrain=50 is the sweet spot.**

**Option B — X = radius_mean, Y = texture_mean**, kTrain=50:

- Test minimum at **degree 1–2** — **contradicts** the table's "3–6 óptimo".
- Train error barely moves (15.0 → 14.2, ~5%): with R² ≈ 0.10 the
  underfitting→óptimo transition is imperceptible.

### Finding 3 — solver choice is a trap

- Plain normal equations + Gaussian elimination (the demo's own method) are
  **borderline at degree ≥ 10** on this data (`|c_max|` ~10⁴–10⁶ at deg 8+,
  ~10⁶–10⁸ at deg 12–15); the test explosion at high degree is partly numerical
  amplification.
- **Adding any ridge (λ = 1e-9) completely kills the signal**: deg 15 test ECM
  drops from 471 861 → 0.0986. **The design MUST NOT regularize.**
- Stable **Householder QR on the raw Vandermonde** (~40 lines, no deps) gives
  the honest curve: the overfitting is REAL and survives a stable solve.

### Visualization

- **Option A**: scatter is two horizontal bands at y=0 / y=1; the high-degree
  polynomial visibly contorts through both bands — the clearest overfitting
  visual in ML pedagogy. Complements (not repeats) the perceptron/KNN class
  scatter, since the y-axis is the label itself.
- **Option B**: a noisy cloud (R²=0.10); degree-5 vs degree-15 fits are
  visually indistinguishable.

### Recommendation: **Option A**

1. **Matches the lab 1:1** — lab.md Part 5 fits radius → binary target, degrees
   1–12, MSE. The trainer becomes the "real-data, interactive version of what
   you just coded".
2. **Matches the Section 12 table** — empirical optimum degree 5 ("3–6"),
   overfitting onset degree 9 ("8–15"). Option B's optimum at degree 1–2 breaks
   the table.
3. **Strongest visual** — two bands + contorting curve.
4. **Interpretable train floor** — 0.10 = irreducible class overlap, a teaching
   moment ("even a perfect model of radius can't separate these").
5. Train ECM never reaches ~0 (floor ≈ 0.10) — the Section 11 bullets must be
   rewritten honestly: "train error at its floor while test error explodes by
   orders of magnitude" (the ratio at deg 15 is ~5 000 000×). The
   ReflectionCheck prompt ("error CERO") stays — it is a hypothetical.

### Component design sketch (for the design phase)

- Deterministic subsample: stratified split seed 42 (knn machinery) + train
  subsample of **50** points (seed 7), computed client-side on mount like
  knn-trainer's curves. No precomputed JSON needed.
- Fit: Householder QR on min-max normalized x (stability + curve plausibility).
  Degrees 1–15, no regularization.
- Left panel: 50 sampled train points (azul) + all 172 test points (rojo) + fit
  curve; **no** "función real" line (there is none in real data).
- Right panel: ECM bars on **log scale** (the lab's own `set_yscale('log')`;
  0.098 vs 471 861 spans ~7 decades).
- Metrics: ECM train / ECM test / diagnosis; diagnosis thresholds per the table
  (≤2 subajuste, 3–6 óptimo, 8–15 sobreajuste; degree 7 transitional — see open
  question).
- Panel copy must state the subsample transparently ("50 biopsias de
  entrenamiento (submuestra fija) · 172 de prueba").
- No in-component MCQ (lesson owns those).

## Affected areas

- `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md` — replace
  iframe (line 231) with `<OverfittingTrainer />`; rewrite the three "¿Qué
  muestra este demo?" bullets (drop the "función real" line, add real-data
  framing + subsample note); ReflectionChecks stay (blockIds preserved);
  Section 12 table can stay as-is (verified against data) — optional minor
  wording for degree 7.
- `src/components/lesson/overfitting-trainer.tsx` — **NEW** client component.
- `src/components/lesson/index.ts` — export `OverfittingTrainer`.
- `src/app/learn/[module]/[slug]/page.tsx` — import + add to components map.
- `public/interactives/demo_06b_overfitting.html` — **DELETE**.
- `src/content/modules/ia/README.md` — demos (8)→(7); remove the `6b` row.
- `public/data/perceptron-trainer.json` — reused, unchanged.

## Risks

- **Feature silently dies if the subsample is skipped**: full-data fit is flat.
  Verify in apply that the fitted curve actually shows train-floor vs test-explosion.
- **Solver/regularization trap**: normal equations + GE are borderline at
  deg ≥ 10; any ridge kills the signal. The design MUST specify a stable QR
  solve and no regularization, or the chart is either garbage or flat.
- **Number mismatch with the lab**: sklearn's `random_state=42` split is a
  different PRNG than mulberry32(42); student lab outputs will not match the
  trainer exactly. Acceptable (different split), worth a note.
- **"Error train ~0" narrative**: unachievable on real data (floor 0.10).
  Coherence of Section 11 bullets and reflection wording must be checked.
- **Log scale required**: without it, the deg-15 test bar (10⁵) dwarfs
  everything and the subajuste/óptimo regime (0.098 vs 0.115) is invisible.
- **Threshold drift with kTrain**: 30 → optimum deg 3 (ok), 100 → optimum deg 7
  (breaks "3–6"); keep kTrain ≈ 50 or re-verify.
- **README count**: only `demo_06b` is removed; rows 1–3 and 7–10 iframes
  remain (numbering already has gaps 4–6).

## Open questions for proposal

1. kTrain: lock **50**, or precompute a fixed subsample list for exact
   reproducibility?
2. Show all 172 test points or subsample test for display symmetry?
3. Diagnosis thresholds: exactly per table (1–2 / 3–6 / 7? / 8–15) — decide how
   to label degree 7 (data says it is still optimal: test 0.0987).
4. Section 12: keep the table verbatim (verified) or add degree 7 to the óptimo
   row for exactness?
5. Error bars: log scale (recommended, matches lab) vs capped linear.
6. Keep the component's Spanish copy minimal and in the voice of the other three
   trainers ("Entrenador de sobreajuste").

## Ready for proposal

Yes. The exploration resolved the target-variable question with real computed
evidence and uncovered the two traps the proposal must encode: the mandatory
subsample and the solver/regularization constraint. Tell the user: the
recommended design is Option A (binary label) with a deterministic 50-point
train subsample, stable QR solve, and log-scale ECM — it is the only option
whose empirical curve matches the lesson's own "3–6 / 8–15" table.
