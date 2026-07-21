# Lab: Fairness Audit of a Machine Learning Model

## Objective

Conduct a complete fairness audit of a classification model. You will detect bias, compute multiple fairness metrics, and apply a mitigation strategy.

## Duration

60 minutes

## Prerequisites

Lesson 2: Bias and Fairness, Python (pandas, sklearn)

## Dataset

We provide a synthetic dataset `credit_data.csv` with the following columns:

- `age`: applicant age
- `income`: annual income (USD)
- `credit_score`: credit score (300–850)
- `loan_amount`: requested loan amount
- `gender`: applicant gender (M/F)
- `default`: whether the applicant defaulted (1 = default, 0 = repaid)

The dataset contains 10,000 records.

## Instructions

### Part 1: Data Exploration (10 minutes)

1. Load the dataset. Compute the default rate by gender.
2. Check the distribution of income and credit score by gender.
3. Are there any obvious disparities?

### Part 2: Model Training and Fairness Metrics (20 minutes)

1. Train a logistic regression model to predict `default` (do NOT include `gender`).
2. Evaluate accuracy, precision, recall, F1 on the test set.
3. Compute and report the following fairness metrics:
   - Demographic parity difference
   - Equal opportunity difference (TPR difference)
   - FPR difference
   - Disparate impact ratio
4. Visualize the metrics using a bar chart.

### Part 3: Threshold Analysis (10 minutes)

1. Vary the decision threshold from 0.1 to 0.9 in steps of 0.1.
2. For each threshold, compute demographic parity and equal opportunity differences.
3. Plot both metrics as a function of threshold.
4. Is there a threshold that minimizes unfairness? What happens to accuracy?

### Part 4: Mitigation (15 minutes)

1. Apply sample reweighing (as shown in the lesson) to balance representation by gender.
2. Retrain the model with sample weights.
3. Recompute all fairness metrics.
4. Compare accuracy before and after mitigation.

### Part 5: Discussion (5 minutes)

Write a paragraph summarizing your findings. Which fairness definition is most appropriate for credit default prediction? What are the limitations of your mitigation approach?

## Deliverables

Submit a Jupyter notebook (`.ipynb`) with:
- All code and outputs
- Answers to the discussion questions in markdown cells
- Visualizations

## Rubric

| Criterion | Points | Excellent | Good | Satisfactory | Needs Improvement |
|-----------|--------|-----------|------|--------------|-------------------|
| Data exploration | 15 | Thorough with observations | Adequate | Minimal | Missing |
| Fairness metrics | 30 | All computed and interpreted | Most computed | Some computed | Missing |
| Threshold analysis | 20 | Complete with plot and interpretation | Partial | Minimal | Missing |
| Mitigation | 20 | Applied and compared correctly | Applied but incomplete | Attempted | Missing |
| Discussion | 15 | Insightful analysis | Good observations | Basic | Missing |
