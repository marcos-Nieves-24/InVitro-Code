---
Module: 4
Lesson Number: 9
Lesson Title: Model Interpretation
Estimated Duration: 75 minutes
Prerequisites: L2-L5 (Linear Regression, Classification, Decision Trees, Random Forest)
Learning Objectives:
  - Explain why model interpretability matters in biotechnology and SaaS
  - Compute and interpret permutation feature importance
  - Generate and interpret partial dependence plots
  - Explain the intuition behind SHAP and LIME
  - Compare global and local interpretability methods
Keywords: interpretability, feature importance, permutation importance, partial dependence, SHAP, LIME
Difficulty: Advanced
Programming Concepts: sklearn.inspection.permutation_importance, sklearn.inspection.PartialDependenceDisplay
Mathematical Concepts: marginal effect, feature perturbation
Machine Learning Concepts: global interpretation, local interpretation, model-agnostic methods
Datasets Used: breast cancer, california housing
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Model Interpretation

## Motivation

A black-box ML model predicts that a patient has cancer — but why? Which biomarkers drove this decision? In regulated industries (healthcare, finance), you can't deploy a model unless you can explain its predictions. Model interpretation answers "why?" — it builds trust, enables debugging, and provides scientific insight. In biotech, it identifies which genes drive disease. In SaaS, it reveals which features drive customer churn.

## Big Picture

**Previous:** You've learned many models (LR, RF, GB). **This lesson:** How to understand what these models learned. **Next:** Applications — putting everything together.

## Theory

### Why Interpretability Matters

1. **Trust:** Stakeholders need to trust the model
2. **Debugging:** Find data leaks, spurious correlations
3. **Discovery:** Learn about the domain (e.g., which genes matter)
4. **Regulation:** GDPR requires explanation for automated decisions

### Types of Interpretability

**Global:** Understand the entire model behavior
- Feature importance (which features matter overall)
- Partial dependence plots (how features affect predictions)

**Local:** Understand a single prediction
- LIME (Local Interpretable Model-agnostic Explanations)
- SHAP (SHapley Additive exPlanations)

### Model-Specific vs. Model-Agnostic

- **Model-specific:** Decision tree rules, linear regression coefficients
- **Model-agnostic:** Can be applied to any model (permutation importance, SHAP)

## Permutation Feature Importance

**Idea:** Shuffle a feature's values and measure the drop in performance. If shuffling drops performance significantly, the feature is important.

**Algorithm:**
1. Evaluate baseline performance (score on validation set)
2. For each feature:
   - Randomly shuffle feature values
   - Re-evaluate performance
   - Importance = baseline - shuffled score
3. Repeat multiple times for stability

## Partial Dependence Plots (PDP)

**Idea:** Show how a feature affects predictions while averaging out other features.

**Algorithm:**
1. Choose a feature $x_s$
2. For each unique value of $x_s$:
   - Set all samples to that value
   - Average predictions across all samples
3. Plot average prediction vs. $x_s$

**Interpretation:** Slope shows marginal effect. Flat line = no effect.

## SHAP (SHapley Additive exPlanations)

**Game theory approach:** Each feature is a "player" contributing to the prediction. SHAP values distribute the prediction among features fairly.

**Properties:**
- Sum of SHAP values = prediction - average prediction
- Positive SHAP = feature pushes prediction up
- Negative SHAP = feature pushes prediction down

**SHAP summary plot:** Shows feature importance and direction of effect.

## LIME (Local Interpretable Model-agnostic Explanations)

**Idea:** Approximate the complex model with a simple interpretable model (linear model) locally around a prediction.

**Algorithm:**
1. Generate perturbed samples around the instance
2. Get predictions from the complex model
3. Weight samples by proximity to the instance
4. Fit an interpretable model (linear regression) on weighted samples
5. Coefficients = local explanation

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

housing = fetch_california_housing()
X, y = housing.data, housing.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Permutation importance
result = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)

sorted_idx = result.importances_mean.argsort()[::-1]
plt.figure(figsize=(8, 5))
plt.barh([housing.feature_names[i] for i in sorted_idx],
         result.importances_mean[sorted_idx])
plt.xlabel('Permutation Importance')
plt.title('Feature Importance (Permutation)')
plt.tight_layout()
plt.savefig('figures/permutation_importance.png', dpi=150)
plt.show()

