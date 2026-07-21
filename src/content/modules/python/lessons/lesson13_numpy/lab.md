# Lab: NumPy Fundamentals

## Objective

Practice creating arrays, indexing, slicing, broadcasting, and universal functions.

## Duration

90 minutes

## Prerequisites

Lessons 9-12 (Lists, Tuples, Dicts, Sets)

## Instructions

### Part 1: Array Creation

```python
import numpy as np

# Different creation methods
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 4))
c = np.ones((2, 5))
d = np.eye(4)
e = np.arange(0, 20, 2)
f = np.linspace(0, 1, 10)
g = np.random.randn(3, 3)

print(f"arange: {e}")
print(f"linspace: {f}")
print(f"eye:\n{d}")
```

### Part 2: Indexing and Slicing

```python
matrix = np.arange(16).reshape(4, 4)
print(f"Matrix:\n{matrix}")
print(f"Element [2, 3]: {matrix[2, 3]}")
print(f"First 2 rows, cols 1-3:\n{matrix[:2, 1:4]}")
print(f"Every other element: {matrix[::2, ::2]}")
print(f"Last column: {matrix[:, -1]}")
```

### Part 3: Universal Functions

```python
arr = np.array([1, 4, 9, 16, 25])
print(f"Original: {arr}")
print(f"sqrt: {np.sqrt(arr)}")
print(f"log: {np.log(arr)}")
print(f"abs(-arr): {np.abs(-arr)}")

# Trig functions
angles = np.array([0, np.pi/2, np.pi])
print(f"sin(angles): {np.sin(angles)}")
```

### Part 4: Broadcasting

```python
# Add a vector to each row
matrix = np.ones((4, 3))
vector = np.array([1, 2, 3])
result = matrix + vector
print(f"Matrix + vector:\n{result}")

# Multiply columns by different values
factors = np.array([0.5, 1.5, 2.0])
scaled = matrix * factors
print(f"Scaled:\n{scaled}")
```

### Part 5: Statistical Operations

```python
data = np.random.randn(1000, 5)
print(f"Shape: {data.shape}")
print(f"Mean per column: {data.mean(axis=0)}")
print(f"Std per column: {data.std(axis=0)}")
print(f"Mean of all: {data.mean():.3f}")

# Center the data
centered = data - data.mean(axis=0)
print(f"Centered mean (~0): {centered.mean(axis=0)}")
```

## Deliverables

Jupyter notebook `numpy_lab.ipynb` with all exercises.
