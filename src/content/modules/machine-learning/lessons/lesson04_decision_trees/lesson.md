---
Module: 4
Lesson Number: 4
Lesson Title: Decision Trees
Estimated Duration: 75 minutes
Prerequisites: L1 (ML Fundamentals)
Learning Objectives:
  - Explain how decision trees make predictions by recursive partitioning
  - Describe Gini impurity and entropy as splitting criteria
  - Train and visualize decision trees with scikit-learn
  - Diagnose overfitting in decision trees and apply pruning
  - Compare decision trees with linear models
Keywords: decision tree, Gini impurity, entropy, information gain, pruning, overfitting
Difficulty: Intermediate
Programming Concepts: sklearn.tree.DecisionTreeClassifier, sklearn.tree.plot_tree
Mathematical Concepts: Gini impurity, entropy, information gain
Machine Learning Concepts: recursive partitioning, tree depth, pruning
Datasets Used: iris, breast cancer, make_classification
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Decision Trees

## Motivation

A doctor diagnoses patients by asking a series of questions: "Is the tumor larger than 2 cm?" → "Are lymph nodes involved?" → "Is the patient over 50?" This is exactly how decision trees work. They are intuitive — you can explain them to a non-technical stakeholder — and they handle non-linear relationships naturally. In biotech, they are used for patient stratification. In SaaS, for lead scoring.

## Big Picture

**Previous:** Logistic Regression gave us linear decision boundaries. **This lesson:** Decision Trees capture non-linear patterns without feature engineering. **Next:** Random Forests combine many trees for even better performance.

## Theory

### Tree Structure

A decision tree consists of:
- **Root node:** first split on the most informative feature
- **Internal nodes:** decisions based on feature values
- **Leaf nodes:** predictions (class label or value)
- **Branches:** outcomes of decisions

### How Predictions Flow

A sample starts at the root and traverses down based on feature comparisons until it reaches a leaf. The leaf's majority class (classification) or mean value (regression) is the prediction.

### Splitting Criteria

**Gini Impurity:** Measures how often a randomly chosen element would be incorrectly classified.

$$\text{Gini}(t) = 1 - \sum_{i=1}^{c} p_i^2$$

Where $p_i$ is the proportion of class $i$ in node $t$.

- Gini = 0: node is pure (all same class)
- Maximum Gini: $1 - 1/c$

**Entropy:**

$$\text{Entropy}(t) = -\sum_{i=1}^{c} p_i \log_2(p_i)$$

- Entropy = 0: pure node
- Higher entropy → more disorder

**Information Gain:** Reduction in impurity after a split.

$$\text{IG} = \text{Impurity}_{\text{parent}} - \sum_{j} \frac{n_j}{n} \text{Impurity}_{\text{child}_j}$$

The algorithm selects the split that maximizes information gain.

### Pruning

Decision trees tend to overfit — they can grow until every leaf is pure. **Pruning** removes unnecessary branches:

- **Pre-pruning:** Stop growing when no significant information gain (max_depth, min_samples_split)
- **Post-pruning:** Grow full tree, then remove branches

## Mathematical Foundation

### Finding the Best Split

For a numerical feature, the algorithm:
1. Sorts all values
2. Considers midpoints between consecutive values as candidate thresholds
3. Computes weighted impurity for each split
4. Selects the threshold with highest information gain

### Tree Depth and Overfitting

A tree with depth 1 (stump) is high-bias. A tree with depth 20 is extremely high-variance. The optimal depth is found via cross-validation.

## Visual Explanation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.datasets import load_iris

iris = load_iris()
X, y = iris.data[:, [0, 2]], iris.target  # sepal length, petal length

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X, y)

plt.figure(figsize=(16, 8))
plot_tree(tree, feature_names=['sepal_length', 'petal_length'],
          class_names=iris.target_names, filled=True, rounded=True)
plt.savefig('figures/decision_tree_iris.png', dpi=150)
plt.show()
```

## Python Implementation

```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
from sklearn.datasets import load_breast_cancer
import matplotlib.pyplot as plt

data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Compare depths
for depth in [1, 3, 5, 10, None]:
    tree = DecisionTreeClassifier(max_depth=depth, random_state=42)
    tree.fit(X_train, y_train)
    train_acc = accuracy_score(y_train, tree.predict(X_train))
    test_acc = accuracy_score(y_test, tree.predict(X_test))
    print(f"Depth {depth}: Train = {train_acc:.3f}, Test = {test_acc:.3f}")

# Best tree with pruning
best_tree = DecisionTreeClassifier(max_depth=4, min_samples_split=10, random_state=42)
best_tree.fit(X_train, y_train)

