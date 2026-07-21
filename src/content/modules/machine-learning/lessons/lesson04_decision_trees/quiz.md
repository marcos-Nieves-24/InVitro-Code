# Quiz: Decision Trees

## Multiple Choice (5 questions)

**Q1.** Gini impurity measures:

a) The depth of a decision tree
b) The probability of incorrect classification in a node
c) The number of samples in a node
d) The accuracy of the model

<details><summary>Answer</summary>b) The probability of incorrect classification in a node (Gini = 1 - Σ(pᵢ²))</details>

**Q2.** A node contains 60 samples of class A and 40 samples of class B. What is the Gini impurity?

a) 0.50
b) 0.48
c) 0.52
d) 0.60

<details><summary>Answer</summary>b) 0.48. Gini = 1 - (0.6² + 0.4²) = 1 - (0.36 + 0.16) = 0.48</details>

**Q3.** Information gain is:

a) The accuracy of a split
b) The reduction in impurity after a split
c) The number of samples in a leaf
d) The depth of the tree

<details><summary>Answer</summary>b) The reduction in impurity after a split (parent impurity minus weighted child impurities)</details>

**Q4.** A decision tree that grows until every leaf is pure is likely suffering from:

a) Underfitting
b) Overfitting
c) Multicollinearity
d) Class imbalance

<details><summary>Answer</summary>b) Overfitting — the tree has memorized the training data, including noise</details>

**Q5.** Which of the following is NOT a valid way to prevent overfitting in decision trees?

a) Limiting max_depth
b) Setting min_samples_split to a higher value
c) Increasing the number of features
d) Pruning the tree after training

<details><summary>Answer</summary>c) Increasing the number of features (more features can actually increase overfitting risk)</details>

## Short Answer (2 questions)

**Q6.** Explain why decision trees are considered "unstable" classifiers. What does this mean in practice?

<details><summary>Answer</summary>Decision trees are unstable because small changes in the training data can lead to very different trees. A few different samples at the top of the tree change the entire structure. In practice, this means variance is high — trees from different data splits can give different feature importance rankings and predictions. Random Forests address this by averaging many trees.</details>

**Q7.** Compare Gini impurity and entropy as splitting criteria. When would you choose one over the other?

<details><summary>Answer</summary>Both measure node impurity and produce similar trees in practice. Gini ranges from 0 to 0.5 (binary), entropy from 0 to 1. Gini is slightly faster to compute (no log). Entropy is more sensitive to changes in probability near 0.5. scikit-learn uses Gini by default. The practical difference is minimal — both will find the same splits in most cases.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `compute_gini(y)` that computes Gini impurity from an array of class labels. Then, write `find_best_split(X, y, feature_idx)` that finds the best threshold for a given feature (maximizing information gain using Gini).

<details><summary>Answer</summary>

```python
import numpy as np

def compute_gini(y):
    classes, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return 1 - np.sum(probs ** 2)

def find_best_split(X, y, feature_idx):
    values = X[:, feature_idx]
    sorted_idx = np.argsort(values)
    X_sorted = values[sorted_idx]
    y_sorted = y[sorted_idx]

    best_gain, best_threshold = 0, None
    parent_gini = compute_gini(y)

    for i in range(1, len(y_sorted)):
        if X_sorted[i] == X_sorted[i - 1]:
            continue
        threshold = (X_sorted[i] + X_sorted[i - 1]) / 2
        y_left = y_sorted[:i]
        y_right = y_sorted[i:]
        n_left, n_right = len(y_left), len(y_right)
        weighted_gini = (n_left * compute_gini(y_left) + n_right * compute_gini(y_right)) / len(y)
        gain = parent_gini - weighted_gini
        if gain > best_gain:
            best_gain = gain
            best_threshold = threshold

    return best_threshold, best_gain

from sklearn.datasets import load_iris
iris = load_iris()
th, gain = find_best_split(iris.data, iris.target, 2)
print(f"Best threshold for petal length: {th:.2f}, info gain: {gain:.4f}")
```
</details>
</details>
