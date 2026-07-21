---
Module: 2
Lesson Number: 14
Lesson Title: Pandas
Estimated Duration: 90 minutes
Prerequisites: L13 — NumPy
Learning Objectives:
  - Create and manipulate Series and DataFrame objects
  - Load data from CSV files using read_csv()
  - Filter, select, and subset data using boolean indexing
  - Use groupby for data aggregation
  - Merge/join multiple DataFrames
  - Apply functions to data with apply() and map()
Keywords: Pandas, DataFrame, Series, groupby, merge, apply, read_csv
Difficulty: Beginner-Intermediate
Programming Concepts: Data manipulation, tabular data, aggregation
Datasets Used: None (synthetic data)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Pandas

## Motivation

Pandas is the most widely used Python library for data manipulation and analysis. It provides the DataFrame — a tabular data structure with labeled rows and columns that makes data cleaning, transformation, and analysis intuitive. In biotechnology, Pandas handles clinical trial data, gene expression tables, and patient records. In SaaS, it processes customer databases, transaction logs, and A/B test results. Most of your time as a data scientist will be spent manipulating DataFrames.

## Big Picture

In the previous lesson, you learned NumPy for numerical computing. Pandas is built on top of NumPy and adds labeled axes, missing data handling, and powerful data operations. This lesson directly prepares you for the visualization lessons (Matplotlib, Seaborn) and for all of Machine Learning (scikit-learn expects NumPy arrays that come from Pandas DataFrames).

## Theory

### What is Pandas?

Pandas provides two main data structures:

- **Series**: One-dimensional labeled array (like a column)
- **DataFrame**: Two-dimensional labeled data structure (like a spreadsheet)

### Creating DataFrames

```python
import pandas as pd

# From dictionary
df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "Salary": [50000, 60000, 70000]
})

# From list of dictionaries
df = pd.DataFrame([
    {"Name": "Alice", "Age": 25},
    {"Name": "Bob", "Age": 30}
])

# From NumPy array
df = pd.DataFrame(np.random.randn(5, 3),
                  columns=["A", "B", "C"])
```

### Reading Data

```python
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")
df = pd.read_json("data.json")
```

### Basic Operations

```python
df.head(10)        # First 10 rows
df.tail(5)         # Last 5 rows
df.info()          # Column types, non-null counts
df.describe()      # Summary statistics
df.columns         # Column names
df.index           # Row labels
df.shape           # (rows, columns)
df.dtypes          # Column data types
```

### Selecting Data

```python
# Column selection
df["Name"]         # Series
df[["Name", "Age"]]  # DataFrame

# Row selection (by label)
df.loc[0]          # Row by label

# Row selection (by position)
df.iloc[0]         # Row by position

# Boolean indexing
df[df["Age"] > 30]
```

### Adding/Removing Columns

```python
df["NewColumn"] = values
df.drop("OldColumn", axis=1, inplace=True)
```

### GroupBy Operations

```python
df.groupby("Category")["Value"].mean()
df.groupby("Category").agg({"Value": ["mean", "std"]})
```

### Merging DataFrames

```python
pd.merge(df1, df2, on="key")
pd.merge(df1, df2, left_on="id1", right_on="id2")
pd.concat([df1, df2], axis=0)  # Stack rows
```

### Apply Functions

```python
df["Column"].apply(lambda x: x ** 2)
df["Column"].map({"old": "new"})
```

## Visual Explanation

```
DataFrame Structure

       Columns →
       Name    Age  Salary
Row 0  Alice   25   50000
  ↓ 1  Bob     30   60000
    2  Charlie 35   70000

     Each column is a Series
     Each row is a record
     Labeled axes for intuitive access
```

## Python Implementation

```python
import pandas as pd
import numpy as np

# Create DataFrame from dictionary
data = {
    "Gene": ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"],
    "Expression": [2.5, -1.2, 3.8, 0.9, -2.1],
    "P_Value": [0.001, 0.08, 0.003, 0.45, 0.02],
    "Chromosome": [17, 17, 7, 8, 12]
}
df = pd.DataFrame(data)
print(df)
```

```python
# Basic exploration
print(df.head())
print(df.info())
print(df.describe())
print(df["Expression"].mean())
print(df[df["P_Value"] < 0.05])
```

```python
# Adding calculated columns
df["Significant"] = df["P_Value"] < 0.05
df["Abs_Expression"] = df["Expression"].abs()
print(df)
```

```python
# GroupBy aggregation
# Create sample sales data
sales = pd.DataFrame({
    "Product": ["A", "B", "A", "C", "B", "A"],
    "Region": ["North", "South", "South", "North", "North", "South"],
    "Revenue": [100, 200, 150, 300, 250, 120]
})

print(sales.groupby("Product")["Revenue"].sum())
print(sales.groupby(["Product", "Region"])["Revenue"].mean())
```

```python
# Merging DataFrames
customers = pd.DataFrame({
    "CustomerID": [1, 2, 3],
    "Name": ["Alice", "Bob", "Charlie"]
})
orders = pd.DataFrame({
    "OrderID": [101, 102, 103],
    "CustomerID": [1, 1, 3],
    "Amount": [50, 75, 100]
})

merged = pd.merge(customers, orders, on="CustomerID")
print(merged)
```

```python
# Apply functions
df["Expression_Rounded"] = df["Expression"].apply(lambda x: round(x, 1))
print(df)
```

## Biotechnology Example

**Scenario**: Analyzing clinical trial data.

