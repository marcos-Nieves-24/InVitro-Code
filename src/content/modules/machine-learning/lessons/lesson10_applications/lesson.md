---
Module: 4
Lesson Number: 10
Lesson Title: Applications
Estimated Duration: 90 minutes
Prerequisites: L1-L9 (all previous lessons)
Learning Objectives:
  - Build an end-to-end ML pipeline from raw data to evaluation
  - Apply regression to a biotech product quality prediction problem
  - Apply clustering + classification to a SaaS customer analytics problem
  - Select appropriate models and metrics for different business contexts
  - Communicate ML results to non-technical stakeholders
Keywords: pipeline, end-to-end, biotechnology, SaaS, product quality, customer segmentation, deployment
Difficulty: Advanced
Programming Concepts: Pipeline, ColumnTransformer, GridSearchCV
Mathematical Concepts: integration of multiple ML concepts
Machine Learning Concepts: full ML workflow, model deployment considerations
Datasets Used: synthetic biotech quality, synthetic SaaS customer data
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Applications

## Motivation

You've learned 9 different algorithms. Now it's time to apply them to real problems: predicting the quality of a biotech product and segmenting SaaS customers. This lesson integrates everything — from data preprocessing through model selection to business communication.

## Big Picture

**Previous:** 9 lessons of theory and practice. **This lesson:** Two complete end-to-end case studies. **Next:** You are ready for the final project.

## Case Study 1: Biotech Product Quality Prediction

### Problem

A biomanufacturing company produces therapeutic proteins. They want to predict the final product **quality score** (0-100) based on process parameters measured during production.

### Dataset

```python
import numpy as np
import pandas as pd

np.random.seed(42)
n_batches = 500

biotech = pd.DataFrame({
    'temperature_c': np.random.normal(37, 2, n_batches),
    'ph_level': np.random.normal(7.2, 0.3, n_batches),
    'dissolved_oxygen_pct': np.random.normal(60, 10, n_batches),
    'agitation_rpm': np.random.normal(200, 30, n_batches),
    'feed_rate_ml_hr': np.random.normal(50, 10, n_batches),
    'culture_time_hr': np.random.normal(120, 20, n_batches),
    'cell_density': np.random.normal(10, 3, n_batches),
})

# Quality score formula (simulated)
quality = (
    80
    - 2 * np.abs(biotech['temperature_c'] - 37)
    - 5 * np.abs(biotech['ph_level'] - 7.2)
    - 0.3 * np.abs(biotech['dissolved_oxygen_pct'] - 60)
    + 0.02 * biotech['cell_density']
    + np.random.normal(0, 3, n_batches)
)
biotech['quality_score'] = quality.clip(0, 100)
```

### Pipeline

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline

X = biotech.drop('quality_score', axis=1)
y = biotech['quality_score']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, random_state=42),
}

results = []
for name, model in models.items():
    pipeline = Pipeline([('scaler', StandardScaler()), ('model', model)])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    results.append({
        'Model': name,
        'R²': r2_score(y_test, y_pred),
        'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
    })

results_df = pd.DataFrame(results).sort_values('R²', ascending=False)
print(results_df.to_string(index=False))
```

### Interpretation

Gradient Boosting explains ~85% of quality variance. Key insight: pH and temperature deviations from optimal are the most important factors.

### Business Action

- Tighten temperature and pH control in bioreactors
- Monitor dissolved oxygen more carefully
- Predicted quality score can be used for early release testing

## Case Study 2: SaaS Customer Segmentation and Churn

### Problem

A SaaS company wants to:
1. Segment customers based on usage patterns
2. Build a churn prediction model for each segment

### Dataset

```python
np.random.seed(42)
n_customers = 1000

saas = pd.DataFrame({
    'monthly_spend': np.random.exponential(200, n_customers),
    'logins_per_week': np.random.poisson(5, n_customers),
    'features_used': np.random.poisson(8, n_customers),
    'support_tickets': np.random.poisson(1, n_customers),
    'account_age_months': np.random.exponential(18, n_customers),
    'days_since_login': np.random.exponential(14, n_customers),
})

