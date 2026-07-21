# Assignment 2: Linear Regression

## Objectives

- Apply linear regression to a real problem
- Compare multiple feature subsets
- Diagnose assumption violations
- Write a professional report

## Dataset

**Boston Housing** alternative: Use `fetch_california_housing` from scikit-learn.

## Instructions

1. **Split** the data into train (70%), validation (15%), test (15%)
2. **Train three models:**
   - Model A: MedInc only (simple)
   - Model B: All 8 features
   - Model C: All 8 features + interaction terms (MedInc × AveRooms, Latitude × Longitude)
3. **Evaluate** each model on validation set using R² and RMSE
4. **Analyze residuals** for the best model
5. **Select the best model** and evaluate on test set

## Deliverables

- Python script or notebook
- Table comparing the three models (training and validation R², RMSE)
- Scatter plot: predicted vs. actual for the best model
- Residual plots for the best model
- Report (max 500 words):
  - Which model performed best and why?
  - Were any assumptions violated?
  - How would you improve the model further?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Multiple models | 3 models with interaction | 2 models | 1 model | Missing |
| Evaluation | R² + RMSE for train/val | Both metrics | One metric | Missing |
| Residual analysis | Plots + interpretation | Plots only | One plot | Missing |
| Report | Insightful, well-written | Clear | Basic | Missing |
| Code quality | Clean, well-commented | Readable | Messy | Does not run |

## Estimated time: 2 hours
