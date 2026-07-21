# Quiz: Gradient Boosting

## Multiple Choice (5 questions)

**Q1.** What is the key difference between bagging and boosting?

a) Bagging uses deep trees; boosting uses shallow trees
b) Bagging trains trees independently; boosting trains trees sequentially
c) Bagging is for regression; boosting is for classification
d) They are the same algorithm with different names

<details><summary>Answer</summary>b) Bagging trains trees independently in parallel; boosting trains trees sequentially, each correcting the errors of the previous ensemble</details>

**Q2.** In gradient boosting, each new tree is trained to predict:

a) The original target variable
b) The residuals (errors) of the current ensemble
c) The average of all previous trees
d) Random noise

<details><summary>Answer</summary>b) The residuals (errors) of the current ensemble</details>

**Q3.** A lower learning rate in gradient boosting typically requires:

a) Fewer trees
b) More trees
c) Deeper trees
d) No change in tree configuration

<details><summary>Answer</summary>b) More trees. A lower learning rate shrinks each tree's contribution, so more trees are needed to achieve the same level of fit.</details>

**Q4.** Which of the following is TRUE about trees in gradient boosting?

a) Trees should be deep (depth 10+) to capture complex patterns
b) Trees are typically shallow (depth 2-5), acting as weak learners
c) Only one tree is used in boosting
d) Trees are always deeper than in Random Forest

<details><summary>Answer</summary>b) Trees are typically shallow (depth 2-5). Boosting works by combining many weak learners, not by using strong individual trees.</details>

**Q5.** XGBoost improves upon basic gradient boosting by adding:

a) Regularization to prevent overfitting
b) Automatic feature selection
c) Support for image data
d) Replacement of trees with neural networks

<details><summary>Answer</summary>a) Regularization to prevent overfitting (L1 and L2 regularization on tree weights)</details>

## Short Answer (2 questions)

**Q6.** Explain how early stopping works in gradient boosting and why it is important.

<details><summary>Answer</summary>Early stopping monitors performance on a validation set after each tree is added. When validation performance stops improving (or starts decreasing) for a specified number of iterations, training stops. This prevents overfitting by finding the optimal number of trees without manual tuning. It's important because boosting can overfit if too many trees are added, especially with a low learning rate.</details>

**Q7.** Compare the roles of learning rate and n_estimators in gradient boosting. What is the relationship between them?

<details><summary>Answer</summary>The learning rate (n) shrinks each tree's contribution to the ensemble. Lower n means each tree has less impact, requiring more trees (higher n_estimators) to achieve good performance. The relationship is approximately: optimal n_estimators * 1 / learning_rate. A common strategy: set learning_rate = 0.01-0.1 and use early stopping to determine n_estimators. Lower learning rates with more trees generally generalize better than higher learning rates with fewer trees.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `compare_boosting_vs_bagging(X, y)` that trains a GradientBoostingClassifier and a RandomForestClassifier (both with 100 estimators, max_depth=3) and returns a DataFrame comparing their train and test accuracies.

<details><summary>Answer</summary>

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score

def compare_boosting_vs_bagging(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    models = {
        'GradientBoosting': GradientBoostingClassifier(
            n_estimators=100, max_depth=3, random_state=42
        ),
        'RandomForest': RandomForestClassifier(
            n_estimators=100, max_depth=3, random_state=42
        ),
    }

    results = []
    for name, model in models.items():
        model.fit(X_train, y_train)
        results.append({
            'Model': name,
            'Train': accuracy_score(y_train, model.predict(X_train)),
            'Test': accuracy_score(y_test, model.predict(X_test)),
        })

    return pd.DataFrame(results)

from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
print(compare_boosting_vs_bagging(data.data, data.target).to_string(index=False))
```
</details>
</details>
