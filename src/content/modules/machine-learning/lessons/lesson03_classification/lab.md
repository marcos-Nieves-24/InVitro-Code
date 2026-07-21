# Lab 3: Classification

## Objectives

- Train logistic regression models with scikit-learn
- Evaluate using confusion matrix, precision, recall, F1, ROC AUC
- Visualize decision boundaries
- Tune classification thresholds

## Part 1: Synthetic Data

```python
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                            class_sep=1.0, random_state=42)
```

Train a logistic regression model and plot the decision boundary (similar to the notebook example).

## Part 2: Breast Cancer Classification

Load `load_breast_cancer()`, split with `stratify=y`, train logistic regression, and report:

- Confusion matrix
- Precision, recall, F1 for both classes
- ROC curve with AUC

## Part 3: Threshold Exploration

For the breast cancer model:
1. Compute precision, recall, and F1 for thresholds [0.1, 0.3, 0.5, 0.7, 0.9]
2. For each threshold, explain what kind of errors increase
3. Which threshold would you choose if false negatives are 10× more costly than false positives?

## Part 4: Imbalanced Data

```python
from sklearn.datasets import make_classification
X_imb, y_imb = make_classification(n_samples=1000, weights=[0.95, 0.05],
                                    random_state=42)
```

Train logistic regression. Report accuracy, precision, recall, F1. Why is accuracy misleading here?

## Deliverables

- Notebook with all 4 parts
- Decision boundary plot (Part 1)
- ROC curve (Part 2)
- Table of threshold metrics (Part 3)
- Written explanation of accuracy vs. F1 (Part 4)

## Estimated time: 45 minutes
