# Slides: Transparency and Explainability

## Slide 1: Title Slide
- Transparency and Explainability in AI
- Module 5, Lesson 3

## Slide 2: Learning Objectives
- Differentiate interpretability vs. explainability
- Understand the black box problem
- Explain LIME and SHAP
- Implement and evaluate explanations
- Understand limitations of post-hoc methods

## Slide 3: Motivation
- Doctor: "Why does the AI recommend chemotherapy?"
- Patient deserves an explanation
- EU AI Act: right to explanation for automated decisions
- Explainability is both ethical and legal

## Slide 4: The Black Box Problem
- Deep neural networks, gradient boosting = high accuracy
- But internal decision process is opaque
- Three dimensions: epistemic, trust, accountability
- How do you debug a model you cannot understand?

## Slide 5: Interpretability vs. Explainability
- Interpretability: understand the model's inner workings
  - Example: linear regression coefficients
- Explainability: understand why a specific prediction was made
  - Example: LIME for a loan denial
- Interpretable models are inherently transparent
- Black box models need post-hoc explanations

## Slide 6: Global vs. Local Explanations
- Global: overall model behavior
  - Feature importance, partial dependence plots
- Local: individual predictions
  - LIME, SHAP force plots
- Different audiences need different explanations

## Slide 7: Model-Specific vs. Model-Agnostic
- Specific: decision tree visualization, linear coefficients
- Agnostic: LIME, SHAP (work with any model)
- Trade-off: specificity gives richer explanations, agnostic gives flexibility

## Slide 8: LIME — Intuition
- Complex decision boundary globally
- Simple linear boundary locally
- Perturb instance, get predictions, fit local model

## Slide 9: LIME — How It Works
1. Take instance to explain
2. Generate perturbed samples
3. Get black box predictions
4. Fit weighted linear model
5. Coefficients = feature importance

## Slide 10: LIME — Formula
- ξ(x) = argmin L(f, g, π_x) + Ω(g)
- f: black box; g: interpretable model; π_x: proximity
- L: how well g approximates f locally
- Ω: complexity penalty

## Slide 11: SHAP — Intuition
- Based on Shapley values from game theory
- Features are "players"; prediction is "payout"
- Each feature's contribution averaged over all subsets

## Slide 12: SHAP — Properties
- Efficiency: sum of SHAP values = prediction - average
- Symmetry: equal contribution = equal value
- Dummy: no contribution = zero
- Additivity: values can be summed
- Theoretically grounded and consistent

## Slide 13: LIME vs. SHAP Comparison
- LIME: fast, local, unstable
- SHAP: slower, consistent, theoretically grounded

## Slide 14: Demo: LIME for Loan Denial
- Random Forest model
- LIME explanation shows top features
- "Declined because: high debt ratio, low credit score"

## Slide 15: Demo: SHAP Summary Plot
- Global explanation
- Features ranked by importance
- Color shows feature value impact

## Slide 16: Demo: SHAP Force Plot
- Local explanation
- Base value → prediction
- Features pushing left (negative) and right (positive)

## Slide 17: Biotech Example — Protein Folding
- Deep learning predicts protein structure
- SHAP identifies influential amino acid positions
- Biological insight and model validation

## Slide 18: SaaS Example — Credit Scoring
- Regulatory requirement for explanation
- SHAP integrated into platform
- Customer: plain language explanation
- Auditor: detailed feature breakdown

## Slide 19: Common Mistakes
- Treating LIME/SHAP as ground truth
- Ignoring instability
- Over-relying on global importance
- Assuming explanations solve all trust problems

## Slide 20: Best Practices
- Prefer interpretable models when possible
- Use multiple explanation methods
- Validate with domain experts
- Design for the audience
- Document limitations

## Slide 21: Summary
- Black box models need explanation methods
- LIME: local linear approximations
- SHAP: game-theoretic feature attributions
- Post-hoc methods have limitations
- Next lesson: Privacy and Data Protection
