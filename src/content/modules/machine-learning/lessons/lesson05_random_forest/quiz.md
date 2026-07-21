# Quiz: Random Forest

## Multiple Choice (5 questions)

**Q1.** What is bagging?

a) Building trees on bootstrap samples and averaging them
b) Using all data to train a single deep tree
c) Reducing features before training
d) A type of neural network

<details><summary>Answer</summary>a) Building trees on bootstrap samples (samples with replacement) and averaging/averaging their predictions</details>

**Q2.** In Random Forest, why are only random subsets of features considered at each split?

a) To speed up training
b) To decorrelate trees, making the ensemble more effective
c) To reduce memory usage
d) To prevent overfitting of individual trees

<details><summary>Answer</summary>b) To decorrelate trees. If all trees used the same best split, they would be highly correlated and averaging wouldn't help much.</details>

**Q3.** The out-of-bag (OOB) score is computed using:

a) The training data
b) The test data
c) Samples not included in each bootstrap sample (~37%)
d) A separate validation set

<details><summary>Answer</summary>c) Samples not included in each bootstrap sample (~37% are left out on average)</details>

**Q4.** Which of the following is TRUE about Random Forest?

a) Increasing n_estimators always increases training time linearly
b) More trees always guarantee better performance
c) Random Forest can only be used for classification
d) Feature importance is not available

<details><summary>Answer</summary>a) Increasing n_estimators always increases training time linearly. (b is false — returns diminish; c is false — there's RandomForestRegressor; d is false — feature importance is a key output)</details>

**Q5.** A Random Forest typically has _____ bias and _____ variance compared to a single decision tree.

a) Higher, lower
b) Lower, lower
c) Similar, lower
d) Lower, higher

<details><summary>Answer</summary>c) Similar bias, lower variance. Random Forest keeps the low bias of trees while reducing variance through averaging.</details>

## Short Answer (2 questions)

**Q6.** Explain the relationship between the number of trees (n_estimators) and Random Forest performance. Why do returns diminish?

<details><summary>Answer</summary>As n_estimators increases, performance improves rapidly at first then plateaus. Each tree is an unbiased estimator with high variance. Averaging reduces variance by approximately 1/B where B is the number of trees. However, trees are correlated (ρ > 0), so even with infinite trees, the variance approaches ρσ². Empirical rule: start with 100 trees and increase until OOB score stabilizes.</details>

**Q7.** When would you use permutation importance instead of impurity-based feature importance in Random Forest?

<details><summary>Answer</summary>Impurity-based importance can be biased toward high-cardinality features (those with many unique values) and can be misleading when features are on different scales. Permutation importance directly measures the drop in performance when a feature's values are shuffled, making it more reliable. Use permutation importance for final feature selection, impurity importance for a quick overview.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `oob_vs_n_estimators(X, y, max_n=500)` that trains Random Forests with n_estimators from 1 to max_n (in steps of 10) and returns a list of OOB scores. Then plot OOB score vs. n_estimators.

<details><summary>Answer</summary>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier

def oob_vs_n_estimators(X, y, max_n=500):
    n_values = np.arange(1, max_n + 1, 10)
    oob_scores = []
    for n in n_values:
        rf = RandomForestClassifier(n_estimators=n, oob_score=True, random_state=42, n_jobs=-1)
        rf.fit(X, y)
        oob_scores.append(rf.oob_score_)
    return n_values, oob_scores

from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
n_vals, oobs = oob_vs_n_estimators(data.data, data.target, max_n=300)

plt.figure(figsize=(8, 5))
plt.plot(n_vals, oobs, 'b-')
plt.xlabel('Number of Trees')
plt.ylabel('OOB Score')
plt.title('OOB Score vs. n_estimators')
plt.grid(True)
plt.show()
```
</details>
</details>
