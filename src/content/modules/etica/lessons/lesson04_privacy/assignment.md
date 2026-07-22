# Assignment: Privacy Impact Assessment for an ML System

## Objectives

- Conduct a privacy impact assessment for a real or hypothetical ML system
- Identify privacy risks at each stage of the ML lifecycle
- Propose privacy-preserving mitigations
- Analyze the privacy-utility trade-off

## Instructions

### Part 1: System Description (300 words)

Describe an ML system that processes personal data. Choose one:
- A diagnostic AI that analyzes patient medical records
- A SaaS product analytics platform that tracks user behavior
- A recruitment AI that screens job candidates
- A social media recommendation system

Include: what data is collected, how it is processed, what the model predicts, who has access, and where the system is deployed.

### Part 2: Privacy Risk Identification (500 words)

For each stage of the ML lifecycle, identify privacy risks:

| Stage | Privacy Risks |
|-------|--------------|
| Data collection | Consent, transparency, data minimization |
| Data storage | Security, access control, retention |
| Model training | Memorization, membership inference |
| Model deployment | API access, model inversion |
| Model sharing | Data leakage in parameters |
| Data deletion | Right to erasure, model retraining |

### Part 3: Regulatory Analysis (500 words)

Analyze how two regulations apply to your system:
1. GDPR: Which articles are most relevant? Is your system compliant?
2. Either HIPAA (if health data) or CCPA/other regulation relevant to your domain

### Part 4: Privacy-Preserving Design (500 words)

Propose a privacy-preserving redesign of your system. Include:
1. What data minimization measures would you implement?
2. Would you use differential privacy? What epsilon would you choose? Why?
3. How would you handle user consent and data deletion requests?
4. What technical controls would you implement (encryption, access control, audit logging)?

### Part 5: Technical Appendix (optional, extra credit)

Implement a differentially private version of a key statistic or model output from your system. Show the privacy-utility trade-off.

## Deliverables

A single PDF report with Parts 1–4 (and optionally Part 5 as a notebook).

## Rubric

| Criterion | Points | Excellent | Good | Satisfactory | Needs Improvement |
|-----------|--------|-----------|------|--------------|-------------------|
| System description | 10 | Clear, detailed | Adequate | Vague | Missing |
| Risk identification | 25 | All stages, specific risks | Most stages | Some stages | Missing |
| Regulatory analysis | 25 | Thorough, correct application | Good | Basic | Incorrect |
| Privacy redesign | 30 | Thoughtful, specific, feasible | Reasonable | Generic | Missing |
| Writing quality | 10 | Professional, clear | Good | Acceptable | Poor |

**Total: 100 points**

## Estimated Time

5–7 hours

## Submission

Upload PDF via the course learning management system.
