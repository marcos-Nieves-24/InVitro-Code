---
Module: 4
Lesson Number: 3
Lesson Title: Classification
Estimated Duration: 90 minutes
Prerequisites: L1 (ML Fundamentals)
Learning Objectives:
  - Explain binary classification and the logistic function
  - Train and evaluate logistic regression models with scikit-learn
  - Interpret a confusion matrix and derive precision, recall, F1
  - Plot and interpret ROC curves and AUC scores
  - Compare classification metrics for different business contexts
Keywords: binary classification, logistic regression, confusion matrix, precision, recall, F1, ROC, AUC, decision boundary
Difficulty: Beginner
Programming Concepts: sklearn.linear_model.LogisticRegression, sklearn.metrics
Mathematical Concepts: sigmoid function, log-odds, cross-entropy loss
Machine Learning Concepts: decision boundary, threshold, ROC curve, AUC
Datasets Used: breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Classification

## Motivation

Is this email spam or not? Does this patient have cancer? Will this customer churn? These are *classification* problems — predicting a discrete category. Classification is the most common type of ML application in both biotechnology (disease diagnosis, drug response) and SaaS (churn prediction, lead scoring).

## Big Picture

**Previous:** Linear Regression predicted continuous numbers. **This lesson:** Logistic Regression predicts categories. **Next:** Decision Trees — a non-linear approach to classification.

## Theory

### Binary Classification

The target $y$ takes two values: 0 (negative class) or 1 (positive class).

### Logistic Regression

Despite the name, logistic regression is a *classification* algorithm. Instead of predicting a continuous value, it predicts the *probability* that a sample belongs to the positive class.

**Linear part:** $z = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p$

**Logistic (sigmoid) function:** $\sigma(z) = \frac{1}{1 + e^{-z}}$

The sigmoid squashes any real number into [0, 1], giving a valid probability:

$$\hat{p} = P(y=1 | \mathbf{x}) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p)}}$$

**Decision rule:** Predict $y=1$ if $\hat{p} \geq 0.5$, else $y=0$.

### Decision Boundary

The line (or hyperplane) where $\hat{p} = 0.5$, i.e., $z = 0$.

### Loss Function: Log Loss (Cross-Entropy)

$$L = -\frac{1}{n}\sum_{i=1}^{n}[y_i\log(\hat{p}_i) + (1-y_i)\log(1-\hat{p}_i)]$$

Unlike MSE for linear regression, log loss heavily penalizes confident wrong predictions.

## Mathematical Foundation

### Log-Odds

The log-odds (logit) transformation:

$$\log\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 x_1 + \cdots + \beta_p x_p$$

This shows logistic regression is linear in *log-odds* space.

### Confusion Matrix

| | Predicted Positive | Predicted Negative |
|-|-------------------|-------------------|
| **Actual Positive** | True Positive (TP) | False Negative (FN) |
| **Actual Negative** | False Positive (FP) | True Negative (TN) |

### Derived Metrics

**Accuracy:** $\frac{TP + TN}{TP + TN + FP + FN}$

**Precision:** $\frac{TP}{TP + FP}$ — "When we predict positive, how often are we right?"

**Recall (Sensitivity):** $\frac{TP}{TP + FN}$ — "What fraction of actual positives did we catch?"

**F1 Score:** $2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$ — Harmonic mean of precision and recall.

**Specificity:** $\frac{TN}{TN + FP}$ — "What fraction of actual negatives did we correctly reject?"

### ROC Curve and AUC

ROC (Receiver Operating Characteristic) plots TPR (recall) vs. FPR (1 - specificity) as the threshold varies.

**AUC (Area Under the Curve):** Probability that a randomly chosen positive is ranked higher than a randomly chosen negative. AUC = 1 is perfect, AUC = 0.5 is random.

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression

np.random.seed(42)
X = np.random.randn(200, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression()
model.fit(X, y)

# Decision boundary
xx, yy = np.meshgrid(np.linspace(-3, 3, 100), np.linspace(-3, 3, 100))
Z = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1]
Z = Z.reshape(xx.shape)

plt.figure(figsize=(8, 6))
plt.contourf(xx, yy, Z, alpha=0.3, levels=np.linspace(0, 1, 11), cmap='RdBu')
plt.contour(xx, yy, Z, levels=[0.5], colors='k', linewidths=2)
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='RdBu', edgecolors='k', alpha=0.7)
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('Logistic Regression Decision Boundary')
plt.colorbar(label='Probability')
plt.savefig('figures/decision_boundary.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, classification_report,
                             roc_curve, auc, accuracy_score)

data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=5000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")

