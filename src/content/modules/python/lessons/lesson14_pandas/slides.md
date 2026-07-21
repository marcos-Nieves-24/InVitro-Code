# Pandas — Slide Outline

## Slide 1: Title Slide
- Pandas: Data Manipulation in Python
- Module 2: Python Programming Fundamentals

## Slide 2: Why Pandas?
- Most popular Python library for data analysis
- DataFrame: intuitive tabular data structure
- Built on NumPy
- Data cleaning, transformation, aggregation
- ML: feature engineering, data preparation

## Slide 3: Pandas Data Structures
- **Series**: 1D labeled array (a column)
- **DataFrame**: 2D labeled table (rows × columns)
- Built on NumPy, adds labels and flexible operations

## Slide 4: Creating DataFrames
```python
pd.DataFrame({"col": [1, 2, 3]})
pd.read_csv("data.csv")
pd.DataFrame(np.random.randn(5, 3))
```

## Slide 5: Exploring Data
```python
df.head()      # First 5 rows
df.info()      # Column types
df.describe()  # Summary stats
df.shape       # Dimensions
df.columns     # Column names
```

## Slide 6: Selecting Data
```python
df["col"]         # Column → Series
df[["col1", "col2"]]  # Multiple columns
df.loc[0]         # Row by label
df.iloc[0]        # Row by position
df[df["Age"] > 30]  # Boolean indexing
```

## Slide 7: loc vs iloc
- `df.loc[rows, cols]` — label-based
- `df.iloc[rows, cols]` — integer position-based
- Always prefer `loc`/`iloc` over chained `[]`

## Slide 8: GroupBy
```python
df.groupby("Category")["Value"].mean()
df.groupby("Category").agg({
    "Value": ["mean", "std"],
    "Score": "sum"
})
```
- Split → Apply → Combine
- Powerful aggregation

## Slide 9: Merging DataFrames
```python
pd.merge(left, right, on="key")
pd.merge(left, right, how="left")
pd.concat([df1, df2], axis=0)
```
- SQL-like joins
- Inner, left, right, outer

## Slide 10: Apply Functions
```python
df["col"].apply(lambda x: x**2)
df["col"].map({"old": "new"})
df.apply(np.mean, axis=0)
```
- Transform values
- Row-wise or column-wise

## Slide 11: Handling Missing Data
```python
df.isna().sum()      # Count missing
df.dropna()          # Remove missing
df.fillna(value)     # Fill missing
df.interpolate()     # Interpolate
```

## Slide 12: Biotech Example
- Clinical trial DataFrame
- Patient demographics, treatment groups
- GroupBy for treatment comparison
- Biomarker analysis

## Slide 13: Common Mistakes
- Chained indexing (SettingWithCopyWarning)
- Forgetting axis parameter
- Inplace vs copy confusion
- Merge without key → Cartesian product

## Slide 14: Best Practices
- Use `loc`/`iloc` for selection
- Use method chaining for pipelines
- Use `query()` for complex filters
- Convert dates to datetime
- Profile: vectorized over apply

## Slide 15: Summary
- DataFrame: 2D labeled data table
- Series: 1D labeled column
- groupby: split-apply-combine
- merge: SQL-like joins
- apply: transform values
- Pandas is the Swiss Army knife of data analysis
