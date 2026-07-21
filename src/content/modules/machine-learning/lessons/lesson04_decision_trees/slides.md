# Slides: Decision Trees

## Slide 1: Title
Decision Trees — Interpretable Non-Linear Models

## Slide 2: Motivation
- Doctors diagnose via sequential questions
- Interpretable by non-experts
- No feature scaling needed
- Capture non-linear patterns automatically

## Slide 3: Tree Structure
- **Root:** first split
- **Internal nodes:** decisions
- **Leaves:** predictions
- **Branches:** outcomes

## Slide 4: How a Tree Predicts
- Start at root
- Compare feature value to threshold
- Follow branch
- Repeat until leaf → read prediction

## Slide 5: Gini Impurity
- Gini = 1 - Σpᵢ²
- Gini = 0 → pure node
- Max Gini: 0.5 (binary), ~0.67 (3-class)

## Slide 6: Entropy
- Entropy = -Σpᵢlog₂(pᵢ)
- Higher → more disorder
- Similar to Gini in practice

## Slide 7: Information Gain
- IG = Impurity_parent - weighted Impurity_children
- Algorithm: try all features and thresholds
- Pick split with highest IG

## Slide 8: Overfitting in Trees
- Deeper trees → more overfitting
- Leaf with 1 sample → memorized noise
- Training: 100% is suspicious

## Slide 9: Pruning
**Pre-pruning:** stop early
- max_depth, min_samples_split
- min_samples_leaf

**Post-pruning:** grow fully, then cut

## Slide 10: Feature Importance
- Built-in from decision tree
- Sum of impurity reduction at each feature
- Normalized to sum to 1

## Slide 11: Demo — Iris Tree
- Petal length is the root split
- Depth 2 is enough for 3 species
- Visualize with plot_tree

## Slide 12: Demo — Overfitting Experiment
- Depth vs. train/test accuracy
- Shows overfitting point

## Slide 13: Biotechnology Example
- Patient stratification by biomarkers
- Gene mutation count is top predictor
- Tree reveals subpopulations

## Slide 14: SaaS Example
- Lead scoring
- Demo request is strongest signal
- Actionable rules for sales team

## Slide 15: Common Mistakes
- No depth limit
- Ignoring min_samples_leaf
- Unstable predictions
- Over-relying on a single tree

## Slide 16: Summary
- Recursive partitioning
- Gini/entropy → information gain
- Overfitting is the main danger
- Always prune
- Visualize for communication
