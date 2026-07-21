# Lab 5: Random Forest

## Objectives

- Compare single trees vs. Random Forest
- Use OOB score for model evaluation
- Analyze feature importance
- Tune hyperparameters

## Part 1: Tree vs. Forest

On the breast cancer dataset, train:
1. A single decision tree (max_depth=5)
2. A Random Forest (n_estimators=100, max_depth=5)

Compare train and test accuracy.

**Question:** What improvement does the forest provide?

## Part 2: OOB Score as Validation

Train a Random Forest with `oob_score=True`. Compare OOB score to test set accuracy for n_estimators = [10, 25, 50, 100, 200].

**Question:** Is OOB score a reliable proxy for test accuracy?

## Part 3: Feature Importance

Train a Random Forest with n_estimators=200. Plot the top 10 feature importances. Compare with the importance from a single tree (depth 5).

**Question:** Are the top features the same? If not, why?

## Part 4: n_estimators and Diminishing Returns

Plot OOB score vs. n_estimators from 1 to 500 in steps of 10.

**Question:** At what n do returns diminish? What's the cost-benefit sweet spot?

## Part 5: Random Forest on Imbalanced Data

Use `make_classification(weights=[0.9, 0.1])` to create imbalanced data. Compare:
1. Default Random Forest
2. Random Forest with `class_weight='balanced'`

Report precision and recall for the minority class.

## Deliverables

- Notebook with all 5 parts
- OOB vs. n_estimators plot
- Feature importance comparison plot
- Precision/recall comparison for imbalanced data

## Estimated time: 45 minutes