# Partial dependence
fig, ax = plt.subplots(figsize=(8, 5))
PartialDependenceDisplay.from_estimator(
    model, X_test, ['MedInc', 'AveOccup'],
    grid_resolution=20, ax=ax
)
plt.suptitle('Partial Dependence Plots')
plt.tight_layout()
plt.savefig('figures/partial_dependence.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance, PartialDependenceDisplay
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 1. Built-in feature importance
impurity_imp = pd.DataFrame({
    'feature': data.feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("Impurity-based importance (top 5):")
print(impurity_imp.head(5).to_string(index=False))

# 2. Permutation importance
perm_imp = permutation_importance(model, X_test, y_test, n_repeats=10, random_state=42)
perm_df = pd.DataFrame({
    'feature': data.feature_names,
    'importance': perm_imp.importances_mean,
    'std': perm_imp.importances_std
}).sort_values('importance', ascending=False)

print("\nPermutation importance (top 5):")
print(perm_df.head(5).to_string(index=False))

# 3. Partial dependence
fig, ax = plt.subplots(figsize=(10, 4))
PartialDependenceDisplay.from_estimator(
    model, X_test, ['worst radius', 'worst concave points'],
    grid_resolution=20, ax=ax
)
plt.suptitle('Partial Dependence: Breast Cancer')
plt.tight_layout()
plt.savefig('figures/pdp_breast_cancer.png', dpi=150)
plt.show()
```

## Walkthrough Example: Understanding a Cancer Classifier

**Model:** Random Forest predicting malignant vs. benign.

**Top features (permutation):**
1. `worst concave points` — most important
2. `worst radius`
3. `worst perimeter`

**Partial dependence for `worst radius`:**
- Below 15: probability of malignant is near 0
- Between 15-25: probability increases rapidly
- Above 25: probability near 1

**This makes clinical sense:** Larger tumors are more likely to be malignant.

## Biotechnology Example: Biomarker Discovery

```python
np.random.seed(42)
n, n_genes = 300, 100

X_gene = np.random.randn(n, n_genes)
y_gene = (X_gene[:, 0] * 0.5 + X_gene[:, 15] * 0.3 - X_gene[:, 42] * 0.4 > 0).astype(int)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_gene, y_gene)

perm = permutation_importance(rf, X_gene, y_gene, n_repeats=5, random_state=42)

top_genes = np.argsort(perm.importances_mean)[::-1][:5]
print("Top predictive genes:")
for g in top_genes:
    print(f"  Gene {g}: importance = {perm.importances_mean[g]:.4f}")
```

**Interpretation:** Permutation importance correctly identifies genes 0, 15, and 42 as the actual predictive features — even among 100 genes.

## Common Mistakes

1. **Confusing correlation with causation** — a feature can be "important" without causing the outcome
2. **Impurity bias** — impurity-based importance favors high-cardinality features
3. **Using only one importance method** — always compare permutation + impurity
4. **Ignoring feature correlations** — correlated features share importance
5. **Over-interpreting small effects** — permutation importance can be noisy

## Best Practices

- Always use permutation importance (not just impurity)
- Compare built-in importance with permutation importance
- Use PDP for features with high importance
- Check for interactions using 2D PDP
- For local explanations, consider SHAP (if installable) or LIME
- Domain expertise is essential for correct interpretation

## Summary

- Permutation importance measures feature importance by shuffling
- Partial dependence plots show marginal effects
- SHAP and LIME provide local explanations for individual predictions
- Global methods explain the whole model; local methods explain one prediction
- Always combine ML interpretation with domain knowledge
- Interpretability is essential for trust, debugging, and discovery

## Key Terms

| Term | Definition |
|------|-----------|
| Permutation importance | Drop in score when a feature is shuffled |
| Partial dependence | Average prediction as a function of one feature |
| Global interpretation | Understanding the overall model |
| Local interpretation | Understanding a single prediction |
| SHAP | Game-theoretic feature attribution |
| LIME | Local surrogate model approximation |

## Exercises

**Level 1 — Basic:** Why is permutation importance considered more reliable than impurity-based importance?

**Level 2 — Implementation:** Train a `RandomForestRegressor` on California Housing. Compute permutation importance and plot the top 5 features.

**Level 3 — Critical Thinking:** Features A and B are highly correlated (r = 0.95). Permutation importance gives both low scores. If you remove feature A, importance of B becomes high. What is happening?

## Coding Challenge

Write a function `compare_importances(model, X_val, y_val, feature_names)` that returns a DataFrame comparing impurity-based and permutation-based feature importances, sorted by permutation importance.
