# Lab: Explaining Black Box Models with LIME and SHAP

## Objective

Use LIME and SHAP to explain predictions from a black box model. Compare explanations and evaluate their reliability.

## Duration

60 minutes

## Prerequisites

Lesson 3, Python (pandas, sklearn, lime, shap)

## Dataset

We use the UCI Wine dataset (built into sklearn) for a multi-class classification task.

## Instructions

### Part 1: Data Preparation and Model Training (10 minutes)

1. Load the Wine dataset from `sklearn.datasets.load_wine`.
2. Split into train/test sets.
3. Train a Random Forest classifier with 200 trees.
4. Report accuracy on the test set.

### Part 2: Global Explanation (10 minutes)

1. Extract and visualize the Random Forest's built-in feature importance.
2. Compute and visualize SHAP summary plot (global explanation).
3. Compare the two global explanations. Do they agree on the top 3 features?

### Part 3: Local Explanation with LIME (15 minutes)

1. Select two test instances: one correctly classified and one misclassified.
2. For each instance, generate a LIME explanation.
3. Display the explanation as a bar chart showing feature contributions.
4. Do the explanations suggest why the misclassification occurred?

### Part 4: Local Explanation with SHAP (15 minutes)

1. For the same two instances, generate SHAP waterfall plots.
2. Compare the SHAP and LIME explanations for each instance.
3. Do the methods agree? Where do they differ?

### Part 5: Stability Analysis (10 minutes)

1. Run LIME 5 times on the same instance.
2. Record the top 3 features each time.
3. Is LIME stable? What is the variance in feature importance?
4. Repeat with SHAP. Is SHAP more stable?

## Deliverables

Submit a Jupyter notebook with:
- All code and visualizations
- Markdown cells answering the comparison questions
- A final paragraph summarizing your findings

## Rubric

| Criterion | Points | Excellent | Good | Satisfactory | Needs Improvement |
|-----------|--------|-----------|------|--------------|-------------------|
| Model training and evaluation | 15 | Correct with analysis | Correct | Minor errors | Not working |
| Global explanations | 20 | Both methods, compared | Both methods | One method | Missing |
| Local explanations | 25 | Both instances, both methods | Partial | One instance/one method | Missing |
| Stability analysis | 25 | Rigorous with interpretation | Done with observations | Attempted | Missing |
| Discussion | 15 | Insightful comparison | Good observations | Basic | Missing |
