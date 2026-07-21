---
Module: 3
Lesson Number: 4
Lesson Title: Statistical Distributions
Estimated Duration: 75 minutes
Prerequisites: Lesson 3 (Probability Fundamentals)
Learning Objectives:
  - Describe the Bernoulli, Binomial, Poisson, and Normal distributions
  - Calculate probabilities using PMFs, PDFs, and CDFs with scipy.stats
  - Standardize a normal distribution to Z-scores
  - Choose the appropriate distribution for a given data scenario
Keywords: Bernoulli, Binomial, Poisson, Normal, Gaussian, Z-score, standardization, scipy.stats, PMF, PDF, CDF
Difficulty: Intermediate
Programming Concepts: scipy.stats, numpy, matplotlib
Mathematical Concepts: PMF, PDF, CDF, standardization, central limit theorem
Machine Learning Concepts: feature normalization, distribution assumptions
Datasets Used: Synthetic data, iris dataset
Notebook: 04_statistical_distributions.ipynb
Assignment: statistical_distributions_assignment.md
Quiz: statistical_distributions_quiz.md
---

# Lesson 4: Statistical Distributions

## Motivation

Every data generating process in nature and business follows some probability distribution. Gene expression follows a log-normal distribution. Customer arrivals follow a Poisson distribution. Binary outcomes like disease/no-disease follow a Bernoulli distribution. Understanding these named distributions allows you to model data realistically, make probabilistic predictions, and choose appropriate statistical tests.

In Lesson 3, you learned the general language of probability. Now you will meet the specific distributions that appear most frequently in machine learning and data science.

## Big Picture

This lesson bridges probability theory (Lesson 3) and practical data analysis. You will learn to work with four essential distributions using scipy.stats. These distributions appear throughout the rest of the course — in EDA (Lesson 6), model evaluation (Lesson 9), and all of Module 4 (Machine Learning).

## Theory

### Bernoulli Distribution

Models a single binary outcome (success/failure, 1/0).

- Parameter: \(p\) (probability of success)
- PMF: \(P(X = 1) = p\), \(P(X = 0) = 1 - p\)
- Mean: \(E[X] = p\)
- Variance: \(\text{Var}(X) = p(1-p)\)

Intuition: A single coin flip. Each patient either responds to treatment or does not.

### Binomial Distribution

Models the number of successes in \(n\) independent Bernoulli trials.

- Parameters: \(n\) (trials), \(p\) (success probability)
- PMF: \(P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}\)
- Mean: \(E[X] = np\)
- Variance: \(\text{Var}(X) = np(1-p)\)

Intuition: Flipping a coin \(n\) times and counting heads. Number of patients who respond to treatment out of 100.

### Poisson Distribution

Models the number of events occurring in a fixed interval of time or space.

- Parameter: \(\lambda\) (average rate)
- PMF: \(P(X = k) = \frac{e^{-\lambda} \lambda^k}{k!}\)
- Mean: \(E[X] = \lambda\)
- Variance: \(\text{Var}(X) = \lambda\)

Intuition: Customer arrivals per hour. Number of mutations in a DNA sequence of fixed length.

### Normal (Gaussian) Distribution

The most important distribution in statistics. Models many natural phenomena.

- Parameters: \(\mu\) (mean), \(\sigma^2\) (variance)
- PDF: \(f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)\)
- Mean: \(\mu\)
- Variance: \(\sigma^2\)

**Standard Normal Distribution**: \(Z = \frac{X - \mu}{\sigma}\) transforms any normal to \(N(0, 1)\).

**68-95-99.7 Rule**: About 68% of data within 1σ, 95% within 2σ, 99.7% within 3σ.

Intuition: Heights, measurement errors, test scores. Many machine learning algorithms assume features are normally distributed.

### Central Limit Theorem

The sum (or average) of \(n\) independent random variables converges to a normal distribution as \(n\) increases, regardless of the original distribution.

Intuition: Even if individual data points are not normal, the average of many samples will be approximately normal. This is why the normal distribution is so ubiquitous.

