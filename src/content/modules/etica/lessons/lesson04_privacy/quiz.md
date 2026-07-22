# Quiz: Privacy and Data Protection

## Multiple Choice (5 questions)

**Q1.** Which GDPR article grants individuals the right not to be subject to decisions based solely on automated processing?

A. Article 5
B. Article 17
C. Article 22
D. Article 32

**Q2.** In differential privacy, a smaller epsilon value means:

A. Stronger privacy guarantees (more noise added)
B. Weaker privacy guarantees (less noise added)
C. Higher accuracy of the output
D. Faster computation

**Q3.** A dataset has 500 columns of demographic, behavioral, and medical data. Names and SSNs have been removed. This is best described as:

A. Anonymous data
B. Pseudonymized data
C. De-identified data (but re-identification risk may remain)
D. Fully protected under GDPR

**Q4.** A k-anonymous dataset with k=5 means:

A. Each record is indistinguishable from at least 4 other records on the quasi-identifiers
B. Each record appears exactly 5 times in the dataset
C. The dataset contains only 5% of the original records
D. Only 5 attributes are retained

**Q5.** Which of the following is NOT a requirement under HIPAA for using protected health information in ML?

A. Removing 18 specific identifiers (safe harbor method)
B. Obtaining a business associate agreement with cloud providers
C. Publishing the trained model as open-source
D. Expert determination that re-identification risk is small

## Short Answer (2 questions)

**Q6.** What is a membership inference attack? How does differential privacy help defend against it?

**Q7.** Explain the "data minimization" principle. Give an example of how an ML project might violate this principle, and how to fix it.

## Coding Question (1 question)

**Q8.** Write a Python function `differentially_private_histogram(data, bins, epsilon)` that:
- Takes an array of values, bin edges, and a privacy budget epsilon
- Computes the true histogram (counts per bin)
- Adds Laplace noise to each bin count with sensitivity = 1 (adding/removing one person changes count of one bin by at most 1)
- Returns the noisy counts (clipped to be non-negative)

---

## Answer Key

**Q1.** C — Article 22: Automated individual decision-making, including profiling.

**Q2.** A — Smaller epsilon = stronger privacy = more noise = lower accuracy.

**Q3.** C — Without proper anonymization (e.g., generalizing quasi-identifiers, applying differential privacy), the data may still be re-identifiable.

**Q4.** A — Each record is indistinguishable from at least k-1 others on the quasi-identifier attributes.

**Q5.** C — HIPAA does not require open-sourcing models. In fact, ensuring PHI is not leaked in model parameters is a key concern.

**Q6.** A membership inference attack attempts to determine whether a specific individual's data was included in a model's training set. Attackers exploit the fact that models often exhibit higher confidence on training examples than on unseen examples. Differential privacy defends against this by bounding the influence any single record can have on the model's output — if the model's behavior changes very little when a record is added or removed, an attacker cannot reliably infer membership.

**Q7.** Data minimization means only collecting data that is necessary for the stated purpose. An ML project might violate this by collecting every possible feature (e.g., collecting genetic data when only age and BMI are needed for the prediction task). To fix it: conduct a privacy impact assessment, identify the minimal feature set needed, and only collect those features.

**Q8.** Sample solution:

```python
def differentially_private_histogram(data, bins, epsilon):
    true_counts, _ = np.histogram(data, bins=bins)
    sensitivity = 1.0
    noise = np.random.laplace(0, sensitivity / epsilon, size=len(true_counts))
    noisy_counts = true_counts + noise
    noisy_counts = np.maximum(noisy_counts, 0)  # Clip to non-negative
    return noisy_counts
```
