# Slides: Linear Regression

## Slide 1: Title
Linear Regression — The Foundation of Predictive Modeling

## Slide 2: Motivation
- Predict drug solubility from molecular properties
- Forecast SaaS revenue from user metrics
- Simplest, most interpretable ML model

## Slide 3: Simple Linear Regression
- $y = \beta_0 + \beta_1 x + \varepsilon$
- $\beta_0$: intercept, $\beta_1$: slope
- Goal: find line that best fits the data

## Slide 4: Multiple Linear Regression
- $y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \cdots + \beta_p x_p$
- Each $\beta_j$ represents the effect of $x_j$ holding others constant
- Matrix form: $\mathbf{y} = \mathbf{X}\boldsymbol{\beta}$

## Slide 5: Ordinary Least Squares
- Minimize MSE = $\frac{1}{n}\sum(y_i - \hat{y}_i)^2$
- Closed form: $\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$
- Intuition: find coefficients where gradient = 0

## Slide 6: Gradient Descent
- Alternative when $p$ is large
- Update: $\beta := \beta - \alpha \nabla \text{MSE}$
- Learning rate $\alpha$ controls step size
- Converges to same solution

## Slide 7: Evaluation Metrics
- **MSE:** average squared error (sensitive to outliers)
- **RMSE:** √MSE (same units as target)
- **R²:** proportion of variance explained

## Slide 8: Coefficient Interpretation
- Each coefficient = change in y per unit change in x
- **Warning:** only valid if other features are held constant
- Coefficients are not comparable across different scales

## Slide 9: Assumptions
1. Linearity
2. Independence
3. Homoscedasticity
4. Normality of residuals (for inference)
5. No multicollinearity

## Slide 10: Demo — Diabetes Dataset
- Load, split, train, evaluate
- Show coefficient bar plot
- Interpret results

## Slide 11: Biotechnology Example
- Protein solubility prediction
- Molecular weight, hydrophobicity, charge, helix fraction
- Hydrophobicity has strongest negative effect

## Slide 12: SaaS Example
- MRR (Monthly Recurring Revenue) forecast
- Active users, signups, churn rate, ARPU
- Business application: resource planning

## Slide 13: Common Mistakes
- Causal interpretation of coefficients
- Multicollinearity inflates variances
- Not checking residuals
- Using R² without context

## Slide 14: Summary
- Linear regression: weighted sum of features
- OLS minimizes MSE
- R² for evaluation
- Gradient descent for large-scale problems
- Always check assumptions
