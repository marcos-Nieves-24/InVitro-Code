# Proposal: Interactive Regression Trainer — Replace demo_06_regression.html

> **Decisiones** · [D1] BCW radio→textura, 569 puntos · [D2] OLS cerrado, R²≈0.105 (dato ruidoso) · [D3] ReflectionCheck re-enmarcado a BCW · [D4] 3 MCQs del iframe descartados · [D5] Título "Regresión lineal en acción" · [D6] §10 narrativa BCW sin dosis-respuesta · [D7] demo_06b fuera de scope.

## Intent

Replace the legacy `<InteractiveFrame>` iframe in Lesson 2 §9 with a `<RegressionTrainer />` React component using 569 real BCW points (radius_mean → texture_mean). Eliminates the HTML/Plotly-global tech island, aligns with `PerceptronTrainer`/`KnnTrainer` patterns, and unifies the lesson around real data instead of synthetic dose-response.

## Scope

### In Scope
- `regression-trainer.tsx` — "use client", OLS closed-form, m/b sliders, live ECM+R², whiskers, "Calcular mejor recta", predict, reset.
- §9: title → "Regresión lineal en acción", `<RegressionTrainer />`, ReflectionCheck re-framed to BCW (blockId preserved).
- §10: narrative + ConceptCard → BCW continuous regression.
- Dual MDX registration: `index.ts` export + `page.tsx` components map.
- Delete `public/interactives/demo_06_regression.html`; README demo count 9→8.

### Out of Scope
- `demo_06b_overfitting.html` (§11) — future change.
- 3 checkpoint MCQs from the iframe (discarded — §15 covers them).
- New dataset; generic reusable trainer (one instance only).

## Capabilities

> No existing `openspec/specs/`. All new.

### New Capabilities
- `interactive-regression`: BCW scatter, OLS closed-form, live ECM+R², residual whiskers, predict, reset, a11y, responsive.
- `regression-lesson-content`: §§9-10 re-framed to BCW radio→texture.

### Modified Capabilities
- None

## Approach

Clone `PerceptronTrainer`/`KnnTrainer`: same fetch (AbortController), Plotly card/grid, button styles, Spanish voseo. OLS in original units. Low R² (~0.10) framed as "real noisy data", anchored to §10 on regression limits.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| R²≈0.10 read as broken regression | High | Copy: "texture hard to predict from radius alone — real noisy data" |
| 569 whiskers + markers → lag | Low | Perceptron precedent (569 markers OK) |
| Missing MDX dual registration breaks build | Medium | Tasks cover both; gate `npm run build` |

## Rollback Plan

- `git revert` of the full branch restores demo_06, original lesson, and README.
- Self-contained commits allow selective revert per area.

## Dependencies

- None new: react-plotly.js installed; `perceptron-trainer.json` exists.

## Success Criteria

- [ ] `npm run build` passes.
- [ ] Scatter: 569 points, OLS line, whiskers, live ECM+R², a11y, citation footer.
- [ ] Sliders default to optimum (m=0.3952, b=13.7070); "Calcular mejor recta" snaps back.
- [ ] "Predecir" shows formula with range validation; "Reiniciar" clears prediction.
- [ ] Loading/error states (spinner + "Reintentar").
- [ ] §§9-10: zero dose-response/antifungal language; ConceptCard updated.
- [ ] `demo_06_regression.html` deleted; README shows 8 demos.
- [ ] Exported from `index.ts` and registered in MDX components map.