plt.figure(figsize=(18, 8))
plot_tree(best_tree, feature_names=data.feature_names,
          class_names=data.target_names, filled=True, rounded=True,
          max_depth=3)
plt.show()

print(classification_report(y_test, best_tree.predict(X_test)))
```

## Walkthrough Example: Iris Classification

**Problem:** Classify iris flowers into 3 species.

**Dataset:** 150 samples, 4 features (sepal length/width, petal length/width).

**Tree structure:**
- Root: petal length ≤ 2.45 → Setosa (pure leaf)
- Right branch: petal length > 2.45 → further splits on petal width
- Depth 2: petal width ≤ 1.75 → Versicolor vs. Virginica

**Interpretation:** The tree automatically identified petal measurements as most discriminative.

## Biotechnology Example: Patient Stratification

A hospital wants to identify high-risk patients for a clinical trial based on biomarkers.

```python
np.random.seed(42)
n = 300

bio_data = pd.DataFrame({
    'biomarker_1': np.random.normal(0, 1, n),
    'biomarker_2': np.random.normal(0, 1, n),
    'age': np.random.randint(20, 80, n),
    'gene_mutation_count': np.random.poisson(3, n),
})

risk = (
    0.3 * bio_data['biomarker_1']
    - 0.2 * bio_data['biomarker_2']
    + 0.01 * bio_data['age']
    + 0.1 * bio_data['gene_mutation_count']
    + np.random.normal(0, 0.3, n)
)
bio_data['high_risk'] = (risk > risk.median()).astype(int)

X_bio = bio_data.drop('high_risk', axis=1)
y_bio = bio_data['high_risk']

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_bio, y_bio)

print(f"Feature importances: {dict(zip(X_bio.columns, tree.feature_importances_))}")
```

**Interpretation:** The tree reveals that gene_mutation_count is the most important risk factor.

## SaaS Example: Lead Scoring

```python
np.random.seed(42)
n = 500

lead_data = pd.DataFrame({
    'pages_visited': np.random.poisson(5, n),
    'time_on_site_min': np.random.exponential(10, n),
    'email_opens': np.random.poisson(2, n),
    'demo_requested': np.random.binomial(1, 0.2, n),
})

conversion_prob = (
    0.05 * lead_data['pages_visited']
    + 0.02 * lead_data['time_on_site_min']
    + 0.1 * lead_data['email_opens']
    + 0.3 * lead_data['demo_requested']
    + np.random.normal(0, 0.1, n)
)
lead_data['converted'] = (conversion_prob > 0.5).astype(int)

X_lead = lead_data.drop('converted', axis=1)
y_lead = lead_data['converted']

tree = DecisionTreeClassifier(max_depth=4, min_samples_leaf=10, random_state=42)
tree.fit(X_lead, y_lead)

print(f"Importance: {dict(zip(X_lead.columns, tree.feature_importances_))}")
```

**Interpretation:** Demo requests are the strongest signal of conversion intent.

## Common Mistakes

1. **No depth limit** — trees grow until pure, causing severe overfitting.
2. **Ignoring feature importance** — trees provide built-in importance scores.
3. **Unbalanced trees** — one branch much deeper than others.
4. **Not checking for instability** — small data changes can produce very different trees.

## Best Practices

- Always limit tree depth (max_depth, min_samples_leaf)
- Use cross-validation to find optimal depth
- Compare tree with baseline model
- Visualize the tree for communication
- Use feature importance to identify key drivers

## Summary

- Decision trees split data recursively based on feature values
- Gini impurity and entropy measure node purity
- Information gain guides split selection
- Deeper trees overfit; pruning prevents this
- Trees are interpretable but unstable
- Feature importance is a key output

## Key Terms

| Term | Definition |
|------|-----------|
| Gini impurity | Probability of incorrect classification in a node |
| Entropy | Measure of disorder in a node |
| Information gain | Reduction in impurity after split |
| Root node | First split in the tree |
| Leaf node | Terminal node with prediction |
| Pruning | Reducing tree depth to prevent overfitting |
| Decision boundary | Axis-aligned splits in feature space |

## Exercises

**Level 1 — Basic:** What is the difference between Gini impurity and entropy? When would they give different splits?

**Level 2 — Implementation:** Train decision trees with max_depth = 2, 4, 6, 8, 10 on the breast cancer dataset. Plot the resulting train and test accuracies. What is the optimal depth?

**Level 3 — Critical Thinking:** A decision tree with max_depth = None achieves 100% accuracy on training data but 60% on test data. What three strategies would you use to improve test performance?

## Coding Challenge

Write a function `tree_depth_tuner(X_train, X_val, y_train, y_val, max_depths)` that trains decision trees for each depth in max_depths, evaluates validation accuracy, and returns the optimal depth and the trained tree.
