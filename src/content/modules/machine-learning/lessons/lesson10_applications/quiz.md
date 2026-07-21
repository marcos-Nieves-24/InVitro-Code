# Quiz: Applications

## Multiple Choice (5 questions)

**Q1.** What is the main benefit of using a Pipeline in scikit-learn?

a) It trains models faster
b) It chains preprocessing and modeling into a single reproducible object
c) It automatically selects the best model
d) It generates visualizations

<details><summary>Answer</summary>b) It chains preprocessing and modeling into a single reproducible object, ensuring the same preprocessing is applied to train and test data</details>

**Q2.** In the biotech quality prediction case study, which process parameter likely has the largest impact on quality?

a) Agitation speed
b) pH deviation from 7.2
c) Culture time
d) Feed rate

<details><summary>Answer</summary>b) pH deviation from 7.2 (the simulated formula has a coefficient of 5 for pH deviation, making it the strongest factor)</details>

**Q3.** Why might you build separate churn models per customer segment instead of one global model?

a) It is always more accurate
b) Different segments may have different churn drivers
c) It requires less data
d) It converges faster

<details><summary>Answer</summary>b) Different segments may have different churn drivers. A high-value segment might churn due to price, while a low-engagement segment might churn due to lack of feature adoption.</details>

**Q4.** ColumnTransformer is useful when:

a) All features are numeric
b) Different columns need different preprocessing (e.g., scaling for numeric, encoding for categorical)
c) The dataset has no missing values
d) Only one model is being tested

<details><summary>Answer</summary>b) It applies different preprocessing pipelines to different columns, which is essential when working with mixed data types</details>

**Q5.** GridSearchCV performs:

a) A random search of hyperparameters
b) An exhaustive search over specified parameter values with cross-validation
c) A single model evaluation
d) Feature selection

<details><summary>Answer</summary>b) An exhaustive search over specified parameter values with cross-validation to find the best hyperparameters</details>

## Short Answer (2 questions)

**Q6.** Describe an end-to-end ML pipeline from raw data to deployment decision. Name at least 5 stages.

<details><summary>Answer</summary>1) Data collection and understanding (EDA), 2) Data preprocessing (cleaning, scaling, encoding), 3) Model training and selection (compare multiple algorithms), 4) Model evaluation (cross-validation, test set, business metrics), 5) Model interpretation (feature importance, PDP), 6) Deployment and monitoring (track performance over time).</details>

**Q7.** A biotech company's quality prediction model achieves excellent accuracy. However, the manufacturing team refuses to use it. What steps would you take to gain adoption?

<details><summary>Answer</summary>1) Build trust through interpretability: show feature importance and PDPs so the team understands the drivers. 2) Start with a pilot: run the model alongside existing processes without replacing them. 3) Involve domain experts in validating the features and predictions. 4) Communicate in business/process language, not ML jargon. 5) Document limitations clearly. 6) Demonstrate ROI with a concrete example (e.g., "if we had this model last month, we would have caught 3 quality issues earlier").</details>

## Coding Question (1 question)

**Q8.** Write a Python function `regression_pipeline_comparison(X, y)` that creates a pipeline with StandardScaler for each of LinearRegression, RandomForestRegressor (n=100), and GradientBoostingRegressor (n=100). It returns a DataFrame comparing their RMSE and R² using 5-fold cross-validation.

<details><summary>Answer</summary>

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import make_scorer, mean_squared_error, r2_score

def regression_pipeline_comparison(X, y):
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
    }

    results = []
    for name, model in models.items():
        pipe = Pipeline([('scaler', StandardScaler()), ('model', model)])
        rmse_scores = -cross_val_score(pipe, X, y, cv=5, scoring='neg_root_mean_squared_error')
        r2_scores = cross_val_score(pipe, X, y, cv=5, scoring='r2')
        results.append({
            'Model': name,
            'RMSE_mean': rmse_scores.mean(),
            'RMSE_std': rmse_scores.std(),
            'R2_mean': r2_scores.mean(),
            'R2_std': r2_scores.std(),
        })

    return pd.DataFrame(results).round(3)

from sklearn.datasets import make_regression
X, y = make_regression(n_samples=500, n_features=10, noise=20, random_state=42)
print(regression_pipeline_comparison(X, y).to_string(index=False))
```
</details>
</details>
