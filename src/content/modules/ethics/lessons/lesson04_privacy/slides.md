# Slides: Privacy and Data Protection

## Slide 1: Title Slide
- Privacy and Data Protection
- Module 5, Lesson 4

## Slide 2: Learning Objectives
- Explain data privacy principles for ML
- Describe GDPR and HIPAA requirements
- Compare anonymization, pseudonymization, differential privacy
- Implement differential privacy
- Evaluate privacy risks

## Slide 3: Motivation
- 2018: Language model memorized and leaked training data
- ML models can memorize individual records
- Hospitals, SaaS, finance all handle sensitive data
- Privacy is not just about secure storage

## Slide 4: Data Privacy Principles
- Lawfulness, fairness, transparency
- Purpose limitation
- Data minimization
- Accuracy
- Storage limitation
- Integrity and confidentiality
- Accountability

## Slide 5: ML Implications of Privacy Principles
- Purpose limitation: don't repurpose models without new consent
- Data minimization: don't collect every possible feature
- Storage limitation: delete training data when no longer needed

## Slide 6: GDPR Overview
- Effective 2018 in the EU
- Most influential privacy regulation globally
- Key articles: 5, 6, 9, 15, 17, 22
- Extraterritorial scope (applies to any EU resident's data)

## Slide 7: GDPR — Key Articles for AI
- Art. 5: Lawfulness, fairness, transparency
- Art. 9: Special categories (health, race, genetics) — restricted
- Art. 17: Right to erasure (right to be forgotten)
- Art. 22: Right not to be subject to solely automated decisions

## Slide 8: HIPAA for Health Data
- Protects Protected Health Information (PHI)
- De-identification required before ML
- Safe harbor: remove 18 identifiers
- Business Associate Agreements for cloud ML
- Penalties up to $1.5M per violation

## Slide 9: Anonymization vs. Pseudonymization
- Anonymization: irreversible removal of identifiers
  - Low re-identification risk
  - Not covered by GDPR
- Pseudonymization: replace identifiers with pseudonyms
  - Higher re-identification risk
  - Still covered by GDPR

## Slide 10: The Re-identification Problem
- Sweeney (2000): 87% of US population uniquely identified by (zip, birthdate, sex)
- Removing names is not enough
- High-dimensional data is inherently identifiable
- Anonymization is surprisingly difficult

## Slide 11: Differential Privacy — Intuition
- Model output should change very little if one person is added/removed
- Cannot infer whether any specific person was in the dataset
- Formal mathematical guarantee

## Slide 12: Differential Privacy — Definition
- Mechanism M satisfies epsilon-DP if for any D, D' differing by one record:
- P(M(D) in S) <= e^epsilon * P(M(D') in S)
- Epsilon = privacy budget
- Smaller epsilon = stronger privacy

## Slide 13: Laplace Mechanism
- M(x) = f(x) + Lap(Delta_f / epsilon)
- Sensitivity Delta_f: max change in f when one record changes
- Mean sensitivity: range / n
- Median sensitivity: ~1 / (n * f(median))

## Slide 14: Privacy Budget (Epsilon)
- 0.01: Very strong privacy (high noise)
- 1: Moderate privacy
- 10: Weak privacy (low noise)
- Multiple queries: budget accumulates

## Slide 15: Privacy Attacks on ML
- Membership inference: is this record in training data?
- Model inversion: reconstruct training data from model
- Attribute inference: infer sensitive attributes from predictions

## Slide 16: Membership Inference Demo
- Train model, compare confidence on training vs. holdout
- Higher confidence on training data signals membership
- Differential privacy mitigates this

## Slide 17: k-Anonymity
- Each record indistinguishable from k-1 others
- Generalize quasi-identifiers (age ranges, zip prefixes)
- Weaknesses: homogeneity attack, background knowledge

## Slide 18: Biotech — Genomic Privacy
- Genomic data is the ultimate identifier
- Never changes, identifies relatives
- Differential privacy for GWAS summary statistics
- Balancing privacy with research utility

## Slide 19: SaaS — Privacy-Preserving Analytics
- Aggregate at cohort level
- k-anonymity for reports
- DP for dashboard metrics
- Automatic data deletion after 90 days

## Slide 20: Common Mistakes
- Anonymization = removing names (false)
- DP is a silver bullet (false)
- Consent is one-time (false)
- Privacy = security (false)
- Ignoring model deployment privacy risks

## Slide 21: Best Practices
- Minimize data collection
- Use DP for releasing statistics
- Implement access controls
- Conduct privacy impact assessments
- Plan for data deletion

## Slide 22: Summary
- Privacy principles guide ML data practices
- GDPR and HIPAA set legal requirements
- Anonymization is hard; DP provides formal guarantees
- Privacy attacks target deployed models
- Next lesson: Social Impact of AI
