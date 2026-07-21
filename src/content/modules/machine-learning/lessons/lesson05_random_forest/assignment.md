# Assignment 5: Random Forest

## Objectives

- Apply Random Forest to a high-dimensional biological dataset
- Use feature importance for biomarker discovery
- Tune the model for optimal performance
- Interpret results in biological context

## Dataset

Use `make_classification` to simulate a **gene expression dataset** with:
- 500 samples
- 5000 features (genes)
- 10 informative features
- Binary outcome (responder / non-responder)

```python
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=500, n_features=5000, n_informative=10,
                            n_redundant=0, random_state=42)
```

## Scenario

You are a bioinformatician analyzing gene expression data from a clinical trial. Your goal is to identify which genes predict drug response and build a classifier.

## Instructions

1. **Split** into train (60%), validation (20%), test (20%)
2. **Train baseline:** single decision tree (tune depth)
3. **Train Random Forest** with default parameters
4. **Tune hyperparameters:** n_estimators, max_depth, min_samples_leaf
5. **Identify top 10 genes** from the best Random Forest
6. **Re-train** using only the top 10, 50, and 100 genes — does performance change?
7. **Final evaluation** on test set

## Deliverables

- Notebook with all code
- Table comparing all models (train/val/test accuracy)
- Bar plot of top 10 gene importances
- Plot of validation accuracy vs. number of genes used
- Short report (max 300 words):
  - How many genes are truly needed for good prediction?
  - Would you trust impurity-based importance for biological discovery? Why or why not?
  - How would you validate these biomarkers in the lab?

## Rubric

| Criteria | Excellent (4) | Good (3) | Adequate (2) | Needs Work (1) |
|----------|--------------|----------|-------------|----------------|
| Pipeline | Complete with all steps | Minor missing | Several steps missing | Incomplete |
| Hyperparameter tuning | Systematic grid search | Partial | Minimal | Missing |
| Gene selection analysis | 10/50/100 comparison | One comparison | Raw importance only | Missing |
| Biological interpretation | Insightful discussion | Clear | Basic | Missing |
| Code quality | Clean, reproducible | Readable | Messy | Does not run |

## Estimated time: 2 hours
