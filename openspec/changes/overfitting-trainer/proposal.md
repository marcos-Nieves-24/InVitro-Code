# Proposal: OverfittingTrainer — Replace demo_06b_overfitting.html

> **Decisiones** · [D1] radius→binary label, kTrain=50 subsample · [D2] Householder QR, sin regularización · [D3] ECM log-scale · [D4] grado 7 transicional, tabla §12 intacta · [D5] ReflectionCheck conservado, bullets reescritos.

## Intent

Replace the last HTML iframe holdout in Lesson 2 §11 with `<OverfittingTrainer />` — a React client component using real BCW data (radius_mean → binary label). Eliminates synthetic-data island, mirrors `PerceptronTrainer`/`KnnTrainer`/`RegressionTrainer` patterns, and teaches overfitting on real noisy data students already worked with in the lab.

## Scope

### In Scope
- `overfitting-trainer.tsx` — "use client", dynamic Plotly, mulberry32(42/7) stratified subsample 50 train, Householder QR fit degrees 1–15, log-scale ECM bars, diagnosis per §12 table.
- §11: title → "Overfitting en acción", `<OverfittingTrainer />`, ReflectionCheck bullets rewritten (no "función real", honest floor ≈ 0.10, subsample framing).
- Dual MDX registration: `index.ts` + `page.tsx`.
- Delete `demo_06b_overfitting.html`; README demos (8)→(7).

### Out of Scope
- Ridge regularization (verified signal-killer). In-component MCQs. §§12–14 content changes beyond coherence.

## Capabilities

### New Capabilities
- `interactive-overfitting`: BCW binomial polynomial fit, degree slider 1–15, dual-panel (scatter+fit / log ECM bars), diagnosis (≤2 subajuste, 3–6 óptimo, 8–15 sobreajuste, grado 7 transición), a11y, responsive, Spanish voseo, UCI footer.
- `overfitting-lesson-content`: §11 re-framed to real BCW data, subsample narrative, ReflectionCheck bullets rewritten.

### Modified Capabilities
- None

## Approach

Clone knn-trainer machinery: mulberry32(42) stratified split → deterministic subsample 50 train (seed 7). Householder QR on min-max normalized Vandermonde — stable at deg 15 (normal equations borderline). Left: 50 train teal + 172 test orange + fit curve. Right: log-scale ECM bars (deg-15 test ~471k vs optimum ~0.098). No ground-truth line; irreducible class-overlap floor is the teaching point. One slider drives both panels.

## Affected Areas

| Area | Impact |
|------|--------|
| `src/components/lesson/overfitting-trainer.tsx` | New |
| `src/components/lesson/index.ts` | Modified |
| `src/app/learn/[module]/[slug]/page.tsx` | Modified |
| `lesson02_how_ai_learns/lesson.md` §11 | Modified |
| `public/interactives/demo_06b_overfitting.html` | Deleted |
| `src/content/modules/ia/README.md` | Modified |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Full-data fit flat (no subsample) | High | Verify train floor ~0.10, test explodes deg 9+ |
| Normal equations unstable deg ≥ 10 | Medium | Hardcode QR; zero ridge |
| Log scale hides subajuste | Low | Numeric ECM in hover tooltips |

## Rollback Plan

`git revert` restores demo_06b, original bullets, and README count. Self-contained commits per area.

## Dependencies

`react-plotly.js` (installed), `perceptron-trainer.json` (reused), knn-trainer PRNG/split pattern (exists).

## Success Criteria

- [ ] `npm run build` passes
- [ ] Train ECM floors ~0.10; test ECM explodes deg 9+ (≥100× optimum)
- [ ] Diagnosis labels match §12 table; degree 7 shows "transición"
- [ ] Left: 50 train + 172 test + fit curve; Right: log-scale ECM bars
- [ ] demo_06b deleted; README shows 7 demos
- [ ] Exported from index.ts, registered in MDX components map
