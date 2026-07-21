# Assignment: Descriptive Statistics

## Objectives

- Compute descriptive statistics using numpy and pandas
- Identify outliers using the IQR method
- Interpret statistical summaries in biological and business contexts

## Instructions

1. Load the California housing dataset from sklearn:
```python
from sklearn.datasets import fetch_california_housing
housing = fetch_california_housing(as_frame=True)
df = housing.data
```

2. For each numeric column, compute:
   - Mean, median, mode
   - Variance, standard deviation, range, IQR
   - Count of outliers using the IQR rule (1.5×IQR)

3. Create a DataFrame called `summary_stats` with one row per feature and columns for all statistics above.

4. Visualize the `MedInc` (median income) column using a boxplot.

5. Answer in a markdown cell:
   - Which feature has the most outliers? Why might this be?
   - Should we remove these outliers? Justify your answer.

## Deliverables

- A Jupyter notebook (`.ipynb`) with all code, outputs, and written answers

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Descriptive statistics | All computed correctly | Minor errors | Missing 1-2 stats | Missing >2 stats |
| Outlier detection | Correct IQR method | Correct but incomplete | Partially implemented | Not implemented |
| Visualization | Boxplot with labels and title | Boxplot present | Basic plot | Missing |
| Interpretation | Insightful, contextualized | Good analysis | Superficial | Missing |

**Total: 16 points**

## Estimated Time

2 hours
