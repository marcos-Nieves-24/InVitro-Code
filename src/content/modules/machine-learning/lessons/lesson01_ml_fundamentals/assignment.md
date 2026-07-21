# Assignment 1: ML Fundamentals

## Objectives

- Apply the ML workflow to a real-world dataset
- Diagnose and fix overfitting and underfitting
- Write a clear report explaining your findings

## Dataset

Use the **California Housing dataset** from scikit-learn:

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

This dataset contains 20,640 samples with 8 features (MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude) and targets are median house values.

## Instructions

1. **Load and explore** the dataset (shape, feature names, target distribution)
2. **Split** into train (70%), validation (15%), and test (15%)
3. **Train a baseline** `LinearRegression` model
4. **Experiment with complexity:**
   - Create polynomial features (degree 2, 3, 5)
   - Train models on each
   - Plot train vs validation R² against complexity
5. **Diagnose fit** for each model
6. **Select the best model** based on validation performance
7. **Final evaluation** on test set

## Deliverables

- Python script or notebook with all code
- A plot showing train vs validation R² vs model complexity
- A short report (max 1 page) answering:
  - Which degree polynomial was optimal?
  - How did you diagnose overfitting/underfitting?
  - What is the final test R²?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Code correctness | All code runs, no errors | Minor issues | Some errors | Does not run |
| Train/test split | Correct with validation split | Train/test only | Split incorrect | No split |
| Complexity experiment | 4+ degrees tested with plot | 3 degrees tested | 1-2 degrees | Missing |
| Diagnosis | Clear classification of fit | Mostly correct | Vague | Missing |
| Report | Well-written, insightful | Good insights | Basic | Minimal |

## Estimated time: 1.5 hours
