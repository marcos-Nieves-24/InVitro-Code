# Assignment: Model Evaluation Report

## Objectives

- Train multiple regression models and compare performance
- Use cross-validation for reliable evaluation
- Diagnose overfitting and model assumptions
- Write a professional evaluation report

## Instructions

1. Load the California housing dataset
2. Train and compare 3 models:
   - LinearRegression
   - A model that always predicts the mean (baseline)
   - Ridge regression (from sklearn.linear_model)

3. For each model:
   - Perform 10-fold cross-validation
   - Report mean ± std of R², MAE, RMSE
   - Compare training vs testing performance

4. **Best Model Deep Dive**:
   - Take the best model (highest CV R²)
   - Fit on full training set
   - Create residual plots
   - Check homoscedasticity (equal variance of residuals)
   - Check normality of residuals
   - Report top 3 most influential features

5. **Report Structure**:
   - Executive summary (3-4 sentences)
   - Methodology (how models were evaluated)
   - Results (table comparing all models)
   - Best model analysis (plots and interpretations)
   - Conclusions and recommendations

## Deliverables

- Jupyter notebook with all code and a markdown report

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Model comparison | All 3 models, proper CV | Minor issues | Missing one | Incomplete |
| Performance metrics | All metrics for all models | Most metrics | Partial | Missing |
| Residual analysis | Complete with interpretation | Good | Basic | Missing |
| Report quality | Professional, well-structured | Good | Adequate | Poorly written |
| Feature interpretation | Insightful | Good | Basic | Missing |

**Total: 20 points**

## Estimated Time

3 hours
