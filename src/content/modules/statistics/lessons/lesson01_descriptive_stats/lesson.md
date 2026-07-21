---
Module: 3
Lesson Number: 1
Lesson Title: Descriptive Statistics
Estimated Duration: 75 minutes
Prerequisites: Module 2 (Python Programming Fundamentals)
Learning Objectives:
  - Explain the difference between measures of central tendency and measures of dispersion
  - Calculate mean, median, mode, variance, standard deviation, range, and IQR using Python
  - Interpret descriptive statistics to summarize a dataset
  - Choose the appropriate measure of central tendency based on data distribution
  - Identify outliers using the IQR method
Keywords: mean, median, mode, variance, standard deviation, range, IQR, boxplot, descriptive statistics
Difficulty: Beginner
Programming Concepts: numpy, pandas, matplotlib
Mathematical Concepts: mean, variance, standard deviation, quartiles, percentiles
Machine Learning Concepts: data summarization, feature understanding
Datasets Used: Synthetic student exam scores, diabetes dataset
Notebook: 01_descriptive_statistics.ipynb
Assignment: descriptive_statistics_assignment.md
Quiz: descriptive_statistics_quiz.md
---

# Lesson 1: Descriptive Statistics

## Motivation

Imagine you have just sequenced 10,000 genes from a patient sample. You need to communicate which genes are consistently expressed and which vary wildly between patients. Without descriptive statistics, you would have to read 10,000 numbers one by one. Descriptive statistics condense entire datasets into a handful of meaningful numbers, enabling scientists and data analysts to understand data at a glance.

In biotechnology, descriptive statistics help answer questions like: What is the average expression level of a gene across a population? How variable is the response to a drug? In SaaS, descriptive statistics summarize user engagement metrics like daily active users or session duration.

## Big Picture

In the previous module, you learned to manipulate data using Python, NumPy, and Pandas. Now you will learn to describe data numerically. This lesson builds the foundation for all subsequent statistics lessons. In Lesson 2, you will visualize these same descriptive concepts using histograms and density plots.

## Theory

### Measures of Central Tendency

Central tendency measures tell us where the "center" of a dataset lies.

**Mean (Average)**

The arithmetic mean is the sum of all values divided by the number of values.

$$\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$$

Intuition: The mean is the balance point of the data. If you placed each data point on a number line with equal weights, the mean is where the fulcrum would balance.

**Median**

The median is the middle value when data is sorted in ascending order.

$$\text{median} = \begin{cases} x_{(n+1)/2} & \text{if } n \text{ is odd} \\ \frac{x_{n/2} + x_{(n/2)+1}}{2} & \text{if } n \text{ is even} \end{cases}$$

Intuition: The median splits the dataset into two equal halves. Unlike the mean, it is not affected by extreme values.

**Mode**

The mode is the most frequent value in the dataset. A dataset can have one mode (unimodal), two modes (bimodal), or more.

Intuition: The mode tells you the most common category or value.

### Measures of Dispersion

Dispersion measures tell us how spread out the data is.

**Range**

$$\text{Range} = \max(x) - \min(x)$$

Intuition: The range gives the total span of the data. It is very sensitive to outliers.

**Variance**

$$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$$

Intuition: Variance measures the average squared distance from the mean. Larger variance means data points are more spread out.

**Standard Deviation**

$$\sigma = \sqrt{\sigma^2}$$

Intuition: The standard deviation is the typical distance of a data point from the mean. Because it is in the same units as the original data, it is more interpretable than variance.

**Interquartile Range (IQR)**

$$\text{IQR} = Q_3 - Q_1$$

Where \(Q_1\) is the 25th percentile and \(Q_3\) is the 75th percentile.

Intuition: The IQR contains the middle 50% of the data. It is robust to outliers.

### Outlier Detection Using IQR

A common rule: any point below \(Q_1 - 1.5 \times \text{IQR}\) or above \(Q_3 + 1.5 \times \text{IQR}\) is considered an outlier.

## Python Implementation

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Sample data: exam scores for 30 students
scores = [78, 85, 92, 67, 88, 95, 73, 81, 90, 76,
          84, 91, 69, 87, 93, 75, 82, 89, 96, 71,
          79, 86, 94, 68, 83, 97, 77, 80, 99, 100]

# Convert to numpy array
scores = np.array(scores)

# Central tendency
mean = np.mean(scores)
median = np.median(scores)
mode = pd.Series(scores).mode().values

print(f"Mean: {mean:.2f}")
print(f"Median: {median:.2f}")
print(f"Mode: {mode}")

# Dispersion
variance = np.var(scores, ddof=0)  # population variance
std_dev = np.std(scores, ddof=0)
data_range = np.ptp(scores)  # peak to peak (range)
q1 = np.percentile(scores, 25)
q3 = np.percentile(scores, 75)
iqr = q3 - q1

print(f"\nVariance: {variance:.2f}")
print(f"Standard Deviation: {std_dev:.2f}")
print(f"Range: {data_range}")
print(f"Q1: {q1:.2f}, Q3: {q3:.2f}, IQR: {iqr:.2f}")

# Outlier detection
lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr
outliers = scores[(scores < lower_bound) | (scores > upper_bound)]
print(f"\nOutlier bounds: [{lower_bound:.2f}, {upper_bound:.2f}]")
print(f"Outliers: {outliers}")

