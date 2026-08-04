# Proposal: Complete IA Module

## Intent

Complete the "Introducción a la IA" module (4 lessons, module order 1). Each lesson has lesson.md + quiz.md but is missing lab.md, assignment.md, references.bib, and notebook.ipynb. L03/L04 quizzes test knowledge never taught in their lessons. This change creates all missing artifacts and fixes content gaps.

## Scope

### In Scope

- **16 new files**: lab.md, assignment.md, references.bib, notebook.ipynb × 4 lessons
- **L03 lesson.md expansion**: confusion matrix section (covers quiz Q4 gap)
- **L04 lesson.md expansion**: CASP14 score, Rentosertib timeline, Evo model (covers quiz Q1/Q2/Q4 gaps)
- **L04 interactives**: MDX-native components (InteractiveTable, ComparisonTable, ReflectionCheck)
- Labs: 60–90 min, sklearn/pandas/matplotlib. Assignments: rubric-based. Notebooks: executable Jupyter.

### Out of Scope

- Slides (explicitly excluded), quiz rewrites, new MDX components, platform code changes, L01/L02 lesson.md modifications

## Capabilities

### New Capabilities

None — content creation within existing lesson-reader capability.

### Modified Capabilities

None — no spec-level behavior changes.

## Approach

**Datasets**: Breast Cancer Wisconsin (L01/L02/L04, sklearn built-in), Iris (L02, sklearn), PDB structures via Biopython (L03). All real, publicly available, biotech-relevant.

**L03 expansion**: New Section on confusion matrix (TP/FP/FN/TN, precision, recall, F1) between S9 and S10.

**L04 expansion**: CASP14 score (92.4) in S5, Rentosertib (18 months to PCC) in S4, new Section on Evo genomics model after S7.

**L04 interactives**: InteractiveTable for confusion matrix computation, ComparisonTable (AlphaFold vs Evo vs traditional), ReflectionCheck at case study transitions.

**Patterns**: Follow Python L13 and Estadística L01 — 5-part timed labs, 4-column rubrics, progressive notebooks, real BibTeX references.

## Affected Areas

| Area | Impact |
|---|---|
| `ia/lessons/lesson01_what_is_ai/` | +4 files |
| `ia/lessons/lesson02_how_ai_learns/` | +4 files |
| `ia/lessons/lesson03_ai_in_biotech/` | +4 files, ~lesson.md |
| `ia/lessons/lesson04_real_cases/` | +4 files, ~lesson.md, +interactives |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Notebook execution failures | Medium | Pin versions; test with `nbconvert --execute` |
| Lesson bloat on L03/L04 | Low | Max 2–3 new Sections per lesson |
| PDB API rate limits | Low | Fallback CSV with pre-fetched data |

## Rollback Plan

Independent files per lesson — `git revert` per lesson. lesson.md expansions are additive Sections. Zero platform code risk.

## Dependencies

scikit-learn ≥ 1.3, pandas, matplotlib, numpy, Biopython (optional)

## Success Criteria

- [ ] All 4 lessons have lab.md, assignment.md, references.bib, notebook.ipynb
- [ ] Notebooks execute end-to-end (`jupyter nbconvert --execute`)
- [ ] L03 teaches confusion matrix before quiz Q4
- [ ] L04 covers CASP14, Rentosertib, Evo before quiz Q1/Q2/Q4
- [ ] L04 has ≥3 interactive MDX elements
- [ ] Content in Spanish; code in English
- [ ] `npm run build` passes
