---
Module: 3
Lesson Number: 3
Lesson Title: Probability Fundamentals
Estimated Duration: 90 minutes
Prerequisites: Lesson 1 (Descriptive Statistics)
Learning Objectives:
  - State Kolmogorov's three axioms of probability
  - Calculate conditional probabilities using Bayes' theorem
  - Apply the law of total probability to partition problems
  - Distinguish between discrete and continuous random variables
  - Solve probability problems with real-world data
Keywords: probability, Kolmogorov axioms, conditional probability, Bayes theorem, random variables, law of total probability
Difficulty: Intermediate
Programming Concepts: numpy, scipy.stats, matplotlib
Mathematical Concepts: probability axioms, conditional probability, Bayes rule, expectation, variance
Machine Learning Concepts: probabilistic thinking, uncertainty quantification
Datasets Used: Synthetic data, medical test data
Notebook: 03_probability.ipynb
Assignment: probability_assignment.md
Quiz: probability_quiz.md
---

# Lesson 3: Probability Fundamentals

## Motivation

Every machine learning model makes predictions under uncertainty. A classifier never knows with 100% certainty which class an example belongs to. A regression model never predicts the exact value without error. Probability provides the mathematical language to express and quantify this uncertainty. Without probability, you cannot understand model confidence, interpret p-values, or evaluate Bayesian methods.

In biotechnology, probability quantifies diagnostic test accuracy: "If a patient tests positive for a disease, what is the probability they actually have it?" In SaaS, probability models predict customer churn: "What is the probability this user will cancel their subscription in the next 30 days?"

## Big Picture

You already understand descriptive statistics (Lesson 1) and data distributions (Lesson 2). Now you will learn the mathematical foundation of randomness and uncertainty. This directly prepares you for Lesson 4 (Statistical Distributions), where random variables follow specific probability laws, and for all subsequent ML lessons that rely on probabilistic reasoning.

## Theory

### Kolmogorov Axioms

Andrey Kolmogorov formalized probability with three axioms.

**Axiom 1 (Non-negativity)**: For any event \(A\), \(P(A) \geq 0\).

**Axiom 2 (Normalization)**: The probability of the sample space \(S\) is 1: \(P(S) = 1\).

**Axiom 3 (Additivity)**: For mutually exclusive events \(A_1, A_2, \ldots\),

$$P\left(\bigcup_{i=1}^{\infty} A_i\right) = \sum_{i=1}^{\infty} P(A_i)$$

Intuition: Probabilities are always between 0 and 1. Something must happen (total probability = 1). If two events cannot happen simultaneously, the probability of either is the sum of their individual probabilities.

### Conditional Probability

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Intuition: If we know event B occurred, we restrict our attention to the portion of A that overlaps with B, renormalized by the probability of B.

### Law of Total Probability

If events \(B_1, B_2, \ldots, B_k\) partition the sample space:

$$P(A) = \sum_{i=1}^{k} P(A \mid B_i) \cdot P(B_i)$$

Intuition: To find the total probability of A, consider all the different ways A can happen, weighted by how likely each scenario is.

### Bayes' Theorem

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$$

Or using the law of total probability:

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{\sum_{i} P(B \mid A_i) \cdot P(A_i)}$$

Intuition: Bayes' theorem updates our belief about A after observing B. \(P(A)\) is the prior (what we believed before), and \(P(A \mid B)\) is the posterior (what we believe after seeing the evidence).

### Random Variables

A random variable is a function that assigns a real number to each outcome in the sample space.

- **Discrete**: Takes countable values (e.g., number of customers who churn)
- **Continuous**: Takes values in an interval (e.g., gene expression level)

**Probability Mass Function (PMF)**: For discrete random variables, \(p(x) = P(X = x)\)

**Probability Density Function (PDF)**: For continuous random variables, \(P(a \leq X \leq b) = \int_a^b f(x) dx\)

**Cumulative Distribution Function (CDF)**: \(F(x) = P(X \leq x)\)

**Expected Value**: \(E[X] = \sum_x x \cdot P(X=x)\) (discrete) or \(E[X] = \int x f(x) dx\) (continuous)

**Variance**: \(\text{Var}(X) = E[(X - E[X])^2] = E[X^2] - E[X]^2\)

## Python Implementation

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Simulating conditional probability: disease testing
# Disease prevalence: 1% of population
# Test sensitivity (true positive rate): 95%
# Test specificity (true negative rate): 90%

# Prior
p_disease = 0.01
p_no_disease = 0.99

# Likelihood
p_pos_given_disease = 0.95
p_neg_given_no_disease = 0.90
p_pos_given_no_disease = 1 - p_neg_given_no_disease  # 0.10 (false positive)

# Using Bayes theorem: P(disease | positive)
p_disease_given_pos = (p_pos_given_disease * p_disease) / (
    p_pos_given_disease * p_disease + p_pos_given_no_disease * p_no_disease
)

print(f"Probability of having disease given positive test: {p_disease_given_pos:.3f}")
print(f"Only {p_disease_given_pos*100:.1f}% — because the disease is rare!")

# Simulate with many patients
np.random.seed(42)
n_patients = 100000
has_disease = np.random.random(n_patients) < p_disease
test_positive = np.where(
    has_disease,
    np.random.random(n_patients) < 0.95,  # true positive
    np.random.random(n_patients) < 0.10   # false positive
)

# Empirical Bayes
actual_disease_given_pos = has_disease[test_positive].mean()
print(f"Empirical P(disease | positive): {actual_disease_given_pos:.3f}")

