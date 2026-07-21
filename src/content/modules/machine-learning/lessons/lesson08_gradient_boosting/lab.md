# Lab 8: Gradient Boosting

## Objectives

- Train gradient boosting models and understand the effect of learning rate
- Use staged predictions to monitor training
- Compare boosting with Random Forest
- Tune hyperparameters

## Part 1: Learning Rate Experiment

On the breast cancer dataset, train `GradientBoostingClassifier` with learning_rates = [0.01, 0.05, 0.1, 0.5, 1.0] and n_estimators=100. Plot test accuracy vs. learning rate.

**Question:** What is the optimal learning rate?

## Part 2: Staged Predictions

Train a GB model with n_estimators=200, learning_rate=0.1. Use `staged_score()` to get train and test scores at each stage. Plot both curves.

**Question:** At what n_estimators does test accuracy plateau?

## Part 3: Boosting vs. Random Forest

Compare GradientBoostingClassifier (lr=0.1, n=100, depth=3) with RandomForestClassifier (n=100, depth=3) on breast cancer.

**Question:** Which performs better on this dataset?

## Part 4: Effect of max_depth

Train GB models with max_depth = [2, 3, 5, 10] (learning_rate=0.1, n_estimators=100). Compare test accuracy.

**Question:** Why does depth 10 perform worse than depth 3?

## Part 5: Subsample (Stochastic Boosting)

Train GB with subsample = [0.5, 0.8, 1.0] (learning_rate=0.1, n_estimators=100, max_depth=3). Compare test accuracy.

**Question:** Does stochasticity help generalization?

## Deliverables

- Notebook with all 5 parts
- Learning rate plot (Part 1)
- Learning curves (Part 2)
- Model comparison table (Part 3)

## Estimated time: 45 minutes
