# Lab: Exploratory Data Analysis

## Objective

Perform a complete EDA on the MPG dataset, documenting findings and cleaning decisions.

## Duration

90 minutes

## Dataset

Seaborn's `mpg` dataset.

## Instructions

### Part 1: Data Loading and Overview (10 min)
1. Load `mpg` from seaborn
2. Print shape, column names, dtypes
3. Generate `df.describe()` and `df.info()`

### Part 2: Missing Values (15 min)
1. Identify columns with missing values
2. Calculate percentage of missing values
3. Visualize missing data patterns
4. Decide on handling strategy for each column with missing values

### Part 3: Univariate Analysis (20 min)
1. Create histograms for `mpg`, `horsepower`, `weight`, `acceleration`
2. Compute skewness and kurtosis for each
3. Identify which features need transformation

### Part 4: Bivariate and Multivariate Analysis (20 min)
1. Create a correlation matrix heatmap
2. Create scatter plots: mpg vs horsepower, mpg vs weight
3. Create boxplots: mpg by origin and by cylinders
4. Identify the strongest relationships

### Part 5: Outlier Detection (15 min)
1. Use IQR method on `mpg`, `horsepower`, `weight`
2. Report number of outliers per column
3. Create boxplots highlighting outliers

### Part 6: Summary Report (10 min)
Write a markdown summary with:
- Key findings about the data
- Data quality issues
- Recommended preprocessing steps
- 3 interesting patterns discovered

## Deliverables

- Jupyter notebook with code, visualizations, and markdown summary

## Rubric

| Criteria | Points |
|----------|--------|
| Missing value analysis | 2 |
| Univariate analysis (histograms + shape stats) | 2 |
| Bivariate analysis (correlation + scatter) | 2 |
| Outlier detection | 2 |
| Summary report | 2 |
Total: 10 points