```python
import pandas as pd
import numpy as np

# Simulate clinical trial data
np.random.seed(42)
n_patients = 100

clinical = pd.DataFrame({
    "PatientID": [f"P-{i:04d}" for i in range(1, n_patients + 1)],
    "Age": np.random.randint(18, 85, n_patients),
    "Sex": np.random.choice(["M", "F"], n_patients),
    "Treatment": np.random.choice(["Drug", "Placebo"], n_patients),
    "Biomarker_Level": np.random.randn(n_patients) * 2 + 5,
    "Response": np.random.choice(["Responder", "Non-responder"], n_patients, p=[0.6, 0.4]),
    "Survival_Months": np.random.exponential(24, n_patients).astype(int)
})

print(clinical.head())
print(clinical.info())

# Analysis
print("\nTreatment groups:")
print(clinical.groupby("Treatment")["Survival_Months"].mean())

print("\nResponse by sex:")
print(clinical.groupby("Sex")["Response"].value_counts())

# Biomarker analysis
high_biomarker = clinical[clinical["Biomarker_Level"] > 5]
print(f"\nPatients with high biomarker: {len(high_biomarker)}")

# Age groups
clinical["Age_Group"] = pd.cut(clinical["Age"], bins=[0, 30, 50, 65, 100],
                                labels=["<30", "30-50", "51-65", ">65"])
print("\nSurvival by age group:")
print(clinical.groupby("Age_Group")["Survival_Months"].agg(["mean", "std", "count"]))
```

## SaaS Example

**Scenario**: Analyzing customer churn data.

```python
import pandas as pd
import numpy as np

# Simulate customer data
np.random.seed(42)
n_customers = 200

customers = pd.DataFrame({
    "CustomerID": range(1, n_customers + 1),
    "Tenure_Months": np.random.randint(1, 60, n_customers),
    "Monthly_Spend": np.random.uniform(10, 200, n_customers).round(2),
    "Support_Tickets": np.random.poisson(0.5, n_customers),
    "Subscription": np.random.choice(["Basic", "Pro", "Enterprise"], n_customers,
                                      p=[0.5, 0.3, 0.2]),
    "Churned": np.random.choice([0, 1], n_customers, p=[0.7, 0.3])
})

print(customers.head())

# Churn analysis
print("\nChurn rate by subscription:")
print(customers.groupby("Subscription")["Churned"].mean().round(3))

print("\nAverage spend (churned vs active):")
print(customers.groupby("Churned")["Monthly_Spend"].mean())

# High-risk segment
high_risk = customers[(customers["Support_Tickets"] > 3) &
                       (customers["Tenure_Months"] < 12)]
print(f"\nHigh-risk customers: {len(high_risk)}")
```

## Common Mistakes

1. **Chaining `[]` instead of `loc`**: `df["A"][0]` works but causes a warning. Use `df.loc[0, "A"]`
2. **Modifying a view vs copy**: `SettingWithCopyWarning` — use `.copy()` explicitly
3. **Forgetting `axis=` parameter**: `drop("col")` defaults to axis=0 (rows). Use `axis=1` for columns
4. **Inplace operations**: Many methods have `inplace=True`, but chaining is usually cleaner
5. **Merging without specifying key**: Can create a Cartesian product

## Best Practices

- Use `loc` and `iloc` for explicit selection
- Use `query()` for complex filtering
- Use method chaining for readability
- Use `pd.cut()` and `pd.qcut()` for binning
- Use `to_datetime()` for date columns
- Profile performance: vectorized operations are faster than `apply()`

## Summary

- Pandas provides Series (1D) and DataFrame (2D) for data analysis
- Read data with `read_csv()`, explore with `head()`, `info()`, `describe()`
- Select data with `loc`, `iloc`, boolean indexing
- Group and aggregate with `groupby()` and `agg()`
- Merge DataFrames with `merge()` and `concat()`
- Apply functions with `apply()` and `map()`

## Key Terms

- **DataFrame**: 2D labeled data structure (rows × columns)
- **Series**: 1D labeled array (single column)
- **Index**: Row labels (default: 0, 1, 2...)
- **GroupBy**: Split-apply-combine operations
- **Merge**: Combining DataFrames on common columns
- **Pivot table**: Multi-dimensional aggregation
- **Boolean indexing**: Filtering with True/False conditions
- **Method chaining**: Applying multiple operations sequentially

## Exercises

### Level 1: Basic

1. How do you read a CSV file into a DataFrame?
2. What is the difference between `loc` and `iloc`?
3. How do you check for missing values in a DataFrame?

### Level 2: Implementation

4. Load a CSV and compute the mean of each numeric column grouped by a categorical column.
5. Given a DataFrame with customer data, create a new column "Segment" that labels customers as "High Value" (spend > 100) or "Standard" (otherwise).

### Level 3: Critical Thinking

6. Compare and contrast the performance of `apply()` vs vectorized operations in Pandas. When would you need to use `apply()`?
7. How would you handle missing values in a dataset? Compare `dropna()`, `fillna()`, and interpolation methods.

## Coding Challenge

Create a **customer segmentation analysis** using Pandas:

1. Generate a synthetic dataset with 500 customers, including features: `age`, `income`, `spending_score`, `purchase_frequency`, `last_purchase_days`
2. Clean the data (handle any missing values, remove outliers)
3. Create segments:
   - By age group (Young/Middle/Senior)
   - By value (Low/Medium/High spender based on spending_score percentiles)
   - By recency (Active/At Risk/Lost based on last_purchase_days)
4. Analyze each segment: compute average income, spending, and purchase frequency
5. Find the top 10% of customers by a composite score (20% income + 50% spending_score + 30% purchase_frequency, normalized)
6. Generate a summary report with all findings
