---
Module: 4
Lesson Number: 8
Lesson Title: Gradient Boosting
Estimated Duration: 90 minutes
Prerequisites: L4 (Decision Trees), L5 (Random Forest)
Learning Objectives:
  - Explain the boosting paradigm and how it differs from bagging
  - Describe the Gradient Boosting algorithm
  - Train Gradient Boosting models with scikit-learn
  - Tune hyperparameters: learning rate, n_estimators, max_depth
  - Describe how XGBoost and LightGBM improve upon basic gradient boosting
Keywords: boosting, gradient boosting, XGBoost, LightGBM, learning rate, additive model, residual
Difficulty: Advanced
Programming Concepts: sklearn.ensemble.GradientBoostingClassifier, learning_rate, early_stopping
Mathematical Concepts: gradient descent in function space, additive modeling
Machine Learning Concepts: boosting, weak learners, sequential ensemble
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Gradient Boosting

## Motivation

Random Forest builds many trees independently and averages them. Gradient Boosting builds trees *sequentially*, where each new tree focuses on the mistakes of the previous ones. Like a student who learns from errors, boosting creates a powerful ensemble from simple trees. Gradient Boosting and its optimized variants (XGBoost, LightGBM) dominate ML competitions and are widely used in biotech (drug discovery, genomics) and SaaS (click-through rate prediction, ranking).

## Big Picture

**Previous:** Random Forest (parallel ensemble — bagging). **This lesson:** Gradient Boosting (sequential ensemble — boosting). **Next:** Model Interpretation — understanding what your model learned.

## Theory

### Boosting Intuition

Instead of training trees independently, boosting trains them sequentially. Each new tree tries to correct the errors of the previous ensemble.

**Analogy:** If you ask 100 people to guess the weight of an object independently (bagging), you get 100 independent estimates. If you ask person 1, then show their error to person 2, then show the combined error to person 3 (boosting), each subsequent person focuses on harder cases.

### Gradient Boosting Algorithm

1. Start with a simple model (e.g., predict the mean)
2. Compute residuals (errors) of the current model
3. Train a shallow tree to predict the residuals
4. Add the tree's predictions (scaled by learning rate) to the ensemble
5. Repeat steps 2-4 for M iterations

**Key insight:** Training on residuals is equivalent to gradient descent in function space.

### Mathematical Foundation

The model is an additive ensemble:

$$F_M(x) = \sum_{m=1}^{M} \gamma_m h_m(x)$$

At step $m$, we fit $h_m$ to the negative gradient of the loss function with respect to the current prediction:

$$h_m \approx \arg\min_h \sum_{i=1}^{n} \left[ -\frac{\partial L(y_i, F_{m-1}(x_i))}{\partial F_{m-1}(x_i)} - h(x_i) \right]^2$$

For MSE loss, the negative gradient is simply the residual: $y_i - F_{m-1}(x_i)$.

### Key Hyperparameters

**learning_rate (η):** Shrinks each tree's contribution (typical: 0.01-0.3). Lower η requires more trees but generalizes better.

**n_estimators:** Number of trees. More trees + low learning rate = better performance (with diminishing returns).

**max_depth:** Trees in boosting are typically shallow (2-5). Each tree is a "weak learner."

**subsample:** Fraction of data used per iteration (stochastic gradient boosting).

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor

np.random.seed(42)
X = np.sort(np.random.rand(80, 1) * 10, axis=0)
y = np.sin(X).ravel() + np.random.normal(0, 0.15, X.shape[0])

# Sequential fitting
F = np.zeros_like(y)
n_stages = 5
fig, axes = plt.subplots(1, n_stages, figsize=(20, 3))

for i in range(n_stages):
    residual = y - F
    tree = DecisionTreeRegressor(max_depth=3)
    tree.fit(X, residual)
    F += 0.5 * tree.predict(X)

    axes[i].scatter(X, y, alpha=0.3, label='Data')
    axes[i].scatter(X, F, color='red', s=20, label=f'Stage {i+1}')
    axes[i].set_ylim(-1.5, 1.5)
    axes[i].legend()