# Boxplot visualization
plt.figure(figsize=(8, 4))
plt.boxplot(scores, vert=False, patch_artist=True)
plt.title('Distribution of Exam Scores')
plt.xlabel('Score')
plt.tight_layout()
plt.show()
```

## Walkthrough Example

**Problem**: A biotech company is testing a new drug. They measured the reduction in tumor size (mm) for 20 patients.

```python
tumor_reduction = [12, 15, 8, 14, 16, 11, 13, 9, 17, 10,
                   14, 13, 15, 12, 11, 16, 10, 14, 13, 45]

reduction = np.array(tumor_reduction)

print("Tumor Reduction Descriptive Statistics")
print(f"Mean: {np.mean(reduction):.2f} mm")
print(f"Median: {np.median(reduction):.2f} mm")
print(f"Std Dev: {np.std(reduction, ddof=0):.2f} mm")
print(f"IQR: {np.percentile(reduction, 75) - np.percentile(reduction, 25):.2f} mm")

# The value 45 is likely an outlier — perhaps measurement error or exceptional case
q1 = np.percentile(reduction, 25)
q3 = np.percentile(reduction, 75)
iqr = q3 - q1
outliers = reduction[(reduction < q1 - 1.5*iqr) | (reduction > q3 + 1.5*iqr)]
print(f"Potential outliers: {outliers}")
```

**Interpretation**: The median (13 mm) is more representative than the mean (14.5 mm) because the outlier 45 inflates the mean. The IQR (4 mm) tells us the middle 50% of patients experienced 11--15 mm of tumor reduction.

## Biotechnology Example

Analyze gene expression data for 50 patient samples. Each sample measures the expression level of the TP53 tumor suppressor gene.

```python
np.random.seed(42)
tp53_expression = np.random.normal(loc=8.5, scale=2.0, size=50)

df = pd.DataFrame({'TP53_expression': tp53_expression})
summary = df.describe()
print(summary)

# Checking for abnormally low expression (potential gene deletion)
q1 = df['TP53_expression'].quantile(0.25)
q3 = df['TP53_expression'].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
print(f"\nSamples with unusually low TP53 expression:")
print(df[df['TP53_expression'] < lower])
```

## SaaS Example

Analyze daily active users (DAU) for a SaaS product over 90 days.

```python
np.random.seed(42)
dau = np.random.poisson(lam=1500, size=90) + np.random.randint(-50, 50, 90)

print("Daily Active Users - Descriptive Statistics")
print(f"Mean: {np.mean(dau):.0f}")
print(f"Median: {np.median(dau):.0f}")
print(f"Std Dev: {np.std(dau, ddof=0):.0f}")
print(f"Min: {np.min(dau)}, Max: {np.max(dau)}")

pd.Series(dau).plot(kind='hist', bins=15, edgecolor='black')
plt.title('Distribution of Daily Active Users')
plt.xlabel('Users')
plt.tight_layout()
plt.show()
```

## Common Mistakes

1. **Using the mean for skewed data**: The mean is sensitive to outliers. Use median for income, gene expression with outliers, or any skewed distribution.
2. **Confusing sample and population variance**: `np.var(x)` computes population variance (ddof=0). For sample variance, use `np.var(x, ddof=1)`.
3. **Interpreting standard deviation without context**: A standard deviation of 10 might be large or small depending on the scale of the data.
4. **Assuming mode is unique**: In continuous data, every value may appear once. Use binning or rounding to find meaningful modes.

## Best Practices

- Always compute both central tendency and dispersion measures together
- Report median and IQR for skewed distributions
- Report mean and standard deviation for symmetric distributions
- Visualize data with a boxplot alongside numerical summaries
- Use `df.describe()` for a quick overview in pandas

## Summary

- Descriptive statistics summarize data with a few key numbers
- Central tendency: mean (balance point), median (middle value), mode (most common)
- Dispersion: range (total spread), variance (average squared deviation), standard deviation (typical deviation), IQR (middle 50% spread)
- IQR rule identifies outliers as points beyond 1.5×IQR from the quartiles
- Choose mean + std for symmetric data, median + IQR for skewed data

## Key Terms

| Term | Definition |
|------|------------|
| Mean | Sum of values divided by count; the arithmetic average |
| Median | The middle value when data is sorted |
| Mode | The most frequent value |
| Variance | Average squared distance from the mean |
| Standard Deviation | Square root of variance; typical distance from mean |
| Range | Difference between max and min |
| Interquartile Range | Difference between 75th and 25th percentiles |
| Outlier | Data point that differs significantly from the rest |

## Exercises

**Level 1: Basic Understanding**

1. A dataset has values [5, 7, 8, 8, 10, 100]. Calculate mean, median, and mode. Which measure best represents the center?
2. What is the difference between variance and standard deviation? Why is standard deviation more commonly reported?

**Level 2: Implementation**

3. Using pandas, load any CSV file and compute the mean, median, std, min, max, and IQR for all numeric columns.
4. Write a function `outlier_count(data)` that returns the number of outliers using the IQR method.

**Level 3: Critical Thinking**

5. A pharmaceutical company reports the mean effectiveness of a drug as 85%. However, 40% of patients showed no response. Explain how this contradiction is possible and suggest better summary statistics.
6. Why might a SaaS company track median session duration instead of mean session duration?

## Coding Challenge

Write a Python script that:
1. Generates a synthetic dataset of 200 values from a normal distribution with mean=50 and std=15
2. Computes all descriptive statistics covered in this lesson
3. Identifies and removes outliers using the IQR method
4. Prints a summary comparing the original and cleaned datasets
