# Interactive Regression Specification

## Purpose

`RegressionTrainer` is a client-side interactive for Lesson 2 §9: 569 real BCW biopsies (radius_mean → texture_mean), OLS closed-form line, live ECM+R², residual whiskers, predict/reset, accessible, responsive, Spanish voseo. Replaces the legacy `demo_06_regression.html` iframe.

## Requirements

### Requirement: BCW Data Source

The trainer MUST load the 569 BCW samples from `/data/perceptron-trainer.json` and MUST plot `radius_mean` (X) vs `texture_mean` (Y) as continuous variables. Markers MUST use a uniform color; class labels MUST NOT affect marker color or legend.

#### Scenario: Loads the real dataset

- GIVEN the component mounts
- WHEN the fetch completes
- THEN 569 points render with Spanish axis labels from `feature_names`

#### Scenario: Fetch fails

- GIVEN the fetch fails
- WHEN the error state is shown
- THEN the user can retry via "Reintentar"

### Requirement: OLS Closed-Form Optimum

The trainer MUST compute slope m and intercept b with the closed-form least-squares solution `m = Σ((x−x̄)(y−ȳ)) / Σ((x−x̄)²)`, `b = ȳ − m·x̄` over the 569 samples. "Calcular mejor recta" MUST compute and display this optimum (≈ m=0.3952, b=13.7070, MSE≈16.53, R²≈0.105 as computed by the component — values MUST NOT be hardcoded).

#### Scenario: Snap to optimum

- GIVEN user-sliders at arbitrary values
- WHEN "Calcular mejor recta" is pressed
- THEN sliders snap to the computed optimum and metrics refresh

### Requirement: Manual Fit Sliders with Live Metrics

Sliders for m and b MUST default to the computed optimum and use data-derived ranges (m ∈ [−0.5, 1.0] step 0.005; b ∈ [0, 30] step 0.5). Moving a slider MUST redraw the line and update the live ECM and R² readouts.

#### Scenario: Live update

- GIVEN the plot rendered with sliders at optimum
- WHEN the user drags a slider
- THEN the line and ECM/R² readouts update immediately

#### Scenario: Non-linear range

- GIVEN the dataset unchanged
- WHEN computing slider ranges
- THEN the optimum falls inside both ranges

### Requirement: Residual Whiskers

The plot MUST draw residual whiskers (`error_y`) from every point to the current line.

#### Scenario: Whiskers follow the line

- GIVEN any m/b pair
- WHEN the line changes
- THEN whisker lengths recompute to the new residuals

### Requirement: Predict with Range Validation

"Predecir" MUST accept a numeric input, validate it against the dataset's X range, and show the result `m·x + b` in texture units.

#### Scenario: In-range prediction

- GIVEN a radius value within the observed range
- WHEN "Predecir" is pressed
- THEN the formula and predicted texture are displayed

#### Scenario: Out-of-range input

- GIVEN a value outside the observed X range
- WHEN "Predecir" is pressed
- THEN the value is clamped or rejected with a message, and no invalid prediction is shown

### Requirement: Reset

"Reiniciar" MUST clear any prediction and restore sliders to the optimum.

#### Scenario: Reset restores defaults

- GIVEN a modified fit and an active prediction
- WHEN "Reiniciar" is pressed
- THEN sliders return to the optimum and the prediction clears

### Requirement: Loading and Error States

The trainer MUST show a loading spinner while fetching and a visible error state with a retry action on failure.

#### Scenario: Retry recovers

- GIVEN the error state visible
- WHEN "Reintentar" is pressed
- THEN the fetch re-attempts and, on success, the plot renders

### Requirement: Citation Footer

The trainer MUST show the citation "Street, W.N., Wolberg, W.H. & Mangasarian, O.L. (1993) — Breast Cancer Wisconsin (Diagnostic), UCI Machine Learning Repository" with a link to `archive.ics.uci.edu`.

#### Scenario: Footer always visible

- GIVEN the trainer rendered successfully
- THEN the citation footer with the UCI link is displayed

### Requirement: Accessibility

Interactive controls (sliders, buttons, input) MUST have `aria-label`s; prediction output MUST be announced via `aria-live="polite"`; information MUST NOT be conveyed by color alone.

#### Scenario: Screen-reader feedback

- GIVEN the prediction computed
- WHEN the result updates
- THEN it is announced by an `aria-live` region

### Requirement: Responsive Layout

The layout MUST use a 2/3 plot + 1/3 controls grid at the `lg` breakpoint and stack on smaller screens.

#### Scenario: Stacked on mobile

- GIVEN a viewport below `lg`
- WHEN the trainer renders
- THEN plot and controls stack vertically

### Requirement: Spanish Voseo Copy

All copy MUST be Spanish voseo ("Probá", "Fijate", "Presioná", "Reiniciá", "Calcular mejor recta").

#### Scenario: Copy language

- GIVEN the trainer rendered
- THEN every label and button uses Spanish voseo

### Requirement: Component Integration

The component MUST be exported from `src/components/lesson/index.ts` AND registered in the MDX components map in `src/app/learn/[module]/[slug]/page.tsx`. `public/interactives/demo_06_regression.html` MUST be deleted, and the module README MUST count 8 demos (9→8, keeping the 6b overfitting row).

#### Scenario: MDX compiles

- GIVEN both registration points updated
- WHEN `npm run build` runs
- THEN the lesson compiles with `<RegressionTrainer />`

#### Scenario: Demo cleanup

- GIVEN the legacy iframe deleted
- WHEN the README is inspected
- THEN it lists 8 demos and keeps the overfitting row
