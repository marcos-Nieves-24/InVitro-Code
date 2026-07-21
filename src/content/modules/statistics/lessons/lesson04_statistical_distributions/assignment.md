# Assignment: Statistical Distributions in Practice

## Objectives

- Identify appropriate distributions for real scenarios
- Compute probabilities using scipy.stats
- Apply standardization and interpret Z-scores

## Instructions

1. **Distribution Identification**: For each scenario, identify the distribution, parameters, and compute the probability:
   - A website has a 2% conversion rate. What's the probability of getting exactly 5 conversions out of 200 visitors?
   - A hospital ER averages 8 patients per hour. What's the probability of more than 12 patients arriving in an hour?
   - IQ scores follow N(100, 15). What IQ score is at the 95th percentile?

2. **Real Data Normal Fit**: Load the `penguins` dataset.
   - For `body_mass_g`, fit a normal distribution (compute μ and σ)
   - Create a Q-Q plot
   - Test normality using `stats.normaltest()`
   - If not normal, apply a transformation and re-test

3. **Standardization Pipeline**: Write a function `standardize_df(df)` that:
   - Takes a DataFrame with numeric columns
   - Returns a standardized DataFrame (mean=0, std=1)
   - Preserves column names and index

4. **CLT Demonstration**: Write a simulation that demonstrates the Central Limit Theorem:
   - Start with a uniform distribution (clearly not normal)
   - Show how the distribution of sample means becomes normal as n increases from 2 to 5 to 30 to 100
   - Create a 2×2 grid showing this evolution

## Deliverables

- Jupyter notebook with all computations, plots, and interpretations

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Distribution identification | All correct | Minor errors | One correct | Missing |
| Normal fit + Q-Q plot | Complete | Minor issues | Partial | Missing |
| Standardization function | Works correctly | Minor bugs | Partially works | Missing |
| CLT demonstration | Clear and complete | Working but unclear | Incomplete | Missing |

**Total: 16 points**

## Estimated Time

2.5 hours
