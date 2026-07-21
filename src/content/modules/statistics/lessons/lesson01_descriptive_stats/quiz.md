# Quiz: Descriptive Statistics

## Multiple Choice (5 questions)

**1. Which measure of central tendency is most affected by outliers?**

a) Median
b) Mode
c) Mean
d) Interquartile Range

**2. The interquartile range (IQR) represents:**

a) The range between the minimum and maximum values
b) The middle 50% of the data
c) The average distance from the mean
d) The most frequent value

**3. A dataset has values: 10, 12, 14, 15, 18, 100. What is the median?**

a) 14
b) 14.5
c) 15
d) 28.17

**4. If the standard deviation of a dataset is 0, what can we conclude?**

a) All values are equal
b) The mean is 0
c) The data is symmetric
d) There are no outliers

**5. According to the IQR rule, a data point is an outlier if it is:**

a) Below Q1 or above Q3
b) Below Q1 - 1.5×IQR or above Q3 + 1.5×IQR
c) More than 2 standard deviations from the mean
d) Below the mean minus the range

## Short Answer (2 questions)

**6.** Explain why the median is preferred over the mean for reporting household income in a country with high income inequality.

**7.** A biotech researcher measures protein concentration in 100 samples. The mean is 45 mg/dL with a standard deviation of 3 mg/dL. Interpret these values in plain language.

## Coding Question (1 question)

**8.** Write Python code using numpy to:
- Create an array `data = np.array([2, 4, 6, 8, 10, 100])`
- Compute the mean, median, variance, standard deviation, and IQR
- Identify all outliers using the IQR method

---

# Answer Key

1. c) Mean
2. b) The middle 50% of the data
3. b) 14.5
4. a) All values are equal
5. b) Below Q1 - 1.5×IQR or above Q3 + 1.5×IQR

6. Income distributions are heavily right-skewed (a few very high incomes). The mean is pulled upward by these high values and does not represent the typical person. The median is robust to outliers and reflects the income of the middle person.

7. The typical protein concentration is 45 mg/dL, and individual samples typically deviate from this average by about 3 mg/dL. Most samples (roughly 68%) fall between 42 and 48 mg/dL.

8. 
```python
import numpy as np
data = np.array([2, 4, 6, 8, 10, 100])
mean = np.mean(data)
median = np.median(data)
variance = np.var(data, ddof=0)
std = np.std(data, ddof=0)
q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
outliers = data[(data < lower) | (data > upper)]
print(f"Outliers: {outliers}")
```
