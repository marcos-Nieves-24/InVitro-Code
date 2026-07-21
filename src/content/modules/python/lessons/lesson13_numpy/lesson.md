---
Module: 2
Lesson Number: 13
Lesson Title: NumPy
Estimated Duration: 90 minutes
Prerequisites: L9-L12 — Lists, Tuples, Dictionaries, Sets
Learning Objectives:
  - Create NumPy arrays from Python lists and with built-in functions
  - Access and modify array elements using indexing and slicing
  - Perform element-wise operations with universal functions
  - Use broadcasting to perform operations on arrays of different shapes
  - Perform basic linear algebra operations
Keywords: NumPy, array, ndarray, broadcasting, universal function, linear algebra
Difficulty: Beginner-Intermediate
Programming Concepts: Array computing, vectorization, broadcasting, linear algebra
Mathematical Concepts: Matrix operations, broadcasting, linear algebra
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# NumPy

## Motivation

NumPy (Numerical Python) is the foundation of scientific computing in Python. It provides a high-performance multidimensional array object and tools for working with these arrays. Most data science libraries (Pandas, scikit-learn, TensorFlow) are built on NumPy. In biotechnology, NumPy arrays represent gene expression matrices, DNA sequence encodings, and medical imaging data. In SaaS, they store feature matrices, time series data, and user-embedding vectors.

## Big Picture

In previous lessons, you learned Python's built-in data structures (lists, tuples, dicts, sets). Lists can store multidimensional data but are slow for numerical operations. NumPy arrays solve this with vectorized operations that run at C speed. This lesson bridges Python fundamentals to the data science libraries you'll use next: Pandas (built on NumPy), Matplotlib (plots NumPy arrays), scikit-learn (trains on NumPy arrays).

## Theory

### What is NumPy?

NumPy is a Python library that provides:
- **ndarray**: Fast, memory-efficient multidimensional array
- **Universal functions (ufuncs)**: Element-wise operations
- **Broadcasting**: Operations on different-shaped arrays
- **Linear algebra**: Matrix operations, decompositions
- **Random number generation**: Various distributions

### Creating Arrays

```python
import numpy as np

# From lists
arr1d = np.array([1, 2, 3, 4, 5])
arr2d = np.array([[1, 2, 3], [4, 5, 6]])

# Built-in functions
zeros = np.zeros((3, 4))       # 3×4 array of zeros
ones = np.ones((2, 3))         # 2×3 array of ones
eye = np.eye(3)                # 3×3 identity matrix
full = np.full((2, 2), 7)      # 2×2 array of 7s
arange = np.arange(0, 10, 2)   # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5) # [0.0, 0.25, 0.5, 0.75, 1.0]
random = np.random.randn(3, 3)  # 3×3 random normal
```

### Array Attributes

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])
arr.shape      # (2, 3) — dimensions
arr.ndim       # 2 — number of dimensions
arr.size       # 6 — total elements
arr.dtype      # dtype('int64') — element type
arr.itemsize   # 8 — bytes per element
```

### Indexing and Slicing

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

arr[0, 1]       # 2 — row 0, col 1
arr[1]          # [4, 5, 6] — row 1
arr[:, 1]       # [2, 5, 8] — column 1
arr[0:2, 0:2]   # [[1, 2], [4, 5]] — submatrix
arr[arr > 3]    # [4, 5, 6, 7, 8, 9] — boolean indexing
```

### Universal Functions (ufuncs)

```python
arr = np.array([1, 2, 3, 4, 5])

np.sqrt(arr)    # Square root
np.exp(arr)     # Exponential
np.log(arr)     # Natural log
np.sin(arr)     # Sine
np.abs(arr)     # Absolute value

# Element-wise operations work naturally
arr + 10        # [11, 12, 13, 14, 15]
arr * 2         # [2, 4, 6, 8, 10]
arr ** 2        # [1, 4, 9, 16, 25]
```

### Broadcasting

Broadcasting allows operations between arrays of different shapes:

```python
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
row_mean = np.mean(arr, axis=1).reshape(-1, 1)  # Column vector
centered = arr - row_mean  # Broadcasting in action
```

### Linear Algebra

