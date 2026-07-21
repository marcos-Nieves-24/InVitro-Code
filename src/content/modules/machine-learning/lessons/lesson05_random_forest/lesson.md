---
Module: 4
Lesson Number: 5
Lesson Title: Random Forest
Estimated Duration: 75 minutes
Prerequisites: L4 (Decision Trees)
Learning Objectives:
  - Explain how bagging reduces variance in ensemble models
  - Train and evaluate Random Forest classifiers with scikit-learn
  - Compute and interpret feature importance from Random Forests
  - Compare Random Forest performance to single decision trees
  - Tune Random Forest hyperparameters
Keywords: random forest, ensemble, bagging, bootstrap, feature importance, out-of-bag
Difficulty: Intermediate
Programming Concepts: sklearn.ensemble.RandomForestClassifier, n_estimators, oob_score
Mathematical Concepts: bagging, bootstrap sampling, majority voting
Machine Learning Concepts: ensemble learning, variance reduction, feature importance
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Random Forest

## Motivation

A single decision tree overfits easily and is unstable — small data changes produce very different trees. But if you ask 100 doctors to diagnose a patient and take a vote, the collective diagnosis is more reliable than any single doctor. This is the core idea of Random Forest: build many trees and average their predictions. Random Forest is one of the most widely used algorithms in both biotech (genomics, drug discovery) and SaaS (fraud detection, churn prediction).

## Big Picture

**Previous:** Decision Trees were interpretable but unstable. **This lesson:** Random Forests solve instability by averaging many trees. **Next:** K-Means Clustering — moving from supervised to unsupervised learning.

## Theory

### Ensemble Learning

Ensemble methods combine multiple models to produce better predictions. The key insight: diverse models make different errors, and averaging reduces those errors.

### Bagging (Bootstrap Aggregating)

1. Create $B$ bootstrap samples (samples with replacement) from training data
2. Train a decision tree on each bootstrap sample
3. Average predictions (regression) or majority vote (classification)

**Why it works:** Each tree has high variance but low bias. Averaging $B$ trees reduces variance by approximately $1/B$ without increasing bias.

### Random Forest = Bagging + Feature Randomness

Random Forest adds an extra source of diversity: at each split, only a random subset of features is considered. This decorrelates the trees further.

- For classification: typically $\sqrt{p}$ features
- For regression: typically $p/3$ features

### Out-of-Bag (OOB) Evaluation

Each bootstrap sample excludes ~37% of samples. These out-of-bag samples can be used as a built-in validation set without needing a separate train/validation split.

### Feature Importance

Random Forest provides two types:

1. **Impurity-based importance:** sum of impurity reduction across all splits for each feature
2. **Permutation importance:** decrease in model performance when a feature's values are shuffled

## Mathematical Foundation

### Bootstrap Variance Reduction

Let $\hat{f}_b(x)$ be the prediction from tree $b$. The ensemble prediction:

$$\hat{f}_{\text{rf}}(x) = \frac{1}{B}\sum_{b=1}^{B} \hat{f}_b(x)$$

If each tree has variance $\sigma^2$ and pairwise correlation $\rho$:

$$\text{Var}(\hat{f}_{\text{rf}}) = \rho\sigma^2 + \frac{1-\rho}{B}\sigma^2$$

As $B \to \infty$, variance approaches $\rho\sigma^2$. Feature randomness reduces $\rho$, making the ensemble more effective.

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import make_classification

X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                            n_clusters_per_class=1, class_sep=0.8, random_state=42)

tree = DecisionTreeClassifier(random_state=42)
forest = RandomForestClassifier(n_estimators=100, random_state=42)

tree.fit(X, y)
forest.fit(X, y)

xx, yy = np.meshgrid(np.linspace(X[:,0].min()-0.5, X[:,0].max()+0.5, 100),
                     np.linspace(X[:,1].min()-0.5, X[:,1].max()+0.5, 100))

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
for ax, model, title in zip(axes, [tree, forest], ['Single Tree', 'Random Forest (100 trees)']):
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=0.3, cmap='RdBu')
    ax.scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', edgecolors='k', alpha=0.7)
    ax.set_title(title)
plt.tight_layout()
plt.savefig('figures/tree_vs_forest_boundary.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Compare tree vs. forest
tree = DecisionTreeClassifier(max_depth=5, random_state=42)
forest = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)

for name, model in [('Single Tree', tree), ('Random Forest', forest)]:
    model.fit(X_train, y_train)
    print(f"{name}:")
    print(f"  Train: {accuracy_score(y_train, model.predict(X_train)):.3f}")
    print(f"  Test:  {accuracy_score(y_test, model.predict(X_test)):.3f}")

