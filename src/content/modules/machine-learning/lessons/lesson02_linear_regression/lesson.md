---
Module: 4
Lesson Number: 2
Lesson Title: Linear Regression
Estimated Duration: 90 minutes
Prerequisites: L1 (ML Fundamentals), Module 3 statistics (variance, covariance, correlation)
Learning Objectives:
  - Explain the mathematical formulation of simple and multiple linear regression
  - Implement linear regression with scikit-learn
  - Interpret regression coefficients in context
  - Evaluate regression models using R², MSE, and RMSE
  - Describe how gradient descent optimizes model parameters
Keywords: linear regression, OLS, gradient descent, R-squared, MSE, coefficient, intercept
Difficulty: Beginner
Programming Concepts: sklearn.linear_model.LinearRegression, numpy linear algebra
Mathematical Concepts: Ordinary Least Squares, gradient descent, R², MSE, RMSE
Machine Learning Concepts: regression, feature weighting, residuals
Datasets Used: scikit-learn diabetes, California Housing, synthetic
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Linear Regression

## Motivation

A biotech company wants to predict drug solubility from molecular properties. A SaaS company wants to forecast monthly recurring revenue. Both are *regression* problems — predicting a continuous number. Linear regression is the simplest and most interpretable regression algorithm. Understanding it thoroughly is essential because many advanced models (regularized regression, neural networks) build on its ideas.

## Big Picture

**Previous:** ML Fundamentals gave you the mental model. **This lesson:** Your first real algorithm — Linear Regression. **Next:** Classification — predicting categories instead of numbers.

## Theory

### Simple Linear Regression

The relationship between one feature $x$ and the target $y$:

$$y = \beta_0 + \beta_1 x + \varepsilon$$

- $\beta_0$: intercept (value of y when x = 0)
- $\beta_1$: slope (change in y per unit change in x)
- $\varepsilon$: residual (error term)

### Multiple Linear Regression

With $p$ features:

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p + \varepsilon$$

In matrix form: $\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}$

### Ordinary Least Squares (OLS)

We choose $\boldsymbol{\beta}$ to minimize the sum of squared residuals:

$$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$$

The closed-form solution:

$$\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$$

### Gradient Descent Intuition

When $p$ is large, the closed-form solution is slow. Gradient descent iteratively adjusts $\boldsymbol{\beta}$:

1. Start with random $\boldsymbol{\beta}$
2. Compute gradient of MSE w.r.t. $\boldsymbol{\beta}$
3. Update: $\boldsymbol{\beta} := \boldsymbol{\beta} - \alpha \nabla \text{MSE}$
4. Repeat until convergence

$\alpha$ is the **learning rate** — how big each step is.

### Evaluation Metrics

**MSE (Mean Squared Error):** $\frac{1}{n}\sum(y_i - \hat{y}_i)^2$
- Sensitive to outliers (squares large errors)

**RMSE (Root Mean Squared Error):** $\sqrt{\text{MSE}}$
- Same units as target variable

**R² (Coefficient of Determination):** $1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}$
- Proportion of variance explained by the model
- Ranges from $-\infty$ to 1
- R² = 1: perfect fit
- R² = 0: model predicts mean always

## Mathematical Foundation

### Deriving OLS

We minimize $L(\boldsymbol{\beta}) = (\mathbf{y} - \mathbf{X}\boldsymbol{\beta})^\top(\mathbf{y} - \mathbf{X}\boldsymbol{\beta})$

Set gradient to zero:
$$\frac{\partial L}{\partial \boldsymbol{\beta}} = -2\mathbf{X}^\top(\mathbf{y} - \mathbf{X}\boldsymbol{\beta}) = 0$$

$$\mathbf{X}^\top\mathbf{X}\boldsymbol{\beta} = \mathbf{X}^\top\mathbf{y}$$

$$\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$$

### Assumptions of Linear Regression

1. **Linearity:** Relationship between X and y is linear
2. **Independence:** Observations are independent
3. **Homoscedasticity:** Constant variance of residuals
4. **Normality:** Residuals are normally distributed (for inference)
5. **No multicollinearity:** Features are not highly correlated

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

np.random.seed(42)
X = np.random.rand(50, 1) * 10
y = 2.5 * X.ravel() + 1.3 + np.random.normal(0, 1.5, 50)

model = LinearRegression()
model.fit(X, y)

X_line = np.linspace(0, 10, 100).reshape(-1, 1)
y_line = model.predict(X_line)