```python
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

np.dot(a, b)        # Matrix multiplication
a @ b               # Same (Python 3.5+)
np.linalg.inv(a)    # Matrix inverse
np.linalg.det(a)    # Determinant
np.linalg.eig(a)    # Eigenvalues and eigenvectors
```

## Visual Explanation

```
NumPy Array Memory Layout

Python List:                 NumPy Array:
┌──────┬──────┬──────┐      ┌──────────────────┐
│ 1    │ 2    │ 3    │      │ 1  2  3          │
├──────┼──────┼──────┤      │ 4  5  6          │
│ 4    │ 5    │ 6    │      │ 7  8  9          │
└──────┴──────┴──────┘      └──────────────────┘
                            Contiguous memory
Each element is a           Homogeneous type
Python object → slow        → fast computation
```

## Python Implementation

```python
import numpy as np

# Array creation
arr = np.array([[1, 2, 3], [4, 5, 6]])
print(f"Array:\n{arr}")
print(f"Shape: {arr.shape}")
print(f"Dimensions: {arr.ndim}")
print(f"Size: {arr.size}")
print(f"Dtype: {arr.dtype}")
```

```python
# Indexing and slicing
matrix = np.arange(9).reshape(3, 3)
print(f"Matrix:\n{matrix}")
print(f"Element [1,2]: {matrix[1, 2]}")
print(f"First row: {matrix[0]}")
print(f"Last column: {matrix[:, -1]}")
print(f"Submatrix:\n{matrix[:2, :2]}")
```

```python
# Universal functions
arr = np.array([1, 2, 3, 4, 5])
print(f"Original: {arr}")
print(f"Sqrt: {np.sqrt(arr)}")
print(f"Exp: {np.exp(arr):.2f}")
print(f"Log: {np.log(arr):.3f}")
print(f"Sin: {np.sin(arr):.3f}")
```

```python
# Broadcasting
prices = np.array([10, 20, 30, 40])
discount = np.array([0.9, 0.85, 0.8, 0.75])
print(f"Discounted: {prices * discount}")

# Scalar broadcasting
print(f"All + 5: {prices + 5}")
print(f"All * 1.1: {prices * 1.1}")
```

```python
# Statistical operations
data = np.random.randn(1000)
print(f"Mean: {data.mean():.3f}")
print(f"Std: {data.std():.3f}")
print(f"Min: {data.min():.3f}")
print(f"Max: {data.max():.3f}")
print(f"Median: {np.median(data):.3f}")
print(f"Percentiles: {np.percentile(data, [25, 50, 75])}")
```

```python
# Linear algebra
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

print(f"A:\n{a}")
print(f"B:\n{b}")
print(f"A @ B:\n{a @ b}")
print(f"A inverted:\n{np.linalg.inv(a)}")
print(f"Determinant: {np.linalg.det(a):.1f}")
```

## Biotechnology Example

**Scenario**: Analyzing gene expression data as a NumPy matrix.

```python
import numpy as np

# Simulate gene expression data (5 genes × 4 samples)
np.random.seed(42)
expression = np.random.randn(5, 4) * 2 + 5  # Mean 5, std 2
gene_names = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
sample_names = ["Sample_A", "Sample_B", "Sample_C", "Sample_D"]

print("Expression matrix:\n")
print(f"{'Gene':>8}", end=" ")
for s in sample_names:
    print(f"{s:>10}", end=" ")
print()
for i, gene in enumerate(gene_names):
    print(f"{gene:>8}", end=" ")
    for val in expression[i]:
        print(f"{val:>10.2f}", end=" ")
    print()

# Normalize: z-score per gene
means = expression.mean(axis=1).reshape(-1, 1)
stds = expression.std(axis=1).reshape(-1, 1)
z_scores = (expression - means) / stds

print(f"\nNormalized (z-score) expression:\n{z_scores}")

# Find highly expressed genes (z-score > 1.5)
high_expr = np.where(z_scores > 1.5)
print(f"\nHigh expression indices: {list(zip(high_expr[0], high_expr[1]))}")
```

## SaaS Example

**Scenario**: Analyzing user engagement metrics.

