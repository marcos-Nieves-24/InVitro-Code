# SDD Explore: regression-trainer

## Exploration: Regresión lineal interactiva — React `RegressionTrainer` en lugar del iframe `demo_06_regression.html`

## PROBLEMA

La Lección 2 del módulo `ia` ("¿Cómo aprende la IA?") enseña regresión lineal mediante un iframe HTML legacy (`public/interactives/demo_06_regression.html`) que:

- Usa **20 puntos sintéticos** de "concentración de fármaco vs. halo de inhibición" (curva dosis-respuesta antifúngico) — contexto que **rompe la continuidad** con el resto de la lección, que gira sobre las 569 biopsias reales BCW (radio medio vs. textura media).
- Es una isla tecnológica: HTML vanilla + Plotly.js global, sin acceso a los datos reales ya disponibles en `public/data/perceptron-trainer.json`, sin integración React, sin a11y/ARIA consistente con el resto de la plataforma.
- Duplica pedagogía que ya vive en la lección (la pregunta predictiva y los checkpoints MCQ viven dentro del iframe; la lección ya tiene su propio `ReflectionCheck`).

Además, la Sección 10 ("ECM y límites de la regresión") usa el mismo lenguaje dosis-respuesta/antifúngico que ya no corresponde al contexto BCW.

## Current State

### Sección 9 de `lesson.md` (líneas 175-198) — texto verbatim que se reemplaza

```mdx
<Section number={9} title="Regresión lineal: interactive" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l02-regresion"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  prompt="Si duplicamos la concentración de un fármaco, ¿esperás que el efecto inhibitorio se duplique exactamente?"
  answer="No necesariamente. La relación dosis-respuesta en biología suele ser sigmoidea: a bajas concentraciones el efecto es pequeño, luego crece rápidamente en un rango, y finalmente se satura (meseta). La regresión lineal solo aproxima bien en el rango casi lineal de la curva."
/>

<InteractiveFrame src="/interactives/demo_06_regression.html" height="700px" caption="modelo sobre datos reales simulados (basado en curvas dosis-respuesta de antifúngicos)" />

**¿Qué muestra?**
- Cada punto es un experimento: concentración de fármaco vs. halo de inhibición
- La recta es el **modelo de regresión lineal**: la mejor línea que pasa entre los puntos
- El **Error Cuadrático Medio (ECM)** mide qué tan lejos están los puntos de la recta

**Probá:**
1. Ajustá pendiente e intercepto manualmente
2. Fijate cómo el ECM se reduce al acercarte a la mejor recta
3. Presioná "Calcular mejor recta" para ver la solución óptima
4. Usá "Predecir" para estimar el halo para una concentración nueva

</Section>
```

- `blockId="reflection-l02-regresion"` **debe preservarse** (solo cambia prompt/answer, ver Open Questions).
- El título `Regresión lineal: interactive` usa la convención "interactive" en minúscula (igual que la Sección 11); las secciones 4 y 7 usan "en acción". No tocar el título salvo decisión explícita de normalizarlo.

### Sección 10 de `lesson.md` (líneas 200-216) — texto verbatim que se ajusta

```mdx
<Section number={10} title="ECM y límites de la regresión" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l02-ecm"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  prompt="¿Por qué elevamos al cuadrado los errores (ECM) en lugar de sumar las diferencias directamente? Si la relación dosis-respuesta es sigmoidea (no lineal), ¿la regresión lineal sigue siendo útil para aproximarla en algún rango?"
  answer="Elevar al cuadrado penaliza más los errores grandes y evita que errores positivos y negativos se cancelen entre sí. La regresión lineal puede aproximar una sigmoidea en su rango casi lineal (la zona media de la curva), pero no en los extremos donde se aplana."
/>

<ConceptCard variant="key-idea">
La regresión lineal encuentra la relación lineal entre una variable independiente (concentración) y una dependiente (efecto). La "mejor recta" minimiza el ECM — esto se llama **mínimos cuadrados**.
</ConceptCard>

No toda relación es lineal; en biología muchas son curvas sigmoideas (dosis-respuesta).

</Section>
```

