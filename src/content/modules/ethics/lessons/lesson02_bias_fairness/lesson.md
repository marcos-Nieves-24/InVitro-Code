---
Module: 5
Lesson Number: 2
Lesson Title: Bias and Fairness
Estimated Duration: 75 minutes
Prerequisites: L1 (Introduction to AI Ethics)
Learning Objectives:
  - Differentiate between data bias, algorithmic bias, and societal bias
  - Implement fairness metrics using Python and sklearn
  - Detect bias in a dataset using statistical analysis
  - Analyze the COMPAS recidivism case and facial recognition bias case
  - Apply bias mitigation strategies to a real dataset
Keywords: bias, fairness, disparate impact, equal opportunity, demographic parity, COMPAS, fairness metrics
Difficulty: Intermediate
Programming Concepts: pandas, numpy, python functions
Mathematical Concepts: Conditional probability, confusion matrix, statistical disparity
Machine Learning Concepts: Classification, model evaluation, threshold selection
Datasets Used: Synthetic loan dataset, COMPAS (ProPublica) sample
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Bias and Fairness

## Learning Objectives

By the end of this lesson, students will be able to:

1. **Differentiate** three types of bias: data, algorithmic, and societal
2. **Define** formal fairness criteria: demographic parity, equal opportunity, equalized odds
3. **Implement** fairness metrics in Python using sklearn
4. **Analyze** the COMPAS recidivism case and identify sources of bias
5. **Apply** at least one pre-processing bias mitigation strategy

## Motivation

In 2016, ProPublica published an investigation of COMPAS, a commercial algorithm used by US courts to predict recidivism risk. The algorithm assigned risk scores to defendants. ProPublica found that:

- Black defendants were almost twice as likely as white defendants to be labeled high risk but not actually re-offend (false positive rate: 45% vs. 23%)
- White defendants were more likely to be labeled low risk but later re-offend (false negative rate: 48% vs. 28%)

The algorithm was systematically biased. It was used to influence bail, sentencing, and parole decisions affecting millions of people.

The company that built COMPAS, Northpointe (now Equivant), defended the algorithm. They argued that it was fair because the *probability of recidivism* for any given score was the same across groups. Both sides had a mathematical argument. Who was right?

The answer depends on which definition of fairness you use. And that is the central challenge of algorithmic fairness: **fairness is not a single mathematical concept.** It is a contested social value translated into competing mathematical definitions.

Understanding these definitions — and their limitations — is essential for anyone building or deploying ML systems that affect people's lives.

## Big Picture

| Previous Lesson | Current Lesson | Next Lesson |
|---|---|---|
| L1: Intro to Ethics (principles) | L2: Bias and Fairness (types, metrics, case studies) | L3: Transparency and Explainability (XAI, SHAP, LIME) |

## Theory

### The Three Types of Bias

#### 1. Data Bias

Data bias exists when the training data does not accurately represent the population the model will be applied to.

Common sources:

- **Historical bias:** The data reflects existing societal prejudices. Example: historical hiring data shows fewer women hired for tech roles because of past discrimination.
- **Representation bias:** Certain groups are underrepresented in the data. Example: medical datasets that primarily contain data from white men.
- **Measurement bias:** The features or labels are measured differently across groups. Example: using self-reported health status when different groups have different access to healthcare.
- **Label bias:** The target variable itself is biased. Example: using arrest records as labels for "criminality" when policing is biased.

#### 2. Algorithmic Bias

Algorithmic bias arises from the design choices in the model or the optimization process.

Common sources:

- **Feature choice:** Including protected attributes (race, gender) or proxies (zip code, name).
- **Objective function:** Optimizing for overall accuracy can sacrifice performance on minority groups.
- **Model architecture:** Some models may amplify certain patterns in the data.
- **Evaluation:** Using inappropriate metrics that hide group-level disparities.

#### 3. Societal Bias

Societal bias is bias that exists in the broader society and is reflected or amplified by AI systems.

- **Feedback loops:** A biased model makes decisions that reinforce the bias in future data.
- **Amplification:** An AI system trained on biased data does not just replicate the bias — it can amplify it.
- **Legitimization:** People trust algorithmic decisions as objective, giving biased systems an aura of authority.

### Fairness Definitions

There are many competing definitions of fairness. The three most commonly used are:

#### Demographic Parity (Statistical Parity)

A prediction is fair if the outcome is independent of the protected attribute:

$$P(\hat{Y} = 1 | A = 0) = P(\hat{Y} = 1 | A = 1)$$

where $\hat{Y}$ is the predicted outcome and $A$ is the protected attribute.

**Intuition:** Each group should receive positive outcomes at the same rate.

**Limitation:** If base rates differ between groups (e.g., different recidivism rates), demographic parity may require sacrificing accuracy.