# Random variable: expected value
# Consider: 20% of users churn each month. Expected number of churned users out of 100?
n_users = 100
p_churn = 0.20
expected_churn = n_users * p_churn
variance_churn = n_users * p_churn * (1 - p_churn)
print(f"\nExpected churned users: {expected_churn}")
print(f"Variance: {variance_churn:.2f}")
print(f"Std dev: {np.sqrt(variance_churn):.2f}")
```

## Walkthrough Example

**Medical Diagnostic Test**

A biotech company develops a test for a rare genetic disorder.

- Prevalence: 0.5% of the population
- Sensitivity: 99% (detects 99% of true cases)
- Specificity: 98% (correctly identifies 98% of healthy people)

**Question**: If a patient tests positive, what is the probability they actually have the disorder?

```python
prevalence = 0.005
sensitivity = 0.99
specificity = 0.98

p_pos_given_disease = sensitivity
p_pos_given_healthy = 1 - specificity

p_dis_given_pos = (p_pos_given_disease * prevalence) / (
    p_pos_given_disease * prevalence + p_pos_given_healthy * (1 - prevalence)
)

print(f"P(disease | positive) = {p_dis_given_pos:.3f} ({p_dis_given_pos*100:.1f}%)")
```

**Interpretation**: Despite 99% sensitivity and 98% specificity, a positive test still means only about 20% chance of having the disease. This counterintuitive result arises because the disease is rare — most positive tests are false positives.

## Biotechnology Example

Gene variant classification. Suppose a mutation is found in a DNA sequence. The mutation could be benign (99.9% of variants) or pathogenic (0.1%). A bioinformatics tool correctly classifies 95% of pathogenic variants and incorrectly flags 2% of benign variants as pathogenic.

```python
p_pathogenic = 0.001
p_benign = 0.999
p_detect_given_pathogenic = 0.95
p_detect_given_benign = 0.02

p_pathogenic_given_detect = (p_detect_given_pathogenic * p_pathogenic) / (
    p_detect_given_pathogenic * p_pathogenic + p_detect_given_benign * p_benign
)
print(f"P(pathogenic | detected) = {p_pathogenic_given_detect:.3f}")
```

## SaaS Example

Customer churn prediction. A SaaS company has data showing:
- 10% of customers churn each month (prior)
- The model predicts churn with 80% accuracy for customers who do churn
- The model falsely predicts churn for 15% of customers who stay

```python
p_churn = 0.10
p_stay = 0.90
p_pred_churn_given_churn = 0.80
p_pred_churn_given_stay = 0.15

p_churn_given_pred = (p_pred_churn_given_churn * p_churn) / (
    p_pred_churn_given_churn * p_churn + p_pred_churn_given_stay * p_stay
)
print(f"P(churn | predicted churn) = {p_churn_given_pred:.3f}")
```

## Common Mistakes

1. **Confusing P(A|B) with P(B|A)**: The probability of having a disease given a positive test is not the same as the probability of a positive test given having the disease. This is called the "prosecutor's fallacy."
2. **Ignoring the base rate**: Bayes' theorem shows that rare events remain rare even after positive evidence (the base rate fallacy).
3. **Assuming independence**: Events are rarely independent in real data. Always check before multiplying probabilities.
4. **Misinterpreting p-values**: A p-value is NOT the probability that the null hypothesis is true.

## Best Practices

- Always write down the prior before updating with evidence
- Use simulation to verify probability calculations
- Visualize probability distributions when possible
- Remember that probability quantifies uncertainty; it does not eliminate it

## Summary

- Kolmogorov axioms: non-negativity, normalization, additivity
- Conditional probability: P(A|B) = P(A∩B) / P(B)
- Law of total probability: P(A) = Σ P(A|B_i) · P(B_i)
- Bayes' theorem: updates prior beliefs with evidence
- Random variables: functions from sample space to real numbers
- Expected value: long-run average of a random variable

## Key Terms

| Term | Definition |
|------|------------|
| Sample Space | Set of all possible outcomes |
| Event | Subset of the sample space |
| Conditional Probability | Probability of A given B has occurred |
| Bayes' Theorem | Formula for updating probabilities given evidence |
| Prior | Initial probability before new evidence |
| Posterior | Updated probability after evidence |
| Random Variable | Variable whose value is determined by a random process |
| Expected Value | Long-run average of a random variable |

## Exercises

**Level 1: Basic Understanding**

1. A fair die is rolled. What is the probability of rolling a 3? What is the probability of rolling an even number?
2. State and explain each of Kolmogorov's three axioms in your own words.

**Level 2: Implementation**

3. Write a Python simulation that rolls two dice 10,000 times and computes the empirical probability that the sum is 7. Compare with the theoretical probability.
4. A spam filter has a false positive rate of 2% and a false negative rate of 1%. 40% of all emails are spam. Use Bayes' theorem to find the probability an email is spam given the filter flagged it.

**Level 3: Critical Thinking**

5. In genome-wide association studies (GWAS), millions of statistical tests are performed simultaneously. Explain how the law of total probability and Bayes' theorem relate to multiple testing correction methods like Bonferroni correction.
6. Why is understanding conditional probability essential for interpreting machine learning model outputs like confidence scores or predicted probabilities?

## Coding Challenge

Write a Python script that:
1. Simulates a diagnostic test for a disease with configurable prevalence, sensitivity, and specificity
2. For each of 10 different prevalence rates (from 0.001 to 0.5), computes the posterior probability P(disease|positive)
3. Plots a curve of prevalence vs posterior probability
4. Includes a horizontal line at y=0.5 to show where the test becomes informative (P(disease|positive) > 0.5)
