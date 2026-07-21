# Lab 10: Applications — End-to-End Pipelines

## Objectives

- Build complete ML pipelines for regression and classification
- Work with mixed data types (numeric + categorical)
- Use GridSearchCV for hyperparameter tuning
- Combine clustering with classification

## Part 1: Biotech Quality Pipeline

Create a pipeline for the biotech quality dataset:
1. Create the synthetic dataset (500 samples)
2. Build a Pipeline: StandardScaler → RandomForestRegressor
3. Perform GridSearchCV over n_estimators and max_depth
4. Report best parameters and CV R²

## Part 2: Model Comparison

Compare LinearRegression, RandomForestRegressor, and GradientBoostingRegressor on the biotech dataset. Use pipelines with StandardScaler. Report RMSE and R².

**Question:** Which model performs best and why?

## Part 3: Pipeline with Mixed Data

Add a categorical feature `batch_type` to the biotech data. Create a ColumnTransformer that scales numeric features and one-hot encodes categorical features. Build a full pipeline and tune it.

## Part 4: SaaS Segmentation + Churn

1. Generate the SaaS customer dataset
2. Segment customers with K-Means (K=3)
3. Profile each segment
4. Train a churn model per segment
5. Compare AUC across segments

**Question:** Do different segments have different churn drivers?

## Part 5: Full Pipeline Function

Write a reusable function that takes X, y, a model, and a param_grid, and returns the best pipeline after GridSearchCV with 5-fold CV.

## Deliverables

- Notebook with all 5 parts
- Pipeline with GridSearchCV results (Part 1)
- Model comparison table (Part 2)
- Segment profiles (Part 4)

## Estimated time: 45 minutes
