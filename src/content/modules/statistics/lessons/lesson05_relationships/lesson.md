---
Module: 3
Lesson Number: 5
Lesson Title: Relationships Between Variables
Estimated Duration: 60 minutes
Prerequisites: Lesson 1 (Descriptive Statistics)
Learning Objectives:
  - Compute and interpret covariance between two variables
  - Distinguish between Pearson and Spearman correlation
  - Create and interpret a correlation matrix heatmap
  - Choose the appropriate correlation coefficient based on data characteristics
  - Identify spurious correlations
Keywords: covariance, Pearson correlation, Spearman correlation, correlation matrix, heatmap, monotonic relationship
Difficulty: Beginner
Programming Concepts: numpy, pandas, matplotlib, seaborn
Mathematical Concepts: covariance, correlation coefficient, rank correlation
Machine Learning Concepts: feature relationships, multicollinearity, feature selection
Datasets Used: iris dataset, synthetic data, penguins dataset
Notebook: 05_relationships.ipynb
Assignment: relationships_assignment.md
Quiz: relationships_quiz.md
---

# Lesson 5: Relationships Between Variables

## Motivation

In machine learning, we rarely work with isolated variables. The relationship between features — and between features and the target — determines which algorithms will work well. Two genes may be co-expressed (correlated expression levels). Customer age and subscription duration may be correlated. Understanding these relationships helps you select features, detect multicollinearity, and gain insight into the underlying system.

## Big Picture

You already know how to describe single variables (Lessons 1-2). Now you will learn to quantify relationships between pairs of variables. This is essential preparation for:
- Lesson 6 (EDA): relationships are a key part of exploration
- Lesson 7 (PCA): PCA is built on the covariance matrix
- All of Module 4: correlation informs feature selection and model choice

## Theory

### Covariance

Covariance measures how two variables vary together.

$$\text{Cov}(X, Y) = \frac{1}{n} \sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})$$

Intuition: When X is above its mean, is Y also above its mean? If yes, covariance is positive. If opposite, negative. If no pattern, near zero.

**Limitation**: Covariance depends on the scale of variables. Two variables measured in different units cannot be compared by covariance alone.

### Pearson Correlation Coefficient

$$\rho_{X,Y} = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y}$$

This normalizes covariance to a [-1, 1] scale.

- +1: perfect positive linear relationship
- 0: no linear relationship
- -1: perfect negative linear relationship

Intuition: Pearson correlation measures the strength and direction of a linear relationship. It assumes variables are approximately normally distributed and the relationship is linear.

**Assumptions**: Linearity, normality (for inference), homoscedasticity, no outliers.

### Spearman Rank Correlation

Spearman correlation uses ranks instead of raw values.

$$\rho_s = \frac{\text{Cov}(R(X), R(Y))}{\sigma_{R(X)} \sigma_{R(Y)}}$$

Where \(R(X)\) are the ranks of \(X\).

Intuition: Spearman measures monotonic relationships (not just linear). If Y consistently increases as X increases, Spearman is high, even if the relationship is curved.

**Advantages**: No normality assumption, robust to outliers, captures any monotonic trend.

### Correlation Matrix

A square matrix showing pairwise correlations between all variables.

$$R = \begin{bmatrix} 1 & \rho_{12} & \cdots & \rho_{1p} \\ \rho_{21} & 1 & \cdots & \rho_{2p} \\ \vdots & \vdots & \ddots & \vdots \\ \rho_{p1} & \rho_{p2} & \cdots & 1 \end{bmatrix}$$

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Generate data with different relationships
np.random.seed(42)
n = 200
x = np.random.normal(0, 1, n)

# Linear positive
y_linear = 2 * x + np.random.normal(0, 0.5, n)

# Nonlinear monotonic
y_nonlinear = x**3 + np.random.normal(0, 1, n)

# No relationship
y_none = np.random.normal(0, 1, n)

# Pearson vs Spearman
from scipy.stats import pearsonr, spearmanr

print("Linear relationship:")
print(f"  Pearson: {pearsonr(x, y_linear)[0]:.3f}, Spearman: {spearmanr(x, y_linear)[0]:.3f}")

print("\nNonlinear monotonic:")
print(f"  Pearson: {pearsonr(x, y_nonlinear)[0]:.3f}, Spearman: {spearmanr(x, y_nonlinear)[0]:.3f}")

print("\nNo relationship:")
print(f"  Pearson: {pearsonr(x, y_none)[0]:.3f}, Spearman: {spearmanr(x, y_none)[0]:.3f}")

# Visualize
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
axes[0].scatter(x, y_linear, alpha=0.6)
axes[0].set_title(f'Linear (Pearson={pearsonr(x, y_linear)[0]:.2f})')
axes[1].scatter(x, y_nonlinear, alpha=0.6)
axes[1].set_title(f'Nonlinear (Spearman={spearmanr(x, y_nonlinear)[0]:.2f})')
axes[2].scatter(x, y_none, alpha=0.6)
axes[2].set_title('No Relationship')
plt.tight_layout()
plt.show()
```

### Correlation Matrix with Heatmap

```python
# Load iris dataset
iris = sns.load_dataset('iris')
numeric_cols = iris.select_dtypes(include=[np.number])

# Compute correlation matrix
corr_matrix = numeric_cols.corr()

# Visualize with heatmap
plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='RdBu_r', center=0,
            square=True, linewidths=1, fmt='.2f')