## Python Implementation

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Bernoulli
p = 0.3
bernoulli = stats.bernoulli(p)
print(f"Bernoulli - P(X=1): {bernoulli.pmf(1):.2f}, P(X=0): {bernoulli.pmf(0):.2f}")

# Binomial
n, p = 10, 0.3
binomial = stats.binom(n, p)
k = np.arange(0, n+1)
print(f"Binomial - P(X=3): {binomial.pmf(3):.3f}")
print(f"Mean (np): {binomial.mean():.2f}, Variance (np(1-p)): {binomial.var():.2f}")

# Poisson
lam = 3.0
poisson = stats.poisson(lam)
k = np.arange(0, 10)
print(f"Poisson - P(X=2): {poisson.pmf(2):.3f}")
print(f"Mean: {poisson.mean():.2f}, Variance: {poisson.var():.2f}")

# Normal
mu, sigma = 50, 10
normal = stats.norm(mu, sigma)
print(f"Normal - P(X < 60) (CDF): {normal.cdf(60):.3f}")
print(f"P(40 < X < 60): {normal.cdf(60) - normal.cdf(40):.3f}")
```

### Visualization

```python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Bernoulli
x = [0, 1]
axes[0, 0].bar(x, stats.bernoulli(0.3).pmf(x), width=0.4, color='steelblue')
axes[0, 0].set_title('Bernoulli (p=0.3)')
axes[0, 0].set_xticks([0, 1])

# Binomial
n, p = 10, 0.3
k = np.arange(0, n+1)
axes[0, 1].bar(k, stats.binom(n, p).pmf(k), width=0.8, color='coral')
axes[0, 1].set_title(f'Binomial (n={n}, p={p})')

# Poisson
lam = 3
k = np.arange(0, 12)
axes[1, 0].bar(k, stats.poisson(lam).pmf(k), width=0.8, color='seagreen')
axes[1, 0].set_title(f'Poisson ($\lambda$={lam})')

# Normal
x = np.linspace(mu-4*sigma, mu+4*sigma, 200)
axes[1, 1].plot(x, stats.norm(mu, sigma).pdf(x), color='purple', linewidth=2)
axes[1, 1].set_title(f'Normal ($\mu$={mu}, $\sigma$={sigma})')

plt.tight_layout()
plt.show()

# Standardization demonstration
data = np.random.normal(loc=100, scale=15, size=1000)
z_scores = (data - np.mean(data)) / np.std(data, ddof=0)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(data, bins=30, edgecolor='black')
axes[0].set_title('Original Data')
axes[1].hist(z_scores, bins=30, edgecolor='black')
axes[1].set_title('Standardized (Z-scores)')
plt.tight_layout()
plt.show()
```

## Walkthrough Example

A biotech company measures the number of bacterial colonies on 100 petri dishes. The average is 15 colonies per dish.

```python
lam = 15
k = np.arange(0, 30)
probs = stats.poisson(lam).pmf(k)

plt.figure(figsize=(10, 4))
plt.bar(k, probs, width=0.8, color='steelblue')
plt.axvline(lam, color='red', linestyle='--', label=f'Mean = {lam}')
plt.title('Poisson Distribution: Bacterial Colonies per Dish')
plt.xlabel('Number of Colonies')
plt.ylabel('Probability')
plt.legend()
plt.show()

# Probability of observing exactly 12 colonies
print(f"P(X=12): {stats.poisson(lam).pmf(12):.3f}")
# Probability of observing 20 or more colonies
print(f"P(X >= 20): {1 - stats.poisson(lam).cdf(19):.3f}")
```

Interpretation: The Poisson model helps predict how many colonies we expect to see and whether a dish with 25 colonies is unusually high.

## Biotechnology Example

Gene expression fold-changes are often approximately log-normal. After log transformation, they follow a normal distribution.

```python
# Simulate fold changes
np.random.seed(42)
fold_changes = np.random.lognormal(mean=0, sigma=0.5, size=1000)

log_fc = np.log2(fold_changes)
z_scores = (log_fc - np.mean(log_fc)) / np.std(log_fc, ddof=0)

