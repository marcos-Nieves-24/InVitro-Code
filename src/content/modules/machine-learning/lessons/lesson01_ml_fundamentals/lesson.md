---
Module: 4
Lesson Number: 1
Lesson Title: ML Fundamentals
Estimated Duration: 75 minutes
Prerequisites: Module 3 (Statistics for Machine Learning)
Learning Objectives:
  - Explain what Machine Learning is and how it differs from traditional programming
  - Define features, labels, training, and prediction
  - Distinguish between supervised and unsupervised learning
  - Diagnose overfitting and underfitting from learning curves
  - Explain the bias-variance tradeoff with examples
Keywords: supervised learning, unsupervised learning, features, labels, overfitting, underfitting, bias-variance tradeoff, generalization
Difficulty: Beginner
Programming Concepts: train_test_split, model.fit, model.predict
Mathematical Concepts: variance, bias, mean squared error
Machine Learning Concepts: training set, test set, generalization, overfitting, underfitting
Datasets Used: scikit-learn diabetes, synthetic sinusoidal
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# ML Fundamentals

## Motivation

Every day you use Machine Learning: Netflix recommends shows, Gmail filters spam, your phone recognizes faces. But how does it work? In traditional programming, you write rules. In ML, the computer learns rules from data. This shift — from programmed rules to learned rules — is the most important idea in modern software. In biotechnology, ML predicts which drug compounds are effective. In SaaS, ML predicts which customers will churn. This lesson builds the mental model you need for every algorithm in the course.

## Big Picture

**Previous:** Module 3 taught you how to describe and visualize data. **This lesson:** You learn how algorithms *learn from data*. **Next:** Linear Regression — your first real ML algorithm.

## Theory

### What is Machine Learning?

Machine Learning is a field of artificial intelligence where computers learn patterns from data without being explicitly programmed for every scenario.

**Traditional programming:**
```
Rules + Data → Answers
```

**Machine Learning:**
```
Data + Answers → Rules
```

We give the computer examples, and it figures out the underlying pattern.

### Key Vocabulary

**Feature (X):** An input variable used to make predictions.
- Example: number of bedrooms in a house, gene expression level, days since last login.

**Label (y):** The output variable we want to predict.
- Example: house price, disease status, churn probability.

**Training:** The process where the model learns patterns from data.

**Prediction:** Using the trained model on new data.

### Supervised vs. Unsupervised Learning

| Aspect | Supervised | Unsupervised |
|--------|-----------|--------------|
| Data | Has labels | No labels |
| Goal | Predict labels | Find structure |
| Examples | Regression, Classification | Clustering, PCA |

### Generalization

A model's ability to perform well on *unseen* data. This is the true goal of ML — not memorizing training data, but learning patterns that generalize.

### Overfitting

The model learns the training data *too well*, including noise. It performs great on training data but poorly on new data.

**Symptoms:**
- Training accuracy near 100%, test accuracy much lower
- Very complex model with many parameters

### Underfitting

The model is too simple to capture the underlying pattern. It performs poorly on both training and test data.

**Symptoms:**
- Both training and test accuracy are low
- Model is too simple

## Mathematical Foundation: Bias-Variance Tradeoff

The expected test error of a model can be decomposed into three parts:

$$\text{Error} = \text{Bias}^2 + \text{Variance} + \text{Irreducible Error}$$

**Bias:** Error from wrong assumptions. High bias → underfitting.
**Variance:** Error from sensitivity to small fluctuations in training data. High variance → overfitting.
**Irreducible Error:** Noise inherent in the problem.

**Intuition:** Think of archery.
- High bias: shots are far from bullseye (systematic error).
- High variance: shots are scattered (inconsistent).

**The tradeoff:** As model complexity increases, bias decreases but variance increases. The optimal model balances both.

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

np.random.seed(42)
X = np.linspace(0, 1, 20).reshape(-1, 1)
y = np.sin(2 * np.pi * X).ravel() + np.random.normal(0, 0.2, 20)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

degrees = [1, 4, 15]
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for i, deg in enumerate(degrees):
    poly = PolynomialFeatures(degree=deg)
    X_poly_train = poly.fit_transform(X_train)
    X_poly_test = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_poly_train, y_train)

    y_train_pred = model.predict(X_poly_train)
    y_test_pred = model.predict(X_poly_test)

    X_plot = np.linspace(0, 1, 200).reshape(-1, 1)
    y_plot = model.predict(poly.transform(X_plot))

    axes[i].scatter(X_train, y_train, label='Train', alpha=0.6)
    axes[i].scatter(X_test, y_test, label='Test', alpha=0.6)
    axes[i].plot(X_plot, y_plot, 'r-', label='Model', linewidth=2)
    axes[i].set_title(f'Degree {deg}')
    axes[i].legend()
    axes[i].set_ylim(-1.5, 1.5)

    train_mse = mean_squared_error(y_train, y_train_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)
    print(f"Degree {deg}: Train MSE = {train_mse:.4f}, Test MSE = {test_mse:.4f}")

