# Lab: Pandas Data Manipulation

## Objective

Practice creating DataFrames, filtering, grouping, merging, and applying functions.

## Duration

90 minutes

## Prerequisites

Lesson 13: NumPy

## Instructions

### Part 1: Creating DataFrames

```python
import pandas as pd
import numpy as np

# From dictionary
df1 = pd.DataFrame({
    "Product": ["A", "B", "C", "D"],
    "Price": [10, 20, 15, 25],
    "Quantity": [100, 150, 120, 80]
})
print("From dict:")
print(df1)

# From list of dicts
df2 = pd.DataFrame([
    {"City": "NY", "Temp": 72},
    {"City": "LA", "Temp": 85},
    {"City": "CHI", "Temp": 65},
])
print("\nFrom list of dicts:")
print(df2)
```

### Part 2: Exploring Data

```python
# Create sample data
np.random.seed(42)
df = pd.DataFrame({
    "Category": np.random.choice(["A", "B", "C"], 50),
    "Value": np.random.randn(50) * 10 + 50,
    "Score": np.random.randint(0, 100, 50),
})

print("First 5 rows:")
print(df.head())
print("\nInfo:")
print(df.info())
print("\nDescribe:")
print(df.describe())
```

### Part 3: Filtering and Selection

```python
# Boolean filtering
high_score = df[df["Score"] > 70]
category_a = df[df["Category"] == "A"]
high_value = df[(df["Value"] > 50) & (df["Score"] > 60)]

print(f"High score: {len(high_score)} rows")
print(f"Category A: {len(category_a)} rows")
print(f"High value + score: {len(high_value)} rows")
```

### Part 4: GroupBy

```python
# Group by category
grouped = df.groupby("Category")
print("Mean per category:")
print(grouped[["Value", "Score"]].mean())

print("\nAggregation:")
print(grouped.agg({
    "Value": ["mean", "std", "count"],
    "Score": ["min", "max"]
}))
```

### Part 5: Merging

```python
# Merge two DataFrames
left = pd.DataFrame({"ID": [1, 2, 3], "Name": ["A", "B", "C"]})
right = pd.DataFrame({"ID": [1, 2, 4], "Score": [95, 87, 92]})

merged = pd.merge(left, right, on="ID", how="left")
print("Left merge:")
print(merged)
```

### Part 6: Apply Functions

```python
# Apply transformations
df["Value_Rounded"] = df["Value"].apply(lambda x: round(x, 1))
df["Score_Group"] = df["Score"].apply(
    lambda x: "High" if x >= 70 else ("Medium" if x >= 40 else "Low")
)
print(df.head(10))
```

## Deliverables

Jupyter notebook `pandas_lab.ipynb` with all exercises.
