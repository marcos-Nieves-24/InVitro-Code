---
Module: 3
Lesson Number: 7
Lesson Title: Dimensionality Reduction (PCA)
Estimated Duration: 90 minutes
Prerequisites: Lesson 5 (Relationships)
Learning Objectives:
  - Explain the intuition behind Principal Component Analysis
  - Interpret explained variance ratios
  - Apply PCA using sklearn.decomposition.PCA
  - Visualize high-dimensional data in 2D using PCA
  - Determine the optimal number of principal components
Keywords: PCA, dimensionality reduction, explained variance, eigenvectors, scree plot, feature reduction
Difficulty: Intermediate
Programming Concepts: sklearn.decomposition.PCA, numpy, matplotlib
Mathematical Concepts: covariance matrix, eigenvalues, eigenvectors, orthogonal transformation
Machine Learning Concepts: dimensionality reduction, feature extraction, variance preservation
Datasets Used: iris, wine, digits
Notebook: 07_dimensionality_reduction.ipynb
Assignment: pca_assignment.md
Quiz: pca_quiz.md
---

# Lesson 7: Dimensionality Reduction (PCA)

## Motivation

Modern biology and SaaS generate datasets with hundreds, thousands, or even millions of features. A single RNA-seq experiment measures 20,000+ genes. A SaaS platform tracks hundreds of user metrics. Working with high-dimensional data is challenging: models overfit, computation slows down, and visualization becomes impossible. Principal Component Analysis (PCA) solves this by finding a lower-dimensional representation that preserves the most important structure in the data.

## Big Picture

This lesson builds on Lesson 5 (covariance and correlation). PCA is built directly on the covariance matrix. It connects to Lesson 8 (Clustering) — PCA is often used to visualize clusters. It also connects to Lesson 9 (Model Evaluation) — reducing dimensions can improve model performance.

## Theory

### PCA Intuition

PCA finds new axes (principal components) that capture the maximum variance in the data.

1. The first principal component (PC1) is the direction of maximum variance
2. PC2 is the direction of maximum remaining variance, orthogonal to PC1
3. And so on for PC3, PC4, ...

Think of PCA as rotating the data to align with its natural axes of variation.

### Mathematical Foundation

Given a data matrix \(X\) (centered, \(n\) samples × \(p\) features):

1. Compute the covariance matrix: \(\Sigma = \frac{1}{n} X^T X\)
2. Compute eigenvectors and eigenvalues: \(\Sigma v_i = \lambda_i v_i\)
3. Sort eigenvectors by decreasing eigenvalues
4. Project data onto top \(k\) eigenvectors: \(Z = X V_k\)

**Explained variance ratio**: \(\frac{\lambda_i}{\sum_{j=1}^{p} \lambda_j}\) — the proportion of total variance captured by each PC.

### Choosing Number of Components

- **Scree plot**: Plot eigenvalues and look for the "elbow"
- **Cumulative explained variance**: Choose enough PCs to explain 70-95% of variance
- **Kaiser criterion**: Keep components with eigenvalue > 1

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import seaborn as sns

# Load iris dataset
iris = sns.load_dataset('iris')
X = iris.drop('species', axis=1)
y = iris['species']

# Standardize (crucial for PCA)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Apply PCA
pca = PCA()
X_pca = pca.fit_transform(X_scaled)

# Explained variance
print("Explained variance ratio:", pca.explained_variance_ratio_)
print("Cumulative:", np.cumsum(pca.explained_variance_ratio_))

# Scree plot
plt.figure(figsize=(8, 4))
plt.subplot(1, 2, 1)
plt.bar(range(1, len(pca.explained_variance_ratio_) + 1),
        pca.explained_variance_ratio_, color='steelblue')
plt.plot(range(1, len(pca.explained_variance_ratio_) + 1),
         np.cumsum(pca.explained_variance_ratio_), 'ro-')
plt.xlabel('Principal Component')
plt.ylabel('Explained Variance Ratio')
plt.title('Scree Plot')

# 2D projection
plt.subplot(1, 2, 2)
species_codes = {'setosa': 'red', 'versicolor': 'blue', 'virginica': 'green'}
for species, color in species_codes.items():
    mask = y == species
    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], c=color, label=species, alpha=0.7)
plt.xlabel('PC1 ({:.1f}%)'.format(pca.explained_variance_ratio_[0] * 100))
plt.ylabel('PC2 ({:.1f}%)'.format(pca.explained_variance_ratio_[1] * 100))
plt.title('PCA of Iris Dataset')
plt.legend()
plt.tight_layout()
plt.show()

# Loadings (feature contributions to PCs)
loadings = pd.DataFrame(
    pca.components_.T,
    columns=[f'PC{i+1}' for i in range(4)],
    index=iris.columns[:4]
)
print("\nPCA Loadings (feature contributions):")
print(loadings)
```

## Walkthrough Example

PCA on the Wine dataset to distinguish wine cultivars.

```python
from sklearn.datasets import load_wine
wine = load_wine()
X = wine.data
y = wine.target
feature_names = wine.feature_names

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print(f"Explained variance (2 components): {pca.explained_variance_ratio_.sum():.3f}")

plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', alpha=0.7)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.colorbar(scatter, label='Cultivar')
plt.title('PCA of Wine Dataset')
plt.show()

# Feature contributions to PC1
loadings = pd.Series(pca.components_[0], index=feature_names)
top_features = loadings.abs().sort_values(ascending=False).head(5)
print("\nTop 5 features contributing to PC1:")
print(top_features)
```

Interpretation: The wine cultivars separate well in the first two principal components. PC1 is driven by proline, flavonoids, and OD280 (phenolic compounds).

## Biotechnology Example

PCA of gene expression data for cancer vs normal samples.

```python
np.random.seed(42)
n_genes = 1000
n_samples = 60

# Simulate gene expression
expression = np.random.randn(n_samples, n_genes)
# Create group differences
expression[:30, :50] += 1.5  # cancer group
labels = ['cancer'] * 30 + ['normal'] * 30

scaler = StandardScaler()
expr_scaled = scaler.fit_transform(expression)

pca = PCA(n_components=2)
expr_pca = pca.fit_transform(expr_scaled)

plt.figure(figsize=(8, 6))
colors = {'cancer': 'red', 'normal': 'blue'}
for label in ['cancer', 'normal']:
    mask = np.array(labels) == label
    plt.scatter(expr_pca[mask, 0], expr_pca[mask, 1], c=colors[label],
                label=label, alpha=0.7)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('PCA of Gene Expression: Cancer vs Normal')
plt.legend()
plt.show()
```

## SaaS Example

PCA of customer behavior metrics for segmentation.

```python
np.random.seed(42)
n_customers = 500
saas_features = pd.DataFrame({
    'session_frequency': np.random.poisson(15, n_customers),
    'avg_session_duration': np.random.exponential(20, n_customers),
    'pages_per_session': np.random.poisson(6, n_customers),
    'feature_usage_count': np.random.poisson(8, n_customers),
    'support_tickets': np.random.poisson(1, n_customers),
    'days_since_signup': np.random.exponential(100, n_customers),
    'revenue': np.random.exponential(30, n_customers)
})

scaler = StandardScaler()
saas_scaled = scaler.fit_transform(saas_features)

pca = PCA(n_components=3)
saas_pca = pca.fit_transform(saas_scaled)

print("Explained variance ratios:", pca.explained_variance_ratio_)
print(f"Cumulative (3 components): {pca.explained_variance_ratio_.sum():.3f}")

# 3D scatter if possible, otherwise 2D
plt.figure(figsize=(8, 6))
plt.scatter(saas_pca[:, 0], saas_pca[:, 1], alpha=0.6, c=saas_features['revenue'], cmap='viridis')
plt.colorbar(label='Revenue')
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title('PCA of SaaS Customer Metrics')
plt.show()
```

## Common Mistakes

1. **Not standardizing data before PCA**: PCA is sensitive to variable scales. Always standardize.
2. **Interpreting PCA directions as causal**: PCA finds correlational structure, not causal mechanisms.
3. **Forcing interpretation of all components**: Higher components often capture noise.
4. **Using PCA on categorical data**: PCA is designed for continuous variables.
5. **Retaining too few components**: Can discard important signal.

## Best Practices

- Always standardize (Z-score) features before PCA
- Use scree plot + cumulative variance to choose components
- Examine loadings to interpret components
- Consider domain knowledge when interpreting PCs
- Remember: PCA is unsupervised — it doesn't use labels

## Summary

- PCA finds orthogonal directions of maximum variance
- Built on eigenvalue decomposition of the covariance matrix
- Explained variance ratio tells us how much information each PC captures
- Always standardize data before PCA
- PCA is used for visualization, denoising, and preprocessing

## Key Terms

| Term | Definition |
|------|------------|
| Principal Component | New variable that captures maximum variance |
| Eigenvalue | Amount of variance captured by a PC |
| Eigenvector | Direction of a PC (loadings) |
| Explained Variance Ratio | Proportion of total variance per PC |
| Scree Plot | Plot of eigenvalues by component number |
| Loading | Contribution of original feature to a PC |

## Exercises

**Level 1: Basic Understanding**

1. Why must we standardize data before PCA? What happens if we don't?
2. If the first two PCs explain 90% of variance, what does this mean about the data?

**Level 2: Implementation**

3. Load the digits dataset from sklearn. Apply PCA and plot the first two components colored by digit label.
4. Determine the minimum number of PCs needed to explain 95% of variance in the wine dataset.

**Level 3: Critical Thinking**

5. A bioinformatician applies PCA to RNA-seq data and finds PC1 separates batches (different sequencing runs) rather than biological conditions. What does this mean? How should they proceed?
6. In a SaaS context, PC1 loads heavily on "session count" and "pages per session" with similar coefficients. How would you interpret this component?

## Coding Challenge

Write a Python script that:
1. Loads the breast cancer dataset from sklearn
2. Standardizes the features
3. Applies PCA and plots the cumulative explained variance
4. Finds the minimum number of components for 90% explained variance
5. Creates a 2D PCA plot colored by diagnosis (malignant vs benign)
6. Interprets which original features contribute most to PC1
