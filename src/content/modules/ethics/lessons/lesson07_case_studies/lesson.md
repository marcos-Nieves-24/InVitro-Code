---
Module: 5
Lesson Number: 7
Lesson Title: Case Studies in Health and SaaS
Estimated Duration: 75 minutes
Prerequisites: L1–L6
Learning Objectives:
  - Analyze real-world bias in healthcare algorithms using ethical principles
  - Evaluate fairness in credit scoring and lending algorithms
  - Design responsible SaaS analytics with privacy and transparency
  - Apply bias detection and mitigation techniques to real datasets
  - Synthesize all Module 5 concepts in a comprehensive case analysis
Keywords: case studies, healthcare bias, credit scoring, responsible AI, algorithmic fairness, ethical deployment
Difficulty: Advanced
Programming Concepts: pandas, sklearn, data analysis
Mathematical Concepts: Fairness metrics, statistical disparities
Machine Learning Concepts: Classification, model evaluation
Datasets Used: Synthetic healthcare and credit datasets
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Case Studies in Health and SaaS

## Learning Objectives

By the end of this lesson, students will be able to:

1. **Analyze** the Obermeyer et al. (2019) study on racial bias in a healthcare algorithm
2. **Evaluate** fairness in credit scoring using multiple fairness definitions
3. **Design** a responsible SaaS analytics system incorporating privacy, fairness, and transparency
4. **Apply** bias detection techniques to synthetic healthcare and credit datasets
5. **Synthesize** all Module 5 concepts in comprehensive case analysis

## Motivation

This lesson brings together everything you have learned in Module 5. We will examine two real-world domains where AI ethics failures have caused documented harm: healthcare and financial services. These are not academic exercises. In 2019, Obermeyer et al. published a study showing that a healthcare algorithm used by hospitals serving 100+ million patients was systematically biased against Black patients. The algorithm did not use race explicitly. It used health costs as a proxy for health needs — and because Black patients had less access to healthcare (and therefore lower costs), the algorithm labeled them as healthier than equally sick white patients. The harm was not malicious. It was structural. And it was entirely preventable with the right ethical analysis.

In the SaaS domain, AI-powered credit scoring and lending platforms make automated decisions that affect millions of people's access to credit, housing, and financial opportunity. These systems must balance predictive accuracy with fairness, transparency, and regulatory compliance.

By the end of this lesson, you should be able to conduct a comprehensive ethical analysis of any ML system you encounter — identifying risks, proposing mitigations, and evaluating trade-offs between competing values.

## Big Picture

| Previous Lessons | Current Lesson | Next |
|---|---|---|
| L1–L6 (Principles, Bias, Explainability, Privacy, Social Impact, Regulation) | L7: Case Studies (synthesis and application) | End of Module 5 |

## Theory

### Case Study 1: Racial Bias in Healthcare Algorithms

#### Background

Obermeyer et al. (2019) studied a commercial algorithm used by US hospitals to identify high-risk patients who would benefit from "high-risk care management" programs. These programs provide additional resources (nurse follow-up, care coordination) to patients with complex health needs.

The algorithm predicted which patients would generate high healthcare costs. The underlying assumption: patients who will generate high costs are those with high health needs, so targeting cost is equivalent to targeting need.

#### The Finding

The algorithm systematically underestimated the health needs of Black patients. At any given risk score, Black patients were sicker than white patients. The algorithm falsely labeled Black patients as healthier than equally sick white patients.

**The mechanism:** The algorithm used health costs as a proxy for health needs. Due to systemic barriers (access to care, insurance coverage, trust in the healthcare system), Black patients with the same level of health need generate lower healthcare costs than white patients. The algorithm learned that "low cost = healthy," which was incorrect for Black patients.

#### Magnitude

The bias reduced the number of Black patients identified for extra care by more than half. If the algorithm were unbiased, the number of Black patients referred for extra care would have roughly doubled.

#### Root Causes

1. **Proxy problem:** Cost is a biased proxy for need when access to care varies by race.
2. **Label bias:** The training label (cost) does not measure what we actually care about (need).
3. **Historical/systemic bias:** The data reflects structural racism in healthcare access.
4. **Missing fairness audit:** The algorithm was deployed without testing for demographic disparities.

#### Fix

Obermeyer et al. showed that retraining the algorithm to predict "number of chronic conditions" (a more direct measure of health need) instead of cost eliminated 84% of the bias.

#### Ethical Analysis

| Principle | Application |
|-----------|-------------|
| Beneficence | Algorithm intended to improve health outcomes, but failed for Black patients |
| Non-maleficence | Caused harm by denying resources to those who needed them most |
| Justice | Distributed healthcare resources inequitably by race |
| Autonomy | Patients unaware algorithm was used to allocate care |
| Explicability | The proxy problem was not transparent to users |

### Case Study 2: Fairness in Credit Scoring

