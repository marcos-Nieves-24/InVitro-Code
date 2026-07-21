# Quiz: Exploratory Data Analysis

## Multiple Choice (5 questions)

**1. What does MCAR stand for in missing data analysis?**

a) Missing Completely At Random
b) Missing Correlated And Random
c) Measured Correctly At Random
d) Mostly Categorical And Rare

**2. Which method is NOT typically used for outlier detection?**

a) IQR method
b) Z-score method
c) Mean imputation
d) Isolation Forest

**3. According to the IQR rule, a point is an outlier if it is:**

a) Below Q1 or above Q3
b) Below Q1 - 1.5×IQR or above Q3 + 1.5×IQR
c) More than 2 standard deviations from the mean
d) Below the 10th percentile

**4. What is the first step in the EDA workflow?**

a) Outlier detection
b) Data overview (shape, columns, types)
c) Correlation analysis
d) Model building

**5. Which type of missing data is most problematic?**

a) MCAR
b) MAR
c) MNAR
d) All are equally problematic

## Short Answer (2 questions)

**6.** Explain the difference between MAR and MNAR missing data. Give an example of each from a clinical trial.

**7.** Why should you keep the original data untouched during EDA and work on copies?

## Coding Question (1 question)

**8.** Write Python code that loads the `titanic` dataset from seaborn and:
- Prints the percentage of missing values per column
- Creates a heatmap of missing values
- Imputes missing `age` values with the median

---

# Answer Key

1. a) Missing Completely At Random
2. c) Mean imputation
3. b) Below Q1 - 1.5×IQR or above Q3 + 1.5×IQR
4. b) Data overview (shape, columns, types)
5. c) MNAR

6. MAR: missing depends on observed data (e.g., older patients more likely to skip a blood test). MNAR: missing depends on unobserved data (e.g., patients with very high pain levels don't report their pain score). MNAR is more problematic because the missingness mechanism cannot be verified from the observed data.

7. EDA often involves trial and error. Keeping the original data allows you to revert changes, compare results, and ensures reproducibility. Data cleaning decisions should be documented and applied systematically, not in-place.

8. 
```python
import seaborn as sns
import matplotlib.pyplot as plt
titanic = sns.load_dataset('titanic')
print(titanic.isnull().sum() / len(titanic) * 100)
plt.figure(figsize=(8, 4))
sns.heatmap(titanic.isnull(), cbar=False, yticklabels=False)
plt.show()
titanic['age'].fillna(titanic['age'].median(), inplace=True)
```
