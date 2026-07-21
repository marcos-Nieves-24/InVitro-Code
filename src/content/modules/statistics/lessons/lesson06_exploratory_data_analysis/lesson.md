---
Module: 3
Lesson Number: 6
Lesson Title: Exploratory Data Analysis (EDA)
Estimated Duration: 90 minutes
Prerequisites: Lessons 1-5
Learning Objectives:
  - Detect and handle missing values in a dataset
  - Identify outliers using multiple methods
  - Create effective visualizations for data exploration
  - Generate automated EDA reports with pandas-profiling
  - Design a systematic EDA workflow
Keywords: EDA, missing values, outliers, visualization, pandas profiling, feature exploration
Difficulty: Intermediate
Programming Concepts: pandas, matplotlib, seaborn, pandas-profiling
Mathematical Concepts: IQR, Z-scores, distribution analysis
Machine Learning Concepts: data quality, feature understanding, preprocessing
Datasets Used: penguins, titanic, California housing
Notebook: 06_exploratory_data_analysis.ipynb
Assignment: eda_assignment.md
Quiz: eda_quiz.md
---

# Lesson 6: Exploratory Data Analysis (EDA)

## Motivation

Before building any machine learning model, you must understand your data. EDA is the systematic process of examining data to detect problems, discover patterns, and generate hypotheses. Half the time in any real ML project is spent on EDA and data cleaning. Skipping EDA leads to garbage-in-garbage-out models, biased conclusions, and embarrassing mistakes.

In biotechnology, EDA reveals batch effects, missing genetic data, and sample contamination. In SaaS, EDA uncovers tracking errors, anomalous user behavior, and seasonal patterns.

## Big Picture

This lesson integrates everything you learned in Lessons 1-5: descriptive statistics, distributions, and relationships. You will apply all of them systematically to explore a new dataset. This prepares you for the remaining lessons (PCA, clustering, model evaluation) and for all of Module 4.

## Theory

### The EDA Workflow

1. **Data overview**: shape, columns, types, memory usage
2. **Missing value analysis**: count, percentage, patterns
3. **Univariate analysis**: descriptive statistics, distributions
4. **Bivariate analysis**: relationships, correlations
5. **Multivariate analysis**: interactions, grouping
6. **Outlier detection**: statistical and visual methods
7. **Summary and action plan**: what to clean, transform, or investigate

### Missing Value Analysis

