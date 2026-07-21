# Quiz: Model Evaluation

## Multiple Choice (5 questions)

**1. What does RMSE stand for?**

a) Regularized Mean Squared Error
b) Root Mean Squared Error
c) Relative Mean Standard Error
d) Regression Model Selection Error

**2. R² = 0 means:**

a) The model predicts perfectly
b) The model performs no better than predicting the mean
c) The model is overfit
d) The model has negative performance

**3. In k-fold cross-validation, each data point is used for testing exactly:**

a) 0 times
b) 1 time
c) k times
d) k-1 times

**4. Which metric penalizes large errors the most heavily?**

a) MAE
b) MSE
c) R²
d) RMSE

**5. Data leakage occurs when:**

a) The test set is too small
b) Information from outside the training set is used during training
c) The model is too complex
d) Cross-validation is not used

## Short Answer (2 questions)

**6.** Explain why it is a mistake to evaluate a model on the same data it was trained on.

**7.** A regression model has MAE = $5,000 and RMSE = $12,000 for house price prediction. What does the difference between MAE and RMSE tell you?

## Coding Question (1 question)

**8.** Write Python code using sklearn that:
- Splits the diabetes dataset into train (80%) and test (20%)
- Trains a LinearRegression
- Computes and prints MAE, RMSE, and R² on the test set

---

# Answer Key

1. b) Root Mean Squared Error
2. b) The model performs no better than predicting the mean
3. b) 1 time
4. b) MSE
5. b) Information from outside the training set is used during training

6. A model can memorize the training data (overfitting) and appear to perform well. But the goal is generalization — performance on new, unseen data. The test set simulates this scenario. Training performance is always optimistic.

7. RMSE is much larger than MAE (more than double), which means there are some predictions with very large errors. The squared term in MSE/RMSE amplifies large errors. Some houses have prediction errors much larger than the typical $5,000.

8. 
```python
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression().fit(X_train, y_train)
y_pred = model.predict(X_test)
print(f"MAE: {mean_absolute_error(y_test, y_pred):.2f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")
print(f"R²: {r2_score(y_test, y_pred):.3f}")
```