plt.title('Iris Dataset - Correlation Matrix')
plt.tight_layout()
plt.show()
```

## Walkthrough Example

Analyze relationships in the penguins dataset.

```python
penguins = sns.load_dataset('penguins').dropna()

# Compute pairwise correlations
numeric_cols = penguins.select_dtypes(include=[np.number])
corr = numeric_cols.corr()
print("Correlation Matrix:")
print(corr)

# Heatmap
plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, square=True, fmt='.2f')
plt.title('Penguin Measurements - Correlation Matrix')
plt.tight_layout()
plt.show()

# Pairplot
sns.pairplot(penguins, hue='species')
plt.show()
```

Interpretation: Flipper length and body mass are highly correlated (r ≈ 0.87). Bill length and bill depth have moderate negative correlation in some species.

## Biotechnology Example

Gene co-expression analysis.

```python
np.random.seed(42)
n_genes = 1000
n_samples = 50

# Simulate gene expression matrix
expression = np.random.randn(n_samples, n_genes)
gene_names = [f'GENE_{i}' for i in range(n_genes)]
df_expr = pd.DataFrame(expression, columns=gene_names)

# Make some genes co-expressed
df_expr['GENE_0'] = df_expr['GENE_1'] * 0.9 + np.random.randn(n_samples) * 0.1
df_expr['GENE_2'] = -df_expr['GENE_3'] * 0.8 + np.random.randn(n_samples) * 0.2

# Find highly correlated gene pairs
corr_matrix = df_expr.corr()
high_corr = np.where(np.abs(corr_matrix) > 0.8)
high_corr_pairs = [(gene_names[i], gene_names[j], corr_matrix.iloc[i, j])
                   for i, j in zip(*high_corr) if i < j]
print(f"Highly correlated pairs (|r| > 0.8):")
for g1, g2, r in high_corr_pairs[:5]:
    print(f"  {g1} - {g2}: r = {r:.3f}")
```

## SaaS Example

User engagement metrics correlation.

```python
np.random.seed(42)
n_users = 500
saas_data = pd.DataFrame({
    'session_duration_min': np.random.exponential(20, n_users),
    'pages_per_session': np.random.poisson(5, n_users),
    'days_since_last_login': np.random.exponential(7, n_users),
    'support_tickets': np.random.poisson(0.5, n_users),
    'subscription_months': np.random.poisson(12, n_users)
})

plt.figure(figsize=(8, 6))
sns.heatmap(saas_data.corr(), annot=True, cmap='RdBu_r', center=0,
            square=True, fmt='.2f')
plt.title('SaaS User Metrics - Correlation Matrix')
plt.tight_layout()
plt.show()
```

## Common Mistakes

1. **Correlation ≠ causation**: High correlation does not imply one variable causes the other. Ice cream sales and drowning are correlated (both increase in summer) but not causally related.
2. **Only checking linear correlation**: Two variables can have a perfect nonlinear relationship (e.g., circle) with zero Pearson correlation.
3. **Ignoring outliers**: A single outlier can dramatically inflate or deflate Pearson correlation.
4. **Over-interpreting small correlations**: With large samples, even r = 0.05 can be statistically significant but practically meaningless.

## Best Practices

- Always visualize relationships with scatter plots alongside correlation coefficients
- Use Spearman for non-linear monotonic relationships
- Check for outliers before interpreting Pearson correlation
- Report both r and p-value when discussing statistical significance
- Use correlation matrices before building ML models to detect multicollinearity

## Summary

- Covariance measures joint variability but depends on scale
- Pearson correlation: linear relationship, [-1, 1], assumes normality
- Spearman correlation: monotonic relationship, based on ranks
- Correlation matrix summarizes all pairwise relationships
- Correlation ≠ causation
- Visualize relationships with scatter plots and heatmaps

## Key Terms

| Term | Definition |
|------|------------|
| Covariance | Measure of joint variability |
| Pearson Correlation | Linear correlation coefficient (r) |
| Spearman Correlation | Rank-based monotonic correlation |
| Correlation Matrix | Table of pairwise correlations |
| Heatmap | Visual representation of a matrix |
| Monotonic | Consistently increasing or decreasing |

## Exercises

**Level 1: Basic Understanding**

1. What is the difference between Pearson and Spearman correlation? When would you use each?
2. If two variables have a Pearson correlation of -0.9, what does this mean?

**Level 2: Implementation**

3. Load the `mpg` dataset from seaborn. Compute the Pearson and Spearman correlation between `mpg` and `horsepower`. Interpret the difference.
4. Generate a dataset where X and Y have a perfect quadratic relationship (Y = X²). Compute Pearson and Spearman correlations. Explain the results.

**Level 3: Critical Thinking**

5. In a gene expression study, you find two genes with a Pearson correlation of 0.95. What are three possible explanations? Which one is most plausible biologically?
6. A SaaS company finds that the number of support tickets and customer churn are correlated (r = 0.6). Should they conclude that support tickets cause churn? What alternative explanations exist?

## Coding Challenge

Write a Python script that:
1. Generates 5 different synthetic datasets: linear positive, linear negative, quadratic (U-shaped), exponential, and a circle
2. For each, computes and prints Pearson and Spearman correlations
3. Creates a 2×3 grid of scatter plots with the correlation coefficients in the titles
4. Writes a brief interpretation of why Pearson and Spearman differ (or agree) for each relationship
