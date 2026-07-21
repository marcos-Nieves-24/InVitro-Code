---
Module: 3
Lesson Number: 9
Lesson Title: Model Evaluation
Estimated Duration: 75 minutes
Prerequisites: Lesson 1 (Descriptive Statistics)
Learning Objectives:
  - Split data into training and testing sets using train_test_split
  - Implement k-fold cross-validation
  - Compute and interpret MAE, MSE, RMSE, and R²
  - Choose appropriate evaluation metrics for regression problems
  - Diagnose overfitting using cross-validation
Keywords: train-test split, cross-validation, MAE, MSE, RMSE, R², overfitting, sklearn.metrics
Difficulty: Intermediate
Programming Concepts: sklearn.model_selection, sklearn.metrics, numpy, pandas
Mathematical Concepts: mean absolute error, mean squared error, root mean squared error, coefficient of determination
Machine Learning Concepts: model evaluation, overfitting, generalization, cross-validation
Datasets Used: diabetes, California housing
Notebook: 09_model_evaluation.ipynb
Assignment: model_evaluation_assignment.md
Quiz: model_evaluation_quiz.md
---

# Lesson 9: Model Evaluation

## Motivation

Building a model is only half the work. The critical question is: how well does this model perform on new, unseen data? A model that memorizes the training data but fails on new data is useless — this is overfitting. Model evaluation metrics and cross-validation give us reliable estimates of real-world performance.

In biotechnology, evaluating a drug response prediction model determines whether it can guide treatment decisions. In SaaS, evaluating a churn prediction model determines whether it's worth deploying to retain customers.

## Big Picture

This lesson introduces the core concepts of model evaluation that underpin all of machine learning. It connects to Lesson 6 (EDA) — good evaluation starts with clean data. It prepares you for Module 4, where you will train, evaluate, and compare many types of models.

## Theory

### Train/Test Split

Split data into a training set (used to fit the model) and a testing set (used to evaluate performance).

- Typical split: 70-80% train, 20-30% test
- The test set must never be used during training
- Without a test set, performance estimates are optimistically biased

### Cross-Validation

k-fold cross-validation splits data into k folds, trains on k-1 folds, and tests on the remaining fold. This is repeated k times.

**Advantages**:
- More stable performance estimate than a single split
- All data is used for both training and testing
- Reduces variance of the performance estimate

### Regression Metrics

**Mean Absolute Error (MAE)**

$$\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$$

Intuition: Average absolute prediction error. Interpretable in original units.

**Mean Squared Error (MSE)**

$$\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2$$

Intuition: Average squared error. Penalizes large errors more heavily.

**Root Mean Squared Error (RMSE)**

$$\text{RMSE} = \sqrt{\text{MSE}}$$

Intuition: Typical prediction error in original units (like standard deviation of errors).

**R² (Coefficient of Determination)**

$$R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$$

Intuition: Proportion of variance in the target explained by the model. Ranges from (-∞, 1], where 1 is perfect prediction and 0 means the model performs no better than predicting the mean.

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load data
diabetes = load_diabetes()
X, y = diabetes.data, diabetes.target

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("Test Set Performance:")
print(f"MAE:  {mae:.2f}")
print(f"MSE:  {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R²:   {r2:.3f}")

# Cross-validation
cv = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(LinearRegression(), X, y, cv=cv, scoring='r2')

print(f"\n5-Fold Cross-Validation R²:")
print(f"Scores: {cv_scores}")
print(f"Mean:   {cv_scores.mean():.3f} (±{cv_scores.std():.3f})")

# Visualize predictions
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
plt.xlabel('True Values')
plt.ylabel('Predictions')
plt.title(f'Diabetes Progression: Predictions vs Actual (R² = {r2:.3f})')
plt.tight_layout()
plt.show()
```

## Walkthrough Example

California Housing: evaluate a linear regression model comprehensively.

```python
from sklearn.datasets import fetch_california_housing

housing = fetch_california_housing(as_frame=True)
X, y = housing.data, housing.target

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train
model = LinearRegression()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Metrics
def regression_report(y_true, y_pred):
    print("Regression Performance Report")
    print("=" * 35)
    print(f"MAE:  ${mean_absolute_error(y_true, y_pred):.3f}k")
    print(f"MSE:  ${mean_squared_error(y_true, y_pred):.3f}k")
    print(f"RMSE: ${np.sqrt(mean_squared_error(y_true, y_pred)):.3f}k")
    print(f"R²:   {r2_score(y_true, y_pred):.4f}")

regression_report(y_test, y_pred)

# Cross-validation
cv_scores = cross_val_score(
    LinearRegression(), X, y, cv=10, scoring='r2'
)
print(f"\n10-Fold CV R²: {cv_scores.mean():.4f} (±{cv_scores.std():.4f})")

# Residuals
residuals = y_test - y_pred
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.scatter(y_pred, residuals, alpha=0.6)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel('Predicted')
plt.ylabel('Residuals')
plt.title('Residual Plot')