Cambios narrativos pendientes: `prompt`/`answer` (mencionan sigmoidea dosis-respuesta), `ConceptCard` ("variable independiente (concentración) y dependiente (efecto)"), y la línea final (dosis-respuesta). Contexto objetivo: BCW radio medio (X) → textura media (Y), ambos continuos, sin colores de clase.

### `demo_06_regression.html` (237 líneas) — UX actual a replicar

- **Datos**: 20 puntos sintéticos (concentración 5–100 µM vs. halo 3.2–18.2 mm).
- **Controles**: slider pendiente m (−0.1…0.40, step 0.005), slider intercepto b (−2…12, step 0.5), ambos con lectura en vivo.
- **Métricas**: ECM en vivo en el título del gráfico y en un readout (rojo, `#d62728`).
- **Residuales**: traza con `error_y` (whiskers) de cada punto a la recta.
- **"Calcular mejor recta"**: mínimos cuadrados en forma cerrada (ecuaciones normales), setea sliders al óptimo.
- **"Predecir"**: input numérico (clamp 0–120), muestra `predicción = m·x + b`.
- **Extras dentro del iframe que NO viven en la lección**: MCQ predictivo ("¿duplicamos la concentración...?") y 3 checkpoint MCQs (ECM, variable continua, aprendizaje supervisado). La pregunta predictiva ya está duplicada por el `ReflectionCheck` de la lección; los 3 checkpoint MCQs **se pierden** al eliminar el iframe (ver Open Questions).

### Convenciones de `PerceptronTrainer`/`KnnTrainer` (src/components/lesson/) a replicar

- `"use client"` + `const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })` (react-plotly.js `^4.0.0`, plotly.js embebido — sin dep extra en package.json).
- Fetch de `/data/perceptron-trainer.json` con **AbortController** (cleanup en unmount), estados `fetchLoading` (spinner "Cargando datos de biopsias…") y `fetchError` (rojo + botón "Reintentar" con `window.location.reload()`).
- **Min-max norm** (`computeNorm`) sobre el dataset completo; guards `xmax !== xmin`.
- Card: `bg-white rounded-card border border-gray-200 shadow-sm p-4 md:p-6`, grid `grid-cols-1 lg:grid-cols-3` (plot `lg:col-span-2` + columna de controles), layout Plotly `height:420, margin:{t:40,r:20,b:50,l:55}`, `paper_bgcolor/plot_bgcolor: white`, leyenda horizontal, `config = {responsive:true, displayModeBar:false, staticPlot:false}`, `useResizeHandler`.
- Botones: `primaryBtnClass`/`secondaryBtnClass` (mismos strings exactos en ambos trainers).
- **Copy voseo**: "Probá", "Elegí", "Fijate", "Hacé", "Presioná", "Reiniciá".
- `aria-label` en sliders/botones, `aria-live="polite"` en readouts.
- **Footer de citación**: "Street, W.N., Wolberg, W.H. & Mangasarian, O.L. (1993) — Breast Cancer Wisconsin (Diagnostic), UCI Machine Learning Repository." + link `archive.ics.uci.edu` (`sourceUrl`).
- Ejes X/Y con `dataset.feature_names[0]` / `[1]` (ya en español: "radio medio (núcleo)", "textura media (desviación de grises)").

### Datos reales disponibles (`public/data/perceptron-trainer.json`)

- 569 puntos `{radius_mean, texture_mean, label}`; `n_benign: 357`, `n_malignant: 212`; `feature_names`/`feature_keys`/`source`/`source_url`.
- Rango radio: 6.98–28.11; rango textura: 9.71–39.28.
- **No hace falta dataset nuevo**: el JSON actual cubre el trainer de regresión (label se ignora).

### Registro de componentes MDX (2 puntos de registro)

1. `src/components/lesson/index.ts` — `export { PerceptronTrainer } ...`, `export { KnnTrainer } ...` (añadir `RegressionTrainer`).
2. `src/app/learn/[module]/[slug]/page.tsx` — import de `@/components/lesson` (líneas 27-29) + entrada en el mapa `components` (líneas 137-159). **Sin esto el MDX no compila el componente.**

