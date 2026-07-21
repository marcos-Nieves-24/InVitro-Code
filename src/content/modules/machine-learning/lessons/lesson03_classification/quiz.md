# Quiz: Classification

## Multiple Choice (5 questions)

**Q1.** What does the sigmoid function do in logistic regression?

a) It transforms features to be normally distributed
b) It maps any real value to a probability between 0 and 1
c) It selects the most important features
d) It computes the mean squared error

<details><summary>Answer</summary>b) It maps any real value to a probability between 0 and 1</details>

**Q2.** A model predicts 100 samples as positive. Of these, 80 are actually positive. Of the 900 actual negatives, 20 were predicted positive. What is the precision?

a) 80/100 = 0.80
b) 80/900 = 0.089
c) 80/(80+20) = 0.80
d) 80/(80+900) = 0.082

<details><summary>Answer</summary>c) 80/(80+20) = 0.80. Precision = TP / (TP + FP) = 80 / (80 + 20)</details>

**Q3.** In which scenario is recall more important than precision?

a) Spam detection (marking normal email as spam is bad)
b) Cancer screening (missing a cancer case is life-threatening)
c) Product recommendation (showing irrelevant products hurts UX)
d) Credit card fraud detection (false positives block legitimate purchases)

<details><summary>Answer</summary>b) Cancer screening — false negatives (missing cancer) have much higher cost than false positives</details>

**Q4.** What does an AUC of 0.50 mean?

a) The model makes perfect predictions
b) The model is no better than random guessing
c) All predictions are correct
d) The model always predicts the majority class

<details><summary>Answer</summary>b) The model is no better than random guessing</details>

**Q5.** The F1 score is:

a) The arithmetic mean of precision and recall
b) The harmonic mean of precision and recall
c) The geometric mean of precision and recall
d) The sum of precision and recall

<details><summary>Answer</summary>b) The harmonic mean of precision and recall</details>

## Short Answer (2 questions)

**Q6.** Explain why accuracy is a poor metric for imbalanced classification problems. Give a concrete example.

<details><summary>Answer</summary>Accuracy is misleading when classes are imbalanced because a model that always predicts the majority class will achieve high accuracy without learning anything. Example: cancer screening with 1% prevalence — a model that always predicts "no cancer" achieves 99% accuracy but misses all cancer cases. Precision, recall, and F1 provide a more honest evaluation.</details>

**Q7.** A logistic regression model gives coefficients: β₁ = 2.5 (feature A), β₂ = -0.8 (feature B). How do you interpret these values?

<details><summary>Answer</summary>The coefficients are in log-odds units. A one-unit increase in feature A multiplies the odds of being positive by exp(2.5) ≈ 12.2 (strong positive effect). A one-unit increase in feature B multiplies the odds by exp(-0.8) ≈ 0.45 (negative effect). Since they are in log-odds, not probability, the magnitude is not directly interpretable as probability change.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `plot_precision_recall_vs_threshold(model, X_val, y_val)` that plots precision and recall curves as functions of the decision threshold (0.0 to 1.0). The plot should show both curves on the same axes with a legend.

<details><summary>Answer</summary>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import precision_score, recall_score

def plot_precision_recall_vs_threshold(model, X_val, y_val):
    y_proba = model.predict_proba(X_val)[:, 1]
    thresholds = np.linspace(0, 1, 101)

    precisions, recalls = [], []
    for t in thresholds:
        y_pred = (y_proba >= t).astype(int)
        precisions.append(precision_score(y_val, y_pred, zero_division=0))
        recalls.append(recall_score(y_val, y_pred))

    plt.figure(figsize=(8, 5))
    plt.plot(thresholds, precisions, 'b-', label='Precision')
    plt.plot(thresholds, recalls, 'r-', label='Recall')
    plt.xlabel('Threshold')
    plt.ylabel('Score')
    plt.title('Precision and Recall vs. Threshold')
    plt.legend()
    plt.grid(True)
    plt.show()

from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
data = load_breast_cancer()
X_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, test_size=0.2, random_state=42)
model = LogisticRegression(max_iter=5000).fit(X_tr, y_tr)
plot_precision_recall_vs_threshold(model, X_te, y_te)
```
</details>
</details>
