---
Module: 4
Lesson Number: 6
Lesson Title: K-Means Clustering
Estimated Duration: 75 minutes
Prerequisites: L1 (ML Fundamentals)
Learning Objectives:
  - Explain the K-Means algorithm and its steps
  - Determine the optimal number of clusters using elbow method and silhouette score
  - Implement K-Means clustering with scikit-learn
  - Interpret cluster centers and assignments
  - Distinguish between supervised and unsupervised learning
Keywords: K-Means, clustering, elbow method, silhouette score, inertia, unsupervised learning
Difficulty: Intermediate
Programming Concepts: sklearn.cluster.KMeans, sklearn.metrics.silhouette_score
Mathematical Concepts: Euclidean distance, inertia, within-cluster sum of squares
Machine Learning Concepts: unsupervised learning, clustering, centroid
Datasets Used: make_blobs, iris (unsupervised), customer segmentation synthetic
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# K-Means Clustering

## Motivation

A biotech company has thousands of patient gene expression profiles and wants to discover new disease subtypes — without any labeled data. A SaaS company wants to group customers into segments for targeted marketing — without predefined categories. These are *clustering* problems, and K-Means is the most popular algorithm for solving them. Unlike previous lessons, there are no labels to predict; we discover hidden structure in the data.

## Big Picture

**Previous:** Random Forest (supervised — predicting labels). **This lesson:** K-Means (unsupervised — discovering groups). **Next:** PCA (unsupervised — reducing dimensions).

## Theory

### What is Clustering?

Clustering groups similar samples together. It answers: "What natural groups exist in the data?"

### K-Means Algorithm

1. Choose K (number of clusters)
2. Initialize K centroids randomly
3. **Assignment step:** assign each point to the nearest centroid
4. **Update step:** recompute centroids as mean of assigned points
5. Repeat steps 3-4 until convergence (centroids stop changing)

### Distance Metric

K-Means uses Euclidean distance:

$$d(\mathbf{x}, \boldsymbol{\mu}_k) = \sqrt{\sum_{j=1}^{p}(x_j - \mu_{kj})^2}$$

### Inertia (Within-Cluster Sum of Squares)

$$\text{Inertia} = \sum_{k=1}^{K}\sum_{i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|^2$$

Inertia measures how compact clusters are. Lower inertia → tighter clusters.

### Choosing K

**Elbow Method:** Plot inertia vs. K. Look for the "elbow" where inertia stops decreasing sharply.

**Silhouette Score:** Measures how similar a point is to its own cluster vs. other clusters. Ranges from -1 to 1. Higher is better.

$$s(i) = \frac{b(i) - a(i)}{\max\{a(i), b(i)\}}$$

Where $a(i)$ is the mean distance to other points in the same cluster, and $b(i)$ is the mean distance to points in the nearest different cluster.

## Mathematical Foundation

### K-Means as Optimization

K-Means minimizes the inertia objective:

$$\min_{\{\boldsymbol{\mu}_k\}} \sum_{k=1}^{K} \sum_{i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|^2$$

This is an NP-hard problem (exponential in K and n). The iterative algorithm finds a local minimum.

### Initialization

Random initialization can lead to different results. **K-Means++** (scikit-learn default) initializes centroids far apart to improve convergence.

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))

for i, K in enumerate([2, 3, 4, 5, 6, 8]):
    kmeans = KMeans(n_clusters=K, random_state=42, n_init=10)
    y_pred = kmeans.fit_predict(X)

    ax = axes[i // 3, i % 3]
    ax.scatter(X[:, 0], X[:, 1], c=y_pred, cmap='viridis', alpha=0.6)
    ax.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
               c='red', marker='x', s=200, linewidths=3)
    ax.set_title(f'K = {K}')
    ax.set_xlabel('Feature 1')
    ax.set_ylabel('Feature 2')

plt.tight_layout()
plt.savefig('figures/kmeans_different_k.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs

# Generate data
X, y = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

# Elbow method
inertias = []
silhouettes = []
K_range = range(2, 11)

for K in K_range:
    kmeans = KMeans(n_clusters=K, random_state=42, n_init=10)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X, kmeans.labels_))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(K_range, inertias, 'o-')
axes[0].set_xlabel('K')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')
axes[0].grid(True)

axes[1].plot(K_range, silhouettes, 'o-')
axes[1].set_xlabel('K')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Score')
axes[1].grid(True)