Types of missing data:
- **MCAR** (Missing Completely At Random): No systematic reason (e.g., accidental data loss)
- **MAR** (Missing At Random): Missing depends on observed data (e.g., older patients more likely to skip a test)
- **MNAR** (Missing Not At Random): Missing depends on unobserved data (e.g., patients with severe symptoms don't report them)

Handling strategies:
- Delete rows/columns with too many missing values
- Impute with mean, median, mode
- Use model-based imputation (e.g., KNN, MICE)

### Outlier Detection Methods

1. **Z-score method**: Flag points with |Z| > 3
2. **IQR method**: Flag points beyond 1.5×IQR from quartiles
3. **Isolation Forest**: ML-based outlier detection
4. **Visual methods**: Boxplots, scatter plots

### Automated EDA

`pandas-profiling` (now `ydata-profiling`) generates a comprehensive EDA report:

```python
# from ydata_profiling import ProfileReport
# profile = ProfileReport(df, title="EDA Report")
# profile.to_file("eda_report.html")
```

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset with missing values
titanic = sns.load_dataset('titanic')

# 1. Data overview
print("Shape:", titanic.shape)
print("\nInfo:")
titanic.info()
print("\nFirst 5 rows:")
print(titanic.head())

# 2. Missing values
missing = titanic.isnull().sum()
missing_pct = (missing / len(titanic)) * 100
missing_df = pd.DataFrame({'Missing': missing, 'Percentage': missing_pct})
print("\nMissing Values:")
print(missing_df[missing_df['Missing'] > 0])

# 3. Visualize missing data
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
sns.heatmap(titanic.isnull(), cbar=False, yticklabels=False, cmap='viridis')
plt.title('Missing Values Heatmap')

plt.subplot(1, 2, 2)
missing_pct[missing_pct > 0].plot(kind='bar', color='coral')
plt.title('Missing Values Percentage')
plt.ylabel('Percentage')
plt.tight_layout()
plt.show()

# 4. Univariate analysis
print("\nDescriptive statistics:")
print(titanic.describe())

# Age distribution
plt.figure(figsize=(12, 4))
plt.subplot(1, 3, 1)
sns.histplot(titanic['age'].dropna(), bins=30, kde=True)
plt.title('Age Distribution')

plt.subplot(1, 3, 2)
titanic['sex'].value_counts().plot(kind='bar', color='steelblue')
plt.title('Sex Distribution')

plt.subplot(1, 3, 3)
titanic['pclass'].value_counts().sort_index().plot(kind='bar', color='seagreen')
plt.title('Passenger Class')
plt.tight_layout()
plt.show()

# 5. Bivariate analysis
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
sns.boxplot(x='pclass', y='age', data=titanic)
plt.title('Age by Passenger Class')

plt.subplot(1, 2, 2)
sns.countplot(x='pclass', hue='survived', data=titanic)
plt.title('Survival by Passenger Class')
plt.tight_layout()
plt.show()

# 6. Outlier detection in fare
q1 = titanic['fare'].quantile(0.25)
q3 = titanic['fare'].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
outliers = titanic[(titanic['fare'] < lower) | (titanic['fare'] > upper)]
print(f"\nFare outliers: {len(outliers)} rows")
print(f"Fare range: ${titanic['fare'].min():.2f} - ${titanic['fare'].max():.2f}")
print(f"IQR bounds: [${lower:.2f}, ${upper:.2f}]")
```

## Walkthrough Example

Complete EDA on the Titanic dataset.

```python
# Systematic EDA
def eda_summary(df):
    summary = {
        'rows': df.shape[0],
        'columns': df.shape[1],
        'missing_cells': df.isnull().sum().sum(),
        'missing_pct': (df.isnull().sum().sum() / (df.shape[0] * df.shape[1])) * 100,
        'duplicated_rows': df.duplicated().sum(),
        'numeric_columns': df.select_dtypes(include=[np.number]).shape[1],
        'categorical_columns': df.select_dtypes(include=['object', 'category']).shape[1]
    }
    return summary

print(eda_summary(titanic))

# Handle missing values
titanic_clean = titanic.copy()
titanic_clean['age'].fillna(titanic_clean['age'].median(), inplace=True)
titanic_clean['embarked'].fillna(titanic_clean['embarked'].mode()[0], inplace=True)
titanic_clean.drop(columns=['deck'], inplace=True)  # too many missing

# Correlation with target
numeric = titanic_clean.select_dtypes(include=[np.number])
corr_with_survived = numeric.corr()['survived'].sort_values(ascending=False)
print("\nCorrelation with Survival:")
print(corr_with_survived)
```

## Biotechnology Example

EDA of a synthetic gene expression dataset.

```python
np.random.seed(42)
n_genes = 100
n_samples = 50

# Create synthetic expression data
expression_data = pd.DataFrame(
    np.random.randn(n_samples, n_genes),
    columns=[f'Gene_{i}' for i in range(n_genes)]
)
expression_data['condition'] = ['control'] * 25 + ['treatment'] * 25

# Add some missing values
mask = np.random.random(expression_data.shape) < 0.02
expression_data = expression_data.mask(mask)

# Add outliers
expression_data.iloc[0, 0] = 50  # extreme outlier

print(f"Shape: {expression_data.shape}")
print(f"Missing values: {expression_data.isnull().sum().sum()}")

# Check for batch effects
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
expression_data.iloc[:, :10].boxplot()
plt.title('First 10 Genes Expression')
plt.xticks(rotation=45)

plt.subplot(1, 2, 2)
expression_data.groupby('condition').mean().T.plot(kind='kde')
plt.title('Expression Density by Condition')
plt.tight_layout()
plt.show()
```

## SaaS Example

EDA of user engagement data.

```python
np.random.seed(42)
n_users = 1000
saas_data = pd.DataFrame({
    'user_id': range(n_users),
    'signup_date': pd.date_range('2024-01-01', periods=n_users, freq='h'),
    'plan': np.random.choice(['free', 'basic', 'premium'], n_users, p=[0.5, 0.3, 0.2]),
    'session_count': np.random.poisson(10, n_users),
    'revenue': np.random.exponential(50, n_users),
    'churned': np.random.choice([0, 1], n_users, p=[0.8, 0.2])
})

# Introduce missing values
saas_data.loc[np.random.random(n_users) < 0.05, 'revenue'] = np.nan

print("SaaS Data Overview:")
print(saas_data.info())
print(f"\nMissing revenue: {saas_data['revenue'].isnull().sum()}")

# Churn analysis
plt.figure(figsize=(12, 4))
plt.subplot(1, 3, 1)
sns.boxplot(x='churned', y='session_count', data=saas_data)
plt.title('Sessions by Churn')

plt.subplot(1, 3, 2)
sns.boxplot(x='plan', y='revenue', data=saas_data)
plt.title('Revenue by Plan')

plt.subplot(1, 3, 3)
saas_data['churned'].value_counts().plot(kind='bar', color=['steelblue', 'coral'])
plt.title('Churn Distribution')
plt.tight_layout()
plt.show()
```

## Common Mistakes

1. **Skipping EDA entirely**: The most common and costly mistake. Always explore first.
2. **Failing to visualize**: Summary statistics alone cannot reveal multimodal distributions or unusual patterns.
3. **Ignoring missing data patterns**: Missing data is rarely random. Analyze why values are missing.
4. **Removing all outliers without investigation**: Outliers may be the most interesting data points.
5. **Data leakage**: Cleaning data using information from the full dataset before splitting.

## Best Practices

- Always set a random seed for reproducibility
- Document every cleaning decision
- Create reusable EDA functions
- Use automated profiling for initial exploration
- Investigate missing values before deciding how to handle them
- Keep the original data untouched; work on copies

## Summary

- EDA is the systematic exploration of data before modeling
- Missing value analysis: identify, visualize, handle
- Outlier detection: IQR, Z-score, visualization
- Automated profiling: pandas-profiling for quick reports
- Always combine numerical summaries with visualizations

## Key Terms

| Term | Definition |
|------|------------|
| EDA | Exploratory Data Analysis — systematic data exploration |
| MCAR | Missing Completely At Random |
| MAR | Missing At Random |
| MNAR | Missing Not At Random |
| Imputation | Filling missing values with estimates |
| Isolation Forest | ML algorithm for outlier detection |
| Batch Effect | Systematic technical variation between experimental batches |

## Exercises

**Level 1: Basic Understanding**

1. What are the three types of missing data? Give an example of each in a clinical trial context.
2. Why should we not remove all outliers without investigation?

**Level 2: Implementation**

3. Load the `tips` dataset from seaborn. Perform a complete EDA including missing values, descriptive stats, and visualizations.
4. Write a function `outlier_report(df, column)` that returns the number and percentage of outliers using both IQR and Z-score methods.

**Level 3: Critical Thinking**

5. In a gene expression dataset, you notice that 15% of values are missing in the treatment group but only 2% in the control group. What type of missing data is this? How would you handle it?
6. A SaaS company's EDA reveals that users who churn have shorter session durations. Can we conclude that short sessions cause churn? What other explanations exist?

## Coding Challenge

Write a Python script that performs a complete EDA on the `mpg` dataset from seaborn:
1. Print shape, column types, missing values
2. Compute descriptive statistics for all numeric columns
3. Create a 2×3 grid of histograms
4. Create a correlation matrix heatmap
5. Identify outliers in `mpg` using both IQR and Z-score methods
6. Generate a pandas-profiling report
7. Write a 1-paragraph summary of findings