#### Equal Opportunity

A prediction satisfies equal opportunity if the true positive rate is equal across groups:

$$P(\hat{Y} = 1 | Y = 1, A = 0) = P(\hat{Y} = 1 | Y = 1, A = 1)$$

**Intuution:** Each group should have the same chance of being correctly identified as positive.

**Limitation:** Does not address false positive disparities.

#### Equalized Odds

A prediction satisfies equalized odds if both the true positive rate and false positive rate are equal across groups:

$$P(\hat{Y} = 1 | Y = y, A = 0) = P(\hat{Y} = 1 | Y = y, A = 1) \quad \text{for } y \in \{0, 1\}$$

**Intuition:** The model's errors affect all groups equally.

**Limitation:** Harder to achieve in practice. May conflict with other fairness definitions.

#### The Impossibility Theorem

Chouldechova (2017) and Kleinberg et al. (2016) showed that it is impossible to simultaneously satisfy all three fairness criteria unless either the base rates are equal across groups or the classifier is perfect. This means **fairness requires trade-offs.**

### Bias Detection Workflow

1. **Dataset audit:** Examine demographic composition, missing data patterns, label distribution across groups.
2. **Model audit:** Train model, compute fairness metrics, compare performance across groups.
3. **Error analysis:** Analyze false positive and false negative rates by group.
4. **Mitigation:** Apply pre-processing, in-processing, or post-processing interventions.

## Mathematical Foundation

### Fairness Metrics

Given:
- $A$: protected attribute (e.g., race, gender)
- $Y$: true label (1 = positive, 0 = negative)
- $\hat{Y}$: predicted label

| Metric | Formula | What It Measures |
|--------|---------|-----------------|
| Demographic parity difference | $P(\hat{Y}=1\|A=0) - P(\hat{Y}=1\|A=1)$ | Rate of positive predictions |
| Equal opportunity difference | $TPR_{A=0} - TPR_{A=1}$ | True positive rate gap |
| Equalized odds difference | $\max(\|TPR_0 - TPR_1\|, \|FPR_0 - FPR_1\|)$ | Maximum of TPR and FPR gaps |
| Disparate impact | $\frac{P(\hat{Y}=1\|A=1)}{P(\hat{Y}=1\|A=0)}$ | Ratio of positive prediction rates |

## Walkthrough Example

### Bias Detection in a Synthetic Loan Dataset

We will generate a synthetic dataset representing loan applications with a protected attribute (race) and analyze bias.

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report

np.random.seed(42)
n = 2000

race = np.random.choice(['white', 'non_white'], size=n, p=[0.7, 0.3])
income = np.where(race == 'white',
                  np.random.normal(70, 20, n),
                  np.random.normal(50, 15, n))
credit_score = np.where(race == 'white',
                        np.random.normal(700, 50, n),
                        np.random.normal(650, 60, n))
repayment = np.where(race == 'white',
                     np.random.binomial(1, 0.85, n),
                     np.random.binomial(1, 0.75, n))

df = pd.DataFrame({
    'race': race,
    'income': income,
    'credit_score': credit_score,
    'loan_amount': np.random.uniform(1000, 50000, n),
    'repayment': repayment
})

X = pd.get_dummies(df[['income', 'credit_score', 'loan_amount']], drop_first=True)
y = df['repayment']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Analyze by race
test_df = df.iloc[X_test.index].copy()
test_df['predicted'] = y_pred

for group in ['white', 'non_white']:
    subset = test_df[test_df['race'] == group]
    tn, fp, fn, tp = confusion_matrix(subset['repayment'], subset['predicted']).ravel()
    tpr = tp / (tp + fn)
    fpr = fp / (fp + tn)
    approval_rate = subset['predicted'].mean()
    print(f"{group}: TPR={tpr:.3f}, FPR={fpr:.3f}, Approval Rate={approval_rate:.3f}")