plt.tight_layout()
plt.savefig('figures/elbow_silhouette.png', dpi=150)
plt.show()

# Best model
best_kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
best_kmeans.fit(X)
print(f"Cluster centers:\n{best_kmeans.cluster_centers_}")
print(f"Inertia: {best_kmeans.inertia_:.2f}")
print(f"Silhouette: {silhouette_score(X, best_kmeans.labels_):.3f}")
```

## Walkthrough Example: Iris Clustering

**Problem:** Can K-Means discover the 3 Iris species without labels?

```python
from sklearn.datasets import load_iris
iris = load_iris()
X = iris.data

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)

# Compare with true labels
print(pd.crosstab(iris.target, labels, rownames=['True'], colnames=['Cluster']))
```

**Result:** K-Means recovers species reasonably well (some confusion between versicolor and virginica).

## Biotechnology Example: Gene Expression Subtypes

```python
np.random.seed(42)
n_patients, n_genes = 200, 500

# Simulate 3 disease subtypes
X_expr = np.random.randn(n_patients, n_genes)
X_expr[:70, :50] += 0.5  # Subtype 1
X_expr[70:130, 50:100] += 0.5  # Subtype 2
X_expr[130:, 100:150] += 0.5  # Subtype 3

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_expr)

# Create subtype labels
true_subtypes = np.array([0]*70 + [1]*60 + [2]*70)
print(pd.crosstab(true_subtypes, clusters, rownames=['True'], colnames=['Cluster']))
```

**Interpretation:** K-Means discovers the three subtypes, potentially revealing novel disease subgroups.

## SaaS Example: Customer Segmentation

```python
np.random.seed(42)
n_customers = 500

customers = pd.DataFrame({
    'annual_spend': np.random.exponential(1000, n_customers),
    'purchase_frequency': np.random.poisson(12, n_customers),
    'avg_order_value': np.random.normal(50, 20, n_customers),
    'tenure_months': np.random.exponential(24, n_customers),
})

scaler = StandardScaler()
X_scaled = scaler.fit_transform(customers)

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
customers['segment'] = kmeans.fit_predict(X_scaled)

# Analyze segments
segments = customers.groupby('segment').mean()
print(segments.round(1))
```

**Interpretation:** Segment 0 = high spenders with high frequency, Segment 1 = new customers, etc.

## Common Mistakes

1. **Not scaling features** — features with larger units dominate distance calculations.
2. **Assuming K is known** — always use elbow + silhouette to determine K.
3. **Interpreting clusters causally** — clusters are geometric, not necessarily biological.
4. **Using K-Means on high dimensions** — Euclidean distance loses meaning in >50 dimensions.
5. **Expecting equal-sized clusters** — K-Means tends to produce balanced clusters.

## Best Practices

- Always scale features (StandardScaler) before clustering
- Use K-Means++ initialization (default in sklearn)
- Run multiple initializations (n_init=10)
- Use elbow + silhouette together to choose K
- Try t-SNE or PCA for visualization of high-dimensional clusters

## Summary

- K-Means groups data into K clusters by minimizing inertia
- Algorithm: assign → update → repeat
- Elbow method + silhouette score choose K
- Features must be scaled
- Clustering discovers hidden structure without labels
- Useful for patient stratification, customer segmentation

## Key Terms

| Term | Definition |
|------|-----------|
| Centroid | Center of a cluster (mean of its points) |
| Inertia | Sum of squared distances from points to centroids |
| Elbow method | Choosing K where inertia improvement slows |
| Silhouette score | Measure of cluster cohesion vs. separation |
| K-Means++ | Smart centroid initialization |
| WCSS | Within-cluster sum of squares (inertia) |

## Exercises

**Level 1 — Basic:** What is the main difference between supervised and unsupervised learning? Give an example of each.

**Level 2 — Implementation:** Generate synthetic data with `make_blobs(n_samples=500, centers=5)`. Apply K-Means with K=2..10, plot elbow and silhouette curves, and determine the optimal K.

**Level 3 — Critical Thinking:** Your K-Means analysis on patient data produces 3 clusters. A doctor says cluster 2 is biologically meaningful. How would you validate whether the clusters represent real biology or just statistical artifacts?

## Coding Challenge

Write a function `optimal_k(X, max_k=10)` that computes inertia and silhouette scores for K=2..max_k and returns the optimal K according to both methods (if they agree) or reports a conflict.
