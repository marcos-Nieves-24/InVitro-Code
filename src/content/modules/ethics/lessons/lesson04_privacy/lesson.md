---
Module: 5
Lesson Number: 4
Lesson Title: Privacy and Data Protection
Estimated Duration: 60 minutes
Prerequisites: L1 (Introduction to AI Ethics)
Learning Objectives:
  - Explain data privacy principles in the context of ML
  - Describe key provisions of GDPR and HIPAA relevant to AI
  - Compare anonymization, pseudonymization, and differential privacy
  - Implement a simple differential privacy mechanism
  - Evaluate privacy risks in ML systems (membership inference, model inversion)
Keywords: privacy, GDPR, HIPAA, differential privacy, anonymization, consent, data protection
Difficulty: Intermediate
Programming Concepts: numpy, random noise addition
Mathematical Concepts: Laplace mechanism, epsilon parameter
Machine Learning Concepts: Training data, model parameters
Datasets Used: Synthetic
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Privacy and Data Protection

## Learning Objectives

By the end of this lesson, students will be able to:

1. **Explain** the core principles of data privacy as they apply to ML systems
2. **Describe** key GDPR and HIPAA requirements that affect AI development
3. **Compare** anonymization, pseudonymization, and differential privacy
4. **Implement** the Laplace mechanism for differential privacy
5. **Evaluate** privacy risks including membership inference and model inversion

## Motivation

In 2018, a study demonstrated that it was possible to extract individual training examples from a generative language model trained on private text data (Carlini et al., 2018). The model had been trained on confidential emails. By querying the model, researchers could reconstruct verbatim passages from the training data.

The model was not supposed to "remember" individual records. It was supposed to learn general patterns. But deep neural networks can memorize training data — including personally identifiable information, medical records, and private communications.

This is not a theoretical risk. Hospitals train diagnostic models on patient data. SaaS companies train recommendation models on user behavior. Financial institutions train fraud detection on transaction history. In all cases, the training data contains sensitive information that must be protected.

Privacy is not just about keeping data secure during collection. It is about ensuring that the ML models trained on that data do not leak private information, even after deployment.

## Big Picture

| Previous Lesson | Current Lesson | Next Lesson |
|---|---|---|
| L3: Transparency (explaining models) | L4: Privacy and Data Protection (protecting data) | L5: Social Impact of AI (broader societal effects) |

## Theory

### Data Privacy Principles

The core principles of data privacy, as reflected in regulations worldwide:

1. **Lawfulness, fairness, and transparency:** Data must be collected and processed lawfully, fairly, and transparently.
2. **Purpose limitation:** Data should only be collected for specified, explicit, and legitimate purposes.
3. **Data minimization:** Only collect data that is necessary for the purpose.
4. **Accuracy:** Data should be accurate and kept up to date.
5. **Storage limitation:** Data should not be kept longer than necessary.
6. **Integrity and confidentiality:** Data should be processed securely.
7. **Accountability:** The data controller is responsible for compliance.

These principles have direct implications for ML:

- **Purpose limitation:** A model trained for diagnostic purposes should not be repurposed for insurance risk assessment without new consent.
- **Data minimization:** Collecting every possible feature "just in case" violates data minimization.
- **Storage limitation:** Training data should be deleted when no longer needed.

### GDPR (General Data Protection Regulation)

The GDPR, effective 2018 in the EU, is the most influential data protection regulation globally. Key provisions for AI:

| Article | Requirement | ML Implication |
|---------|-------------|----------------|
| Art. 5 | Lawfulness, fairness, transparency | Document data processing for ML |
| Art. 6 | Legal basis for processing | Obtain consent or legitimate interest basis |
| Art. 9 | Special categories (health, race, etc.) | Prohibited unless explicit consent or substantial public interest |
| Art. 15 | Right of access | Individuals can request their data |
| Art. 17 | Right to erasure ("right to be forgotten") | May require model retraining without a person's data |
| Art. 22 | Automated individual decision-making | Right not to be subject to solely automated decisions with legal effects |

### HIPAA (Health Insurance Portability and Accountability Act)

HIPAA governs protected health information (PHI) in the US. Key implications for ML:

