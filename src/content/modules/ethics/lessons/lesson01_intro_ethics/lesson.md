---
Module: 5
Lesson Number: 1
Lesson Title: Introduction to AI Ethics
Estimated Duration: 60 minutes
Prerequisites: Module 4 (Machine Learning)
Learning Objectives:
  - Define ethics in the context of artificial intelligence
  - Explain why AI ethics matters for biotechnology and SaaS applications
  - Identify the five key ethical principles for AI: beneficence, non-maleficence, autonomy, justice, explicability
  - Analyze real-world cases where ethical failures in AI caused harm
  - Evaluate trade-offs between competing ethical principles in system design
Keywords: ethics, beneficence, non-maleficence, autonomy, justice, explicability, fairness, accountability
Difficulty: Introductory
Programming Concepts: None
Mathematical Concepts: None
Machine Learning Concepts: Model evaluation, classification, regression (review)
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Introduction to AI Ethics

## Learning Objectives

By the end of this lesson, students will be able to:

1. **Define** AI ethics and its scope within the ML lifecycle
2. **Explain** why ethical considerations are critical when deploying AI in healthcare and SaaS
3. **Identify** the five foundational principles of AI ethics
4. **Analyze** a real-world case of algorithmic harm using ethical principles
5. **Evaluate** ethical trade-offs in a concrete system design scenario

## Motivation

Imagine you build a machine learning model that predicts which patients will develop diabetes. Your model achieves 94% accuracy on your test set. You deploy it in a hospital. Months later, you discover the model systematically underdiagnoses diabetes in women of color — precisely the population that needs early detection the most.

Your model is accurate on average. But it causes real harm.

This is not a hypothetical scenario. It happened. In 2019, researchers discovered that a widely-used healthcare algorithm in US hospitals was systematically biased against Black patients, falsely labeling them as healthier than equally sick white patients (Obermeyer et al., 2019). The algorithm was deployed in hospitals serving millions of patients. The harm was real, measurable, and entirely preventable.

AI ethics is not an abstract philosophical exercise. It is an engineering discipline that asks: *What should we build? How should we build it? Who might be harmed? What responsibilities do we have toward the people affected by our systems?*

If you work in biotechnology, healthcare, or SaaS, you will almost certainly deploy models that affect real people. Understanding ethics is as essential as understanding gradient descent.

## Big Picture

| Previous Module | Current Lesson | Next Lesson |
|---|---|---|
| Module 4: Introduction to ML (training models, evaluation) | L1: Introduction to AI Ethics (principles, why ethics matters) | L2: Bias and Fairness (types of bias, fairness metrics) |

This lesson lays the philosophical and practical foundation. Every subsequent lesson — bias, transparency, privacy, social impact, regulation, case studies — builds on these five principles.

## Theory

### What is Ethics in AI?

Ethics is the branch of philosophy concerned with moral principles — what is right and wrong, good and bad. AI ethics applies these principles to the design, development, deployment, and governance of artificial intelligence systems.

AI ethics asks questions like:

- Who is responsible when an autonomous vehicle kills a pedestrian?
- Should an ML model deny a loan application based on zip code?
- Is it acceptable to train a diagnostic model without patient consent?
- How transparent should an AI system be about its decision process?

These are not questions we can answer with a loss function. They require values, deliberation, and trade-offs.

### Why It Matters

There are four compelling reasons to care about AI ethics:

1. **Harm prevention.** ML systems can and do cause harm — biased predictions, privacy violations, job displacement. Understanding ethics helps us minimize harm.

2. **Trust.** Users, patients, and regulators demand trustworthy systems. A single ethical failure can destroy credibility.

3. **Legal compliance.** Regulation is accelerating. The EU AI Act, GDPR, and HIPAA impose legal requirements on AI systems. Ignorance is not a defense.

4. **Better science.** Ethical reflection improves scientific rigor. Considering who is included in your dataset, how your features are constructed, and what your model optimizes for leads to better, more robust models.

### The Five Key Principles

