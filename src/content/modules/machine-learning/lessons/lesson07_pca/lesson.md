---
Module: 4
Lesson Number: 7
Lesson Title: Principal Component Analysis (PCA)
Estimated Duration: 75 minutes
Prerequisites: L1 (ML Fundamentals), Module 3 (covariance, eigenvalues)
Learning Objectives:
  - Explain PCA intuition: finding directions of maximum variance
  - Apply PCA for dimensionality reduction with scikit-learn
  - Interpret explained variance ratio and cumulative variance plot
  - Use PCA for 2D visualization of high-dimensional data
  - Describe the relationship between eigenvectors and principal components
Keywords: PCA, dimensionality reduction, eigenvalues, eigenvectors, explained variance, feature extraction
Difficulty: Intermediate
Programming Concepts: sklearn.decomposition.PCA, fit_transform, explained_variance_ratio_
Mathematical Concepts: covariance matrix, eigenvalue decomposition, orthogonal projection
Machine Learning Concepts: dimensionality reduction, feature extraction, data visualization
Datasets Used: iris, breast cancer, make_blobs
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Principal Component Analysis (PCA)

## Motivation

A flow cytometer measures 50+ markers per cell. A microarray measures 20,000+ gene expression levels. High-dimensional data is everywhere in biotechnology, but humans can only visualize 2-3 dimensions. PCA reduces hundreds of dimensions to a handful while preserving the most important patterns. In SaaS, PCA helps visualize customer segments and identify hidden factors driving user behavior.

## Big Picture

**Previous:** K-Means (unsupervised — grouping). **This lesson:** PCA (unsupervised — dimensionality reduction). **Next:** Gradient Boosting (back to supervised, but with a new paradigm).

## Theory

### The Curse of Dimensionality

As dimensions increase:
- Data becomes sparse
- Distances become meaningless
- Visualization becomes impossible
- Models overfit more easily

PCA solves this by finding a lower-dimensional representation that captures most of the variance.

### PCA Intuition

PCA finds new axes (principal components) that:
1. Are directions of maximum variance in the data
2. Are orthogonal to each other (uncorrelated)
3. Capture decreasing amounts of variance

**Think of it as:** rotating the data to align with its natural axes of variation.

### Mathematical Foundation

1. **Center the data:** subtract mean from each feature
2. **Compute covariance matrix:** $\mathbf{\Sigma} = \frac{1}{n-1}\mathbf{X}^\top\mathbf{X}$
3. **Eigendecomposition:** $\mathbf{\Sigma}\mathbf{v} = \lambda\mathbf{v}$
4. **Select top K eigenvectors:** these are the principal components
5. **Project data:** $\mathbf{X}_{\text{PCA}} = \mathbf{X}\mathbf{W}$ where $\mathbf{W}$ contains top K eigenvectors

**Eigenvalues ($\lambda$):** amount of variance explained by each component
**Eigenvectors ($\mathbf{v}$):** direction of each component (feature loadings)

### Explained Variance Ratio

$$\text{Explained Variance Ratio}_k = \frac{\lambda_k}{\sum_{j=1}^{p}\lambda_j}$$

This tells us what fraction of total variance each component captures.

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

iris = load_iris()
X = iris.data

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=iris.target, cmap='viridis', alpha=0.7)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} variance)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} variance)')
plt.title('PCA of Iris Dataset (2 Components)')
plt.colorbar(scatter, label='Species')
plt.savefig('figures/pca_iris.png', dpi=150)
plt.show()

print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
print(f"Cumulative: {np.cumsum(pca.explained_variance_ratio_)}")
```

## Python Implementation

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X = StandardScaler().fit_transform(data.data)

# Full PCA
pca = PCA()
X_pca = pca.fit_transform(X)

# Explained variance
cumulative = np.cumsum(pca.explained_variance_ratio_)

plt.figure(figsize=(8, 5))
plt.bar(range(1, len(cumulative) + 1), pca.explained_variance_ratio_, alpha=0.7, label='Individual')
plt.step(range(1, len(cumulative) + 1), cumulative, where='mid', label='Cumulative')
plt.axhline(y=0.9, color='r', linestyle='--', label='90% threshold')
plt.xlabel('Principal Component')
plt.ylabel('Explained Variance Ratio')
plt.title('PCA: Explained Variance')
plt.legend()
plt.grid(True)
plt.savefig('figures/pca_variance.png', dpi=150)
plt.show()

# Number of components for 90% variance
n_90 = np.argmax(cumulative >= 0.9) + 1
print(f"Components needed for 90% variance: {n_90}")

# PCA with 2 components for visualization
pca2 = PCA(n_components=2)
X_pca2 = pca2.fit_transform(X)

plt.figure(figsize=(8, 6))
plt.scatter(X_pca2[:, 0], X_pca2[:, 1], c=data.target, cmap='RdBu', alpha=0.6)
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title(f'Breast Cancer: 2D PCA ({pca2.explained_variance_ratio_.sum():.1%} variance)')
plt.colorbar(label='Malignant')
plt.savefig('figures/pca_breast_cancer.png', dpi=150)
plt.show()
```

