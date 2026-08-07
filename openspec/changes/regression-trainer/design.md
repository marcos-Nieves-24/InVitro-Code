# Design: Interactive Regression Trainer — Replace demo_06_regression.html

## Technical Approach

Clone `PerceptronTrainer` structural skeleton (AbortController fetch, `computeNorm`, dynamic Plotly, card/grid layout, Spanish voseo, a11y, citation footer) and replace its ML logic with OLS closed-form regression: `m = Σ((x−x̄)(y−ȳ)) / Σ((x−x̄)²)`, `b = ȳ − m·x̄`, `R² = 1 − SS_res/SS_tot`. Same dataset (BCW 569 points, radius_mean → texture_mean). No class coloring — single uniform trace. Replaces `<InteractiveFrame>` in §9. Deletes `demo_06_regression.html`; README 9→8 demos.

## Architecture Decisions

| # | Decision | Options | Tradeoff | Decision |
|---|---|---|---|---|
| AD1 | Component skeleton | (a) Clone PerceptronTrainer · (b) Standalone from scratch · (c) Generic reusable trainer | (a) duplicates boilerplate but follows proven pattern; (b) diverges; (c) premature abstraction for single instance | **(a)** — mirror `"use client"` + `dynamic(() => import("react-plotly.js"))` + AbortController fetch + card grid `lg:grid-cols-3` + same button classes + citation footer |
| AD2 | OLS implementation | (a) Closed-form (exact formulas, no iteration) · (b) Gradient descent iteration | (a) exact, O(n), no convergence issues; (b) pedagogically richer but unnecessary for OLS | **(a)** — compute once on mount; "Calcular mejor recta" snaps sliders to computed optimum; values never hardcoded |
| AD3 | Slider ranges | (a) Data-derived [−0.5, 1.0] m / [0, 30] b · (b) Auto-derived from optimum (e.g. ±50%) | (a) simple, covers optimum m=0.3952, b=13.7070; (b) dynamic but fragile for near-zero m | **(a)** — fixed ranges from exploration; optimum falls inside; m step=0.005, b step=0.5 |
| AD4 | Predict input semantics | (a) Reject outside [xmin, xmax] · (b) Clamp silently · (c) Warn but allow | (a) clean UX, no silent data changes; (b) matches legacy demo but hides errors | **(a)** — input is radius in original µm units; out-of-range shows "El valor debe estar entre {xmin} y {xmax} µm" |
| AD5 | Residual whiskers | (a) Plotly `error_y` on scatter trace · (b) Separate line trace per point | (a) single trace, 569 whiskers (perceptron precedent renders 569 markers fine); (b) doubles trace count = slower | **(a)** — `error_y` object with `type: "data"`, `array: residuals`, `visible: true` on the main scatter |
| AD6 | Marker color | (a) Single uniform color · (b) Class-colored (benign/malignant) | (b) misleads — regression is continuous, not classification; spec forbids class legend | **(a)** — `#6366f1` (indigo-500), distinct from Perceptron's class colors; single trace, no color legend |
| AD7 | Plot layout | (a) Mirror Perceptron height=420, margins, white bg, horizontal legend · (b) Smaller/taller | (a) proven responsive; (b) may look cramped or waste space | **(a)** — `height:420, margin:{t:40,r:20,b:50,l:55}`, `useResizeHandler`, `responsive:true`, disabled modebar |
| AD8 | MDX registration | (a) Export from `index.ts` + map in `page.tsx` · (b) Named import in MDX | Missing either breaks build; (a) is the established pattern for all lesson components | **(a)** — `export { RegressionTrainer }` at barrel + `RegressionTrainer` entry in components map; dual registration is critical path |

## Data Flow / Component State

```
mount ──▶ fetch /data/perceptron-trainer.json (AbortController)
  ├─ loading ──▶ spinner "Cargando datos de biopsias…"
  ├─ error   ──▶ red card + "Reintentar" (window.location.reload())
  └─ success ──▶ computeNorm() + OLS closed-form ──▶ render
                    │
                    ├─ Plot: scatter (569 pts, uniform color) + OLS line + error_y whiskers
                    ├─ Metrics panel: ECM + R² live (useMemo on m, b, norm, dataset)
                    ├─ Sliders: m [−0.5, 1.0, step 0.005], b [0, 30, step 0.5] ── default = OLS optimum
                    ├─ "Calcular mejor recta" ──▶ setSliders(ols_optimum)
                    ├─ "Predecir" input ──▶ validate [xmin, xmax] ──▶ show m·x+b (reject if out of range)
                    └─ "Reiniciar" ──▶ clear prediction + snap sliders to optimum
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/lesson/regression-trainer.tsx` | **Create** | Client component: OLS closed-form, Plotly scatter+line+whiskers, m/b sliders, predict/reset, a11y, citation |
| `src/components/lesson/index.ts` | Modify | Add `export { RegressionTrainer } from "./regression-trainer"` |
| `src/app/learn/[module]/[slug]/page.tsx` | Modify | Import `RegressionTrainer` + add to `components` map |
| `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md` | Modify | Replace §9 (iframe→trainer, re-frame content) and §10 (BCW narrative) |
| `public/interactives/demo_06_regression.html` | **Delete** | Legacy iframe replaced by React component |
| `src/content/modules/ia/README.md` | Modify | Demo count 9→8, remove row `\| 6 \| regression \|` |

