# Slides: Model Interpretation

## Slide 1: Title
Model Interpretation — Understanding Why

## Slide 2: Motivation
- "The model says cancer, but why?"
- Regulated industries require explanations
- Debugging: find data leaks, spurious correlations
- Discovery: learn about the domain

## Slide 3: Types of Interpretability
- **Global:** overall model behavior
- **Local:** single prediction explanation
- **Model-specific:** coefficients, tree rules
- **Model-agnostic:** any model

## Slide 4: Permutation Importance
1. Measure baseline score
2. Shuffle feature values → measure score again
3. Importance = baseline - shuffled
4. Repeat for stability

## Slide 5: Interpreting Permutation Importance
- High importance = model relies on this feature
- Low importance = feature is not useful
- Warning: correlated features share importance

## Slide 6: Partial Dependence Plots
- How does feature X affect predictions on average?
- Y-axis: average prediction
- X-axis: feature value
- Slope = marginal effect

## Slide 7: Reading PDPs
- Upward slope: positive effect
- Downward slope: negative effect
- Flat: no effect
- Non-linear: turns, plateaus

## Slide 8: SHAP Values
- Game theory: each feature is a "player"
- SHAP = fair distribution of the prediction
- Sum of SHAP values = prediction - average prediction
- Positive → pushes prediction up
- Negative → pushes prediction down

## Slide 9: LIME
- Local surrogate model
- Perturb the instance locally
- Fit simple model (linear) on perturbations
- Coefficients = local explanation

## Slide 10: Demo — Breast Cancer Importance
- Impurity vs. permutation
- Top features: worst concave points, worst radius
- Both methods agree on top features

## Slide 11: Demo — PDPs
- worst radius: S-shaped curve
- Below 15: low risk
- 15-25: increasing risk
- Above 25: high risk

## Slide 12: Biotechnology Example
- Gene expression: 100 genes
- Permutation importance correctly identifies 3 predictive genes
- Even among 97 noisy features

## Slide 13: Common Mistakes
- Confusing correlation with causation
- Using only impurity importance
- Ignoring feature correlations
- Over-interpreting small effects
- No domain validation

## Slide 14: Best Practices
- Use permutation + impurity together
- Check PDPs for important features
- Validate with domain experts
- Use local explanations for individual cases
- Document limitations

## Slide 15: Summary
- Permutation importance: reliable global method
- PDPs: visualize marginal effects
- SHAP/LIME: local explanations
- Always combine with domain knowledge
- Interpretability = trust + debugging + discovery
