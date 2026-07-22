# Slides: Model Evaluation

## Slide 1: Title
- Model Evaluation for Regression
- Module 3, Lesson 9

## Slide 2: Learning Objectives
- Split data into train/test
- Implement cross-validation
- Compute MAE, MSE, RMSE, R²
- Diagnose overfitting

## Slide 3: The Goal of Evaluation
- Estimate performance on unseen data
- Detect overfitting
- Compare different models
- Guide model selection

## Slide 4: Train/Test Split
- 70-80% train, 20-30% test
- Test set is NEVER used during training
- Simulates real-world performance
- Single split can be unstable

## Slide 5: Cross-Validation
- Divide data into k folds
- Train on k-1 folds, test on remaining
- Repeat k times
- Each point tested exactly once
- More stable estimate than single split

## Slide 6: MAE (Mean Absolute Error)
- MAE = (1/n) Σ |y - ŷ|
- Average absolute error
- In original units
- Interpretable

## Slide 7: MSE and RMSE
- MSE = (1/n) Σ (y - ŷ)²
- Penalizes large errors more
- RMSE = √MSE (in original units)
- RMSE ≥ MAE (always)

## Slide 8: R² (Coefficient of Determination)
- R² = 1 - SSE / SST
- Proportion of variance explained
- 1 = perfect, 0 = mean predictor
- Can be negative (worse than mean)

## Slide 9: Overfitting Detection
- Train R² >> Test R²
- CV scores vary widely
- Model memorizes training data
- Fix: simplify model, more data, regularization

## Slide 10: Key Takeaways
- Never evaluate on training data
- Use cross-validation for reliable estimates
- Report multiple metrics
- Check residual plots
- Compare against simple baselines
