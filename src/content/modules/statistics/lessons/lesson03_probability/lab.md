# Lab: Probability Fundamentals

## Objective

Apply Bayes' theorem and probability concepts to real-world problems through simulation.

## Duration

60 minutes

## Instructions

### Part 1: Diagnostic Test Analysis (20 min)

A biotech company has developed a test for a biomarker.
- Prevalence: 3%
- Sensitivity: 92% 
- Specificity: 88%

1. Calculate P(disease | positive) using Bayes' theorem
2. Simulate 100,000 patients to verify empirically
3. Calculate P(no disease | negative) — the negative predictive value
4. Plot posterior probability as a function of prevalence

### Part 2: Spam Filter (20 min)

A spam filter has these rates:
- False positive: 1% (flags legitimate email as spam)
- False negative: 0.5% (misses spam)
- 60% of all emails are spam

1. If an email is flagged as spam, what is the probability it is actually spam?
2. If an email passes the filter, what is the probability it is actually spam?

### Part 3: Random Variable Exploration (20 min)

1. Define a random variable X = sum of two dice
2. Compute its PMF theoretically
3. Simulate 50,000 rolls to verify
4. Compute E[X] and Var(X)

## Deliverables

- Python script with all calculations, simulations, and a plot
- Written interpretations for each part

## Rubric

| Criteria | Points |
|----------|--------|
| Correct Bayes calculations | 3 |
| Simulation verification | 2 |
| Spam filter analysis | 2 |
| Random variable exploration | 3 |
Total: 10 points
