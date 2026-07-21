---
Module: 3
Lesson Number: 8
Lesson Title: Clustering (K-Means)
Estimated Duration: 90 minutes
Prerequisites: Lesson 1 (Descriptive Statistics), Lesson 5 (Relationships)
Learning Objectives:
  - Explain the K-Means clustering algorithm and its intuition
  - Determine the optimal number of clusters using the elbow method and silhouette score
  - Implement K-Means clustering using sklearn.cluster.KMeans
  - Visualize clustering results with PCA
  - Interpret cluster characteristics
Keywords: K-Means, clustering, elbow method, silhouette score, unsupervised learning, centroid
Difficulty: Intermediate
Programming Concepts: sklearn.cluster.KMeans, numpy, pandas, matplotlib
Mathematical Concepts: Euclidean distance, inertia, within-cluster sum of squares
Machine Learning Concepts: unsupervised learning, clustering, segmentation
Datasets Used: iris, penguins, mall customers (synthetic)
Notebook: 08_clustering.ipynb
Assignment: clustering_assignment.md
Quiz: clustering_quiz.md
---

# Lesson 8: Clustering (K-Means)

## Motivation

Not all data comes with labels. In many real-world scenarios — customer segmentation, gene expression analysis, image compression — we need to discover groups within the data without prior knowledge. Clustering algorithms find these groups automatically. K-Means is the most widely used clustering algorithm due to its simplicity, speed, and interpretability.

In biotechnology, clustering identifies patient subgroups with similar molecular profiles (precision medicine). In SaaS, clustering segments users for targeted marketing and personalized experiences.

## Big Picture

This lesson introduces unsupervised learning, a core ML paradigm. It builds on descriptive statistics (Lesson 1 — distances) and relationships (Lesson 5 — similarity). It connects to Lesson 7 (PCA), which is often used to visualize clusters. K-Means will reappear in Module 4 as an unsupervised learning algorithm.

## Theory

### K-Means Algorithm

**Goal**: Partition \(n\) observations into \(k\) clusters, where each observation belongs to the cluster with the nearest centroid.

**Algorithm**:
1. Initialize \(k\) centroids (randomly or with k-means++)
2. Assign each point to the nearest centroid
3. Recompute centroids as the mean of assigned points
4. Repeat steps 2-3 until convergence

**Objective (Inertia)**: Minimize the within-cluster sum of squares:

$$\text{Inertia} = \sum_{i=1}^{k} \sum_{x \in C_i} \| x - \mu_i \|^2$$

Where \(\mu_i\) is the centroid of cluster \(C_i\).

Intuition: K-Means finds circular clusters of similar size. Points within a cluster are close to each other and to their centroid.

### Choosing k: Elbow Method

Plot inertia vs k. The "elbow" (where the curve flattens) suggests the optimal k.

Intuition: Adding more clusters always reduces inertia, but after the optimal k, the improvement becomes marginal.

### Choosing k: Silhouette Score

For each point, the silhouette score measures how similar it is to its own cluster vs other clusters:

$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$

Where \(a(i)\) is the average distance to points in the same cluster, and \(b(i)\) is the average distance to points in the nearest different cluster.

- Silhouette ranges from [-1, 1]
- > 0.5: Good clustering
- > 0.25: Reasonable structure
- < 0: Points may be in wrong cluster

### K-Means++ Initialization

Smart centroid initialization that spreads initial centroids apart, improving convergence and results. Default in sklearn.

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import seaborn as sns

# Load data
iris = sns.load_dataset('iris')
X = iris.drop('species', axis=1)

# Standardize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Elbow method
inertias = []
silhouettes = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels))

# Plot
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('Number of Clusters (k)')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')
axes[0].axvline(3, color='red', linestyle='--', alpha=0.5)

axes[1].plot(K_range, silhouettes, 'ro-')
axes[1].set_xlabel('Number of Clusters (k)')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Analysis')
axes[1].axvline(3, color='blue', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()

# Apply K-Means with optimal k
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
iris['cluster'] = kmeans.fit_predict(X_scaled)

# Compare with true labels
cross_tab = pd.crosstab(iris['species'], iris['cluster'])
print("Cross-tabulation (Species vs Cluster):")
print(cross_tab)

# Visualize clusters using PCA
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=iris['cluster'],
                      cmap='viridis', alpha=0.7)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            c='red', marker='X', s=200, label='Centroids')
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title('K-Means Clusters (Iris Dataset)')
plt.legend()
plt.show()
```

## Walkthrough Example

Customer segmentation for a retail business.

```python
from sklearn.datasets import make_blobs

# Generate synthetic customer data
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=1.5, random_state=42)
customer_df = pd.DataFrame(X, columns=['annual_income', 'spending_score'])

# Determine optimal k
inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

plt.figure(figsize=(8, 4))
plt.plot(range(1, 11), inertias, 'bo-')
plt.axvline(4, color='red', linestyle='--')
plt.xlabel('k')
plt.ylabel('Inertia')
plt.title('Elbow Method for Customer Segmentation')
plt.show()

# Apply K-Means
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
customer_df['segment'] = kmeans.fit_predict(X)