plt.tight_layout()
plt.savefig('figures/bias_variance_demo.png', dpi=150)
plt.show()
```

**Interpretation:**
- Degree 1 (underfitting): Simple line, high bias, both errors high.
- Degree 4 (good fit): Captures pattern, both errors low.
- Degree 15 (overfitting): Wiggly, perfect on training but fails on test.

## Python Implementation

### Train/Test Split

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

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print(f"Train R²: {model.score(X_train, y_train):.3f}")
print(f"Test R²: {model.score(X_test, y_test):.3f}")
print(f"Test MSE: {mean_squared_error(y_test, y_pred):.1f}")
```

## Walkthrough Example: Predicting Disease Progression

**Problem:** Predict diabetes progression after one year.

**Dataset:** scikit-learn diabetes dataset (442 patients, 10 features).

```python
from sklearn.datasets import load_diabetes

data = load_diabetes()
print(f"Features: {data.feature_names}")
print(f"Samples: {data.data.shape[0]}")
print(f"Features per sample: {data.data.shape[1]}")
```

**Analysis:** We split data, train a linear model, and evaluate.

**Interpretation:** The model explains ~45% of variance in disease progression (R² ≈ 0.45).

## Biotechnology Example: Gene Expression → Drug Response

Imagine you have gene expression data from 500 cancer patients and want to predict which patients respond to a specific drug.

- **Features (X):** Expression levels of 1000 genes
- **Label (y):** Responder (1) or non-responder (0)

A model trained on this data can identify expression signatures predictive of drug response.

## SaaS Example: Predicting User Churn

A SaaS company wants to predict which users will cancel their subscription.

- **Features:** login frequency, support tickets, days since last login, plan type
- **Label:** churned (1) or not (0)

The model learns patterns: users who don't log in for 30+ days and have filed support tickets are high-risk.

## Common Mistakes

1. **Training on all data before splitting** — causes data leakage, overestimates performance.
2. **Using test set for hyperparameter tuning** — treats test set like training data.
3. **Assuming high training accuracy means a good model** — could be overfitting.
4. **Confusing correlation with causation** — ML finds patterns, not causes.

## Best Practices

- Always split data *before* any preprocessing
- Keep a test set completely hidden until final evaluation
- Use cross-validation for reliable performance estimates
- Start with simple models before trying complex ones
- Plot learning curves to diagnose bias/variance

## Summary

- ML learns patterns from data instead of following explicit rules
- Features (X) are inputs; labels (y) are outputs
- Training fits the model; prediction applies it to new data
- Generalization is the ability to perform well on unseen data
- Overfitting: model too complex, memorizes noise
- Underfitting: model too simple, misses patterns
- Bias-variance tradeoff: optimal model balances systematic error and sensitivity
- Train/test split is essential for honest evaluation

## Key Terms

| Term | Definition |
|------|-----------|
| Feature | Input variable used for prediction |
| Label | Output variable to predict |
| Training | Process of fitting a model to data |
| Prediction | Model output on new data |
| Generalization | Performance on unseen data |
| Overfitting | Model memorizes training noise |
| Underfitting | Model too simple for the pattern |
| Bias | Error from simplifying assumptions |
| Variance | Error from sensitivity to data fluctuations |

## Exercises

**Level 1 — Basic:** Explain in your own words the difference between traditional programming and Machine Learning.

**Level 2 — Implementation:** Load the load_diabetes dataset, create a train/test split, train a LinearRegression, and compute both train and test R². Increase model complexity using PolynomialFeatures and observe the bias-variance tradeoff.

**Level 3 — Critical Thinking:** You train a model and get train accuracy = 99% and test accuracy = 65%. What is likely happening? What three things would you try to fix it?

## Coding Challenge

Write a function `diagnose_fit(model, X_train, X_test, y_train, y_test)` that:
1. Computes train and test scores
2. Prints whether the model is overfitting, underfitting, or well-balanced
3. Returns a string with the diagnosis

Use a threshold: if train_score - test_score > 0.15, flag overfitting.