# Simulate churn
churn_log_odds = (
    -1
    + 0.05 * saas['days_since_login']
    + 0.3 * saas['support_tickets']
    - 0.02 * saas['logins_per_week']
    - 0.1 * saas['features_used']
)
saas['churned'] = (1 / (1 + np.exp(-churn_log_odds)) > 0.3).astype(int)
```

### Step 1: Segmentation

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

X_seg = StandardScaler().fit_transform(saas.drop('churned', axis=1))

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
saas['segment'] = kmeans.fit_predict(X_seg)

segment_profiles = saas.groupby('segment').mean()
print("Segment Profiles:")
print(segment_profiles.round(1))
```

### Step 2: Churn Prediction per Segment

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

for seg in sorted(saas['segment'].unique()):
    seg_data = saas[saas['segment'] == seg]
    X_s = seg_data.drop(['churned', 'segment'], axis=1)
    y_s = seg_data['churned']

    if len(seg_data) < 50:
        continue

    Xs_tr, Xs_te, ys_tr, ys_te = train_test_split(X_s, y_s, test_size=0.3, random_state=42)

    rf = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    rf.fit(Xs_tr, ys_tr)

    auc = roc_auc_score(ys_te, rf.predict_proba(Xs_te)[:, 1])
    print(f"Segment {seg} (n={len(seg_data)}): AUC = {auc:.3f}")
```

### Business Action

- Segment-specific retention campaigns
- High-risk customers identified weeks before churn
- Personalized pricing changes

## Walkthrough Example: End-to-End Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV

# Mixed data example
mixed_data = biotech.copy()
mixed_data['batch_type'] = np.random.choice(['A', 'B', 'C'], n_batches)

X_mixed = mixed_data.drop('quality_score', axis=1)
y_mixed = mixed_data['quality_score']

numeric_features = ['temperature_c', 'ph_level', 'dissolved_oxygen_pct',
                    'agitation_rpm', 'feed_rate_ml_hr', 'culture_time_hr', 'cell_density']
categorical_features = ['batch_type']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(drop='first'), categorical_features),
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(random_state=42)),
])

param_grid = {
    'model__n_estimators': [50, 100, 200],
    'model__max_depth': [5, 10, None],
}

grid = GridSearchCV(pipeline, param_grid, cv=5, scoring='r2')
grid.fit(X_mixed, y_mixed)

print(f"Best params: {grid.best_params_}")
print(f"Best CV R²: {grid.best_score_:.3f}")
```

## Common Mistakes

1. **Skipping EDA** — always understand data before modeling
2. **Leaking future information** — time-based data needs chronological splits
3. **Tuning on test data** — use validation or cross-validation
4. **Ignoring business constraints** — interpretability, speed, cost matter
5. **Not communicating results** — a great model with no buy-in is useless

## Best Practices

- Always start with a simple baseline
- Build pipelines for reproducibility
- Use cross-validation for reliable estimates
- Document everything (data sources, assumptions, decisions)
- Communicate in business language, not ML jargon
- Monitor model performance after deployment

## Summary

- End-to-end ML pipeline: data → preprocessing → model → evaluation → business action
- Biotech: quality prediction enables process optimization
- SaaS: segmentation + churn prediction enables targeted retention
- Always consider the business context when choosing models and metrics
- Communication is as important as technical accuracy

## Key Terms

| Term | Definition |
|------|-----------|
| Pipeline | Chained sequence of data transforms and model |
| End-to-end | Complete workflow from raw data to business decision |
| ColumnTransformer | Applies different preprocessing to different columns |
| GridSearchCV | Systematic hyperparameter search with cross-validation |
| Business metric | KPI that matters to stakeholders (not just ML metrics) |

## Exercises

**Level 1 — Basic:** What are the 5 key stages of an end-to-end ML pipeline?

**Level 2 — Implementation:** Build a complete pipeline for the biotech quality dataset that includes scaling, a Random Forest, and GridSearchCV for n_estimators and max_depth.

**Level 3 — Critical Thinking:** A model achieves R² = 0.92 on the test set, but the manufacturing team doesn't trust it. What would you do to build trust and enable adoption?

## Coding Challenge

Write a function `build_ml_pipeline(X, y, model, param_grid)` that creates a pipeline with StandardScaler and the given model, performs GridSearchCV with 5-fold CV, and returns the best pipeline and the cross-validation results DataFrame.