plt.suptitle('Gradient Boosting: Sequential Residual Fitting')
plt.tight_layout()
plt.savefig('figures/boosting_sequential.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Compare learning rates
for lr in [0.01, 0.1, 0.5, 1.0]:
    gb = GradientBoostingClassifier(
        n_estimators=100, learning_rate=lr, max_depth=3, random_state=42
    )
    gb.fit(X_train, y_train)
    print(f"LR={lr:.2f}: Train={gb.score(X_train, y_train):.3f}, "
          f"Test={gb.score(X_test, y_test):.3f}")

# Best model
gb = GradientBoostingClassifier(
    n_estimators=200, learning_rate=0.1, max_depth=3, subsample=0.8, random_state=42
)
gb.fit(X_train, y_train)
y_pred = gb.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
```

## Walkthrough Example: Breast Cancer with Gradient Boosting

**Results:**
- learning_rate=0.1: Test ~97%
- learning_rate=0.5: Test ~96% (slightly worse — overfitting)
- learning_rate=0.01: Test ~96% (needed more trees)

**Key finding:** Lower learning rate + more trees consistently beats higher learning rate with fewer trees.

## XGBoost and LightGBM

Both are optimized implementations of gradient boosting widely used in practice.

**XGBoost (eXtreme Gradient Boosting):**
- Regularized boosting to prevent overfitting
- Efficient handling of missing values
- Built-in cross-validation
- Parallel processing (at tree level)

**LightGBM:**
- Faster training (histogram-based algorithm)
- Leaf-wise tree growth (vs. depth-wise)
- Lower memory usage
- Native categorical feature handling

```python
# Conceptual example (requires xgboost/lightgbm installation)
# import xgboost as xgb
# model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
# model.fit(X_train, y_train)
```

## Biotechnology Example: Drug-Target Interaction

```python
np.random.seed(42)
n = 500

drug_data = pd.DataFrame({
    'molecular_weight': np.random.normal(400, 100, n),
    'logP': np.random.uniform(-2, 5, n),
    'h_bond_donors': np.random.poisson(2, n),
    'h_bond_acceptors': np.random.poisson(4, n),
    'rotatable_bonds': np.random.poisson(5, n),
})

interaction = (
    0.3 * drug_data['logP']
    - 0.1 * drug_data['molecular_weight'] / 100
    + 0.2 * drug_data['h_bond_acceptors']
    + np.random.normal(0, 0.2, n)
)
drug_data['binds'] = (interaction > intervention.median()).astype(int)

X_d = drug_data.drop('binds', axis=1)
y_d = drug_data['binds']

gb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
gb.fit(X_d, y_d)

print(f"Feature importances:")
for name, imp in zip(X_d.columns, gb.feature_importances_):
    print(f"  {name}: {imp:.3f}")
```

## SaaS Example: Click-Through Rate Prediction

```python
np.random.seed(42)
n = 2000

ctr_data = pd.DataFrame({
    'user_age_days': np.random.randint(1, 1000, n),
    'past_clicks': np.random.poisson(10, n),
    'hour_of_day': np.random.randint(0, 24, n),
    'device_type': np.random.choice([0, 1, 2], n),
    'ad_position': np.random.choice([0, 1, 2, 3], n),
})

click_prob = (
    0.01 * np.log1p(ctr_data['past_clicks'])
    - 0.02 * ctr_data['hour_of_day']
    + 0.05 * (ctr_data['ad_position'] == 0)
    + np.random.normal(0, 0.1, n)
)
ctr_data['clicked'] = (click_prob > 0).astype(int)

gb_ctr = GradientBoostingClassifier(n_estimators=150, learning_rate=0.05, max_depth=3)
gb_ctr.fit(ctr_data.drop('clicked', axis=1), ctr_data['clicked'])
print(f"Test AUC: {roc_auc_score(ctr_data['clicked'], gb_ctr.predict_proba(ctr_data.drop('clicked', axis=1))[:, 1]):.3f}")
```

## Common Mistakes

1. **Too many trees without enough learning rate** — overfitting
2. **Deep trees in boosting** — boosting is designed for shallow trees (depth 2-5)
3. **Ignoring early stopping** — use validation set to stop when performance plateaus
4. **Using boosting on very small datasets** — prone to overfitting with <100 samples

## Best Practices

- Always use a validation set for early stopping
- Start with learning_rate=0.1, n_estimators=100, max_depth=3
- Lower learning rate → more trees → better generalization
- Use subsample < 1.0 for stochastic boosting (reduces overfitting)
- Compare with Random Forest to decide which ensemble works better
- For large data, use XGBoost or LightGBM

## Summary

- Boosting builds trees sequentially, each correcting previous errors
- Each tree fits the residuals (negative gradient) of the current ensemble
- Key hyperparameters: learning_rate, n_estimators, max_depth
- Lower learning rate + more trees = better generalization
- XGBoost and LightGBM are optimized, production-ready implementations

## Key Terms

| Term | Definition |
|------|-----------|
| Boosting | Sequential ensemble correcting previous errors |
| Residual | Difference between actual and predicted |
| Learning rate | Scaling factor for each tree's contribution |
| Weak learner | Shallow tree that barely outperforms random |
| Additive model | Ensemble formed by adding models sequentially |
| Early stopping | Stopping training when validation performance stops improving |

## Exercises

**Level 1 — Basic:** Explain the key difference between bagging (Random Forest) and boosting (Gradient Boosting).

**Level 2 — Implementation:** Train GradientBoostingClassifier on breast cancer with learning_rates [0.01, 0.05, 0.1, 0.5] and n_estimators=100. Plot test accuracy vs. learning_rate.

**Level 3 — Critical Thinking:** You have 50 samples with 200 features. Why might Gradient Boosting be a bad choice? What would you use instead?

## Coding Challenge

Write a function `tune_gradient_boosting(X_train, y_train, X_val, y_val)` that performs a grid search over learning_rate (0.01, 0.05, 0.1) and max_depth (2, 3, 5) and returns the best model and its validation accuracy.