plt.figure(figsize=(8, 5))
plt.scatter(X, y, alpha=0.6, label='Data')
plt.plot(X_line, y_line, 'r-', linewidth=2, label=f'y = {model.coef_[0]:.2f}x + {model.intercept_:.2f}')
plt.xlabel('Feature (x)')
plt.ylabel('Target (y)')
plt.legend()
plt.title('Simple Linear Regression')
plt.savefig('figures/simple_linear_regression.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

data = load_diabetes()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Intercept:", model.intercept_)
print("Coefficients:")
for name, coef in zip(data.feature_names, model.coef_):
    print(f"  {name}: {coef:.4f}")
print(f"\nMSE:  {mean_squared_error(y_test, y_pred):.1f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.1f}")
print(f"R²:   {r2_score(y_test, y_pred):.3f}")
```

## Walkthrough Example: California Housing

```python
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing()
X_h = pd.DataFrame(housing.data, columns=housing.feature_names)
y_h = housing.target

X_train, X_test, y_train, y_test = train_test_split(X_h, y_h, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

print(f"R²: {model.score(X_test, y_test):.3f}")

# Feature importance
coef_df = pd.DataFrame({
    'feature': housing.feature_names,
    'coefficient': model.coef_
}).sort_values('coefficient', key=abs, ascending=False)
print(coef_df)
```

**Interpretation:** MedInc (median income) has the largest positive coefficient — higher income predicts higher house prices.

## Biotechnology Example: Predicting Protein Solubility

A pharmaceutical company wants to predict whether a protein will be soluble in water based on molecular descriptors.

```python
np.random.seed(42)
n_proteins = 200

solubility_data = pd.DataFrame({
    'molecular_weight': np.random.normal(50000, 10000, n_proteins),
    'hydrophobicity': np.random.uniform(-2, 2, n_proteins),
    'charge': np.random.normal(0, 5, n_proteins),
    'helix_fraction': np.random.uniform(0, 1, n_proteins),
})

# Simulate solubility score
solubility_data['solubility'] = (
    0.5
    - 0.3 * solubility_data['hydrophobicity']
    + 0.1 * solubility_data['charge']
    + 0.2 * solubility_data['helix_fraction']
    + np.random.normal(0, 0.1, n_proteins)
)

X_s = solubility_data.drop('solubility', axis=1)
y_s = solubility_data['solubility']

model_s = LinearRegression()
model_s.fit(X_s, y_s)

for col, coef in zip(X_s.columns, model_s.coef_):
    print(f"{col}: {coef:.4f}")
print(f"R²: {model_s.score(X_s, y_s):.3f}")
```

**Interpretation:** Hydrophobicity has the largest negative effect — more hydrophobic proteins tend to be less soluble.

## SaaS Example: Forecasting Monthly Revenue

A SaaS startup wants to forecast next month's MRR (Monthly Recurring Revenue).

```python
np.random.seed(42)
n_months = 36

revenue_data = pd.DataFrame({
    'active_users': np.random.poisson(1000, n_months) + np.arange(n_months) * 10,
    'new_signups': np.random.poisson(50, n_months) + np.arange(n_months) * 2,
    'churn_rate': np.random.uniform(0.02, 0.08, n_months),
    'avg_revenue_per_user': np.random.uniform(20, 30, n_months),
})

true_mrr = (
    0.5 * revenue_data['active_users']
    + 2.0 * revenue_data['new_signups']
    - 500 * revenue_data['churn_rate']
    + revenue_data['avg_revenue_per_user'] * revenue_data['active_users'] * 0.01
    + np.random.normal(0, 100, n_months)
)

revenue_data['mrr'] = true_mrr

X_r = revenue_data.drop('mrr', axis=1)
y_r = revenue_data['mrr']

model_r = LinearRegression()
model_r.fit(X_r, y_r)

print(f"R²: {model_r.score(X_r, y_r):.3f}")
for col, coef in zip(X_r.columns, model_r.coef_):
    print(f"{col}: {coef:.2f}")
```

## Common Mistakes

1. **Interpreting coefficients causally** — correlation ≠ causation
2. **Ignoring multicollinearity** — correlated features inflate coefficient variance
3. **Not checking residual patterns** — curved residuals suggest non-linearity
4. **Using R² alone** — always check residual plots and MSE too
5. **Forgetting to scale features** — coefficients are not comparable when features have different units

## Best Practices

- Always visualize the data first
- Check residual plots (residuals vs. fitted, Q-Q plot)
- Use RMSE instead of MSE for interpretability
- Compare model performance to a baseline (mean predictor)
- Consider regularization (Ridge, Lasso) when many features

## Summary

- Linear regression models the target as a weighted sum of features
- OLS finds coefficients that minimize MSE
- R² measures the proportion of variance explained
- Gradient descent is an iterative alternative to OLS for large datasets
- Always check assumptions and residual plots

## Key Terms

| Term | Definition |
|------|-----------|
| Ordinary Least Squares | Method minimizing squared residuals |
| Coefficient | Weight assigned to a feature |
| Intercept | Prediction when all features are 0 |
| Residual | Difference between actual and predicted |
| R² | Proportion of variance explained |
| MSE | Average squared prediction error |
| RMSE | Square root of MSE, in original units |
| Gradient Descent | Iterative optimization algorithm |

## Exercises

**Level 1 — Basic:** What do R² = 1, R² = 0, and R² = -0.5 mean in practice?

**Level 2 — Implementation:** Use `fetch_california_housing()`, train a linear regression on all 8 features, and create a bar plot of the coefficients (absolute value).

**Level 3 — Critical Thinking:** You have a dataset with 5 features. After training, 3 features have very large coefficients and 2 have tiny coefficients. Does this mean the 2 features are unimportant? Why or why not?

## Coding Challenge

Write a function `linear_regression_from_scratch(X, y)` that implements OLS using the closed-form solution. Compare your coefficients to `sklearn.linear_model.LinearRegression`. Return the coefficients, intercept, and R².
