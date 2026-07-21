# Slides: ML Fundamentals

## Slide 1: Title
ML Fundamentals — How Computers Learn from Data

## Slide 2: Motivation
- Netflix recommendations, spam filters, face recognition
- Traditional programming vs ML
- Biotech: predict drug response from gene expression
- SaaS: predict customer churn from usage patterns

## Slide 3: Traditional Programming vs ML
- Rules + Data → Answers (Traditional)
- Data + Answers → Rules (ML)
- Key insight: we stop writing rules, we let data speak

## Slide 4: Key Vocabulary
- **Feature (X):** Input variable
- **Label (y):** Output to predict
- **Training:** Model learns patterns
- **Prediction:** Model applied to new data

## Slide 5: Supervised vs Unsupervised
| | Supervised | Unsupervised |
|--|-----------|--------------|
| Labels | Yes | No |
| Goal | Predict | Discover structure |
| Examples | Regression, Classification | Clustering, PCA |

## Slide 6: Generalization
- The true goal of ML
- Model must perform well on UNSEEN data
- Train/test split is essential

## Slide 7: Overfitting
- Model memorizes training data
- High train score, low test score
- Cause: model too complex
- Fix: simplify, regularize, get more data

## Slide 8: Underfitting
- Model too simple to capture pattern
- Low train AND test scores
- Cause: model too simple
- Fix: increase complexity, better features

## Slide 9: Bias-Variance Tradeoff
- Error = Bias² + Variance + Irreducible Error
- As complexity ↑, bias ↓, variance ↑
- Sweet spot: minimum total error

## Slide 10: Visual Demo
- Degree 1: underfitting
- Degree 4: good fit
- Degree 15: overfitting
- Show train vs test MSE

## Slide 11: Demo Code Walkthrough
- Load diabetes dataset
- train_test_split
- model.fit, model.score
- Interpret results

## Slide 12: Biotechnology Example
- Gene expression → drug response
- 500 patients, 1000 genes
- Binary classification: responder / non-responder

## Slide 13: SaaS Example
- Churn prediction
- Features: login frequency, support tickets, account age
- Real business impact: retention

## Slide 14: Common Mistakes
- Splitting after preprocessing (data leakage)
- Tuning on test set
- Confusing correlation with causation
- Ignoring class imbalance

## Slide 15: Summary
- ML: learn rules from data
- Features (X), labels (y)
- Generalization is the goal
- Overfit ↔ Underfit
- Always evaluate on held-out data
