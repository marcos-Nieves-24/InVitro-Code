# Quiz: ML Fundamentals

## Multiple Choice (5 questions)

**Q1.** What distinguishes Machine Learning from traditional programming?

a) ML requires more code than traditional programming
b) In ML, the computer learns rules from data instead of following explicit rules
c) ML only works with images
d) ML does not require a computer

<details><summary>Answer</summary>b) In ML, the computer learns rules from data instead of following explicit rules</details>

**Q2.** In ML terminology, what is a "feature"?

a) The output variable we want to predict
b) An input variable used to make predictions
c) A special property of neural networks
d) The model's accuracy score

<details><summary>Answer</summary>b) An input variable used to make predictions</details>

**Q3.** A model achieves 99% accuracy on training data but only 62% on test data. This is most likely:

a) Underfitting
b) Optimal generalization
c) Overfitting
d) Data leakage in the test set

<details><summary>Answer</summary>c) Overfitting</details>

**Q4.** The bias-variance tradeoff states that:

a) High bias always leads to high variance
b) As model complexity increases, bias tends to decrease and variance tends to increase
c) Bias and variance are unrelated
d) Simple models always outperform complex models

<details><summary>Answer</summary>b) As model complexity increases, bias tends to decrease and variance tends to increase</details>

**Q5.** Which of the following is an example of unsupervised learning?

a) Predicting house prices from bedroom count and square footage
b) Clustering customer purchase patterns without predefined categories
c) Classifying emails as spam or not spam
d) Predicting whether a patient has a disease

<details><summary>Answer</summary>b) Clustering customer purchase patterns without predefined categories</details>

## Short Answer (2 questions)

**Q6.** Explain the difference between training and prediction in Machine Learning.

<details><summary>Answer</summary>Training is the process where the model learns patterns from labeled data by adjusting its internal parameters. Prediction is applying the trained model to new, unseen data to generate outputs. Training requires labeled data and computational effort; prediction is fast and can be applied to unlabeled data.</details>

**Q7.** A colleague tells you: "My model has R² = 0.95 on the training set, so it's excellent." Why might this be misleading?

<details><summary>Answer</summary>A high training R² does not guarantee good generalization. The model could be overfitting — memorizing noise in the training data rather than learning true patterns. The test set R² is the reliable measure of performance. The colleague should evaluate on a held-out test set or use cross-validation.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `bias_variance_demo(degree)` that:
1. Generates synthetic sinusoidal data with noise (20 points, `np.sin(2πx) + N(0, 0.2)`)
2. Fits a polynomial regression of the given degree
3. Returns the train MSE and test MSE

Test your function with degree=1, degree=4, and degree=15.

<details><summary>Answer</summary>

```python
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

def bias_variance_demo(degree):
    np.random.seed(42)
    X = np.linspace(0, 1, 20).reshape(-1, 1)
    y = np.sin(2 * np.pi * X.ravel()) + np.random.normal(0, 0.2, 20)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    poly = PolynomialFeatures(degree=degree)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_train_poly, y_train)

    train_pred = model.predict(X_train_poly)
    test_pred = model.predict(X_test_poly)

    train_mse = mean_squared_error(y_train, train_pred)
    test_mse = mean_squared_error(y_test, test_pred)

    return train_mse, test_mse

for deg in [1, 4, 15]:
    tr, te = bias_variance_demo(deg)
    print(f"Degree {deg}: Train MSE = {tr:.4f}, Test MSE = {te:.4f}")
```
</details>
</details>
