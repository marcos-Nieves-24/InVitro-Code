# Tasks: Complete IA Module

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 1,400–1,650 authored lines (16 new files + 2 lesson.md expansions) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (L01) → PR 2 (L02) → PR 3 (L03) → PR 4 (L04) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | L01: 4 new files (lab, assignment, references, notebook) | PR 1 | `npm run build` passes | Open L01 lesson page, verify lab/assignment render; run `jupyter nbconvert --execute notebook.ipynb` | Remove 4 files from `lesson01_what_is_ai/` — no other lesson affected |
| 2 | L02: 4 new files (lab, assignment, references, notebook) | PR 2 | `npm run build` passes | Open L02 lesson page, verify lab/assignment render; run `jupyter nbconvert --execute notebook.ipynb` | Remove 4 files from `lesson02_how_ai_learns/` — no other lesson affected |
| 3 | L03: 4 new files + lesson.md confusion matrix section | PR 3 | `npm run build` passes | Open L03 lesson page, verify new Section renders and quiz Q4 content is taught; run `jupyter nbconvert --execute notebook.ipynb` | Remove 4 files + revert lesson.md Section insertion in `lesson03_ai_in_biotech/` |
| 4 | L04: 4 new files + lesson.md CASP14/Rentosertib/Evo + interactives | PR 4 | `npm run build` passes | Open L04 lesson page, verify ≥3 MDX interactives render and quiz Q1/Q2/Q4 content is taught; run `jupyter nbconvert --execute notebook.ipynb` | Remove 4 files + revert lesson.md expansions in `lesson04_real_cases/` |

## Phase 1: Lesson 01 — What is AI

- [x] 1.1 Create `src/content/modules/ia/lessons/lesson01_what_is_ai/lab.md` — 5-part timed lab (60-90 min) using Breast Cancer Wisconsin dataset via `sklearn.datasets.load_breast_cancer()`. Parts: (1) Dataset loading & overview, (2) Feature exploration (shape, names, target distribution), (3) 2D feature scatter visualization, (4) Feature comparison benign vs malignant, (5) Summary statistics report. Follow Estadística L01 lab pattern: objective, duration, dataset, instructions per part, deliverables.
- [x] 1.2 Create `src/content/modules/ia/lessons/lesson01_what_is_ai/assignment.md` — Feature exploration assignment with 4-column rubric (Excellent/Good/Adequate/Poor). Tasks: load BCW, compute feature statistics, create visualizations, write interpretation. Follow Estadística L01 assignment pattern.
- [x] 1.3 Create `src/content/modules/ia/lessons/lesson01_what_is_ai/references.bib` — 4-5 BibTeX entries: AI textbooks (Russell & Norvig, Géron), BCW dataset paper (Wolberg et al.), scikit-learn paper (Pedregosa et al.). Follow Python L13 references.bib format.
- [x] 1.4 Create `src/content/modules/ia/lessons/lesson01_what_is_ai/notebook.ipynb` — Executable Jupyter notebook mirroring lesson.md sections. Cells: Setup (imports) → Load BCW → Explore features (shape, names, target distribution) → 2D feature scatter plot → Feature comparison table → Summary. Follow Python L13 notebook structure (markdown headers + code cells).

## Phase 2: Lesson 02 — How AI Learns

- [x] 2.1 Create `src/content/modules/ia/lessons/lesson02_how_ai_learns/lab.md` — 5-part timed lab (60-90 min). Parts: (1) Load Iris dataset (2 features for 2D), (2) Train/test split, (3) KNN with varying k on Iris, (4) Decision boundary visualization, (5) Linear regression on BCW target + overfitting demo (polynomial degrees). Use sklearn KNN, LinearRegression.
- [x] 2.2 Create `src/content/modules/ia/lessons/lesson02_how_ai_learns/assignment.md` — Train/test split + overfitting assignment with 4-column rubric. Tasks: implement KNN with k-tuning on BCW, plot train/test error vs k, identify optimal k, explain overfitting observed.
- [x] 2.3 Create `src/content/modules/ia/lessons/lesson02_how_ai_learns/references.bib` — 4-5 BibTeX entries: ISLR (James et al.), Pattern Recognition (Bishop), scikit-learn, KNN original paper (Cover & Hart 1967).
- [x] 2.4 Create `src/content/modules/ia/lessons/lesson02_how_ai_learns/notebook.ipynb` — Executable notebook. Cells: Setup → Load Iris (2 features) → Train/test split → KNN with varying k → Decision boundary plot → Linear regression on BCW → Overfitting demo (polynomial degrees) → Summary.

## Phase 3: Lesson 03 — AI in Biotech

