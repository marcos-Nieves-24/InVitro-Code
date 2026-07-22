# Assignment: Building an Explanation Dashboard

## Objectives

- Implement LIME and SHAP for a real dataset
- Build a function that generates explanations for multiple instances
- Critically evaluate explanation quality
- Write a report suitable for a non-technical audience

## Instructions

### Part 1: Model and Data (1 hour)

Choose a dataset with at least 5 features and a binary classification target. Options:
- UCI Heart Disease dataset
- UCI Adult Income dataset (predict income > 50K)
- A synthetic dataset you create

Train at least two models:
- An interpretable model (Logistic Regression)
- A black box model (Random Forest or Gradient Boosting)

### Part 2: Explanation Functions (2 hours)

Implement the following functions:

1. `global_explanation(model, X, feature_names, method='shap')` — returns a DataFrame of global feature importance
2. `local_explanation_lime(model, instance, feature_names)` — returns (features, weights) for a single prediction
3. `local_explanation_shap(model, instance, feature_names)` — returns SHAP values for a single prediction
4. `explanation_dashboard(model, X_test, y_test, n_instances=10)` — generates explanations for n_instances and returns a comparison table

### Part 3: Analysis (2 hours)

1. For 10 test instances, compare LIME and SHAP explanations. Report the rank correlation of feature importance between the two methods.
2. For each instance, check whether the most important feature according to the explanation matches the most important feature globally.
3. If the black box model misclassifies an instance, does the explanation reveal why?

### Part 4: Report (1 hour)

Write a 500-word report explaining your findings for a non-technical audience (e.g., a product manager or regulator). Include:
- What is explainable AI and why it matters
- What LIME and SHAP do (in plain language)
- Key findings from your analysis
- Limitations of the methods
- Recommendations for using explanations in practice

## Deliverables

- A Jupyter notebook with Parts 1–3
- A PDF report (Part 4)

## Rubric

| Criterion | Points | Excellent | Good | Satisfactory | Needs Improvement |
|-----------|--------|-----------|------|--------------|-------------------|
| Models and data | 15 | Two models, appropriate dataset | Two models | One model | Missing |
| Explanation functions | 25 | All four functions, clean code | Three functions | Two or fewer | Not working |
| Comparative analysis | 25 | Rigorous comparison, statistical test | Good comparison | Basic | Missing |
| Report | 25 | Clear, non-technical, complete | Mostly clear | Partial | Missing or unclear |
| Reflection on limitations | 10 | Nuanced understanding demonstrated | Good awareness | Basic | Missing |

**Total: 100 points**

## Estimated Time

6–8 hours

## Submission

Submit notebook and PDF via the course learning management system.
