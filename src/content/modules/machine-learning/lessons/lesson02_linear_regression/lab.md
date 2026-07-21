# Lab 2: Linear Regression

## Objectives

- Implement simple and multiple linear regression
- Interpret coefficients and evaluate model performance
- Detect violations of linear regression assumptions
- Compare OLS closed-form with sklearn implementation

## Data

Use the **California Housing** dataset.

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

## Part 1: Simple Linear Regression

Use only `MedInc` (median income) to predict `MedHouseVal`. Fit the model, plot the regression line over the scatter plot, and report R².

## Part 2: Multiple Linear Regression

Use all 8 features. Report:
- R², MSE, RMSE
- Coefficient values (sorted by absolute value)
- Which feature has the largest positive impact? Largest negative impact?

## Part 3: Residual Analysis

Calculate residuals: $e_i = y_i - \hat{y}_i$

1. Plot residuals vs. predicted values — do you see a pattern?
2. Plot a histogram of residuals — are they approximately normal?
3. Compute the correlation between residuals and each feature — should be near 0.

## Part 4: Multicollinearity Check

Compute the correlation matrix of the 8 features. Are any pairs highly correlated (|r| > 0.7)? How would this affect your coefficient interpretation?

## Part 5: OLS from Scratch

Implement the closed-form solution and verify coefficients match sklearn.

## Deliverables

- Notebook or script with all 5 parts
- 3 plots (regression line, residuals vs. fitted, residual histogram)
- Written interpretation of residual plots

## Estimated time: 45 minutes
