# Lab: Statistical Distributions

## Objective

Work with named distributions to model real-world phenomena and understand standardization.

## Duration

60 minutes

## Dataset

Synthetic and real data (iris dataset).

## Instructions

### Part 1: Distribution Identification (15 min)

For each scenario, identify the appropriate distribution and compute the requested probability using scipy.stats:

1. A drug works for 70% of patients. Out of 30 patients, what is the probability exactly 20 respond?
2. A lab receives an average of 5 samples per hour. What is the probability of receiving exactly 3 samples in the next hour?
3. Blood glucose levels follow N(100, 15) mg/dL. What percentage of patients have glucose > 140 mg/dL?

### Part 2: Fitting a Normal Distribution (20 min)

1. Load the iris dataset
2. For `sepal_length`, fit a normal distribution (compute mu and sigma from data)
3. Plot the histogram with the fitted normal PDF overlaid
4. Create a Q-Q plot using `stats.probplot()` to check normality
5. Does sepal_length appear normally distributed?

### Part 3: Standardization (15 min)

1. Standardize all numeric columns in the iris dataset
2. Verify mean ≈ 0 and std ≈ 1 for each column
3. Plot boxplots of original vs standardized data side by side

### Part 4: Central Limit Theorem Demo (10 min)

1. Generate 1000 samples from an exponential distribution (skewed!)
2. Take sample means for sample sizes n = 5, 10, 30, 100 (1000 each)
3. Plot histograms of the sample means
4. Observe how the distribution becomes normal as n increases

## Deliverables

- Python script or notebook with all computations and plots
- Written answers to the interpretation questions

## Rubric

| Criteria | Points |
|----------|--------|
| Distribution identification | 3 |
| Normal fitting and Q-Q plot | 3 |
| Standardization | 2 |
| CLT demonstration | 2 |
Total: 10 points