### README y demo a eliminar

- `src/content/modules/ia/README.md` lista 9 demos → 8: eliminar fila `| 6 | regression | ...` y cambiar el header `## Demos interactivos (9)` → `(8)`.
- Eliminar `public/interactives/demo_06_regression.html`. `demo_06b_overfitting.html` (Sección 11) **queda fuera de scope**.

### Alineación con el lab (`lab.md` Parte 5)

El lab usa `LinearRegression` sobre BCW **target binario** (0/1) con mean radius para demostrar train/test y sobreajuste polinomial. El trainer propuesto (radio→textura, ambos continuos) es un ejemplo de regresión *correcto* (variable continua) y complementario; el lab es la demostración del *uso* con sklearn. La narrativa de la sección debe hablar de "predecir un valor continuo (textura)" para alinearse con la definición de regresión de la Sección 8.

## Affected Areas

- `src/components/lesson/regression-trainer.tsx` — **NUEVO** componente cliente (corazón del cambio).
- `src/components/lesson/index.ts` — export del componente.
- `src/app/learn/[module]/[slug]/page.tsx` — entrada en el mapa `components`.
- `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md` — Sección 9 (reemplazar iframe) y Sección 10 (narrativa BCW).
- `public/interactives/demo_06_regression.html` — **ELIMINAR**.
- `src/content/modules/ia/README.md` — conteo de demos 9 → 8.
- `public/data/perceptron-trainer.json` — solo lectura, sin cambios.

## Approaches

1. **Componente dedicado `RegressionTrainer` (recomendado)** — clon estructural de `PerceptronTrainer`/`KnnTrainer` con OLS en forma cerrada.
   - Pros: patrón ya establecido y probado en la plataforma; datos reales; a11y consistente; sin iframe; el mismo JSON; citación incluida.
   - Cons: duplica boilerplate de fetch/norm/Plotly (aceptable, los 3 hermanos comparten el patrón).
   - Effort: Medium.

2. **Parchear el HTML en su lugar** (cambiar solo los 20 puntos sintéticos por los 569 reales).
   - Pros: mínimo esfuerzo.
   - Cons: mantiene la isla tecnológica; sin React/a11y; sin reuso de componentes; Plotly global legacy; contradice la dirección de la plataforma; no cubre el requisito del orchestrator.
   - Effort: Low pero dead-end.

3. **Componente genérico reutilizable `ScatterRegressionTrainer`** (configurable por features).
   - Pros: reutilizable a futuro.
   - Cons: abstracción prematura; solo hay UNA instancia hoy; añade complejidad de props/API para un caso único; rompe la simetría con los trainers hermanos (que son componentes concretos).
   - Effort: High.

## Recommendation

**Enfoque 1: `RegressionTrainer` dedicado**, replicando las convenciones exactas de `PerceptronTrainer`/`KnnTrainer`. Especificaciones clave verificadas en exploración:

- **OLS en forma cerrada** sobre las 569 muestras (radio→textura): `slope m = 0.3952`, `intercept b = 13.7070`, `MSE = 16.5305`, **`R² = 0.1048`**. El "Calcular mejor recta" setea los sliders a este óptimo.
- **Rangos de sliders derivados de los datos** para que el óptimo quede accesible: m ∈ [−0.5, 1.0] (step 0.005), b ∈ [0, 30] (step 0.5). Valores iniciales = óptimo (el enunciado del orchestrator: "defaulting to the closed-form optimum").
- **R² débil (≈0.10)**: hallazgo clave — la relación radio→textura es ruidosa. La narrativa de la Sección 9 debe decirlo explícitamente ("la textura es difícil de predecir solo con el radio; por eso el R² es bajo y los puntos están dispersos") — esto refuerza el mensaje de la Sección 10 sobre límites de la regresión en lugar de contradecirlo. El demo sintético anterior (R² casi perfecto) daba una ilusión que el dato real no sostiene.
- **Residuales**: whiskers `error_y` sobre los 569 puntos (el perceptrón ya renderiza 569 markers sin problema; el `error_y` se calcula en O(n) por render, trivial).
- **"Predecir"**: input numérico clamp `[norm.xmin, norm.xmax]` (+ pequeño padding), output `m·x + b` con unidades de textura.
- **Métricas en la card**: ECM y R² en vivo en la columna de estado (patrón "Estado del modelo" del perceptrón), no solo en el título.
- **Copy**: mantener voseo y el bloque "¿Qué muestra?"/"Probá:" adaptado a BCW (radio→textura, sin colores de clase).

