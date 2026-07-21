# Assignment 8: Gradient Boosting

## Objectives

- Apply gradient boosting to a regression problem
- Tune hyperparameters systematically
- Compare multiple ensemble methods
- Write a model selection recommendation

## Dataset

Use the **California Housing** dataset.

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

## Scenario

A real estate analytics company needs a model to predict house prices. You must compare multiple ensemble methods and recommend the best one.

## Instructions

1. **Split** into train (70%), validation (15%), test (15%)
2. **Train the following models** (use validation set for tuning):
   - DecisionTreeRegressor (tune max_depth)
   - RandomForestRegressor (tune n_estimators, max_depth)
   - GradientBoostingRegressor (tune learning_rate, n_estimators, max_depth)
3. **Compare models** on validation set using R² and RMSE
4. **Select the best model** and evaluate on test set
5. **Create a learning curve** for the best model (R² vs. n_estimators)

## Deliverables

- Notebook with all steps
- Table comparing all models (R², RMSE on train/val)
- Learning curve for the best model
- Report (max 300 words):
  - Which model performed best and why?
  - What were the optimal hyperparameters?
  - How does boosting compare to bagging for this problem?
  - Would you use this model in production? Why or why not?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Model comparison | 3+ models with tuning | 2 models | 1 model | Missing |
| Hyperparameter tuning | Systematic search | Partial | Minimal | Missing |
| Evaluation | R² + RMSE with interpretation | Both metrics | One metric | Missing |
| Learning curve | Clear, annotated | Present | Unclear | Missing |
| Recommendation | Insightful, production-aware | Clear | Basic | Missing |

## Estimated time: 2 hours