plt.subplot(1, 2, 2)
plt.hist(residuals, bins=30, edgecolor='black')
plt.xlabel('Residual')
plt.title('Residual Distribution')
plt.tight_layout()
plt.show()

print(f"Mean residual: {np.mean(residuals):.4f}")
print(f"Std residual: {np.std(residuals):.4f}")
```

## Biotechnology Example

Predict drug response based on molecular features.

```python
np.random.seed(42)
n_samples = 200
n_features = 20

X_drug = np.random.randn(n_samples, n_features)
true_coeffs = np.random.randn(n_features)
y_drug = X_drug @ true_coeffs + np.random.randn(n_samples) * 2

X_train, X_test, y_train, y_test = train_test_split(
    X_drug, y_drug, test_size=0.25, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Drug Response Prediction Model")
print(f"R²: {r2_score(y_test, y_pred):.3f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.3f}")

# Top predictive features
feature_importance = pd.Series(
    np.abs(model.coef_), index=[f'Feature_{i}' for i in range(n_features)]
).sort_values(ascending=False)
print("\nTop 5 predictive features:")
print(feature_importance.head(5))
```

## SaaS Example

Predict customer lifetime value (LTV).

```python
np.random.seed(42)
n_customers = 1000
ltv_data = pd.DataFrame({
    'logins_per_week': np.random.poisson(3, n_customers),
    'avg_session_min': np.random.exponential(15, n_customers),
    'features_used': np.random.poisson(5, n_customers),
    'support_tickets': np.random.poisson(0.5, n_customers),
    'referrals': np.random.poisson(1, n_customers)
})

# Simulate LTV
ltv_data['ltv'] = (
    10 * ltv_data['logins_per_week']
    + 2 * ltv_data['avg_session_min']
    + 15 * ltv_data['features_used']
    - 20 * ltv_data['support_tickets']
    + 30 * ltv_data['referrals']
    + np.random.randn(n_customers) * 20
)

X = ltv_data.drop('ltv', axis=1)
y = ltv_data['ltv']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Customer LTV Prediction")
regression_report(y_test, y_pred)

# Cross-validation
cv_scores = cross_val_score(LinearRegression(), X, y, cv=5, scoring='r2')
print(f"\nCV R²: {cv_scores.mean():.3f} (±{cv_scores.std():.3f})")
```

## Common Mistakes

1. **Evaluating on training data**: This gives an overly optimistic estimate. Always use a held-out test set.
2. **Data leakage**: Using test data information during training (e.g., scaling before splitting).
3. **Only reporting R²**: Report multiple metrics (MAE, RMSE, R²) for a complete picture.
4. **Ignoring residual patterns**: Residuals should be randomly scattered around 0; patterns indicate model misspecification.
5. **Using a single train/test split**: Performance depends on the random split; use cross-validation for more reliable estimates.

## Best Practices

- Always split before any preprocessing (avoid data leakage)
- Use cross-validation for model selection and hyperparameter tuning
- Report multiple metrics (MAE is more interpretable, MSE penalizes outliers more)
- Check residual plots for model assumptions
- Compare model performance against a simple baseline

## Summary

- Train/test split simulates model performance on unseen data
- Cross-validation provides more reliable performance estimates
- MAE: average absolute error (interpretable)
- MSE: average squared error (penalizes large errors)
- RMSE: typical error in original units
- R²: proportion of variance explained
- Never evaluate on training data

## Key Terms

| Term | Definition |
|------|------------|
| Training Set | Data used to fit the model |
| Test Set | Data used to evaluate the model |
| Cross-Validation | Repeated train/test splits on different folds |
| MAE | Mean Absolute Error |
| MSE | Mean Squared Error |
| RMSE | Root Mean Squared Error |
| R² | Coefficient of Determination |
| Overfitting | Model memorizes training data, fails on new data |
| Data Leakage | Using test data information during training |

## Exercises

**Level 1: Basic Understanding**

1. What is the difference between MAE and MSE? When would you prefer one over the other?
2. Why is cross-validation better than a single train/test split?

**Level 2: Implementation**

3. Load the diabetes dataset. Compare the 5-fold CV R² of LinearRegression with a model that always predicts the mean.
4. Write a function `evaluate_model(model, X, y, cv_folds=5)` that returns MAE, RMSE, and R² using cross-validation.

**Level 3: Critical Thinking**

5. A model achieves R² = 0.95 on the training set but R² = 0.45 on the test set. What is happening? What steps should be taken?
6. In a biotech drug response prediction problem, which metric (MAE, MSE, RMSE, or R²) is most clinically meaningful? Justify your answer.

## Coding Challenge

Write a Python script that:
1. Loads the California housing dataset
2. Splits into train (80%) and test (20%)
3. Trains a LinearRegression model
4. Computes and prints MAE, MSE, RMSE, and R² on both train and test sets
5. Performs 10-fold cross-validation and reports mean ± std R²
6. Creates a side-by-side plot: predicted vs actual (scatter) and residuals (histogram)
7. Determines which feature has the largest absolute coefficient and interprets its meaning
