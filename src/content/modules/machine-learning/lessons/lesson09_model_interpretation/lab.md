# Lab 9: Model Interpretation

## Objectives

- Compute and interpret permutation importance
- Generate and interpret partial dependence plots
- Compare built-in vs. permutation importance
- Understand how correlations affect importance

## Part 1: Permutation Importance on Breast Cancer

Train a `RandomForestClassifier` on breast cancer. Compute both impurity and permutation importance. Create a DataFrame comparing them. Plot the top 10 features by permutation importance with error bars.

**Question:** Which top features differ between the two methods?

## Part 2: Partial Dependence

Create PDPs for the top 3 features from permutation importance. For each, describe the shape of the curve.

**Question:** Does the PDP match clinical knowledge about breast cancer?

## Part 3: Correlated Features Experiment

```python
np.random.seed(42)
n = 500
X_corr = np.random.randn(n, 5)
X_corr[:, 1] = X_corr[:, 0] * 0.95 + np.random.randn(n) * 0.1  # Correlated
y_corr = X_corr[:, 0] + X_corr[:, 2] + np.random.randn(n) * 0.5
```

Train a RandomForestRegressor. Compute permutation importance.

**Question:** What happens to the importance of feature 0 and feature 1? Why?

## Part 4: PDP for California Housing

Train RF on California Housing. Create PDPs for MedInc, AveOccup, and Latitude.

**Question:** What does the Latitude PDP reveal about California real estate?

## Part 5: Local Explanation with SHAP (conceptual)

If SHAP is installed: pick one test sample and create a SHAP waterfall plot. If not, explain what you would expect to see.

## Deliverables

- Notebook with all 5 parts
- Importance comparison bar plot (Part 1)
- PDPs for top features (Part 2)
- Correlation experiment results (Part 3)

## Estimated time: 45 minutes