# ROC Curve
fpr, tpr, _ = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(6, 5))
plt.plot(fpr, tpr, label=f'ROC (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate (Recall)')
plt.title('ROC Curve')
plt.legend()
plt.savefig('figures/roc_curve.png', dpi=150)
plt.show()
```

## Walkthrough Example: Breast Cancer Detection

**Problem:** Classify breast tumors as malignant (1) or benign (0).

**Dataset:** Wisconsin Breast Cancer dataset (569 samples, 30 features).

**Results:**
- Accuracy: ~97%
- Precision: ~0.98 (when we predict malignant, we are 98% correct)
- Recall: ~0.96 (we catch 96% of actual malignancies)
- AUC: ~0.99 (excellent discrimination)

## Biotechnology Example: Predicting Drug Response

A pharmaceutical company tests whether a drug is effective (responder = 1) based on patient biomarkers.

```python
np.random.seed(42)
n_patients = 500

clinic_data = pd.DataFrame({
    'age': np.random.normal(55, 15, n_patients),
    'biomarker_A': np.random.normal(0, 1, n_patients),
    'biomarker_B': np.random.normal(0, 1, n_patients),
    'gene_X_expression': np.random.exponential(1, n_patients),
})

log_odds = (
    -2
    + 0.5 * clinic_data['biomarker_A']
    - 0.3 * clinic_data['biomarker_B']
    + 1.5 * clinic_data['gene_X_expression']
)
clinic_data['responder'] = (1 / (1 + np.exp(-log_odds)) > 0.5).astype(int)

X_c = clinic_data.drop('responder', axis=1)
y_c = clinic_data['responder']
X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_c, y_c, test_size=0.3)

model_c = LogisticRegression()
model_c.fit(X_train_c, y_train_c)

print(classification_report(y_test_c, model_c.predict(X_test_c)))
```

**Interpretation:** Gene X expression is the strongest predictor of drug response.

## SaaS Example: Churn Prediction

```python
np.random.seed(42)
n_users = 1000

saas_data = pd.DataFrame({
    'days_since_login': np.random.exponential(20, n_users),
    'support_tickets': np.random.poisson(2, n_users),
    'feature_usage_pct': np.random.uniform(0, 100, n_users),
    'account_age_months': np.random.exponential(12, n_users),
})

log_odds = (
    -1
    + 0.08 * saas_data['days_since_login']
    + 0.5 * saas_data['support_tickets']
    - 0.03 * saas_data['feature_usage_pct']
)
saas_data['churned'] = (1 / (1 + np.exp(-log_odds)) > 0.5).astype(int)

X_s = saas_data.drop('churned', axis=1)
y_s = saas_data['churned']

model_s = LogisticRegression(max_iter=1000)
model_s.fit(X_s, y_s)

for col, coef in zip(X_s.columns, model_s.coef_[0]):
    print(f"{col}: {coef:.4f}")

print(f"\nAUC: {roc_auc_score(y_s, model_s.predict_proba(X_s)[:, 1]):.3f}")
```

## Common Mistakes

1. **Using accuracy on imbalanced data** — if 95% of samples are negative, a model predicting "negative" always gets 95% accuracy but is useless.
2. **Setting threshold at 0.5 by default** — adjust based on business needs (higher threshold if false positives are costly).
3. **Confusing precision and recall** — precision = accuracy of positive predictions; recall = fraction of positives found.
4. **Interpreting coefficients directly** — coefficients are in log-odds units, not probability units.

## Best Practices

- Always check class balance before choosing metrics
- Use AUC for model comparison, precision/recall for business decisions
- Consider cost matrices: false positives and false negatives have different costs
- Scale features for logistic regression (it uses gradient descent)
- Use stratified train/test split to preserve class proportions

## Summary

- Logistic regression predicts class probabilities via the sigmoid function
- Decision boundary separates classes in feature space
- Confusion matrix summarizes prediction outcomes
- Precision, recall, F1 provide nuanced evaluation
- ROC AUC measures ranking quality across thresholds
- Threshold selection depends on business context

## Key Terms

| Term | Definition |
|------|-----------|
| Sigmoid | S-shaped function squashing values to [0, 1] |
| Decision boundary | Threshold where probability = 0.5 |
| Confusion matrix | Table of TP, FP, TN, FN |
| Precision | TP / (TP + FP) |
| Recall (Sensitivity) | TP / (TP + FN) |
| F1 Score | Harmonic mean of precision and recall |
| ROC Curve | TPR vs. FPR at various thresholds |
| AUC | Area under ROC, measures ranking quality |

## Exercises

**Level 1 — Basic:** If a spam filter has precision = 0.95 and recall = 0.60, what does each number mean? Which is more important for a spam filter?

**Level 2 — Implementation:** Load the `breast_cancer` dataset, train a logistic regression model, and plot the ROC curve with AUC displayed on the plot.

**Level 3 — Critical Thinking:** A medical test for a rare disease (1% prevalence) achieves 99% accuracy. Is this a good test? Explain why accuracy is misleading here.

## Coding Challenge

Write a function `find_optimal_threshold(model, X_val, y_val)` that finds the decision threshold (0.0 to 1.0) that maximizes F1 score on validation data. Use 100 evenly spaced thresholds.
