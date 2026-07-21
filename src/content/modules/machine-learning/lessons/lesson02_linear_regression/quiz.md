# Quiz: Linear Regression

## Multiple Choice (5 questions)

**Q1.** In simple linear regression, what does the coefficient $\beta_1$ represent?

a) The predicted value of y when x = 0
b) The change in y for a one-unit change in x
c) The correlation between x and y
d) The error term

<details><summary>Answer</summary>b) The change in y for a one-unit change in x</details>

**Q2.** What does R² = 0.70 mean?

a) The model is 70% likely to be correct
b) 70% of the variance in the target is explained by the features
c) 30% of predictions are wrong
d) The correlation coefficient is 0.70

<details><summary>Answer</summary>b) 70% of the variance in the target is explained by the features</details>

**Q3.** Which of the following is NOT an assumption of linear regression?

a) Linearity between features and target
b) Independence of observations
c) Features must be normally distributed
d) Homoscedasticity (constant variance of residuals)

<details><summary>Answer</summary>c) Features must be normally distributed (only residuals need normality for inference)</details>

**Q4.** Gradient descent is preferred over the closed-form OLS solution when:

a) The number of features is very large
b) The dataset has fewer than 100 samples
c) The features are categorical
d) R² is negative

<details><summary>Answer</summary>a) The number of features is very large (computational cost of matrix inversion is O(n³))</details>

**Q5.** A negative R² value indicates:

a) The model is overfitting
b) The model performs worse than predicting the mean
c) The data has no variance
d) The coefficients are negative

<details><summary>Answer</summary>b) The model performs worse than predicting the mean</details>

## Short Answer (2 questions)

**Q6.** A colleague fits a linear regression and gets R² = 0.92 on training data and R² = 0.15 on test data. What is happening and how would you fix it?

<details><summary>Answer</summary>The model is overfitting — it memorizes training data but fails to generalize. Possible fixes: reduce model complexity (fewer features, polynomial degree), apply regularization (Ridge/Lasso), get more training data, or simplify the feature set.</details>

**Q7.** Explain why the closed-form OLS solution $\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X})^{-1}\mathbf{X}^\top\mathbf{y}$ is problematic when $\mathbf{X}^\top\mathbf{X}$ is not invertible. When does this occur?

<details><summary>Answer</summary>When $\mathbf{X}^\top\mathbf{X}$ is singular (determinant = 0), it has no inverse. This occurs when features are perfectly multicollinear (one feature is a linear combination of others) or when there are fewer samples than features (n < p). Solutions include removing correlated features, using pseudoinverse, or applying regularization (Ridge adds $\lambda I$ making the matrix invertible).</details>

## Coding Question (1 question)

**Q8.** Write a Python function `ridge_regression_scratch(X, y, lambda_val)` that implements Ridge regression (OLS with L2 penalty) using the closed-form solution: $\boldsymbol{\beta} = (\mathbf{X}^\top\mathbf{X} + \lambda\mathbf{I})^{-1}\mathbf{X}^\top\mathbf{y}$. Test it against `sklearn.linear_model.Ridge`.

<details><summary>Answer</summary>

```python
import numpy as np
from sklearn.linear_model import Ridge

def ridge_regression_scratch(X, y, lambda_val):
    X_with_intercept = np.c_[np.ones(X.shape[0]), X]
    n_features = X_with_intercept.shape[1]
    I = np.eye(n_features)
    I[0, 0] = 0  # Don't regularize intercept
    beta = np.linalg.inv(X_with_intercept.T @ X_with_intercept + lambda_val * I) @ X_with_intercept.T @ y
    return beta[0], beta[1:]

from sklearn.datasets import load_diabetes
data = load_diabetes()
X, y = data.data, data.target

int_s, coef_s = ridge_regression_scratch(X, y, lambda_val=1.0)
ridge = Ridge(alpha=1.0).fit(X, y)

print(f"Intercept match: {np.abs(int_s - ridge.intercept_) < 1e-8}")
print(f"Coefficients match: {np.allclose(coef_s, ridge.coef_, atol=1e-8)}")
```
</details>
</details>
