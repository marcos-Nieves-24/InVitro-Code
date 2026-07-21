# Quiz: Pandas

## Multiple Choice (5 questions)

**Q1:** What is a DataFrame?
- A) A 1D labeled array
- B) A 2D labeled data structure with rows and columns
- C) A 3D tensor
- D) A list of NumPy arrays

**Q2:** How do you read a CSV file into a DataFrame?
- A) `pd.load_csv()`
- B) `pd.read_csv()`
- C) `pd.csv_to_df()`
- D) `pd.import_csv()`

**Q3:** What is the difference between `loc` and `iloc`?
- A) There is no difference
- B) `loc` uses labels, `iloc` uses integer positions
- C) `loc` uses integer positions, `iloc` uses labels
- D) `loc` works with columns, `iloc` works with rows

**Q4:** How do you select rows where column "Age" > 30?
- A) `df[df["Age"] > 30]`
- B) `df[Age > 30]`
- C) `df.select("Age" > 30)`
- D) `df.filter("Age" > 30)`

**Q5:** Which method is used to check summary statistics of numeric columns?
- A) `df.summary()`
- B) `df.info()`
- C) `df.describe()`
- D) `df.stats()`

## Short Answer (2 questions)

**Q6:** Explain what `groupby()` does in Pandas.

**Q7:** What is method chaining and why is it useful in Pandas?

## Coding Question

**Q8:** Write Pandas code to: create a DataFrame from a dictionary with columns "Name" and "Score", then add a new column "Passed" that is True if Score ≥ 60.

## Answer Key

**Q1:** B) A 2D labeled data structure with rows and columns

**Q2:** B) `pd.read_csv()`

**Q3:** B) `loc` uses labels, `iloc` uses integer positions

**Q4:** A) `df[df["Age"] > 30]`

**Q5:** C) `df.describe()`

**Q6:** `groupby()` splits the DataFrame into groups based on one or more columns, applies a function to each group independently, and combines the results. It implements the "split-apply-combine" pattern for data aggregation. For example, `df.groupby("Category")["Value"].mean()` computes the mean of Value for each Category.

**Q7:** Method chaining is calling multiple methods sequentially on the same object, like `df.dropna().groupby("A").mean().reset_index()`. It's useful because it creates readable, concise code that reads like a pipeline of operations without needing intermediate variables.

**Q8:**
```python
import pandas as pd
df = pd.DataFrame({"Name": ["Alice", "Bob", "Charlie"], "Score": [85, 45, 72]})
df["Passed"] = df["Score"] >= 60
print(df)
```
