# Regression Lesson Content Specification

## Purpose

Re-frame Lesson 2 (§§9–10) of module `ia` from synthetic dose-response/antifungal language to the real BCW dataset (radius_mean → texture_mean) and embed `<RegressionTrainer />`, replacing the legacy iframe.

## Requirements

### Requirement: §9 Section Title

The §9 section title MUST be "Regresión lineal en acción", replacing "Regresión lineal: interactive".

#### Scenario: Title rendered

- GIVEN the lesson page rendered
- WHEN §9 is displayed
- THEN the title reads "Regresión lineal en acción"

### Requirement: §9 ReflectionCheck Re-framed to BCW

The §9 `ReflectionCheck` MUST preserve `blockId="reflection-l02-regresion"`, `moduleSlug="ia"` and `lessonSlug="lesson02_how_ai_learns"`, while its prompt and answer MUST be re-framed to the BCW relationship (radius vs texture) — MUST NOT reference drug concentration or dose-response.

#### Scenario: blockId preserved

- GIVEN the lesson source
- WHEN §9's ReflectionCheck is inspected
- THEN the blockId remains `reflection-l02-regresion` and prompt/answer discuss radio/textura

### Requirement: §9 Trainer Embedding and Body Copy

§9 MUST render `<RegressionTrainer />` in place of `<InteractiveFrame src="/interactives/demo_06_regression.html">`. The "¿Qué muestra?" and "Probá vos:" body MUST be rewritten for the BCW scatter (no class colors, no dose-response).

#### Scenario: iframe removed

- GIVEN the lesson source
- WHEN §9 is inspected
- THEN the InteractiveFrame is absent and RegressionTrainer is present

#### Scenario: Body copy updated

- GIVEN §9 rendered
- WHEN the explanatory bullets are read
- THEN they describe radio/textura and the regression model, with no antifungal references

### Requirement: Weak R² Framed as Real Noisy Data

The §9 copy MUST explicitly frame the weak fit (R²≈0.10) as "datos reales ruidosos" — texture is hard to predict from radius alone — and MUST NOT present it as a broken regression, anchoring the §10 message on regression limits.

#### Scenario: Weak-fit framing

- GIVEN §9 rendered with R²≈0.10
- WHEN the explanatory text is read
- THEN it states the low R² is expected with real noisy data

### Requirement: §10 BCW Narrative

The §10 `ReflectionCheck` (blockId preserved) prompt/answer MUST be re-framed to BCW continuous regression, and the §10 `ConceptCard` MUST define regression as predicting a continuous value (radio → textura), contrasted with classification. The section MUST NOT contain dose-response, sigmoidal, or antifungal language.

#### Scenario: ConceptCard regression vs classification

- GIVEN §10 rendered
- WHEN the ConceptCard is read
- THEN it contrasts continuous regression with classification in BCW terms

#### Scenario: No dose-response language

- GIVEN the full §10 source
- WHEN scanned for legacy terms
- THEN no dose-response, sigmoid, or antifungal references remain
