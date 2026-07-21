# Lab: Privacy-Preserving Data Analysis

## Objective

Implement and compare privacy-preserving techniques for releasing statistical summaries. Evaluate the privacy-utility trade-off for different epsilon values.

## Duration

60 minutes

## Prerequisites

Lesson 4, Python (numpy, pandas, matplotlib)

## Dataset

Use the Adult Income dataset from UCI (or a synthetic dataset with demographic and income columns).

## Instructions

### Part 1: Baseline Statistics (10 minutes)

1. Load the Adult dataset.
2. Compute and report: mean age, mean income, income distribution by gender, education distribution.
3. These are your "true" values. They cannot be released if the data is sensitive.

### Part 2: Differential Privacy for Summary Statistics (20 minutes)

1. Implement the Laplace mechanism function (from the lesson).
2. For each statistic (mean age, mean income, proportion female), release a differentially private version.
3. For epsilon = [0.01, 0.1, 0.5, 1, 5, 10], run 100 trials each and compute:
   - Mean Absolute Error
   - Standard deviation of error
4. Create a plot showing MAE vs. epsilon for each statistic.
5. Which statistic is easiest to release with high accuracy? Why?

### Part 3: Differential Privacy for a Histogram (15 minutes)

1. Create a histogram of income (10 bins).
2. Release a differentially private histogram with epsilon = [0.1, 1, 10].
3. Plot the true histogram vs. the private histograms.
4. At what epsilon does the histogram become recognizable?

### Part 4: Composition (15 minutes)

1. Suppose you release three statistics: mean age, mean income, and a 10-bin histogram.
2. With basic composition, the total epsilon is the sum of individual epsilons.
3. For a total budget of epsilon=1, how would you allocate the budget across the three statistics to minimize total error?
4. Implement and test your allocation strategy.

## Deliverables

Submit a Jupyter notebook with:
- All code and visualizations
- A paragraph on your budget allocation strategy and the rationale

## Rubric

| Criterion | Points | Excellent | Good | Satisfactory | Needs Improvement |
|-----------|--------|-----------|------|--------------|-------------------|
| Baseline statistics | 10 | All computed correctly | Most | Some | Missing |
| DP for statistics | 25 | Full implementation with analysis | Good | Partial | Missing |
| DP histogram | 25 | Clear visualization and comparison | Adequate | Basic | Missing |
| Composition analysis | 25 | Thoughtful allocation, tested | Good strategy | Basic | Missing |
| Discussion | 15 | Insightful on privacy-utility trade-off | Good | Basic | Missing |