#### Background

Credit scoring algorithms predict the likelihood that a borrower will default on a loan. These scores determine access to credit, mortgages, and sometimes employment and housing. The most widely used scoring system is FICO, but many fintech companies use ML models for more granular risk assessment.

#### The Challenge

Credit scoring faces fundamental fairness challenges:

1. **Historical discrimination:** Training data from past lending reflects historical discrimination (redlining, steering). The model learns to replicate these patterns.
2. **Proxy features:** Features like zip code, education level, and even transaction history can proxy for race and socioeconomic status.
3. **Base rate differences:** Different groups have different historical default rates due to systemic economic inequality. Equalizing outcomes (demographic parity) may conflict with predictive accuracy.
4. **Regulatory requirements:** The Equal Credit Opportunity Act (ECOA) prohibits discrimination on the basis of race, color, religion, national origin, sex, marital status, age, or public assistance income.

#### Fairness Analysis

| Fairness Definition | Application to Credit Scoring |
|-------------------|-------------------------------|
| Demographic parity | Equal approval rates across groups. May conflict with base rate differences. |
| Equal opportunity | Equal TPR: qualified applicants equally likely to be approved regardless of group. |
| Equalized odds | Equal TPR and FPR: errors affect all groups equally. |
| Disparate impact | Approval rate ratio between groups should exceed 0.8 (EEOC 4/5ths rule). |

#### Responsible Credit Scoring Design

1. **Feature selection:** Avoid proxies for protected attributes.
2. **Adverse action notice:** Provide specific reasons for denial (ECOA requirement).
3. **Regular fairness monitoring:** Audit approval rates, TPR, FPR by demographic group.
4. **Alternative data caution:** Using alternative data (social media, utility payments) may introduce new bias sources.
5. **Human review:** Allow manual override for borderline cases.

### Case Study 3: Ethical SaaS Analytics

#### Background

Software-as-a-Service (SaaS) platforms collect vast amounts of user behavior data: clicks, time spent, feature usage, purchases, support interactions. AI-powered analytics extract insights to help businesses improve products, reduce churn, and increase revenue.

#### Ethical Challenges

1. **Privacy:** Users may not know their behavior is being analyzed at this granularity.
2. **Consent:** Is implicit consent (using the product) sufficient for predictive analytics?
3. **Transparency:** Should users be told that a model predicts their likelihood of churning?
4. **Manipulation:** Personalized recommendations can cross the line into manipulation.
5. **Fairness:** If a SaaS platform optimizes for high-revenue customers, smaller customers may receive worse service.
6. **Data retention:** How long should behavioral data be kept?

#### Design Principles for Responsible SaaS Analytics

1. **Privacy by design:** Aggregate data where possible; anonymize or pseudonymize.
2. **Transparency:** Publish a clear description of what data is collected and how it is used.
3. **User control:** Allow users to opt out of behavioral analytics (without losing core functionality).
4. **Fairness auditing:** Monitor whether the analytics system treats all customer segments equitably.
5. **Bias mitigation:** Check for algorithmic bias in predictive models (churn prediction, upselling).
6. **Data minimization:** Only collect data needed for the stated purpose.

## Walkthrough Example

### Analyzing Bias in a Synthetic Credit Dataset

We generate a synthetic credit dataset with demographic information and analyze fairness.

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import confusion_matrix

# Generate synthetic credit data
np.random.seed(42)
n = 10000

age = np.random.normal(45, 12, n)
income = np.where(np.random.random(n) > 0.2,
                  np.random.normal(65, 30, n),
                  np.random.normal(40, 15, n))
credit_history = np.random.normal(5, 2, n)
loan_amount = np.random.uniform(1000, 50000, n)

# Protected attribute: race (0 = majority, 1 = minority)
race = np.random.choice([0, 1], size=n, p=[0.7, 0.3])

# Target: default (slightly higher default rate for minority group)
# due to systemic factors, not inherent difference
default_prob = 0.1 + 0.3 * (credit_history < 3).astype(float) + \
               0.05 * race  # small structural difference
default = np.random.binomial(1, np.clip(default_prob, 0.05, 0.5))

# Train model (without race)
X = pd.DataFrame({'age': age, 'income': income,
                  'credit_history': credit_history,
                  'loan_amount': loan_amount})