- **De-identification:** PHI must be de-identified before use in research or ML.
- **Safe harbor method:** Remove 18 specific identifiers (names, SSN, dates, etc.).
- **Expert determination:** An expert certifies that re-identification risk is very small.
- **Business associate agreements:** Cloud ML platforms must sign BAAs.

### Anonymization vs. Pseudonymization

| Technique | Definition | Re-identification Risk |
|-----------|------------|----------------------|
| **Anonymization** | Irreversibly removing identifying information | Low (if done correctly) |
| **Pseudonymization** | Replacing identifiers with pseudonyms | Higher (can be reversed with additional data) |
| **Aggregation** | Reporting group statistics instead of individual data | Low (but can leak information with small groups) |

**Critical point:** True anonymization is extremely difficult with high-dimensional data. A dataset with 15 demographic attributes can uniquely identify 99.96% of US residents (Sweeney, 2000). Simply removing names and SSNs is insufficient.

### Differential Privacy

Differential privacy provides a mathematical guarantee that the output of a computation does not reveal whether any individual's data was included in the dataset.

**Intuition:** If a model's predictions change very little when we add or remove any single person's data, then we cannot infer much about that person from the model.

**Formal definition:**

A randomized mechanism $\mathcal{M}$ satisfies $\epsilon$-differential privacy if for any two datasets $D$ and $D'$ that differ by one record, and for any set of outcomes $S$:

$$P(\mathcal{M}(D) \in S) \leq e^\epsilon \cdot P(\mathcal{M}(D') \in S)$$

where $\epsilon$ (epsilon) is the privacy budget. Smaller $\epsilon$ means stronger privacy.

#### The Laplace Mechanism

The simplest mechanism for achieving differential privacy: add noise drawn from a Laplace distribution to the output.

$$\mathcal{M}(x) = f(x) + \text{Lap}\left(\frac{\Delta f}{\epsilon}\right)$$

where $\Delta f$ is the sensitivity of function $f$ (the maximum change in $f$ when one record is modified).

#### Privacy Budget

- $\epsilon = 0.01$: Very strong privacy (high noise)
- $\epsilon = 1$: Moderate privacy
- $\epsilon = 10$: Weak privacy (low noise)
- Multiple queries consume the budget cumulatively

### Privacy Attacks on ML Models

| Attack | Goal | Method |
|--------|------|--------|
| **Membership inference** | Determine if a specific record was in training data | Compare model confidence on known vs. held-out data |
| **Model inversion** | Reconstruct training data features from the model | Optimize input to maximize class confidence |
| **Attribute inference** | Infer sensitive attributes from model predictions | Use model outputs to predict unknown attributes |

## Walkthrough Example

### Implementing Differential Privacy with the Laplace Mechanism

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Real data: ages of 1000 patients
real_ages = np.random.normal(50, 15, 1000)
real_mean = np.mean(real_ages)
print(f"True mean age: {real_mean:.2f}")

# Differential privacy via Laplace mechanism
def laplace_mechanism(true_value, sensitivity, epsilon):
    noise = np.random.laplace(0, sensitivity / epsilon)
    return true_value + noise

epsilon_values = [0.01, 0.1, 1, 10]
for eps in epsilon_values:
    private_mean = laplace_mechanism(real_mean, sensitivity=1, epsilon=eps)
    print(f"epsilon={eps:.2f}: private mean = {private_mean:.2f} (error={abs(private_mean-real_mean):.2f})")
```

## Biotechnology Example

### Privacy in Genomic Data

Genomic data is the ultimate personal identifier — it cannot be changed, and it identifies not just the individual but their relatives. Sharing genomic data for ML research requires extreme privacy protection.

**Differential privacy for GWAS:** Genome-wide association studies (GWAS) can leak information about individual participants. Applying differential privacy to summary statistics (e.g., allele frequencies) prevents attackers from determining whether a specific person was in the study.

**Challenge:** Differential privacy adds noise. For genomic signals, the noise can obscure real biological associations. Researchers must carefully balance privacy and utility.

## SaaS Example

### Privacy-Preserving Analytics

A SaaS analytics platform collects user behavior data to provide product insights. To protect user privacy while maintaining utility:

1. **Aggregation:** Report metrics at cohort level, not individual.
2. **k-anonymity:** Ensure each reported group has at least k users.
3. **Differential privacy:** Add calibrated noise to dashboard metrics.
4. **Data retention:** Automatically delete raw events after 90 days.

GDPR requires that EU user data be processed lawfully. The platform must provide:
- Clear privacy notice
- Opt-out mechanism
- Data export and deletion capabilities
- Data Processing Agreement (DPA) with customers

## Common Mistakes

1. **Anonymization is not just removing names.** High-dimensional data can be re-identified with auxiliary information.
2. **Differential privacy is not a silver bullet.** It does not prevent all privacy attacks; it bounds the information leakage.
3. **Consent is not a one-time event.** GDPR requires granular, withdrawable consent for each processing purpose.
4. **Privacy is not security.** Encryption protects data during transit/storage but does not prevent the model from leaking information.
5. **Ignoring privacy during model deployment.** Privacy risks exist after deployment (membership inference attacks on APIs).

## Best Practices

1. **Minimize data collection.** Only collect features you need.
2. **Use differential privacy** for releasing model parameters or summary statistics.
3. **Implement access controls** and audit logging for training data.
4. **Conduct privacy impact assessments** before training models on sensitive data.
5. **Plan for data deletion.** If a user requests erasure, can you retrain without their data?

## Summary

- Data privacy is governed by principles of lawfulness, minimization, and accountability.
- GDPR provides a comprehensive framework with specific implications for ML.
- HIPAA governs health data; de-identification is required before ML use.
- Anonymization is difficult; differential privacy provides formal guarantees.
- Privacy attacks (membership inference, model inversion) target trained models.
- Privacy must be considered throughout the ML lifecycle.

## Key Terms

| Term | Definition |
|------|------------|
| GDPR | General Data Protection Regulation (EU) — comprehensive data protection law |
| HIPAA | Health Insurance Portability and Accountability Act (US) — health data protection |
| Anonymization | Irreversible removal of identifying information from data |
| Pseudonymization | Replacement of identifiers with pseudonyms |
| Differential privacy | Mathematical framework guaranteeing that algorithm outputs do not reveal individual data |
| Epsilon (privacy budget) | Parameter controlling the strength of differential privacy |
| Laplace mechanism | Method for achieving differential privacy by adding Laplace noise |
| Membership inference | Attack to determine if a specific record was in the training data |
| Model inversion | Attack to reconstruct training data from model parameters |
| k-anonymity | Property that each record is indistinguishable from at least k-1 others |

## Exercises

### Level 1: Basic Understanding

1. List the seven data privacy principles. Which three are most relevant to ML? Why?
2. What is the difference between anonymization and pseudonymization? Give an example of each.

### Level 2: Implementation

3. Implement the Laplace mechanism for releasing the median of a dataset. Compare the noise needed for the median vs. the mean (median has lower sensitivity).
4. Simulate a membership inference attack: train two models (one with and one without a specific record), compute the model's confidence on that record, and show the difference.

### Level 3: Critical Thinking

5. A hospital wants to share patient data for ML research. They remove names, SSNs, and dates. Is this sufficient? What other re-identification risks exist?
6. The "right to erasure" (GDPR Art. 17) conflicts with ML models that have already learned from a person's data. Is it sufficient to delete the raw data? If not, what should happen to the model? Discuss the practical challenges.

## Coding Challenge

Implement a differentially private mean release function. Write a script that:
1. Generates a synthetic dataset of salaries
2. Computes the true mean
3. Applies the Laplace mechanism with epsilon = [0.1, 0.5, 1, 5]
4. Runs 1000 trials for each epsilon
5. Plots the distribution of private means vs. the true mean
6. Reports the mean absolute error for each epsilon
7. Also plots the privacy-utility trade-off curve

## References

Dwork, C., & Roth, A. (2014). The algorithmic foundations of differential privacy. *Foundations and Trends in Theoretical Computer Science*, 9(3–4), 211–407. https://doi.org/10.1561/0400000042

European Parliament. (2016). General Data Protection Regulation (Regulation (EU) 2016/679). https://eur-lex.europa.eu/eli/reg/2016/679/oj

Sweeney, L. (2000). Simple demographics often identify people uniquely. *Health (San Francisco)*, 671, 1–34.

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.