plt.figure(figsize=(8, 6))
plt.scatter(X[:, 0], X[:, 1], c=customer_df['segment'], cmap='viridis', alpha=0.7)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            c='red', marker='X', s=200)
plt.xlabel('Annual Income')
plt.ylabel('Spending Score')
plt.title('Customer Segments')
plt.show()

# Segment profiles
print("\nSegment Profiles:")
print(customer_df.groupby('segment').mean())
```

Interpretation: Four customer segments emerge: high-income high-spenders, high-income low-spenders, low-income high-spenders, and low-income low-spenders.

## Biotechnology Example

Clustering patient gene expression profiles.

```python
np.random.seed(42)
n_patients = 100
n_genes = 50

expression = np.random.randn(n_patients, n_genes)
# Create 3 subtypes
expression[:30, :20] += 2  # Subtype A
expression[30:65, 20:35] -= 1.5  # Subtype B
expression[65:, 35:] += 1  # Subtype C

true_subtypes = ['A'] * 30 + ['B'] * 35 + ['C'] * 35

# PCA + K-Means
pca = PCA(n_components=10)
expr_pca = pca.fit_transform(expression)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
predicted_clusters = kmeans.fit_predict(expr_pca)

# Visualize
pca_2d = PCA(n_components=2)
expr_2d = pca_2d.fit_transform(expression)

plt.figure(figsize=(8, 6))
plt.scatter(expr_2d[:, 0], expr_2d[:, 1], c=predicted_clusters, cmap='viridis', alpha=0.7)
plt.title('Patient Clusters Based on Gene Expression')
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.show()

# Evaluate vs true labels
from sklearn.metrics import adjusted_rand_score
print(f"Adjusted Rand Index: {adjusted_rand_score(true_subtypes, predicted_clusters):.3f}")
```

## SaaS Example

User behavior segmentation.

```python
np.random.seed(42)
n_users = 1000
user_data = pd.DataFrame({
    'avg_session_min': np.random.exponential(15, n_users),
    'logins_per_week': np.random.poisson(4, n_users),
    'features_used': np.random.poisson(6, n_users),
    'support_tickets': np.random.poisson(0.5, n_users)
})

scaler = StandardScaler()
user_scaled = scaler.fit_transform(user_data)

# Find optimal k
sil_scores = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(user_scaled)
    sil_scores.append(silhouette_score(user_scaled, labels))

optimal_k = range(2, 9)[np.argmax(sil_scores)]
print(f"Optimal k (silhouette): {optimal_k}")

kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
user_data['segment'] = kmeans.fit_predict(user_scaled)

print("\nSegment Profiles:")
print(user_data.groupby('segment').describe().round(1))
```

## Common Mistakes

1. **Not standardizing features**: K-Means uses Euclidean distance; features on larger scales dominate.
2. **Assuming k is known**: Always validate k with elbow method and silhouette score.
3. **Using K-Means for non-spherical clusters**: K-Means finds circular clusters. Use DBSCAN for arbitrary shapes.
4. **Interpreting clusters without domain validation**: Clusters are mathematical constructs — verify they make sense.
5. **Running K-Means once**: Results depend on initialization; use `n_init=10` and set `random_state`.

## Best Practices

- Always standardize features before clustering
- Use k-means++ initialization (default in sklearn)
- Validate k with both elbow and silhouette methods
- Visualize clusters with PCA
- Profile each cluster to understand its characteristics
- Run K-Means multiple times with different seeds

## Summary

- K-Means partitions data into k groups based on Euclidean distance to centroids
- Elbow method plots inertia vs k to find optimal k
- Silhouette score measures cluster quality (-1 to 1)
- Always standardize data before K-Means
- K-Means works best for spherical, well-separated clusters

## Key Terms

| Term | Definition |
|------|------------|
| K-Means | Partition-based clustering algorithm |
| Centroid | Center of a cluster (mean of assigned points) |
| Inertia | Sum of squared distances from points to their centroid |
| Elbow Method | Technique to find k by locating bend in inertia curve |
| Silhouette Score | Measure of cluster cohesion and separation |
| K-Means++ | Smart centroid initialization method |
| Unsupervised Learning | Learning without labeled data |

## Exercises

**Level 1: Basic Understanding**

1. Explain the K-Means algorithm in 3 steps.
2. What does a silhouette score of -0.1 mean? What about 0.7?

**Level 2: Implementation**

3. Load the penguins dataset, standardize numeric features, and apply K-Means with k=3. Compare cluster assignments with actual species using a cross-tabulation.
4. For the iris dataset, compute silhouette scores for k=2 through k=8. Which k is optimal?

**Level 3: Critical Thinking**

5. A bioinformatician applies K-Means to single-cell RNA-seq data and gets clusters that don't match known cell types. What could explain this? Suggest three diagnostic checks.
6. Why does K-Means fail on data with elongated or irregularly shaped clusters? What alternative algorithm would work better?

## Coding Challenge

Write a Python script that:
1. Generates synthetic data with `make_blobs` (4 centers, different standard deviations)
2. Tests k = 2 through k = 8 using both elbow method and silhouette score
3. Plots both metrics side by side
4. Applies K-Means with the optimal k
5. Visualizes the clusters (use PCA if more than 2 features)
6. Prints the centroid coordinates and cluster sizes
7. Creates a profile table showing mean feature values per cluster
