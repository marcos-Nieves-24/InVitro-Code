# Assignment 7: PCA

## Objectives

- Apply PCA to a high-dimensional biological dataset
- Determine optimal number of components
- Interpret components in biological terms
- Use PCA as a preprocessing step for classification

## Dataset

Use the **Breast Cancer** dataset (30 features, 569 samples).

## Scenario

You are analyzing high-dimensional patient data. You need to:
1. Reduce dimensionality for visualization
2. Determine how many dimensions capture the essential structure
3. Understand what each component represents
4. Test whether PCA improves classification performance

## Instructions

1. **Scale data** with StandardScaler
2. **Full PCA:** compute and plot explained variance; determine n for 80%, 90%, 95%, 99%
3. **Interpret components:** for PC1 and PC2, list the top 5 features by loading magnitude. What biological theme does each component represent?
4. **Classification experiment:**
   - Train a LogisticRegression on original 30 features (scaled)
   - Train LogisticRegression on PCA-reduced data (2, 5, 10 components)
   - Train LogisticRegression on PCA-reduced data (optimal n for 90%)
   - Compare test accuracies
5. **Final conclusion:** Does PCA improve or hurt classification? Why?

## Deliverables

- Notebook with all steps
- Scree plot with thresholds
- Loadings interpretation table
- Classification comparison table
- Report (max 300 words):
  - How many components did you choose and why?
  - What do the top components represent?
  - Did PCA help classification? Why or why not?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Variance analysis | Complete with multiple thresholds | Single threshold | Basic | Missing |
| Component interpretation | Meaningful biological interpretation | Clear | Vague | Missing |
| Classification experiment | Multiple PCA dims compared | One comparison | Partial | Missing |
| Conclusion | Insightful, nuanced | Clear | Basic | Missing |
| Code quality | Clean, reproducible | Readable | Messy | Does not run |

## Estimated time: 2 hours
