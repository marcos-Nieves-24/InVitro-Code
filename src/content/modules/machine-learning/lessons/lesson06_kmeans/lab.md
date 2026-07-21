# Lab 6: K-Means Clustering

## Objectives

- Implement K-Means with scikit-learn
- Determine optimal K using elbow and silhouette
- Understand the effect of scaling
- Apply clustering to real-world segments

## Part 1: Synthetic Data

Generate data with `make_blobs(n_samples=400, centers=5, cluster_std=0.9)`. Run K-Means with K=2 through K=10. Plot inertia and silhouette scores.

**Questions:**
- What K does the elbow suggest?
- What K does silhouette suggest?
- Do they agree?

## Part 2: Scaling Experiment

Create data where one feature has 100× the scale of another:
```python
X_unscaled = np.column_stack([np.random.randn(200) * 100, np.random.randn(200)])
```

Run K-Means (K=3) with and without StandardScaler. Plot both results side by side.

**Question:** How does scaling change the clustering?

## Part 3: Iris Clustering

Load `load_iris()`, scale features, run K-Means (K=3), and create a cross-tabulation of true species vs. cluster labels.

**Question:** Which species does K-Means confuse most often?

## Part 4: Customer Segmentation

Create synthetic customer data (n=500) with features: spending score, purchase frequency, recency. Scale, cluster, and profile each segment (mean values).

**Question:** Can you name each segment (e.g., "high-value loyal", "dormant", "new")?

## Part 5: High-Dimensional Clustering

Generate data with `make_blobs(n_samples=200, n_features=50, centers=4)`. Compute silhouette for K=2..10. Compare with 2D PCA visualization.

```python
from sklearn.decomposition import PCA
```

**Question:** Does K-Means still work well in 50 dimensions?

## Deliverables

- Notebook with all 5 parts
- Elbow + silhouette plots (Part 1)
- Scaling comparison plot (Part 2)
- Segment profiles (Part 4)

## Estimated time: 45 minutes