# Feature importance
importance = pd.DataFrame({
    'feature': data.feature_names,
    'importance': forest.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 5 features:")
print(importance.head(5).to_string(index=False))
```

## Walkthrough Example: Breast Cancer with Random Forest

**Comparing tree vs. forest:**
- Single tree (depth 5): Test ~93%
- Random Forest (100 trees, depth 5): Test ~97%

**Why?** The forest averages many trees, reducing variance. Some trees might overfit specific patterns, but the majority vote corrects individual errors.

**OOB score:** ~95% — close to test score, confirming OOB is a reliable validation proxy.

## Biotechnology Example: Gene Expression Classification

```python
np.random.seed(42)
n_samples, n_genes = 300, 1000

X_expr = np.random.randn(n_samples, n_genes)
y_type = (X_expr[:, 0] * 0.5 + X_expr[:, 50] * 0.3 - X_expr[:, 200] * 0.4 > 0).astype(int)

X_tr, X_te, y_tr, y_te = train_test_split(X_expr, y_type, test_size=0.3)

rf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
rf.fit(X_tr, y_tr)

print(f"Test accuracy: {accuracy_score(y_te, rf.predict(X_te)):.3f}")

# Top predictive genes
gene_importance = pd.DataFrame({
    'gene': [f'GENE_{i}' for i in range(n_genes)],
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False).head(10)
print(gene_importance.to_string(index=False))
```

**Interpretation:** The model identifies gene 0, 50, and 200 as most predictive — matching the synthetic data generation.

## SaaS Example: Fraud Detection

```python
np.random.seed(42)
n = 2000

fraud_data = pd.DataFrame({
    'transaction_amount': np.random.exponential(100, n),
    'distance_from_home': np.random.exponential(50, n),
    'hour_of_day': np.random.randint(0, 24, n),
    'num_previous_transactions': np.random.poisson(20, n),
    'is_new_device': np.random.binomial(1, 0.1, n),
})

fraud_prob = (
    0.001 * fraud_data['transaction_amount']
    + 0.002 * fraud_data['distance_from_home']
    + 0.02 * (fraud_data['hour_of_day'] < 6)
    + 0.1 * fraud_data['is_new_device']
    + np.random.normal(0, 0.05, n)
)
fraud_data['is_fraud'] = (fraud_prob > 0.15).astype(int)

X_f = fraud_data.drop('is_fraud', axis=1)
y_f = fraud_data['is_fraud']

rf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
rf.fit(X_f, y_f)

print(f"Recall: {recall_score(y_f, rf.predict(X_f)):.3f}")
print(f"Precision: {precision_score(y_f, rf.predict(X_f)):.3f}")
```

## Common Mistakes

1. **Too few trees** — start with 100, increase until OOB error stabilizes.
2. **No depth limit** — even in forests, very deep trees can overfit on small datasets.
3. **Ignoring class_weight** — for imbalanced data, set `class_weight='balanced'`.
4. **Using impurity importance blindly** — for high-cardinality features, permutation importance is more reliable.

## Best Practices

- Use OOB score as a free validation metric
- Start with `n_estimators=100` and increase until OOB error plateaus
- Limit `max_depth` or set `min_samples_leaf` to control tree complexity
- Compare with a single tree to measure ensemble benefit
- Use permutation importance for final feature selection

## Summary

- Random Forest averages many trees to reduce variance
- Bagging creates diverse trees via bootstrap sampling
- Feature randomness decorrelates trees further
- OOB evaluation provides free validation
- Feature importance identifies key predictors
- RF is robust, accurate, and widely applicable

## Key Terms

| Term | Definition |
|------|-----------|
| Ensemble | Combining multiple models |
| Bagging | Bootstrap + Aggregation |
| Bootstrap | Sampling with replacement |
| OOB | Out-of-bag samples for validation |
| Feature importance | Measure of each feature's contribution |
| n_estimators | Number of trees in the forest |

## Exercises

**Level 1 — Basic:** Explain why bagging reduces variance compared to a single tree.

**Level 2 — Implementation:** Train a Random Forest on the breast cancer dataset with `n_estimators=[10, 50, 100, 200]`. Plot OOB score vs. n_estimators. At what point do returns diminish?

**Level 3 — Critical Thinking:** Your Random Forest achieves 99.5% training accuracy but 88% test accuracy. The single tree achieves 94% training and 90% test. What is happening and how would you fix the forest?

## Coding Challenge

Write a function `tune_random_forest(X_train, y_train, X_val, y_val)` that performs a grid search over `n_estimators` (50, 100, 200) and `max_depth` (3, 5, 10, None) and returns the best model and its validation accuracy.