```

**Interpretation:** The non-white group likely has higher FPR and lower approval rate, indicating bias.

## Biotechnology Example

### Bias in a Diagnostic Model

A diagnostic model for skin cancer is trained on a dataset where 90% of images are of light skin. When evaluated on dark skin images, accuracy drops from 95% to 70%.

**Bias types involved:**
- Representation bias (dark skin underrepresented)
- Measurement bias (image capture conditions may differ)
- Historical bias (medical research has historically focused on light skin)

**Fairness analysis:**
- Demographic parity: For a "requires biopsy" positive class, rate should be consistent
- Equal opportunity: Sensitivity should be equal across skin types
- Equalized odds: Both sensitivity and specificity should be equal across skin types

## SaaS Example

### Algorithmic Hiring

A SaaS recruiting platform offers an AI screening tool. The model is trained on successful hires from the past 5 years at client companies. The model learns to penalize candidates with gaps in their resume, which disproportionately affects women who took parental leave.

**Fairness mitigation:**
1. Remove or transform features that are proxies for protected attributes
2. Require equal opportunity: the top-k candidates should have equal TPR across gender
3. Regular auditing of deployed model performance by demographic group
4. Transparency reports for clients on model demographics

## Common Mistakes

1. **Assuming fairness through unawareness.** Simply removing the protected attribute from the model does not eliminate bias because other features (zip code, education) can act as proxies.
2. **Ignoring intersectionality.** Bias may be concentrated at the intersection of multiple attributes (e.g., women of color) rather than single dimensions.
3. **Optimizing for one fairness metric while ignoring others.** There is no single universally correct fairness definition.
4. **Confusing group fairness with individual fairness.** Two individuals who are similar should receive similar predictions (individual fairness), which differs from group-level parity.
5. **Assuming fairness is a one-time fix.** Bias can emerge or change over time as data distributions shift.

## Best Practices

1. **Audit your data before training.** Examine demographic composition, label balance, and feature distributions across groups.
2. **Test multiple fairness metrics.** No single metric captures everything.
3. **Document fairness decisions.** Explain which definition(s) you chose and why.
4. **Involve domain experts.** Understanding why bias exists requires domain knowledge.
5. **Plan for ongoing monitoring.** Fairness is not a one-time check.

## Summary

- Three types of bias: data, algorithmic, societal
- Key fairness definitions: demographic parity, equal opportunity, equalized odds
- Fairness metrics are competing and sometimes incompatible (impossibility theorem)
- Bias detection requires auditing data, model, and errors by group
- Mitigation strategies exist at each stage of the ML pipeline
- Removing protected attributes is insufficient (proxy problem)

## Key Terms

| Term | Definition |
|------|------------|
| Data bias | Bias originating from the training data (representation, measurement, historical) |
| Algorithmic bias | Bias introduced by model design choices (features, objective, evaluation) |
| Societal bias | Bias that exists in society and is reflected/amplified by AI |
| Demographic parity | Equal rate of positive predictions across groups |
| Equal opportunity | Equal true positive rate across groups |
| Equalized odds | Equal TPR and FPR across groups |
| Disparate impact | When a policy or practice disproportionately affects a protected group |
| Impossibility theorem | Proof that multiple fairness definitions cannot simultaneously be satisfied |
| Proxy | A non-protected feature that correlates with a protected attribute |
| Intersectionality | The compounding effect of multiple protected attributes |

## Exercises

### Level 1: Basic Understanding

1. Define the three types of bias in AI. Give a concrete example of each.
2. What is the difference between demographic parity and equal opportunity? Which one would you use for a credit approval model? Why?

### Level 2: Implementation

3. Using the synthetic loan dataset from the walkthrough, compute the disparate impact ratio for the model's predictions. Disparate impact is defined as the ratio of positive prediction rates between the protected group and the reference group.
4. Train a Random Forest classifier on the same data and compare the fairness metrics. Does the model class affect fairness?

### Level 3: Critical Thinking

5. Imagine you are building a model to predict which patients need follow-up care. The base rate of the condition is 2x higher in one demographic group. Discuss whether demographic parity is an appropriate fairness criterion for this scenario. What would you recommend instead?
6. Read ProPublica's COMPAS analysis and Northpointe's response. Both used rigorous statistics but reached opposite conclusions. Explain how they could both be "correct" by using different fairness definitions.

## Coding Challenge

Generate a synthetic dataset with two demographic groups where one group has a higher base rate of the positive class. Train a classifier. Compute demographic parity, equal opportunity, and equalized odds. Implement a simple reweighing pre-processing technique (assign higher sample weights to underrepresented groups) and compare the fairness metrics before and after.

## References

Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). Machine bias. *ProPublica*. https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing

Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. *Proceedings of the 1st Conference on Fairness, Accountability and Transparency*, 81, 77–91.

Chouldechova, A. (2017). Fair prediction with disparate impact: A study of bias in recidivism prediction instruments. *Big Data*, 5(2), 153–163. https://doi.org/10.1089/big.2016.0047

Dwork, C., Hardt, M., Pitassi, T., Reingold, O., & Zemel, R. (2012). Fairness through awareness. *Proceedings of the 3rd Innovations in Theoretical Computer Science Conference*, 214–226. https://doi.org/10.1145/2090236.2090255

Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *Advances in Neural Information Processing Systems*, 29, 3315–3323.

Mehrabi, N., Morstatter, F., Saxena, N., Lerman, K., & Galstyan, A. (2021). A survey on bias and fairness in machine learning. *ACM Computing Surveys*, 54(6), 1–35. https://doi.org/10.1145/3457607

Noble, S. U. (2018). *Algorithms of oppression: How search engines reinforce racism*. New York University Press.
