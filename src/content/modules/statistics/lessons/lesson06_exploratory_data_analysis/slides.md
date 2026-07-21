# Slides: Exploratory Data Analysis

## Slide 1: Title
- Exploratory Data Analysis (EDA)
- Module 3, Lesson 6

## Slide 2: Learning Objectives
- Detect and handle missing values
- Identify outliers using multiple methods
- Design systematic EDA workflow
- Use automated profiling tools

## Slide 3: The EDA Workflow
- Data overview
- Missing value analysis
- Univariate analysis
- Bivariate analysis
- Multivariate analysis
- Outlier detection
- Summary and action plan

## Slide 4: Missing Value Types
- MCAR: Missing Completely At Random
- MAR: Missing At Random (depends on observed data)
- MNAR: Missing Not At Random (depends on unobserved)

## Slide 5: Handling Missing Values
- Delete rows/columns with too many missing
- Impute with mean, median, mode
- Model-based imputation (KNN, MICE)
- Always investigate why data is missing

## Slide 6: Outlier Detection
- IQR method: ±1.5×IQR from quartiles
- Z-score: |Z| > 3
- Isolation Forest
- Visual: boxplots, scatter plots

## Slide 7: Univariate Analysis
- Descriptive statistics
- Histograms + KDE
- Check for normality
- Identify transformations needed

## Slide 8: Bivariate Analysis
- Scatter plots
- Correlation matrix
- Grouped boxplots
- Cross-tabulations

## Slide 9: Automated Profiling
- pandas-profiling / ydata-profiling
- Generates comprehensive HTML report
- Quick initial exploration
- Not a replacement for manual EDA

## Slide 10: Key Takeaways
- EDA is 50% of any ML project
- Investigate missing data patterns
- Combine stats + visuals
- Document every decision
- Keep original data untouched
