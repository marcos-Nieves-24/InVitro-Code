# NumPy — Slide Outline

## Slide 1: Title Slide
- NumPy: Numerical Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why NumPy?
- Foundation of scientific Python
- Fast array operations (C speed)
- Building block for Pandas, scikit-learn, TensorFlow
- ML: feature matrices, model parameters

## Slide 3: The ndarray
- Homogeneous multidimensional array
- Contiguous memory → fast access
- Vectorized operations → no Python loops
- Rich set of functions

## Slide 4: Creating Arrays
```python
np.array([1, 2, 3])
np.zeros((3, 4))
np.ones((2, 3))
np.eye(3)
np.arange(0, 10, 2)
np.linspace(0, 1, 5)
np.random.randn(3, 3)
```

## Slide 5: Array Attributes
```python
arr.shape    # (2, 3) dimensions
arr.ndim     # 2
arr.size     # 6 elements
arr.dtype    # dtype('int64')
```
- Shape tells you the dimensions
- Dtype tells you element type

## Slide 6: Indexing and Slicing
```python
arr[0, 1]       # Element
arr[1]          # Row
arr[:, 1]       # Column
arr[0:2, 0:2]   # Submatrix
arr[arr > 3]    # Boolean indexing
```
- Similar to lists but multi-dimensional

## Slide 7: Universal Functions
```python
np.sqrt(arr)  # Square root
np.exp(arr)   # Exponential
np.log(arr)   # Natural log
np.sin(arr)   # Sine
np.abs(arr)   # Absolute value
```
- Element-wise operations
- C implementation → fast

## Slide 8: Broadcasting
```python
arr + 10              # Scalar broadcast
arr + np.array([1, 2, 3])  # Vector broadcast
```
- Operate on different shapes
- Follow strict broadcasting rules
- Avoids explicit loops

## Slide 9: Broadcasting Rules
1. Make arrays have same number of dimensions
2. Dimensions of size 1 are stretched
3. Incompatible shapes → error

## Slide 10: Linear Algebra
```python
a @ b               # Matrix multiply
np.linalg.inv(a)    # Inverse
np.linalg.det(a)    # Determinant
np.linalg.eig(a)    # Eigenvalues
np.linalg.svd(a)    # SVD
```

## Slide 11: Statistical Operations
```python
arr.sum() / .mean() / .std()
arr.min() / .max()
arr.cumsum()
np.percentile(arr, [25, 75])
np.corrcoef(arr)
```
- Specify axis for row/column operations

## Slide 12: Biotech Example
- Gene expression matrix (genes × samples)
- Normalization with broadcasting
- Z-score calculation
- Threshold-based filtering

## Slide 13: Common Mistakes
- Copy vs view confusion
- Broadcasting shape errors
- Forgetting dtype
- Using `==` with floats
- Python loops instead of vectorization

## Slide 14: Best Practices
- Always vectorize (no Python loops)
- Use `.copy()` when modifying slices
- Check shapes with `.shape`
- Use `np.isclose()` for float comparison
- Profile code to find bottlenecks

## Slide 15: Summary
- ndarray: fast, homogeneous, multidimensional
- Vectorized operations = C speed
- Broadcasting = flexible shape handling
- Universal functions = element-wise operations
- Linear algebra: @, linalg module
- Foundation for all ML libraries