```python
import numpy as np

# Simulate daily active users (7 days × 3 products)
np.random.seed(42)
dau = np.random.randint(1000, 5000, size=(7, 3))
products = ["Dashboard", "Analytics", "Reports"]

print("Daily Active Users (7 days):")
print(f"{'Day':>5}", end=" ")
for p in products:
    print(f"{p:>12}", end=" ")
print()
for day in range(7):
    print(f"{day+1:>5}", end=" ")
    for prod in range(3):
        print(f"{dau[day, prod]:>12,}", end=" ")
    print()

# Weekly statistics
print(f"\nWeekly averages:")
for i, p in enumerate(products):
    print(f"  {p}: {dau[:, i].mean():.0f} ± {dau[:, i].std():.0f}")

# Growth rate (day-over-day)
growth = np.diff(dau, axis=0) / dau[:-1] * 100
print(f"\nGrowth rates (%):\n{growth}")

# Correlation between products
corr = np.corrcoef(dau.T)
print(f"\nCorrelation matrix:\n{corr}")
```

## Common Mistakes

1. **Confusing np.array() with Python lists**: Arrays support element-wise operations; lists do not
2. **Floating-point precision**: `np.float64` has limited precision like Python floats
3. **Copy vs view confusion**: Slicing returns a view, not a copy. Use `.copy()` for independent data
4. **Broadcasting errors**: Incompatible shapes raise ValueError. Check shapes with `.shape`
5. **Using `==` with floats**: Same precision issues as Python; use `np.isclose()`
6. **Forgetting dtype**: Mixed types in list → string dtype (all elements become strings)

## Best Practices

- Use `np.array()` with explicit dtype when needed
- Use vectorized operations instead of Python loops (much faster)
- Use `.copy()` when you need to modify a slice independently
- Use `np.isclose()` for floating-point comparisons
- Use `axis=` parameter for row-wise/column-wise operations
- Profile code: vectorized NumPy is 10-100x faster than Python loops

## Summary

- NumPy provides the ndarray: fast, memory-efficient, multidimensional
- Create arrays with `np.array()`, `np.zeros()`, `np.ones()`, `np.arange()`, etc.
- Indexing and slicing similar to lists, but with multidimensional capabilities
- Universal functions (ufuncs) operate element-wise at C speed
- Broadcasting enables operations on different-shaped arrays
- Linear algebra: `@`, `np.linalg.inv`, `np.linalg.eig`
- Always prefer vectorized operations over Python loops

## Key Terms

- **ndarray**: NumPy's multidimensional array object
- **Shape**: Tuple of array dimensions
- **Axis**: Dimension of an array (0=rows, 1=columns)
- **Vectorization**: Using array operations instead of loops
- **Broadcasting**: Rules for operating on arrays with different shapes
- **Universal function (ufunc)**: Element-wise function on arrays
- **Dtype**: Data type of array elements
- **View**: Alternative access to the same data (no copy)
- **Fancy indexing**: Indexing with boolean arrays or integer lists

## Exercises

### Level 1: Basic

1. Create a 4×4 array of zeros. How would you create its identity matrix version?
2. What is the difference between `arr[1]` and `arr[:, 1]` for a 2D array?
3. What does `np.arange(2, 10, 3)` return?

### Level 2: Implementation

4. Write a function that normalizes a matrix to have mean=0 and std=1 along each column.
5. Implement matrix multiplication manually (using loops) and then using `@`. Compare the performance on 100×100 matrices.

### Level 3: Critical Thinking

6. How does NumPy achieve its speed advantage over Python lists? What is the role of contiguous memory and vectorization?
7. When would broadcasting fail? Give an example of incompatible shapes and explain how to fix it.

## Coding Challenge

Write a program that implements **Principal Component Analysis (PCA)** from scratch using NumPy:
1. Generate a random dataset (100 samples, 5 features)
2. Center the data (subtract each column's mean)
3. Compute the covariance matrix
4. Compute eigenvalues and eigenvectors of the covariance matrix
5. Sort eigenvectors by eigenvalues (descending)
6. Project the data onto the first 2 principal components
7. Verify your result by comparing with the reconstruction error (reconstruct original from reduced data)
8. Use only NumPy — no scikit-learn
