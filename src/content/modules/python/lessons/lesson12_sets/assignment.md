# Assignment: Gene Set Analysis

## Objectives

- Use sets for biological data analysis
- Implement set operations (union, intersection, difference)
- Apply Jaccard similarity for comparing sets
- Use sets for efficient membership testing

## Instructions

Create a Python script `gene_set_analysis.py` that:

1. **Gene sets**: Create at least 5 sets representing genes expressed in different tissues or experiments.

2. **Functions**:
   - `jaccard(set1, set2)` — compute Jaccard similarity
   - `common_genes(*sets)` — find genes common to all input sets
   - `unique_genes(*sets)` — find genes unique to each set (return a list of sets)
   - `gene_recommendations(known_genes, all_sets, threshold=0.5)` — given a set of known genes, find which other sets share at least `threshold` Jaccard similarity

3. **Analysis**: Print a similarity matrix showing Jaccard similarity between all pairs.

## Starter Data

```python
brain = {"BRCA1", "TP53", "EGFR", "MYC", "ALK", "GATA2", "FOXA1"}
liver = {"TP53", "KRAS", "MYC", "FOXA1", "HNF4A", "ALB", "CYP3A4"}
heart = {"BRCA1", "MYC", "GATA2", "NKX2-5", "TBX5", "MYH6", "MYH7"}
kidney = {"TP53", "EGFR", "KRAS", "GATA2", "FOXA1", "HNF4A", "UMOD"}
lung = {"BRCA1", "TP53", "EGFR", "KRAS", "ALK", "MYC", "NKX2-1"}
```

## Deliverables

- `gene_set_analysis.py` with all functions
- Output showing:
  - Jaccard similarity matrix
  - Common genes across all tissues
  - Unique genes per tissue
  - Recommendations for a given tissue

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Set Operations | All correct | Most correct | Errors |
| Functions | Well-designed, all implemented | Most implemented | Missing functions |
| Jaccard | Correct computation and matrix | Computed but not matrix | Incorrect |
| Recommendations | Working recommendation system | Basic | Not implemented |
| Code Quality | Clean, documented | Acceptable | Poor |

## Estimated Completion Time

60 minutes
