# Interactive Overfitting Specification

## Purpose

`OverfittingTrainer` is a client-side interactive for Lesson 2 §11: 569 real BCW biopsies, polynomial fit of normalized `radius_mean` → binary label, degree slider 1–15, dual-panel (scatter + fit | log ECM bars), live ECM + diagnosis, accessible, responsive, Spanish voseo. Replaces the legacy `demo_06b_overfitting.html` iframe.

## Requirements

### Requirement: BCW Data Source

The trainer MUST load the 569 BCW samples from `/data/perceptron-trainer.json` and MUST fit X = `radius_mean` (min-max normalized) against the binary label Y ∈ {0, 1}.

#### Scenario: Loads the real dataset

- GIVEN the component mounts
- WHEN the fetch completes
- THEN 569 points render as the two class bands at y=0 and y=1

### Requirement: Deterministic Split Contract

The trainer MUST reproduce the same split on every mount: stratified 70/30 train/test split (mulberry32 seed 42), then a stratified 50-point train subsample (mulberry32 seed 7); the 172 test points MUST stay whole. Copy MUST disclose the subsample ("50 biopsias de entrenamiento (submuestra fija) · 172 de prueba").

#### Scenario: Stable subsample

- GIVEN the component mounts twice
- WHEN the split is computed
- THEN both mounts yield identical 50 train / 172 test points

#### Scenario: Subsample disclosed

- GIVEN the left panel rendered
- THEN the copy states the fixed 50-point subsample and the 172 test points

### Requirement: Polynomial Fit via Householder QR

The trainer MUST fit degrees 1–15 via Householder QR on the Vandermonde of the normalized X. It MUST NOT use plain normal equations or any regularization (λ = 0 strictly).

#### Scenario: Stable high-degree fit

- GIVEN degree 15 selected
- WHEN the fit is computed
- THEN train ECM stays near its ~0.10 floor while test ECM explodes (≳10⁵× optimum) with no numerical artifacts

### Requirement: ECM Metrics on Log Scale

The trainer MUST compute and display numeric train ECM and test ECM for the current degree, plotted as bars on a log scale in the right panel with the numeric ECM in hover tooltips.

#### Scenario: Live readout

- GIVEN a degree selected
- WHEN the metrics panel renders
- THEN both ECM values appear for that degree

#### Scenario: Hover shows numeric ECM

- GIVEN the right panel rendered
- WHEN a bar is hovered
- THEN the exact numeric ECM appears in the tooltip

### Requirement: Diagnosis Bands

The trainer MUST label the current degree per the §12 table: 1–2 "Subajuste", 3–6 "Punto óptimo", 7 "transición (óptimo)", 8–15 "Sobreajuste".

#### Scenario: Degree 7 transitional

- GIVEN the slider at 7
- WHEN the diagnosis renders
- THEN it reads "transición (óptimo)"

#### Scenario: Overfitting onset

- GIVEN the slider at 9
- WHEN the diagnosis renders
- THEN it reads "Sobreajuste"

### Requirement: Dual-Panel Layout

One slider MUST drive both panels. LEFT: 50 train points (teal circles), all 172 test points (distinct marker: orange × or hollow), and the fit curve overlay. RIGHT: train/test log ECM bars for the current degree. LEFT MUST NOT draw a "función real" line.

#### Scenario: Panels reflect the degree

- GIVEN the slider at degree d
- WHEN both panels render
- THEN the curve and the bars both correspond to d

### Requirement: Degree Slider

The slider MUST range 1–15, default to 1, and show the three-zone labels (subajuste / óptimo / sobreajuste).

#### Scenario: Default degree

- GIVEN the component mounts
- THEN the slider shows 1 and both panels fit degree 1

### Requirement: Loading and Error States

The trainer MUST show a loading spinner while fetching and a visible error state with retry on failure.

#### Scenario: Retry recovers

- GIVEN the error state visible
- WHEN "Reintentar" is pressed
- THEN the fetch re-attempts and, on success, the trainer renders

### Requirement: Citation Footer

The trainer MUST show the citation "Street, W.N., Wolberg, W.H. & Mangasarian, O.L. (1993) — Breast Cancer Wisconsin (Diagnostic), UCI Machine Learning Repository" with a link to `archive.ics.uci.edu`.

#### Scenario: Footer always visible

- GIVEN the trainer rendered successfully
- THEN the citation footer with the UCI link is displayed

### Requirement: Accessibility

Controls MUST have `aria-label`s; the diagnosis and ECM readouts MUST be announced via `aria-live="polite"`; information MUST NOT be conveyed by color alone.

#### Scenario: Screen-reader diagnosis

- GIVEN the degree changes
- WHEN the diagnosis updates
- THEN the change is announced by an `aria-live` region

### Requirement: Responsive Layout

The dual-panel layout MUST use a side-by-side grid at the `lg` breakpoint and stack vertically on smaller screens.

#### Scenario: Stacked on mobile

- GIVEN a viewport below `lg`
- WHEN the trainer renders
- THEN the two panels stack vertically

### Requirement: Spanish Voseo Copy

All copy MUST be Spanish voseo ("Probá", "Fijate", "Arrastrá"), matching the other trainers.

#### Scenario: Copy language

- GIVEN the trainer rendered
- THEN every label and button uses Spanish voseo

### Requirement: Component Integration

`OverfittingTrainer` MUST be exported from `src/components/lesson/index.ts` AND registered in the MDX components map in `src/app/learn/[module]/[slug]/page.tsx`. `public/interactives/demo_06b_overfitting.html` MUST be deleted, and the module README MUST count 7 demos (8→7, removing the 6b row).

#### Scenario: MDX compiles

- GIVEN both registration points updated
- WHEN `npm run build` runs
- THEN the lesson compiles with `<OverfittingTrainer />`

#### Scenario: Demo cleanup

- GIVEN the legacy iframe deleted
- WHEN the README is inspected
- THEN it lists 7 demos with no 6b row
