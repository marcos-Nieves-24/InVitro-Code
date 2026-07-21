# Slides: Random Forest

## Slide 1: Title
Random Forest — From Unstable Trees to Robust Ensembles

## Slide 2: Motivation
- Single trees overfit and are unstable
- "Wisdom of the crowd": 100 doctors > 1 doctor
- RF is robust, accurate, widely applicable
- Used in genomics, fraud detection, churn prediction

## Slide 3: Ensemble Learning
- Combine multiple models → better predictions
- Diverse models make different errors
- Averaging cancels individual errors

## Slide 4: Bagging (Bootstrap Aggregating)
1. Create B bootstrap samples (sample with replacement)
2. Train tree on each sample
3. Average predictions / majority vote

Reduces variance by ~1/B without increasing bias.

## Slide 5: Random Forest = Bagging + Feature Randomness
- At each split, consider only m features (√p for classification)
- Forces trees to be different
- Lower correlation → better averaging

## Slide 6: OOB Evaluation
- Each bootstrap sample excludes ~37% of data
- These OOB samples serve as built-in validation
- OOB score ≈ cross-validation (free!)

## Slide 7: RF vs. Single Tree
- RF: smoother decision boundary
- RF: higher accuracy
- RF: more stable (lower variance)

## Slide 8: Feature Importance
- Impurity-based: sum of Gini reduction
- Permutation-based: drop in accuracy when shuffling
- Top features = biomarkers / key drivers

## Slide 9: Hyperparameters
- **n_estimators:** more is better (diminishing returns)
- **max_depth:** still useful to limit (default = full)
- **min_samples_leaf:** prevent overfitting
- **class_weight:** 'balanced' for imbalanced data

## Slide 10: Demo — Tree vs. Forest
- Breast cancer dataset
- Single tree: ~93% test
- Random Forest: ~97% test
- OOB: ~95% (close to test)

## Slide 11: Demo — n_estimators Effect
- Few trees: high variance
- 100+ trees: plateau
- OOB score mirrors test score

## Slide 12: Biotechnology Example
- 1000 genes, 300 patients
- Top 3 genes match synthetic generation
- Gene selection for biomarker discovery

## Slide 13: SaaS Example
- Fraud detection with class_weight='balanced'
- Transaction amount, distance, time, device
- Recall-focused evaluation

## Slide 14: Common Mistakes
- Not enough trees (start at 100)
- No depth limit on small datasets
- Using impurity importance blindly
- Ignoring class imbalance

## Slide 15: Summary
- RF = bagged trees + random features
- OOB score = free validation
- Feature importance for interpretation
- Robust, accurate, easy to use
- One of the most practical ML algorithms
