# Overfitting Lesson Content Specification

## Purpose

Re-frame Lesson 2 §11 of module `ia` from the synthetic overfitting demo to the real BCW binomial fit, embed `<OverfittingTrainer />` in place of the iframe, and rewrite the demo bullets honestly — no "función real", irreducible-error floor ≈ 0.10, fixed 50-biopsy subsample — consistent with the "datos reales ruidosos" framing of §§9–10.

## Requirements

### Requirement: §11 Section Title

The §11 section title MUST be "Overfitting en acción", replacing "Overfitting: interactive".

#### Scenario: Title rendered

- GIVEN the lesson page rendered
- WHEN §11 is displayed
- THEN the title reads "Overfitting en acción"

### Requirement: §11 ReflectionCheck Preserved

The §11 `ReflectionCheck` MUST preserve `blockId="reflection-l02-overfitting-predict"`, `moduleSlug="ia"` and `lessonSlug="lesson02_how_ai_learns"`; its hypothetical "error CERO" prompt and answer MUST remain unchanged.

#### Scenario: blockId preserved

- GIVEN the lesson source
- WHEN §11's ReflectionCheck is inspected
- THEN the blockId and slugs are unchanged

### Requirement: §11 Trainer Embedding

§11 MUST render `<OverfittingTrainer />` in place of `<InteractiveFrame src="/interactives/demo_06b_overfitting.html">`, dropping the "datos sintéticos" caption.

#### Scenario: iframe removed

- GIVEN the lesson source
- WHEN §11 is inspected
- THEN the InteractiveFrame is absent and OverfittingTrainer is present

### Requirement: Demo Bullets Rewritten Honestly

The "¿Qué muestra este demo?" bullets MUST be rewritten for real BCW data: they MUST NOT reference any "función real subyacente" (real data has no true function), MUST frame the ≈0.10 train-error floor as irreducible class overlap (radius alone cannot separate the classes), and MUST frame the small train subsample as the lab condition (50 fixed biopsies). They SHOULD explain overfitting as test error exploding by orders of magnitude while train error sits at its floor.

#### Scenario: No true-function claim

- GIVEN the rewritten bullets
- WHEN scanned for legacy terms
- THEN no "función real subyacente" or equivalent claim remains

#### Scenario: Floor framed honestly

- GIVEN the bullets rendered
- WHEN read
- THEN they state the ≈0.10 floor is irreducible class overlap, not model failure

### Requirement: §12–14 Coherence

The §12 degree table (1–2 Subajuste, 3–6 Punto óptimo, 8–15 Sobreajuste) MUST remain intact; only minor coherence wording is allowed, including a "transición (óptimo)" note for degree 7. §§13–14 MUST NOT be reworked; only minor wording preserving meaning is allowed.

#### Scenario: Table intact

- GIVEN §12 rendered
- WHEN the table is inspected
- THEN the three degree bands and diagnoses match the current table

#### Scenario: No rework of §13–14

- GIVEN the §13–14 source
- WHEN inspected
- THEN content is unchanged except permitted minor wording

### Requirement: Real-Noisy-Data Framing

The §11 intro and bullets MUST frame the noisy binomial fit as "datos reales ruidosos", consistent with the §§9–10 framing of the same BCW dataset.

#### Scenario: Consistent framing

- GIVEN §11 rendered
- WHEN the intro and bullets are read
- THEN they frame noise as expected on real data, matching §§9–10