y = default

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
model = GradientBoostingClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
```

## Biotechnology Example

### Synthetic Diagnostic Algorithm Audit

A diagnostic algorithm predicts disease risk from biomarkers. The training data is 75% from Population A and 25% from Population B. The algorithm achieves 92% accuracy on Population A but 78% on Population B.

**Bias detection:**
- Representation bias: Population B underrepresented
- Model performance gap: 14 percentage point accuracy difference
- Fairness metrics: compute TPR, FPR, PPV, NPV by population

**Mitigation:**
1. Collect more data from Population B
2. Stratified sampling during training
3. Group-specific thresholds to equalize TPR or FPR
4. Regular monitoring post-deployment

**Ethical principles:**
- Justice: unequal performance violates distributive justice
- Non-maleficence: misdiagnosis in Population B causes harm
- Explicability: must document performance disparities

## SaaS Example

### Ethical Churn Prediction

A SaaS company builds a churn prediction model to identify customers likely to cancel. The model identifies two segments:

- **Small businesses** (lower revenue): Higher predicted churn because they have fewer users and less engagement
- **Enterprise customers** (higher revenue): Lower predicted churn

The company plans to offer retention discounts only to the high-churn segment. But this disproportionately rewards small businesses (which need the discount) while enterprise customers (with more negotiating power) receive no offer.

**Ethical analysis:**
- Should retention resources be distributed based on customer value or customer need?
- Is it fair to optimize retention spend for maximum ROI if this deprioritizes smaller customers?
- What transparency obligations does the company have to customers whose data is used?

**Responsible approach:**
1. Segment-neutral retention: allocate resources proportional to churn risk, not customer value
2. Transparency: disclose data collection and model usage in the terms of service
3. Opt-out: allow customers to exclude their data from churn modeling
4. Auditing: monitor whether the model disadvantage any customer segment

## Common Mistakes

1. **Assuming a well-intentioned model causes no harm.** The Obermeyer algorithm was not malicious; it caused harm through a design flaw.
2. **Ignoring the proxy problem.** Features that correlate with the target may still be biased.
3. **Testing fairness only on overall metrics.** Need to test across all demographic subgroups.
4. **Assuming one fairness definition fits all contexts.** Credit scoring and healthcare need different fairness criteria.
5. **Forgetting that fairness is not the only ethical concern.** Privacy, transparency, and accountability also matter.

## Best Practices

1. **Always test models across demographic subgroups before deployment.**
2. **Choose fairness metrics that match the domain context.**
3. **Document feature selection decisions and their ethical rationale.**
4. **Plan for ongoing monitoring — fairness is not a one-time check.**
5. **Involve domain experts and affected communities in system design.**
6. **Build in transparency from the start.**

## Summary

- Obermeyer et al. (2019): healthcare algorithm used cost as a proxy for need, causing racial bias.
- Credit scoring requires careful feature selection, fairness monitoring, and regulatory compliance.
- Responsible SaaS analytics balances business value with user privacy and fairness.
- Bias can be detected through subgroup performance analysis and fairness metrics.
- Mitigation requires changes to data, model, or deployment strategy.
- There is no single correct solution — each case requires context-specific ethical reasoning.

## Key Terms

| Term | Definition |
|------|------------|
| Proxy problem | Using a variable that correlates with the target but is biased across groups |
| Label bias | Bias in the target variable used for training |
| High-risk care management | Healthcare program providing extra resources to high-need patients |
| Adverse action notice | Legal requirement to explain credit denial reasons |
| ECOA | Equal Credit Opportunity Act — prohibits credit discrimination |
| Churn prediction | Model predicting which customers will cancel a service |
| Privacy by design | Embedding privacy protections into system architecture from the start |

## Exercises

### Level 1: Basic Understanding

1. In the Obermeyer healthcare algorithm, what was the proxy variable? Why was it biased?
2. List three ethical principles from Lesson 1 and explain how they apply to credit scoring.

### Level 2: Implementation

3. Using the synthetic credit dataset from the walkthrough, compute the demographic parity difference and equal opportunity difference. Does the model exhibit bias?
4. Retrain the model without the problematic features. Do fairness metrics improve? At what cost to accuracy?

### Level 3: Critical Thinking

5. A SaaS company uses AI to predict customer churn and offers retention discounts to the highest-risk customers. This leads to enterprise customers receiving fewer discounts than small businesses. Is this ethical? Defend your position.
6. Design a responsible AI review process for a company that builds AI credit scoring systems. What stages should the review have? Who should be on the review board? What criteria should they use to approve or reject a model?
7. The Obermeyer algorithm could be fixed by changing the target variable from cost to number of chronic conditions. Are there cases where no target variable is unbiased? What should developers do in that case?

## Coding Challenge

Using the synthetic healthcare dataset from the notebook:
1. Train a model to predict healthcare need
2. Use cost as a proxy for need (as in the real case)
3. Measure the bias across two demographic groups
4. Retrain the model using a different target variable
5. Compare fairness metrics before and after
6. Visualize the improvement

## References

Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science*, 366(6464), 447–453. https://doi.org/10.1126/science.aax2342

Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016). Machine bias. *ProPublica*. https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing

Benjamin, R. (2019). *Race after technology: Abolitionist tools for the new Jim Code*. Polity Press.

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.

Noble, S. U. (2018). *Algorithms of oppression: How search engines reinforce racism*. New York University Press.
