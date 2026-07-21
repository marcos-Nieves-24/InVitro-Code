# Lab 4: Decision Trees

## Objectives

- Train and visualize decision trees
- Understand how depth affects overfitting
- Compute feature importance
- Compare Gini vs. entropy

## Part 1: Visualize a Tree

Load `load_iris()`, train a `DecisionTreeClassifier(max_depth=3)`, and visualize it using `plot_tree`.

**Questions:**
- Which feature is used at the root split?
- What is the Gini impurity of each leaf?

## Part 2: Depth and Overfitting

On the breast cancer dataset, train trees with max_depth = 1 through 15. Plot train and test accuracy vs. depth.

**Questions:**
- At what depth does the tree start overfitting?
- What is the optimal depth?
- What happens when max_depth = None?

## Part 3: Feature Importance

Train a tree with `max_depth=4` on breast cancer. Print feature importances sorted by value.

- Which are the top 5 features?
- Do the importances align with domain knowledge (e.g., worst radius, worst concavity are typically important)?

## Part 4: Gini vs. Entropy

Compare `criterion='gini'` vs `criterion='entropy'` on breast cancer with max_depth=4. Report test accuracy for both.

**Question:** Is there a meaningful difference?

## Part 5: Decision Tree Regressor

Use `DecisionTreeRegressor` on the diabetes dataset. Report train and test R² at various depths.

```python
from sklearn.tree import DecisionTreeRegressor
```

## Deliverables

- Notebook with all 5 parts
- Tree visualization (Part 1)
- Depth vs. accuracy plot (Part 2)
- Feature importance bar plot (Part 3)

## Estimated time: 45 minutes
