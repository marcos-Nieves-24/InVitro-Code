# Assignment: Comprehensive EDA

## Objectives

- Perform systematic EDA on a real-world dataset
- Detect and handle data quality issues
- Generate actionable insights from data exploration

## Instructions

1. Load the `diamonds` dataset from seaborn
2. Complete EDA following this workflow:
   - Data overview (shape, columns, types, memory)
   - Missing value analysis (count, percentage, patterns)
   - Descriptive statistics for all numeric columns
   - Univariate analysis: histograms + KDE for `price`, `carat`, `depth`, `table`
   - Bivariate analysis: correlation matrix heatmap, scatter matrix
   - Outlier detection: IQR method on `price` and `carat`
   - Grouped analysis: price distribution by cut, color, clarity

3. Create a function `eda_pipeline(df)` that automates the above steps

4. Write a report (2-3 paragraphs):
   - What are the key characteristics of diamond prices?
   - Which features are most correlated with price?
   - Are there outliers? Should they be removed?
   - What preprocessing would you recommend before modeling?

## Deliverables

- Jupyter notebook with code, visualizations, and written report

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Data overview & missing values | Complete | Minor omissions | Partial | Missing |
| Univariate analysis | All 4 features analyzed | 3 features | 2 features | <2 |
| Bivariate analysis | Correlations + interpretations | Basic correlations | Incomplete | Missing |
| Outlier detection | Correct with interpretation | Correct only | Partial | Missing |
| Grouped analysis | Clear patterns identified | Basic grouping | Limited | Missing |
| Written report | Insightful, actionable | Good summary | Superficial | Missing |

**Total: 24 points**

## Estimated Time

3 hours