# Which genes are differentially expressed (|Z| > 2)?
de_genes = np.abs(z_scores) > 2
print(f"Number of differentially expressed genes: {de_genes.sum()}")
print(f"Percentage: {de_genes.mean() * 100:.1f}%")
```

## SaaS Example

Daily user sign-ups follow a Poisson process.

```python
lam_signups = 25  # average 25 signups per day
daily_signups = stats.poisson(lam_signups).rvs(365, random_state=42)

plt.figure(figsize=(10, 4))
plt.hist(daily_signups, bins=20, edgecolor='black', color='coral')
plt.axvline(lam_signups, color='red', linestyle='--', label=f'Mean = {lam_signups}')
plt.title('Daily Sign-ups (Poisson Distribution)')
plt.xlabel('Sign-ups')
plt.ylabel('Frequency')
plt.legend()
plt.show()

# Expected number of days with more than 30 sign-ups
p_more_than_30 = 1 - stats.poisson(lam_signups).cdf(30)
expected_days = p_more_than_30 * 365
print(f"Expected days with >30 sign-ups: {expected_days:.1f}")
```

## Common Mistakes

1. **Using Binomial when trials are not independent**: The Binomial assumes independence. In reality, patients in the same hospital may have correlated outcomes.
2. **Using Poisson when variance ≠ mean**: The Poisson assumes variance = mean. If variance is much larger (overdispersion), use Negative Binomial instead.
3. **Assuming data is normal without checking**: Always visualize and test for normality before using methods that assume it.
4. **Interpreting the CLT too broadly**: The CLT applies to the sample mean, not to individual observations.

## Best Practices

- Visualize your data before choosing a distribution
- Use Q-Q plots to check normality
- Standardize features (Z-scores) when using distance-based ML algorithms
- Remember the 68-95-99.7 rule for quick normal approximations
- Use scipy.stats for all distribution computations

## Summary

- **Bernoulli**: Single binary outcome (p)
- **Binomial**: Count of successes in n trials (n, p)
- **Poisson**: Count of events in time/space (λ)
- **Normal**: Bell-shaped continuous distribution (μ, σ)
- **Standardization**: Z = (X - μ) / σ creates standard normal
- Central Limit Theorem: sample means approach normality as sample size grows

## Key Terms

| Term | Definition |
|------|------------|
| Bernoulli Distribution | Models a single binary outcome |
| Binomial Distribution | Models number of successes in n trials |
| Poisson Distribution | Models event counts over time/space |
| Normal Distribution | Symmetric bell-shaped distribution |
| Z-score | Standardized value: (X - μ) / σ |
| Standardization | Transforming to mean 0, std 1 |
| Central Limit Theorem | Sample means approach normality with large n |
| PMF | Probability mass function (discrete) |
| PDF | Probability density function (continuous) |
| CDF | Cumulative distribution function |

## Exercises

**Level 1: Basic Understanding**

1. What are the mean and variance of a Bernoulli distribution with p = 0.5?
2. The number of customer support tickets received per hour averages 12. What distribution models this? What is the probability of receiving exactly 10 tickets in an hour?

**Level 2: Implementation**

3. Using scipy.stats, generate and plot the PMF of a Binomial distribution with n=20, p=0.7. What is the probability of getting at least 15 successes?
4. Generate 1000 samples from N(100, 20), standardize them, and verify the resulting Z-scores have mean ≈ 0 and std ≈ 1.

**Level 3: Critical Thinking**

5. In RNA-seq data, gene counts are often modeled with a Negative Binomial rather than Poisson distribution. Why? What property of RNA-seq data violates the Poisson assumption?
6. A SaaS company's daily revenue is right-skewed. Why might the Central Limit Theorem still allow them to use normal-based confidence intervals for monthly average revenue?

## Coding Challenge

Write a Python script that:
1. Generates data from 4 different distributions (Bernoulli, Binomial, Poisson, Normal)
2. For each distribution, computes and prints the mean and variance
3. Creates a 2×2 subplot with the PMF or PDF of each distribution
4. For the normal distribution, overlaid vertical lines at ±1σ, ±2σ, ±3σ from the mean with annotations showing the percentage of data within each range