- [x] 3.1 Expand `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md` — Insert new `<Section number={10}>` on confusion matrix between current S9 ("Pipeline real") and S10 ("Checkpoint"). Content: TP/FP/FN/TN definitions, precision, recall, F1-score with `<InteractiveTable>` worked example (conidia classification), `<ConceptCard variant="definition">` for each metric, `<ReflectionCheck>` connecting to quiz Q4. Renumber existing S10→S11, S11→S12. Max ~50 lines added.
- [x] 3.2 Create `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lab.md` — 5-part timed lab (60-90 min). Parts: (1) Confusion matrix from scratch with BCW + KNN, (2) Precision/recall/F1 computation, (3) PDB fetch via Biopython or CSV fallback for 1UBQ, (4) Parse Cα coordinates and compute distances, (5) ML pipeline summary with evaluation metrics.
- [x] 3.3 Create `src/content/modules/ia/lessons/lesson03_ai_in_biotech/assignment.md` — ML pipeline + evaluation metrics assignment with 4-column rubric. Tasks: build KNN classifier on BCW, compute confusion matrix + derived metrics, interpret results in biotech context, compare with a baseline rule-based classifier.
- [x] 3.4 Create `src/content/modules/ia/lessons/lesson03_ai_in_biotech/references.bib` — 4-5 BibTeX entries: AlphaFold paper (Jumper et al. 2021), PDB (Berman et al. 2000), structural bio textbook (Branden & Tooze), Biopython (Cock et al. 2009).
- [x] 3.5 Create `src/content/modules/ia/lessons/lesson03_ai_in_biotech/notebook.ipynb` — Executable notebook. Cells: Setup → Confusion matrix from scratch (BCW + KNN) → Precision/recall/F1 computation → PDB fetch (Biopython try/except with CSV fallback) → Parse Cα coordinates → Distance matrix → Summary.

## Phase 4: Lesson 04 — Real Cases

- [x] 4.1 Expand `src/content/modules/ia/lessons/lesson04_real_cases/lesson.md` — Three content insertions + interactives: (a) CASP14 score (92.4 GDT) as `<ConceptCard>` in existing S5 ("AlphaFold en la práctica"), (b) Rentosertib timeline (18 months to PCC) as `<CalloutInfo>` in existing S4 ("Reposicionamiento") + `<ReflectionCheck>` at transition, (c) New `<Section number={8}>` on Evo genomics model between current S7 and S8, with `<InteractiveTable>` (confusion matrix computation) and `<ComparisonTable>` (AlphaFold vs Evo vs traditional). Renumber existing S8→S9, S9→S10, S10→S11, S11→S12. Max ~80 lines added.
- [x] 4.2 Create `src/content/modules/ia/lessons/lesson04_real_cases/lab.md` — 5-part timed lab (60–90 min). Parts: (1) Load BCW and train KNN classifier, (2) Compute confusion matrix + all derived metrics, (3) Compare KNN vs LogisticRegression on same data, (4) Metrics comparison table (accuracy, precision, recall, F1 for both models), (5) End-to-end pipeline summary with model selection rationale.
- [x] 4.3 Create `src/content/modules/ia/lessons/lesson04_real_cases/assignment.md` — End-to-end pipeline assignment with 4-column rubric. Tasks: build complete classification pipeline (load → split → train → evaluate → compare), write analysis report with metrics interpretation, discuss model selection tradeoffs in biotech context.
- [x] 4.4 Create `src/content/modules/ia/lessons/lesson04_real_cases/references.bib` — 4-5 BibTeX entries: CASP14 results (Senior et al. 2020), Evo (Nguyen et al. 2024, Science), Rentosertib/Insilico Medicine (Zhavoronkov et al. 2021), drug repositioning review.
- [x] 4.5 Create `src/content/modules/ia/lessons/lesson04_real_cases/notebook.ipynb` — Executable notebook. Cells: Setup → Load BCW → Train KNN classifier → Compute confusion matrix + metrics → Train LogisticRegression → Compare models → Metrics comparison table → Summary.

## Phase 5: Verification

- [ ] 5.1 Run `npm run build` to verify lesson.md modifications (L03, L04) compile without errors.
- [ ] 5.2 Verify L03 quiz alignment: confirm lesson.md teaches confusion matrix (TP/FP/FN/TN, precision, recall, F1) before quiz Q4.
- [ ] 5.3 Verify L04 quiz alignment: confirm lesson.md covers CASP14 score (92.4), Rentosertib (18 months), and Evo (genomics model) before quiz Q1/Q2/Q4.
- [ ] 5.4 Verify L04 has ≥3 interactive MDX elements (InteractiveTable, ComparisonTable, ReflectionCheck).
- [ ] 5.5 Verify all 16 new files exist in correct directories and follow reference patterns (5-part labs, 4-column rubrics, BibTeX syntax, notebook JSON structure).
- [ ] 5.6 Run `npm run lint` to confirm no lint errors introduced.
