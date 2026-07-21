# Lab 1: ML Fundamentals — Diagnosing Model Fit

## Objectives

- Implement train/test split with scikit-learn
- Train a linear regression model and evaluate performance
- Diagnose overfitting and underfitting using learning curves
- Visualize the bias-variance tradeoff

## Setup

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

plt.style.use('seaborn-v0_8-whitegrid')
np.random.seed(42)
```

## Part 1: Train/Test Split

Load the diabetes dataset, split into train (80%) and test (20%), train a `LinearRegression`, and print train and test R².

```python
data = load_diabetes()
X, y = data.data, data.target
# YOUR CODE HERE
```

**Check:** Test R² should be approximately 0.45.

## Part 2: Learning Curves

Use polynomial regression with varying degrees [1, 2, 3, 5, 10, 15] on a synthetic sine wave. For each degree, record train MSE and test MSE. Plot both against degree on a log scale.

**Question:** At what degree does overfitting begin?

## Part 3: Diagnose a Mystery Model

You are given three pre-trained models (A, B, C) with these performances:

| Model | Train R² | Test R² |
|-------|----------|---------|
| A | 0.32 | 0.28 |
| B | 0.99 | 0.99 |
| C | 0.99 | 0.55 |

Classify each as underfitting, well-fit, overfitting, or suspicious.

## Part 4: Cross-Validation

Use 5-fold cross-validation on the diabetes dataset with `LinearRegression`. Report the mean and standard deviation of the 5 R² scores.

```python
scores = cross_val_score(LinearRegression(), X, y, cv=5)
print(f"CV R²: {scores.mean():.3f} ± {scores.std():.3f}")
```

## Deliverables

- A single notebook or Python script with all parts completed
- Clearly labeled plots
- Written answers for Part 3

## Estimated time: 45 minutes
