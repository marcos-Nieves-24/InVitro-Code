# Assignment 4: Decision Trees

## Objectives

- Build an interpretable decision tree for a medical diagnosis problem
- Tune hyperparameters to prevent overfitting
- Present a visual tree that can be explained to clinicians

## Dataset

Use the **Breast Cancer Wisconsin** dataset from scikit-learn.

## Scenario

You are building a clinical decision support tool. The tool must:
1. Be interpretable (doctors need to understand why a prediction is made)
2. Be as small as possible (max 5 levels deep for readability)
3. Achieve at least 90% test accuracy

## Instructions

1. **Split** train (70%), validation (15%), test (15%)
2. **Tune hyperparameters** using validation set:
   - max_depth: [2, 3, 4, 5]
   - min_samples_split: [2, 5, 10, 20]
   - min_samples_leaf: [1, 5, 10]
3. **Select the best model** that meets all requirements
4. **Visualize** the final tree
5. **Extract decision rules** from the tree (e.g., "If worst radius > 15 and worst concave points > 0.1 → malignant")
6. **Evaluate** on test set

## Deliverables

- Notebook with code
- Visualized decision tree (export as PNG)
- List of 5-10 decision rules extracted from the tree
- Short report answering:
  - What hyperparameters did you choose and why?
  - What is the test accuracy?
  - How many rules are needed to cover 90% of cases?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Hyperparameter tuning | Systematic search, justified | Basic search | Minimal | Missing |
| Tree visualization | Clear, labeled, exported | Visible | Poor quality | Missing |
| Decision rules | 5+ clear rules | 3-4 rules | 1-2 rules | Missing |
| Interpretability | Doctor-friendly explanation | Clear | Vague | Missing |
| Performance | ≥90% with ≤5 depth | Meets one | Meets neither | Not evaluated |

## Estimated time: 2 hours