Floridi and Cowls (2019) synthesized over 50 AI ethics guidelines worldwide into five core principles:

#### 1. Beneficence

*Do good. Promote well-being.*

AI systems should be designed to benefit humanity. This means:

- Maximizing positive outcomes (better diagnoses, higher productivity, improved access)
- Considering who benefits and who is excluded
- Building systems that serve the public good, not just corporate profit

**Example:** A diagnostic AI should be evaluated not just on accuracy but on whether it improves patient outcomes in practice.

#### 2. Non-maleficence

*Do no harm. Prevent harm.*

AI systems must not cause foreseeable harm. This includes:

- Direct harm (misdiagnosis, accidents)
- Indirect harm (bias, discrimination, privacy violations)
- Long-term harm (environmental damage, social inequality)

**Example:** Before deploying an automated hiring system, test whether it disproportionately rejects candidates from certain demographic groups.

#### 3. Autonomy

*Respect human agency. Keep humans in control.*

Humans should retain meaningful control over AI systems. This means:

- Informed consent when using people's data
- The right to opt out of automated decisions
- Meaningful human oversight for high-stakes decisions

**Example:** A patient should be told when a diagnostic recommendation comes from an AI, and a clinician should have the final say.

#### 4. Justice

*Be fair. Distribute benefits and burdens equitably.*

AI systems should not reinforce existing inequalities. This means:

- Fair distribution of AI's benefits across populations
- Protection of vulnerable groups
- Access to redress when systems cause harm

**Example:** If an AI system predicts disease risk, ensure it performs equally well across all demographic groups, not just the majority.

#### 5. Explicability

*Be transparent and accountable.*

AI systems should be understandable and accountable to those they affect. This includes:

- Transparency: explaining how decisions are made
- Interpretability: making model behavior understandable
- Accountability: clearly assigning responsibility for outcomes

**Example:** A credit-scoring model should be able to explain why a loan was denied in terms the applicant can understand.

### Ethical Trade-offs

Principles often conflict. Consider a trade-off between:

- **Autonomy vs. Beneficence:** A medical AI that always recommends the best treatment (beneficence) might override a patient's preferences (autonomy).
- **Privacy vs. Transparency:** Making an AI fully transparent might require sharing private training data (privacy violation).
- **Justice vs. Efficiency:** Achieving perfect fairness across groups might reduce overall accuracy (efficiency loss).

There is no universal formula for resolving these conflicts. Ethical AI design requires thoughtful deliberation, stakeholder input, and domain expertise.

## Walkthrough Example

### Case: Predictive Policing

Consider a predictive policing system that uses historical crime data to forecast where crimes are likely to occur. Police departments use these predictions to allocate patrols.

**Ethical analysis using our five principles:**

| Principle | Question | Analysis |
|-----------|----------|----------|
| Beneficence | Does it produce good outcomes? | Could reduce crime rates and improve public safety |
| Non-maleficence | Does it cause harm? | Historical data reflects biased policing; predictions may perpetuate over-policing of minority neighborhoods |
| Autonomy | Does it respect human agency? | Officers may defer to the algorithm rather than using judgment |
| Justice | Is it fair? | If historical data is biased, the system unfairly targets already over-policed communities |
| Explicability | Is it transparent? | Citizens may not know they are being policed based on an algorithm |

**Conclusion:** The system could produce good outcomes only if the data, deployment, and oversight are carefully designed to prevent harm and ensure fairness.

## Biotechnology Example

### AI in Drug Discovery

An ML model is trained to predict which chemical compounds will bind to a target protein for a new cancer drug. The training data comes from public databases that primarily contain compounds tested on European-derived cell lines.

**Ethical concerns:**

- **Justice:** The resulting drug may be less effective for non-European populations because the model never learned their biological variability.
- **Beneficence:** The drug could save lives, but only for a subset of patients.
- **Autonomy:** Were the patients whose cell lines were used in training informed? Did they consent?

**Lesson:** Dataset composition is an ethical decision, not just a technical one.

## SaaS Example

