# Quiz: Model Interpretation

## Multiple Choice (5 questions)

**Q1.** Permutation importance measures:

a) How often a feature appears in the model
b) The drop in model performance when a feature's values are randomly shuffled
c) The correlation between a feature and the target
d) The computational cost of using a feature

<details><summary>Answer</summary>b) The drop in model performance when a feature's values are randomly shuffled. A large drop = important feature.</details>

**Q2.** A partial dependence plot shows:

a) The distribution of a feature
b) The average model prediction as a function of one feature, averaging out others
c) The correlation between two features
d) The training time vs. feature count

<details><summary>Answer</summary>b) The average model prediction as a function of one feature, holding other features constant through averaging</details>

**Q3.** Which of the following is a LOCAL interpretability method?

a) Permutation importance
b) Partial dependence plot
c) SHAP values
d) Impurity-based feature importance

<details><summary>Answer</summary>c) SHAP values provide explanations for individual predictions (local), while the others are global methods</details>

**Q4.** Impurity-based feature importance can be misleading because:

a) It is too slow to compute
b) It favors high-cardinality features (features with many unique values)
c) It only works for linear models
d) It always gives the same results as permutation importance

<details><summary>Answer</summary>b) It favors high-cardinality features because those features create more splits and accumulate more impurity reduction</details>

**Q5.** Two features are highly correlated (r = 0.95). How does this affect permutation importance?

a) Both features will show high importance
b) Both features may show low importance because the model can substitute one for the other
c) Only the first feature will show importance
d) Permutation importance handles correlation perfectly

<details><summary>Answer</summary>b) Both features may show low importance because when one is shuffled, the model still uses the correlated counterpart to make predictions, so performance drops little</details>

## Short Answer (2 questions)

**Q6.** Explain the difference between global and local interpretability. When would you use each?

<details><summary>Answer</summary>Global interpretability explains the overall model behavior — which features matter most and how they affect predictions on average (e.g., permutation importance, PDP). Local interpretability explains a single prediction — why this specific patient was classified as high-risk (e.g., SHAP, LIME). Use global methods for model understanding and debugging; use local methods when you need to explain individual decisions (e.g., why was this loan denied?).</details>

**Q7.** A partial dependence plot for "years of experience" in a salary prediction model shows a flat line from 0-2 years, a steep increase from 2-15 years, and a plateau after 15 years. Interpret this.

<details><summary>Answer</summary>The PDP shows a non-linear marginal effect: salary is insensitive to experience in the first 2 years (entry-level jobs), increases rapidly between 2-15 years (career progression and skill accumulation), then plateaus after 15 years (senior roles with diminishing returns to additional experience). This suggests the relationship between experience and salary is non-linear and cannot be captured by a simple linear coefficient.</details>

## Coding Question (1 question)

**Q8.** Write a function `plot_pdp_features(model, X_val, feature_names, features_to_plot)` that creates a 2x3 grid of partial dependence plots for 6 features using `PartialDependenceDisplay.from_estimator`.

<details><summary>Answer</summary>

```python
import matplotlib.pyplot as plt
from sklearn.inspection import PartialDependenceDisplay

def plot_pdp_features(model, X_val, feature_names, features_to_plot):
    n_features = len(features_to_plot)
    n_rows = (n_features + 2) // 3
    fig, ax = plt.subplots(n_rows, 3, figsize=(15, 4 * n_rows))
    ax = ax.ravel()

    for i, feature in enumerate(features_to_plot):
        if i < len(ax):
            PartialDependenceDisplay.from_estimator(
                model, X_val, [feature],
                feature_names=feature_names,
                ax=ax[i], grid_resolution=20
            )
            ax[i].set_title(f'PDP: {feature}')

    for j in range(n_features, len(ax)):
        ax[j].set_visible(False)

    plt.tight_layout()
    plt.show()

from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import fetch_california_housing
housing = fetch_california_housing()
model = RandomForestRegressor(n_estimators=50).fit(housing.data, housing.target)
plot_pdp_features(model, housing.data, housing.feature_names, ['MedInc', 'HouseAge', 'AveRooms', 'AveOccup', 'Latitude', 'Longitude'])
```
</details>
</details>
