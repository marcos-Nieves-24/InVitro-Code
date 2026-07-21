# Lab: Descriptive Statistics

## Objective

Apply descriptive statistics to analyze a real-world dataset using Python.

## Duration

60 minutes

## Dataset

We will use the Diabetes dataset from sklearn.

```python
from sklearn.datasets import load_diabetes
diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df['target'] = diabetes.target
```

## Instructions

### Part 1: Data Overview (10 min)

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes

diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df['target'] = diabetes.target
print(df.head())
print(df.info())
```

### Part 2: Central Tendency (10 min)

Compute and interpret the mean, median, and mode for the `age`, `bmi`, and `bp` columns.

### Part 3: Dispersion (10 min)

Compute variance, standard deviation, range, and IQR for all numeric columns.

### Part 4: Outlier Detection (15 min)

For the `bmi` column:
1. Calculate Q1, Q3, and IQR
2. Identify outliers using the IQR rule
3. Create a boxplot
4. Report how many outliers exist and whether they seem like data errors

### Part 5: Summary Report (15 min)

Write a function `summarize(df)` that returns a DataFrame with:
- Column name
- Mean, median, std, min, max
- Q1, Q3, IQR
- Outlier count

## Deliverables

Submit a single Python script (`.py` or `.ipynb`) containing:
- All code with comments
- Interpretation of descriptive statistics for the diabetes dataset
- A boxplot showing outliers in BMI

## Rubric

| Criteria | Points |
|----------|--------|
| Correct descriptive statistics computation | 4 |
| Outlier detection implementation | 3 |
| Boxplot with proper formatting | 2 |
| Written interpretation | 1 |

Total: 10 points