## §9 Verbatim Replacement Block

```mdx
<Section number={9} title="Regresión lineal en acción" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l02-regresion"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  prompt="Si solo conocemos el radio medio de una biopsia, ¿podemos predecir con precisión la textura media del tejido?"
  answer="No con gran precisión. El radio medio y la textura media tienen una relación débil (R² ≈ 0.10) — son datos reales ruidosos. La regresión lineal nos da la mejor recta posible, pero la predicción tiene mucho error porque la textura depende de muchos más factores que solo el tamaño del núcleo."
/>

<RegressionTrainer />

**¿Qué muestra?**
- Cada punto es una biopsia real del dataset BCW: radio medio del núcleo vs. textura media del tejido
- La recta es el **modelo de regresión lineal**: la mejor línea que pasa entre los 569 puntos
- El **Error Cuadrático Medio (ECM)** mide qué tan lejos están los puntos de la recta — con datos reales, siempre hay dispersión
- Las líneas verticales (residuales) muestran la distancia de cada punto a la recta

**Probá:**
1. Mové los sliders de pendiente e intercepto para ajustar la recta manualmente
2. Fijate cómo el ECM y R² cambian en vivo al mover la recta
3. Presioná "Calcular mejor recta" para ver la solución óptima por mínimos cuadrados
4. Usá "Predecir" para estimar la textura a partir de un valor de radio

</Section>
```

## §10 Tweak — only changed lines (rest stays)

**ReflectionCheck prompt/answer** (replace entire block):

```mdx
<Section number={10} title="ECM y límites de la regresión" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l02-ecm"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  prompt="¿Por qué elevamos al cuadrado los errores (ECM) en lugar de sumar las diferencias directamente? ¿Por qué el R² de nuestra regresión radio→textura es tan bajo (≈0.10)?"
  answer="Elevar al cuadrado penaliza más los errores grandes y evita que errores positivos y negativos se cancelen entre sí. El R² es bajo porque la textura de un tumor depende de muchos factores (no solo el tamaño del núcleo) — son datos reales, ruidosos. La regresión nos da la mejor aproximación lineal posible, pero no puede capturar toda la complejidad."
/>

<ConceptCard variant="key-idea">
La regresión lineal encuentra la relación lineal entre una variable independiente (radio medio) y una dependiente (textura media). La "mejor recta" minimiza el ECM — esto se llama **mínimos cuadrados**. Con datos reales, el R² rara vez es perfecto, y eso está bien: nos dice cuánta información aporta nuestra variable.
</ConceptCard>

No toda relación es lineal; en biología muchas variables tienen relaciones complejas que una sola recta no puede capturar. Un R² bajo no significa que el modelo esté mal — significa que el problema es difícil, como casi siempre en datos reales.

</Section>
```

## Testing Strategy

No test runner configured (`strict_tdd: false`). Verification is manual:

| Layer | What | How |
|-------|------|-----|
| Build gate | Component compiles with MDX | `npm run build` — no module-not-found or MDX parse errors |
| Type check | Props, Plotly config, state types | `npm run type-check` |
| Manual: trainer | Scatter (569 pts), OLS line, whiskers, ECM/R² live, predict validate/reject, reset, loading/error states, citation | Visual inspection at `/learn/ia/lesson02_how_ai_learns` — all spec scenarios |
| Manual: content | §9 title, body, ReflectionCheck (BCW, no dose-response), §10 no sigmoidea | `rg "concentración|fármaco|dosis.respuesta|antifúngico|sigmoidea"` in lesson.md → zero matches |
| Manual: cleanup | `demo_06_regression.html` deleted, README 8 demos, row removed | `ls public/interactives/`, read README |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure client-side React component.

## Migration / Rollout

- Delete `public/interactives/demo_06_regression.html`; remove README row `| 6 | regression |`; header `(9)` → `(8)`.
- No DB migration, no feature flag, no phased rollout. Single atomic commit.
- Rollback: `git revert` restores all files.

## Open Questions

- None. All three design-phase questions resolved: (1) predict rejects outside [xmin, xmax] with message; (2) slider ranges fixed at m ∈ [−0.5, 1.0], b ∈ [0, 30]; (3) residual whiskers via Plotly `error_y` on scatter trace.
