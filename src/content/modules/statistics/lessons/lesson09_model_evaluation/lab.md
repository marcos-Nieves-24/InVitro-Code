# Lab: Model Evaluation

## Objective

Train and evaluate a regression model using multiple metrics and cross-validation.

## Duration

60 minutes

## Dataset

California Housing from sklearn.

## Instructions

### Part 1: Train/Test Split (10 min)
1. Load California housing dataset
2. Split into 80% train, 20% test
3. Train a LinearRegression model
4. Predict on test set

### Part 2: Performance Metrics (15 min)
1. Compute MAE, MSE, RMSE, R² on test set
2. Also compute training set R²
3. Is there evidence of overfitting? Compare train vs test R²

### Part 3: Cross-Validation (15 min)
1. Perform 5-fold cross-validation
2. Report mean and standard deviation of R²
3. Perform 10-fold CV and compare with 5-fold
4. Interpret: is the model stable across folds?

### Part 4: Residual Analysis (10 min)
1. Plot residuals vs predicted values
2. Plot histogram of residuals
3. Are residuals centered at 0? Randomly scattered?
4. What do the residual patterns tell you?

### Part 5: Feature Importance (10 min)
1. Extract model coefficients
2. Sort by absolute value
3. Which features are most influential?
4. Interpret the top 2 features

## Deliverables

- Jupyter notebook with code, plots, and interpretations

## Rubric

| Criteria | Points |
|----------|--------|
| Train/test split and metrics | 3 |
| Cross-validation | 2 |
| Residual analysis | 2 |
| Feature importance interpretation | 3 |
Total: 10 points