## Walkthrough Example: Iris PCA

**Problem:** Visualize 4D Iris data in 2D.

**Results:**
- PC1 captures ~92% of variance (mainly petal measurements)
- PC2 captures ~5% (mainly sepal measurements)
- Together: ~97% of variance in 2 dimensions

**Interpretation:** Setosa is clearly separated. Versicolor and Virginica overlap slightly but are distinguishable.

## Biotechnology Example: Gene Expression Visualization

```python
np.random.seed(42)
n_samples, n_genes = 200, 1000

X_expr = np.random.randn(n_samples, n_genes)
X_expr[:70, :50] += 0.5
X_expr[70:130, 50:100] += 0.5
X_expr[130:, 100:150] += 0.5
y_true = np.array([0]*70 + [1]*60 + [2]*70)

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_expr)

plt.figure(figsize=(8, 6))
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y_true, cmap='viridis', alpha=0.7)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('Gene Expression: PCA Visualization')
plt.colorbar(label='Subtype')
plt.show()

print(f"2 components capture {pca.explained_variance_ratio_.sum():.1%} of variance")
```

**Interpretation:** PCA reveals three distinct patient subgroups corresponding to the simulated subtypes.

## SaaS Example: User Behavior Factors

```python
np.random.seed(42)
n_users = 500

user_data = pd.DataFrame({
    'pages_per_session': np.random.poisson(4, n_users),
    'session_duration': np.random.exponential(10, n_users),
    'features_used': np.random.poisson(8, n_users),
    'support_tickets': np.random.poisson(1, n_users),
    'days_active_per_month': np.random.randint(1, 30, n_users),
    'referrals': np.random.poisson(2, n_users),
})

X_user = StandardScaler().fit_transform(user_data)
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_user)

loadings = pd.DataFrame(
    pca.components_.T,
    columns=['PC1', 'PC2', 'PC3'],
    index=user_data.columns
)
print("Component Loadings:")
print(loadings.round(3))
print(f"\nExplained variance: {pca.explained_variance_ratio_.cumsum()}")
```

**Interpretation:** PC1 might represent "engagement" (pages, duration, features), PC2 "support needs" (tickets), PC3 "growth" (referrals, days active).

## Common Mistakes

1. **Not scaling data** — features with larger variance dominate the first PC
2. **Interpreting PCA directions as causal** — components are mathematical, not biological
3. **Using PCA for feature selection** — PCA creates new features, it doesn't select original ones
4. **Assuming PCA always helps** — if signal is in low-variance directions, PCA might discard it
5. **Ignoring loadings** — always check which original features contribute to each component

## Best Practices

- Always scale data before PCA (StandardScaler)
- Use cumulative explained variance plot to choose number of components
- Look for "elbow" in the scree plot (variance vs. component number)
- For visualization, 2-3 components are usually sufficient
- Examine component loadings to interpret what each PC represents
- Consider t-SNE or UMAP for non-linear visualization if PCA fails

## Summary

- PCA finds orthogonal directions of maximum variance
- Eigenvectors = principal components; eigenvalues = variance explained
- PCA reduces dimensions while preserving structure
- Always scale data before PCA
- Use explained variance ratio to choose number of components
- PCA is essential for visualizing high-dimensional data

## Key Terms

| Term | Definition |
|------|-----------|
| Principal Component | New axis aligned with maximum variance |
| Eigenvalue | Amount of variance captured by a component |
| Eigenvector | Direction of a principal component |
| Explained variance ratio | Fraction of total variance per component |
| Loadings | Contribution of original features to each PC |
| Dimensionality reduction | Reducing number of features while preserving information |

## Exercises

**Level 1 — Basic:** If 95% of variance is captured by 3 components out of 30 original features, what does this mean?

**Level 2 — Implementation:** Apply PCA to the breast cancer dataset (30 features). Plot cumulative explained variance and determine how many components capture 95% of variance.

**Level 3 — Critical Thinking:** You apply PCA to gene expression data and PC1 separates patients by age instead of disease status. What happened? How would you fix it?

## Coding Challenge

Write a function `pca_analysis(X, n_components)` that:
1. Scales the data
2. Fits PCA
3. Returns the transformed data, explained variance ratios, and loadings
4. Prints how many components are needed for 90% variance
