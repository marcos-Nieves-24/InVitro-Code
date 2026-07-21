---
Module: 3
Lesson Number: 2
Lesson Title: Data Distribution
Estimated Duration: 60 minutes
Prerequisites: Lesson 1 (Descriptive Statistics)
Learning Objectives:
  - Construct histograms and density plots using matplotlib and seaborn
  - Interpret skewness and kurtosis values
  - Distinguish between symmetric, left-skewed, and right-skewed distributions
  - Choose appropriate bin width for histograms
  - Explain how distribution shape affects choice of summary statistics
Keywords: histogram, density plot, skewness, kurtosis, KDE, distribution shape
Difficulty: Beginner
Programming Concepts: matplotlib, seaborn, numpy, pandas
Mathematical Concepts: skewness, kurtosis, probability density function
Machine Learning Concepts: data distribution understanding
Datasets Used: Synthetic data, penguins dataset
Notebook: 02_data_distribution.ipynb
Assignment: data_distribution_assignment.md
Quiz: data_distribution_quiz.md
---

# Lesson 2: Data Distribution

## Motivation

In Lesson 1, you learned to summarize data with a handful of numbers. But two very different datasets can have identical means and standard deviations. Visualizing the distribution reveals patterns that summary statistics miss: multimodality, gaps, clusters, and extreme values. Understanding data distribution is critical before applying any machine learning model, as many algorithms assume normally distributed features.

In biotechnology, distribution shapes reveal whether gene expression follows a normal or log-normal pattern. In SaaS, user activity data often follows a power-law distribution, affecting how we compute averages and detect anomalies.

## Big Picture

Lesson 1 taught numerical summaries; this lesson teaches visual summaries. You will learn to see the shape of your data. This prepares you for Lesson 3 (Probability), where distributions become formal mathematical objects, and for Lesson 4 (Statistical Distributions), where you will encounter named distributions like the normal and binomial.

## Theory

### Histograms

A histogram partitions data into bins and counts how many observations fall into each bin.

**Intuition**: The histogram approximates the underlying probability distribution of the data. The area of each bar represents the proportion of data in that bin.

**Choosing Bin Width**: The number of bins dramatically affects interpretation. Too few bins hide detail; too many create noise.

- Sturges' rule: \(k = \lceil \log_2 n + 1 \rceil\)
- Square-root rule: \(k = \lceil \sqrt{n} \rceil\)
- Freedman-Diaconis rule: \(h = 2 \times \text{IQR} \times n^{-1/3}\)

### Density Plots (KDE)

A kernel density estimate (KDE) plots a smooth version of the histogram.

$$\hat{f}(x) = \frac{1}{nh} \sum_{i=1}^{n} K\left(\frac{x - x_i}{h}\right)$$

Intuition: Place a small "bump" (kernel) at each data point, then sum all bumps to create a smooth curve. The bandwidth \(h\) controls smoothness.

### Skewness

Skewness measures asymmetry of the distribution.

$$\text{Skewness} = \frac{1}{n} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{\sigma}\right)^3$$

- **Skewness = 0**: Symmetric (e.g., normal distribution)
- **Skewness > 0**: Right-skewed (long tail on the right)
- **Skewness < 0**: Left-skewed (long tail on the left)

Intuition: In a right-skewed distribution, the mean is greater than the median because extreme high values pull the mean to the right.

### Kurtosis

Kurtosis measures the "tailedness" of the distribution.

$$\text{Kurtosis} = \frac{1}{n} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{\sigma}\right)^4 - 3$$

(The "-3" makes the normal distribution have kurtosis = 0, called excess kurtosis.)

- **Kurtosis = 0**: Mesokurtic (normal-like)
- **Kurtosis > 0**: Leptokurtic (heavy tails, more outliers)
- **Kurtosis < 0**: Platykurtic (light tails, fewer outliers)

Intuition: High kurtosis means extreme values are more likely than in a normal distribution. This matters for risk assessment in finance and outlier detection in genomics.

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Generate data with different distributions
np.random.seed(42)
symmetric = np.random.normal(loc=50, scale=10, size=1000)
right_skewed = np.random.exponential(scale=10, size=1000)
left_skewed = -np.random.exponential(scale=10, size=1000) + 100

# Histograms
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

axes[0].hist(symmetric, bins=20, edgecolor='black', color='steelblue')
axes[0].set_title('Symmetric (Normal)')

axes[1].hist(right_skewed, bins=20, edgecolor='black', color='coral')
axes[1].set_title('Right-Skewed')

axes[2].hist(left_skewed, bins=20, edgecolor='black', color='seagreen')
axes[2].set_title('Left-Skewed')

plt.tight_layout()
plt.show()

# Density plots with seaborn
plt.figure(figsize=(10, 5))
sns.kdeplot(symmetric, label='Symmetric', fill=True)
sns.kdeplot(right_skewed, label='Right-Skewed', fill=True)
sns.kdeplot(left_skewed, label='Left-Skewed', fill=True)
plt.title('Density Plots Comparison')
plt.legend()
plt.show()

# Compute skewness and kurtosis
from scipy.stats import skew, kurtosis

