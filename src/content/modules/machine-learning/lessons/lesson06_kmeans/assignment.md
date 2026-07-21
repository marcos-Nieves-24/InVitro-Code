# Assignment 6: K-Means Clustering

## Objectives

- Cluster real biological data to discover novel subtypes
- Determine optimal K using multiple metrics
- Interpret cluster profiles in biological context
- Visualize high-dimensional clusters with PCA

## Dataset

Use the **Breast Cancer** dataset from scikit-learn — but treat it as an unlabeled dataset for clustering (ignore the true labels during training, only use them for evaluation).

```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X = data.data  # No labels during training!
```

## Scenario

You are a researcher studying breast cancer heterogeneity. You believe there are molecular subtypes beyond the standard malignant/benign classification. Use K-Means to discover potential subtypes.

## Instructions

1. **Scale features** with StandardScaler
2. **Determine optimal K** using elbow, silhouette, and domain knowledge (K=2..10)
3. **Cluster with optimal K**
4. **Visualize clusters** using PCA (2D scatter with cluster colors)
5. **Profile clusters** — compute mean of each feature for each cluster
6. **Compare with true labels** — create a cross-tabulation. Did K-Means recover the malignant/benign split? Or discover something different?
7. **Interpret** — what distinguishes each cluster clinically?

## Deliverables

- Notebook with all steps
- Elbow + silhouette plots
- PCA visualization of clusters
- Cluster profile table (mean feature values per cluster)
- Cross-tabulation of clusters vs. true diagnosis
- Report (max 300 words):
  - What is the optimal K and why?
  - Did clusters align with malignant/benign?
  - What biological hypothesis would you propose?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| K selection | Elbow + silhouette + justification | One method | No method | Missing |
| Cluster profiling | Mean features + interpretation | Mean features | Basic | Missing |
| Visualization | PCA plot with clear clusters | PCA plot | Basic plot | Missing |
| Biological interpretation | Insightful hypothesis | Clear | Vague | Missing |
| Code quality | Clean, well-documented | Readable | Messy | Does not run |

## Estimated time: 2 hours
