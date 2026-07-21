# Assignment 3: Classification

## Objectives

- Build a complete classification pipeline
- Handle imbalanced data appropriately
- Choose evaluation metrics based on business context
- Write a data-driven recommendation

## Scenario

You work for a **healthtech startup** that has developed a blood test to detect a disease. The disease has 3% prevalence in the screened population. Your test produces 30 biomarker measurements per patient.

## Dataset

Use `load_breast_cancer()` from scikit-learn. Treat malignant = positive (disease present), benign = negative.

## Instructions

1. **Split** into train (60%), validation (20%), test (20%) with stratification
2. **Train** logistic regression (default settings)
3. **Evaluate** using all metrics on validation set
4. **Find optimal threshold** for two scenarios:
   - Scenario A: Missing a case costs 50× more than a false alarm
   - Scenario B: False alarms cost 10× more than missing a case
5. **Final evaluation** on test set using the chosen thresholds
6. **Write a recommendation** (max 300 words) to the CEO:
   - What threshold would you use for screening the general population?
   - What is the tradeoff you are making?
   - What is the expected false positive rate?

## Deliverables

- Python script or notebook
- Table with metrics at different thresholds
- ROC curve with annotated operating points
- Recommendation memo to CEO

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Pipeline | Complete, stratified split | Complete | Partial | Missing |
| Threshold analysis | Both scenarios with justification | One scenario | Basic | Missing |
| Metrics | Full set with interpretation | Most metrics | Few metrics | Missing |
| Recommendation | Insightful, business-aware | Clear | Basic | Missing |
| Code quality | Clean, documented | Readable | Messy | Does not run |

## Estimated time: 2 hours