## Risks

- **R² ≈ 0.105 (relación débil)**: si la narrativa no se ajusta, el interactivo puede leerse como "regresión rota" en vez de "dato real ruidoso". Mitigación: copy explícito + anclaje a la Sección 10.
- **3 checkpoint MCQs del iframe se pierden**: el MCQ predictivo está duplicado por el `ReflectionCheck` de la lección, pero los 3 checkpoints (definición de ECM, variable continua, supervisado) no existen en la lección. Decisión requerida en proposal: descartarlos (los cubre el Checkpoint de la Sección 15) o migrarlos a MDX.
- **Prompt del `ReflectionCheck` de la Sección 9 es dosis-respuesta**: el `blockId` se preserva, pero prompt/answer hablan de concentración/efecto. Re-framear a radio/textura o mantener como pregunta conceptual "si duplicás X, ¿se duplica Y?" — decisión de proposal (ver Open Questions).
- **Regresión del target binario en el lab vs. continua en el trainer**: ángulos pedagógicos distintos (lab: target 0/1; trainer: textura continua). No es bloqueante; documentar en el copy que el trainer es el ejemplo "puro" de regresión continua.
- **569 puntos + whiskers residuales**: rendimiento Plotly en dispositivos bajos — aceptable (precedente perceptrón), opción de opacidad baja.
- **Bloqueo de registro MDX**: olvidar el export en `index.ts` o el mapa en `page.tsx` rompe la compilación de la Sección 9 (error silencioso en build de MDX). Tasks deben incluir ambos puntos.

## Open Questions (para la fase proposal)

1. ¿Re-framear el `prompt`/`answer` del `ReflectionCheck` `reflection-l02-regresion` al contexto BCW (radio/textura), o mantener la pregunta dosis-respuesta como está? El `blockId` se conserva en cualquier caso.
2. ¿Los 3 checkpoint MCQs del iframe se descartan o se migran como MDX a la lección?
3. ¿Normalizar el título de la Sección 9 ("Regresión lineal: interactive" → "Regresión lineal: en acción") para consistencia con las Secciones 4/7, o dejarlo?

## Ready for Proposal

**Yes.** La exploración confirmó: datos reales disponibles sin cambios (JSON existente), patrón de componente establecido y replicable (dos precedentes), OLS/R² pre-calculados, puntos de registro MDX identificados, y texto verbatim de las secciones 9/10 capturado. El orchestrator debe presentar al usuario las 3 Open Questions como decisiones de la fase proposal.

## FUENTES

- `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md` — Secciones 9 (175-198) y 10 (200-216) verbatim; Sección 11 excluida (218-237).
- `public/interactives/demo_06_regression.html` — demo legacy completo (237 líneas).
- `src/components/lesson/perceptron-trainer.tsx` — convenciones de referencia (703 líneas).
- `src/components/lesson/knn-trainer.tsx` — convenciones de referencia (907 líneas).
- `src/components/lesson/index.ts` — punto de export (línea 18-19).
- `src/app/learn/[module]/[slug]/page.tsx` — mapa `components` (137-159).
- `public/data/perceptron-trainer.json` — 569 puntos BCW; OLS calculado: m=0.3952, b=13.7070, MSE=16.5305, R²=0.1048.
- `src/content/modules/ia/lessons/lesson02_how_ai_learns/lab.md` — Parte 5 (líneas 156-213), regresión sobre BCW.
- `src/content/modules/ia/README.md` — tabla de demos (líneas 14-28), conteo 9 → 8.
- `openspec/config.yaml` — convenciones: contenido en español, RFC 2119 en specs, patrón de componentes MDX en design.
- `package.json` — react-plotly.js `^4.0.0` (sin plotly.js directo).
