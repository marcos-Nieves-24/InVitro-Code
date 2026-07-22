# Quiz: Relationships Between Variables

## Multiple Choice (5 questions)

**1. Pearson correlation measures:**

a) The slope of the regression line
b) The strength of a linear relationship
c) The causal effect of X on Y
d) The difference between means

**2. Spearman correlation is based on:**

a) Raw data values
b) Ranks of data values
c) Z-scores
d) Standard deviations

**3. A correlation of -0.8 indicates:**

a) Strong positive linear relationship
b) Strong negative linear relationship
c) Weak negative linear relationship
d) No relationship

**4. Which correlation is more robust to outliers?**

a) Pearson
b) Spearman
c) Both are equally robust
d) Neither

**5. A correlation matrix with all values close to 1 suggests:**

a) Features are independent
b) Features are multicollinear
c) Features have zero variance
d) The data is normally distributed

## Short Answer (2 questions)

**6.** Explain the difference between a linear and a monotonic relationship. Give an example of each.

**7.** Why is it important to check for multicollinearity before building a linear regression model?

## Coding Question (1 question)

**8.** Write Python code that:
- Creates two arrays: x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] and y = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
- Computes both Pearson and Spearman correlation
- Explains why they differ

---

# Answer Key

1. b) The strength of a linear relationship
2. b) Ranks of data values
3. b) Strong negative linear relationship
4. b) Spearman
5. b) Features are multicollinear

6. A linear relationship follows a straight line (Y = a + bX). A monotonic relationship consistently increases or decreases but not necessarily in a straight line (e.g., Y = X² for X > 0). Quadratic growth is monotonic (for X > 0, as X increases, Y increases) but not linear.

7. Multicollinearity inflates the variance of coefficient estimates, making them unstable and uninterpretable. It becomes difficult to determine which feature is actually driving the prediction.

8. 
```python
from scipy.stats import pearsonr, spearmanr
x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
y = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
print(f"Pearson: {pearsonr(x, y)[0]:.3f}")
print(f"Spearman: {spearmanr(x, y)[0]:.3f}")
# Pearson is 0.97 (high but not 1 because the relationship is quadratic, not linear)
# Spearman is 1.0 (perfect monotonic relationship)
```