### AI-Powered Loan Underwriting

A SaaS lending platform uses ML to approve or deny small business loans. The model uses features including credit history, revenue, and zip code.

**Ethical concerns:**

- **Justice:** Zip code correlates with race due to historical redlining. The model may perpetuate housing discrimination.
- **Explicability:** Applicants denied a loan deserve an explanation. "The model said no" is insufficient.
- **Non-maleficence:** Denying loans to minority-owned businesses deepens wealth inequality.

**Lesson:** Features that are predictive are not always ethically acceptable.

## Common Mistakes

1. **Equating accuracy with ethical success.** A model can be accurate on average but systematically wrong for specific groups.
2. **Ignoring data provenance.** The ethical properties of a dataset matter as much as its statistical properties.
3. **Treating ethics as optional.** Ethics is not a checkbox to complete after the model is built. It must be integrated throughout the ML lifecycle.
4. **Assuming neutrality.** ML systems are not value-neutral. Every design choice reflects values.
5. **Forgetting the human.** Behind every data point is a person who may be affected by the system.

## Best Practices

1. **Start early.** Consider ethical implications during problem formulation, not after deployment.
2. **Diverse teams.** Teams with diverse backgrounds identify more ethical risks.
3. **Stakeholder engagement.** Talk to the people who will be affected by your system.
4. **Document decisions.** Write down why you chose certain features, datasets, and thresholds.
5. **Assume responsibility.** If your system causes harm, own it and fix it.

## Summary

- AI ethics applies moral principles to the design, development, and deployment of AI systems.
- There are five key principles: beneficence, non-maleficence, autonomy, justice, and explicability.
- These principles often conflict; there is no universal resolution.
- Dataset composition, feature selection, and model design are all ethical decisions.
- Ethics is not optional — it is a core engineering responsibility.

## Key Terms

| Term | Definition |
|------|------------|
| Beneficence | The principle of designing AI to promote well-being and produce good outcomes |
| Non-maleficence | The principle of preventing harm caused by AI systems |
| Autonomy | The principle of respecting human agency and keeping humans in control |
| Justice | The principle of distributing AI's benefits and burdens fairly |
| Explicability | The principle of making AI transparent, interpretable, and accountable |
| AI ethics | The field concerned with moral principles in AI design and deployment |
| Ethical trade-off | A situation where satisfying one ethical principle conflicts with another |

## Exercises

### Level 1: Basic Understanding

1. List the five ethical principles of AI according to Floridi and Cowls (2019). Provide a one-sentence definition for each.
2. Explain why a model with 95% accuracy can still be ethically problematic.

### Level 2: Analysis

3. Choose a real or hypothetical AI system. Analyze it using the five ethical principles. Identify at least one potential ethical violation.
4. Give an example of an ethical trade-off between autonomy and non-maleficence in a healthcare AI context.

### Level 3: Critical Thinking

5. An AI system predicts student performance to allocate educational resources. Write a short ethical analysis (200 words) covering all five principles. What trade-offs exist? How would you resolve them?
6. Why might it be insufficient to rely solely on "fairness through unawareness" (excluding protected attributes from the model)? What ethical principle does this violate?

## Coding Challenge

No coding challenge for this introductory lesson. Implementation exercises begin in Lesson 2.

## References

Floridi, L., & Cowls, J. (2019). A unified framework of five principles for AI in society. *Harvard Data Science Review*, 1(1). https://doi.org/10.1162/99608f92.8cd550d1

Jobin, A., Ienca, M., & Vayena, E. (2019). The global landscape of AI ethics guidelines. *Nature Machine Intelligence*, 1, 389–399. https://doi.org/10.1038/s42256-019-0088-2

Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science*, 366(6464), 447–453. https://doi.org/10.1126/science.aax2342

O'Neil, C. (2016). *Weapons of math destruction: How big data increases inequality and threatens democracy*. Crown Publishing Group.

Russell, S., & Norvig, P. (2020). *Artificial intelligence: A modern approach* (4th ed.). Pearson.
