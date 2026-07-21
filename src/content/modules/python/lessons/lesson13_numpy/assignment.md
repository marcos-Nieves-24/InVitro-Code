# Assignment: NumPy Matrix Operations

## Objectives

- Create and manipulate NumPy arrays
- Perform matrix operations using vectorized code
- Implement data normalization and transformation
- Apply broadcasting rules correctly

## Instructions

Create a Python script `numpy_ops.py` that implements the following functions **using only NumPy** (no explicit Python loops):

1. `create_design_matrix(X)` — given an N×1 feature vector, create an N×2 design matrix with [X, 1] (for linear regression with intercept)

2. `standardize(X)` — center and scale each column to mean=0, std=1

3. `covariance_matrix(X)` — compute the covariance matrix (N features × N features)

4. `pairwise_distance(X)` — compute Euclidean distance between all pairs of rows in X (return N×N distance matrix)

5. `ridge_regression(X, y, lambda_)` — implement ridge regression: β = (XᵀX + λI)⁻¹ Xᵀy

6. `mse(y_true, y_pred)` — compute mean squared error

## Starter Data

```python
np.random.seed(42)
X = np.random.randn(100, 5)
y = X @ np.array([1.5, -2.0, 0.5, 3.0, -1.0]) + np.random.randn(100) * 0.1
```

## Deliverables

- `numpy_ops.py` with all functions
- Demonstration script showing each function works correctly
- Timing comparison: vectorized vs loop-based implementation for `pairwise_distance`

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Needs Improvement (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Vectorization | All functions vectorized (no Python loops) | Most functions vectorized | Loop-based |
| Array Operations | Correct broadcasting, indexing, reshaping | Mostly correct | Errors |
| Linear Algebra | Correct matrix operations (inverse, multiply, transpose) | Most correct | Major errors |
| Functions | All 6 implemented correctly | 4-5 implemented | < 4 implemented |
| Performance | Includes timing comparison | Code runs but slow | Not measured |

## Estimated Completion Time

90 minutes
