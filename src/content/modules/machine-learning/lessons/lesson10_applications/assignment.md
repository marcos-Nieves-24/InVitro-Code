# Assignment 10: Applications — Final Integration

## Objectives

- Build a complete end-to-end ML application
- Choose appropriate models and metrics for the business context
- Interpret and communicate results
- Write a professional data science report

## Scenario

**Choose ONE of the following two scenarios and complete all tasks.**

### Option A: Biotech — Cell Culture Yield Prediction

A biotech company produces monoclonal antibodies. You have process data from 800 batches. Predict the final **titer (g/L)** and identify which process parameters most affect yield.

```python
np.random.seed(42)
n = 800
biotech = pd.DataFrame({
    'temperature': np.random.normal(36.5, 1.5, n),
    'ph': np.random.normal(7.0, 0.2, n),
    'dissolved_o2': np.random.normal(50, 8, n),
    'seeding_density': np.random.normal(0.5, 0.1, n),
    'glutamine_mM': np.random.normal(4, 1, n),
    'culture_days': np.random.uniform(10, 16, n),
    'reactor_type': np.random.choice(['STR', 'WAVE', 'PERFUSION'], n),
})

titer = (
    2.5
    - 0.3 * np.abs(biotech['temperature'] - 36.5)
    - 2.0 * np.abs(biotech['ph'] - 7.0)
    + 0.5 * biotech['seeding_density']
    + 0.1 * biotech['glutamine_mM']
    + 0.05 * biotech['culture_days']
    + np.random.normal(0, 0.3, n)
)
biotech['titer'] = titer.clip(0)
```

### Option B: SaaS — Customer Health Scoring

A SaaS company wants a **customer health score** (0-100) that predicts churn risk. You have usage data for 2000 accounts.

```python
np.random.seed(42)
n = 2000
saas = pd.DataFrame({
    'active_users': np.random.poisson(50, n),
    'monthly_usage_hours': np.random.exponential(200, n),
    'support_tickets_30d': np.random.poisson(3, n),
    'feature_adoption_pct': np.random.uniform(0, 100, n),
    'days_since_last_login': np.random.exponential(10, n),
    'plan_tier': np.random.choice(['basic', 'pro', 'enterprise'], n, p=[0.5, 0.3, 0.2]),
    'integration_count': np.random.poisson(5, n),
})

health = (
    70
    + 0.2 * saas['active_users']
    + 0.05 * saas['monthly_usage_hours']
    - 2 * saas['support_tickets_30d']
    + 0.2 * saas['feature_adoption_pct']
    - 1.5 * saas['days_since_last_login']
    + np.random.normal(0, 5, n)
)
saas['health_score'] = health.clip(0, 100)
saas['churned_3m'] = (saas['health_score'] < 30).astype(int)
```

## Instructions (applies to both options)

1. **EDA:** Explore the data (distributions, correlations, missing values)
2. **Preprocessing:** Scale numeric features, encode categorical, split
3. **Modeling:** Compare at least 3 models with cross-validation
4. **Tuning:** GridSearchCV for the best model
5. **Interpretation:** Feature importance, PDPs for top features
6. **Business recommendation:** Write a report (max 500 words)

## Deliverables

- Notebook with complete analysis
- Model comparison table
- Feature importance plot
- PDPs for top 2 features
- Business report (max 500 words):
  - Key findings
  - Model performance and limitations
  - Actionable recommendations
  - Next steps

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| EDA | Thorough, with visualizations | Good | Basic | Missing |
| Preprocessing | Correct scaling + encoding + split | Complete | Partial | Missing |
| Model comparison | 3+ models, CV, comparison table | 2 models | 1 model | Missing |
| Hyperparameter tuning | GridSearchCV with justification | GridSearch | Manual | Missing |
| Interpretation | Importance + PDP + insight | One method | Basic | Missing |
| Business report | Professional, actionable | Clear | Basic | Missing |
| Code quality | Clean, reproducible | Readable | Messy | Does not run |

## Estimated time: 3 hours
