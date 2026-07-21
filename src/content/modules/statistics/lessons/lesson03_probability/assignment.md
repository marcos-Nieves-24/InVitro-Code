# Assignment: Probability Applications

## Objectives

- Apply Bayes' theorem to diagnostic testing
- Simulate probability experiments in Python
- Interpret probabilistic results in context

## Instructions

1. **Medical Screening**: A hospital implements a screening program for a disease with:
   - Prevalence: 0.5%
   - Test sensitivity: 98%
   - Test specificity: 97%

   a) Calculate P(disease | positive) using Bayes' theorem
   b) If 10,000 people are screened, how many false positives do you expect?
   c) The hospital decides to only inform patients if they test positive twice (assuming independent tests). Recalculate P(disease | two positives).

2. **Simulation**: Write a simulation of the above scenario with 1 million virtual patients to verify your calculations.

3. **SaaS Churn Model**: A SaaS company predicts churn with:
   - Prior churn rate: 8%
   - Model sensitivity: 85%
   - Model specificity: 80%

   Create a function `churn_probability(prior, sensitivity, specificity)` that returns the posterior probability. Use it to:
   - Calculate P(churn | predicted churn)
   - Create a plot showing how posterior changes as prior varies from 0.01 to 0.50

4. **Write a short report** (1 page) interpreting these results for a non-technical audience.

## Deliverables

- Jupyter notebook with code, simulations, and plots
- A markdown report section

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Bayes calculations | All correct | Minor errors | One correct | Missing |
| Simulation | Verified analytically | Works but limited | Partially works | Missing |
| Churn model + plot | Complete and clear | Minor issues | Incomplete | Missing |
| Report | Clear, non-technical | Good but technical | Too brief | Missing |

**Total: 16 points**

## Estimated Time

2.5 hours
