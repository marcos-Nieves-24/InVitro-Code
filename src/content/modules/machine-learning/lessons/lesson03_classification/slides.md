# Slides: Classification

## Slide 1: Title
Classification — Predicting Categories

## Slide 2: Motivation
- Spam detection, cancer diagnosis, churn prediction
- Predicting categories, not numbers
- Logistic regression is the foundation

## Slide 3: Binary Classification
- y ∈ {0, 1}
- Positive class: what we want to detect
- Negative class: everything else

## Slide 4: The Sigmoid Function
- σ(z) = 1 / (1 + e^{-z})
- Maps real numbers to [0, 1]
- Valid probability interpretation

## Slide 5: Logistic Regression
- z = β₀ + β₁x₁ + ... + βₚxₚ
- P(y=1) = σ(z)
- Decision: predict 1 if P ≥ 0.5

## Slide 6: Decision Boundary
- Line/hyperplane where P = 0.5
- Linear in feature space
- Can be extended with polynomial features

## Slide 7: Confusion Matrix
| | Pred+ | Pred- |
|--|-------|-------|
| Actual+ | TP | FN |
| Actual- | FP | TN |

## Slide 8: Key Metrics
- **Accuracy:** (TP + TN) / total
- **Precision:** TP / (TP + FP) — "trust positive predictions"
- **Recall:** TP / (TP + FN) — "catch all positives"
- **F1:** harmonic mean of precision and recall

## Slide 9: ROC Curve
- TPR (Recall) vs FPR (1 - Specificity)
- Each point = different threshold
- AUC = probability positive ranks above negative

## Slide 10: Threshold Selection
- Default 0.5 is not always optimal
- High threshold → high precision, low recall
- Low threshold → high recall, low precision
- Choose based on error costs

## Slide 11: Demo — Breast Cancer
- Load, split (stratified), train
- Confusion matrix, classification report
- ROC curve with AUC

## Slide 12: Biotechnology Example
- Drug response prediction
- Biomarkers as features
- Gene expression as key predictor

## Slide 13: SaaS Example
- Churn prediction
- Login frequency, tickets, feature usage
- Business impact: retention campaigns

## Slide 14: Common Mistakes
- Accuracy on imbalanced data
- Default threshold 0.5 without thinking
- Confusing precision and recall
- No cost analysis

## Slide 15: Summary
- Logistic regression: sigmoid + linear model
- Confusion matrix → precision, recall, F1
- ROC AUC for model comparison
- Threshold depends on business context
- Imbalanced data needs special care
