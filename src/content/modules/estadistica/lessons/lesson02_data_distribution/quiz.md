# Quiz: Data Distribution

## Multiple Choice (5 questions)

**1. A distribution with skewness = -1.5 is:**

a) Symmetric
b) Right-skewed
c) Left-skewed
d) Bimodal

**2. Excess kurtosis of 0 indicates:**

a) Heavy tails
b) Light tails
c) Normal distribution tail weight
d) Bimodality

**3. In a right-skewed distribution, which is true?**

a) Mean < Median
b) Mean > Median
c) Mean = Median
d) Mode > Median

**4. The Freedman-Diaconis rule determines:**

a) The number of bins for a histogram
b) The bandwidth for KDE
c) Whether data is normally distributed
d) The significance level

**5. A leptokurtic distribution (kurtosis > 0) has:**

a) Fewer outliers than normal
b) More outliers than normal
c) No outliers
d) The same number of outliers as normal

## Short Answer (2 questions)

**6.** Explain why log-transforming right-skewed gene expression data makes it approximately normal. What is the practical benefit?

**7.** You plot a histogram and see two distinct peaks. What does this suggest about the data? What should you investigate next?

## Coding Question (1 question)

**8.** Write Python code that:
- Generates 1000 samples from an exponential distribution with scale=5
- Creates a histogram with KDE overlay
- Computes and prints skewness and kurtosis

---

# Answer Key

1. c) Left-skewed
2. c) Normal distribution tail weight
3. b) Mean > Median
4. a) The number of bins for a histogram
5. b) More outliers than normal

6. Log-transformation compresses the long right tail and expands the left tail, making the distribution more symmetric. The practical benefit is that many statistical methods (t-tests, linear models, PCA) assume normality, so transformed data meets these assumptions better.

7. Two peaks (bimodal distribution) suggest the data contains two distinct subgroups. This might indicate different species, treatment vs control groups, or different customer segments. Investigate by coloring the histogram by a categorical variable.

8. 
```python
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis

data = np.random.exponential(scale=5, size=1000)
sns.histplot(data, bins=30, kde=True)
plt.show()
print(f"Skewness: {skew(data):.3f}")
print(f"Kurtosis: {kurtosis(data):.3f}")
```
