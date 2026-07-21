# Assignment 9: Model Interpretation

## Objectives

- Interpret a complex model using multiple methods
- Communicate findings to a non-technical audience
- Make a data-driven recommendation

## Dataset

Use the **Breast Cancer** dataset. Train a `RandomForestClassifier`.

## Scenario

You are a data scientist at a hospital. You've built a cancer diagnosis model with >95% accuracy. The clinical team wants to understand the model before deploying it.

## Instructions

1. **Train** a Random Forest (tune briefly)
2. **Global interpretation:**
   - Compute permutation importance (top 5 features)
   - Create PDPs for the top 2 features
   - Write a plain-English explanation of what drives cancer predictions
3. **Local interpretation:**
   - Pick 2 test samples (one malignant, one benign)
   - Explain each prediction using the top features
   - For each, say what pushed the prediction toward malignant or benign
4. **Validate with domain knowledge:**
   - Check: do the important features make clinical sense?
   - Are there any suspicious features that might cause bias?
5. **Write a memo** (max 500 words) to the clinical team:
   - How does the model work?
   - Which features are most important?
   - What are the limitations?
   - Would you recommend deployment?

## Deliverables

- Notebook with all analyses
- Permutation importance plot
- PDP plots for top 2 features
- Two local explanations (one per class)
- Memo to clinical team

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Global interpretation | Clear, thorough | Mostly clear | Basic | Missing |
| Local interpretation | Detailed, insightful | Clear | Basic | Missing |
| Clinical validation | Meaningful domain discussion | Some discussion | Minimal | Missing |
| Memo | Professional, persuasive | Clear | Basic | Unclear |
| Code quality | Clean, documented | Readable | Messy | Does not run |

## Estimated time: 2 hours
