# Design: Complete IA Module

## Technical Approach

Content-only change: create 16 new files (lab.md, assignment.md, references.bib, notebook.ipynb × 4 lessons) and expand 2 lesson.md files (L03, L04) to close quiz-knowledge gaps. Zero platform code changes. Follow established patterns from Python L13 and Estadística L01.

## Architecture Decisions

### Decision: Notebook structure — progressive executable cells

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Single monolithic notebook | Simple but hard to navigate | ✗ |
| Sectioned with markdown headers + code cells | Matches lesson flow, executable end-to-end | ✓ |

**Rationale**: Reference notebooks (Python L13, Estadística L01) use markdown headers per topic with interleaved code cells. Follow this pattern. Each notebook mirrors its lesson.md sections.

### Decision: Lab format — 5-part timed structure

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Open-ended exercises | Flexible but no time guidance | ✗ |
| 5 timed parts (10-20 min each) | Structured, matches references | ✓ |

**Rationale**: Both reference labs use 5-part structure with per-part timing. Total 60-90 min. Each part has starter code + deliverable.

### Decision: Assignment rubric — 4-column format

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Simple point list | Easy but vague | ✗ |
| 4-column rubric (Excellent/Good/Adequate/Poor) | Clear expectations, matches Estadística L01 | ✓ |

### Decision: L04 interactives — MDX-native components only

| Option | Tradeoff | Decision |
|--------|----------|----------|
| InteractiveFrame HTML demos | Rich but requires new HTML files (out of scope) | ✗ |
| MDX-native: InteractiveTable, ComparisonTable, ReflectionCheck | Uses existing components, no new platform code | ✓ |

**Rationale**: Proposal explicitly excludes new platform code. Existing components (`InteractiveTable`, `ComparisonTable`, `ReflectionCheck`) are sufficient.

### Decision: PDB fallback — pre-fetched CSV

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Live Biopython fetch only | Real but fragile (network, rate limits) | ✗ |
| Try Biopython, fallback to bundled CSV | Robust, works offline | ✓ |

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `ia/lessons/lesson01_what_is_ai/lab.md` | Create | 5-part lab: Breast Cancer Wisconsin EDA |
| `ia/lessons/lesson01_what_is_ai/assignment.md` | Create | Feature exploration assignment, 4-col rubric |
| `ia/lessons/lesson01_what_is_ai/references.bib` | Create | 4-5 BibTeX entries (AI textbooks, BCW dataset) |
| `ia/lessons/lesson01_what_is_ai/notebook.ipynb` | Create | Executable: features, scatter plots, BCW stats |
| `ia/lessons/lesson02_how_ai_learns/lab.md` | Create | 5-part lab: KNN, decision boundary, regression |
| `ia/lessons/lesson02_how_ai_learns/assignment.md` | Create | Train/test split + overfitting assignment |
| `ia/lessons/lesson02_how_ai_learns/references.bib` | Create | 4-5 BibTeX entries (ML textbooks, ISLR) |
| `ia/lessons/lesson02_how_ai_learns/notebook.ipynb` | Create | Executable: sklearn KNN, LinearRegression, Iris |
| `ia/lessons/lesson03_ai_in_biotech/lab.md` | Create | 5-part lab: confusion matrix, PDB fetch, pipeline |
| `ia/lessons/lesson03_ai_in_biotech/assignment.md` | Create | ML pipeline + evaluation metrics assignment |
| `ia/lessons/lesson03_ai_in_biotech/references.bib` | Create | 4-5 BibTeX entries (AlphaFold, PDB, structural bio) |
| `ia/lessons/lesson03_ai_in_biotech/notebook.ipynb` | Create | Executable: confusion matrix, PDB, classification |
| `ia/lessons/lesson03_ai_in_biotech/lesson.md` | Modify | Add confusion matrix Section between S9 and S10 |
| `ia/lessons/lesson04_real_cases/lab.md` | Create | 5-part lab: BCW classification + evaluation |
| `ia/lessons/lesson04_real_cases/assignment.md` | Create | End-to-end pipeline assignment |
| `ia/lessons/lesson04_real_cases/references.bib` | Create | 4-5 BibTeX entries (CASP14, Evo, drug repos.) |
| `ia/lessons/lesson04_real_cases/notebook.ipynb` | Create | Executable: full pipeline, metrics comparison |
| `ia/lessons/lesson04_real_cases/lesson.md` | Modify | Add CASP14, Rentosertib, Evo content + interactives |