print(f"Symmetric - Skewness: {skew(symmetric):.3f}, Kurtosis: {kurtosis(symmetric):.3f}")
print(f"Right-Skewed - Skewness: {skew(right_skewed):.3f}, Kurtosis: {kurtosis(right_skewed):.3f}")
print(f"Left-Skewed - Skewness: {skew(left_skewed):.3f}, Kurtosis: {kurtosis(left_skewed):.3f}")
```

## Walkthrough Example

Analyze the distribution of body mass in penguins.

```python
import seaborn as sns
penguins = sns.load_dataset('penguins')
penguins = penguins.dropna()

# Histogram with KDE
plt.figure(figsize=(10, 5))
sns.histplot(penguins['body_mass_g'], bins=25, kde=True, edgecolor='black')
plt.title('Distribution of Penguin Body Mass')
plt.xlabel('Body Mass (g)')
plt.tight_layout()
plt.show()

# Compute shape statistics
print(f"Skewness: {skew(penguins['body_mass_g']):.3f}")
print(f"Kurtosis: {kurtosis(penguins['body_mass_g']):.3f}")
print(f"Mean: {penguins['body_mass_g'].mean():.0f} g")
print(f"Median: {penguins['body_mass_g'].median():.0f} g")
```

Interpretation: The distribution of body mass is roughly symmetric (skewness near 0). The mean and median are close. There may be multiple peaks reflecting different penguin species.

## Biotechnology Example

Gene expression data often follows a log-normal distribution. Taking the log makes it approximately normal.

```python
np.random.seed(42)
gene_expression = np.random.lognormal(mean=2.0, sigma=0.8, size=1000)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].hist(gene_expression, bins=30, edgecolor='black', color='steelblue')
axes[0].set_title('Raw Gene Expression (Log-Normal)')
axes[0].set_xlabel('Expression Level')

log_transformed = np.log1p(gene_expression)
axes[1].hist(log_transformed, bins=30, edgecolor='black', color='coral')
axes[1].set_title('Log-Transformed (Approx. Normal)')
axes[1].set_xlabel('Log(Expression)')

plt.tight_layout()
plt.show()

print(f"Raw skewness: {skew(gene_expression):.3f}")
print(f"Log-transformed skewness: {skew(log_transformed):.3f}")
```

## SaaS Example

User session durations in a SaaS product.

```python
np.random.seed(42)
session_duration = np.random.exponential(scale=300, size=2000)  # in seconds

plt.figure(figsize=(10, 4))
sns.histplot(session_duration, bins=40, kde=True, edgecolor='black')
plt.title('Distribution of Session Durations')
plt.xlabel('Duration (seconds)')
plt.axvline(np.mean(session_duration), color='red', linestyle='--', label=f'Mean: {np.mean(session_duration):.0f}s')
plt.axvline(np.median(session_duration), color='blue', linestyle='-', label=f'Median: {np.median(session_duration):.0f}s')
plt.legend()
plt.show()
```

## Common Mistakes

1. **Using too few bins**: Hides the shape of the distribution.
2. **Ignoring multimodality**: Multiple peaks suggest subgroups (e.g., different species, user types).
3. **Assuming normality**: Many real-world datasets are skewed.
4. **Confusing skewness direction**: Right-skewed = tail on the right, mean > median.

## Best Practices

- Always visualize your data before computing statistics
- Try multiple bin widths to see different levels of detail
- Use KDE plots alongside histograms
- Report skewness and kurtosis alongside mean and std for non-normal data
- Log-transform right-skewed data when needed for ML models

## Summary

- Histograms show the frequency distribution of data
- Density plots provide a smooth estimate of the distribution
- Skewness measures asymmetry (0 = symmetric)
- Kurtosis measures tail heaviness (0 = normal-like)
- Distribution shape guides choice of summary statistics and preprocessing

## Key Terms

| Term | Definition |
|------|------------|
| Histogram | Bar chart of binned data frequencies |
| Kernel Density Estimate | Smooth estimate of probability density |
| Skewness | Measure of distribution asymmetry |
| Kurtosis | Measure of tail heaviness |
| Leptokurtic | Heavy-tailed distribution |
| Platykurtic | Light-tailed distribution |
| Multimodal | Distribution with multiple peaks |

## Exercises

**Level 1: Basic Understanding**

1. A histogram of house prices shows a long tail on the right. Is this distribution symmetric, left-skewed, or right-skewed? What does this imply about the mean vs median?
2. What kurtosis value would you expect for a normal distribution?

**Level 2: Implementation**

3. Generate 500 samples from a normal distribution with mean=0 and std=1. Plot a histogram with KDE overlay and compute skewness and kurtosis.
4. Load the `tips` dataset from seaborn. Plot histograms of `total_bill` for each day and compare their shapes.

**Level 3: Critical Thinking**

5. A researcher finds that gene expression data has high kurtosis. What does this imply about the biology? How might this affect downstream analysis?
6. Why might a SaaS company prefer median over mean when reporting customer lifetime value (LTV)?

## Coding Challenge

Write a script that:
1. Generates data from four distributions: normal, exponential, uniform, and binomial (n=10, p=0.5)
2. Creates a 2x2 grid of histograms with KDE overlays
3. Prints skewness and kurtosis for each
4. Includes a brief interpretation of each shape