## Lesson Expansion Design

### L03: Confusion Matrix Section

**Insert**: New `<Section number={10}>` between current S9 ("Pipeline real") and S10 ("Checkpoint"). Renumber existing S10→S11, S11→S12.

**Content**: TP/FP/FN/TN definitions, precision, recall, F1-score. Use `<InteractiveTable>` with a worked example (conidia classification results). Use `<ConceptCard variant="definition">` for each metric. Use `<ReflectionCheck>` to connect to quiz Q4.

**Max addition**: ~50 lines.

### L04: Three Content Expansions

1. **CASP14 score (92.4)**: Insert into existing S5 ("AlphaFold en la práctica") — add `<ConceptCard>` with CASP14 context and GDT score comparison table.

2. **Rentosertib timeline (18 months to PCC)**: Insert into existing S4 ("Reposicionamiento") — add `<CalloutInfo>` with the Insilico Medicine timeline alongside existing Baricitinib/Remdesivir examples.

3. **Evo genomic model**: New `<Section number={8}>` between current S7 ("IA en el laboratorio del futuro") and S8 ("Limitaciones"). Renumber S8→S9, S9→S10, S10→S11, S11→S12. Content: Evo as a foundational model for genomics, comparison with AlphaFold.

4. **L04 Interactives** (≥3 MDX elements):
   - `<InteractiveTable>`: Confusion matrix computation table in new Evo section
   - `<ComparisonTable>`: AlphaFold vs Evo vs traditional methods (3-column comparison using feature/left/right)
   - `<ReflectionCheck>`: At Rentosertib case study transition

**Max addition**: ~80 lines + renumbering.

## Dataset Strategy

| Dataset | Lessons | Source | Exercises |
|---------|---------|--------|-----------|
| Breast Cancer Wisconsin | L01, L02, L04 | `sklearn.datasets.load_breast_cancer()` | Feature exploration (L01), KNN classification (L02), full pipeline + metrics (L04) |
| Iris | L02 | `sklearn.datasets.load_iris()` | Decision boundary visualization, KNN with k tuning |
| PDB structures | L03 | Biopython `Bio.PDB` + fallback CSV | Fetch 1UBQ (ubiquitin), parse coordinates, compute distances |

**PDB fallback**: If `Bio.PDB` fetch fails, notebook includes a pre-computed CSV with Cα coordinates for 1UBQ (76 residues). Code cell checks network and switches automatically.

## Notebook Design (per lesson)

### L01 Notebook: "What is AI?"
1. Setup (imports) → 2. Load BCW dataset → 3. Explore features (shape, names, target distribution) → 4. Visualize 2D feature scatter → 5. Feature comparison table → 6. Summary

### L02 Notebook: "How AI Learns"
1. Setup → 2. Load Iris (2 features for 2D) → 3. Train/test split → 4. KNN with varying k → 5. Decision boundary plot → 6. Linear regression on BCW target → 7. Overfitting demo (polynomial degrees) → 8. Summary

### L03 Notebook: "AI in Biotech"
1. Setup → 2. Confusion matrix from scratch (BCW + KNN) → 3. Precision/recall/F1 computation → 4. PDB fetch (Biopython or CSV fallback) → 5. Parse Cα coordinates → 6. Distance matrix → 7. Summary

### L04 Notebook: "Real Cases"
1. Setup → 2. Load BCW → 3. Train KNN classifier → 4. Compute confusion matrix + metrics → 5. Compare multiple models (KNN, LogisticRegression) → 6. Metrics comparison table → 7. Summary

## Quality Gates

| Gate | Method |
|------|--------|
| Notebooks execute | `jupyter nbconvert --execute --to notebook` per notebook |
| Build passes | `npm run build` after lesson.md modifications |
| Spanish content | Manual review — all prose in Spanish, code in English |
| Quiz alignment | Verify L03 lesson teaches confusion matrix before quiz Q4; L04 teaches CASP14/Rentosertib/Evo before quiz Q1/Q2/Q4 |
| BibTeX valid | Parse with `bibtexparser` or manual syntax check |

## Dependencies

```
scikit-learn >= 1.3
pandas >= 2.0
matplotlib >= 3.7
numpy >= 1.24
biopython >= 1.81  (optional — L03 only, CSV fallback)
jupyter/nbconvert  (for execution verification only)
```

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. All files are additive. Lesson.md expansions are additive Sections with renumbering only. `git revert` per lesson for rollback.

## Open Questions

None.
