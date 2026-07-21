# Quiz: Introduction to AI Ethics

## Multiple Choice (5 questions)

**Q1.** Which of the following best defines AI ethics?

A. The study of how to make AI systems more profitable
B. The application of moral principles to the design, development, and deployment of AI systems
C. A set of laws that all AI systems must follow
D. The mathematical analysis of algorithmic fairness

**Q2.** According to Floridi and Cowls (2019), how many core ethical principles synthesize the majority of AI ethics guidelines worldwide?

A. Three
B. Five
C. Seven
D. Ten

**Q3.** A hospital deploys an AI diagnostic system that is 96% accurate overall but systematically misdiagnoses a rare condition that disproportionately affects a specific ethnic group. Which principle does this primarily violate?

A. Beneficence
B. Autonomy
C. Justice
D. Explicability

**Q4.** The principle of explicability in AI ethics requires that:

A. The AI system must be open-source
B. The AI system's decisions should be understandable and accountable to those affected
C. The AI system must explain itself in natural language at all times
D. The training data must be publicly available

**Q5.** Which of the following is NOT one of the five principles identified by Floridi and Cowls?

A. Beneficence
B. Non-maleficence
C. Profitability
D. Autonomy

## Short Answer (2 questions)

**Q6.** Explain why a machine learning model that achieves high average accuracy can still be ethically problematic. Provide a concrete example.

**Q7.** Describe an ethical trade-off between the principles of privacy and transparency. How might a system designer navigate this conflict?

## Coding Question (1 question)

**Q8.** (Conceptual — no coding) You are designing an AI system to help university admissions committees evaluate applications. Write a short analysis (approximately 150 words) explaining how each of the five ethical principles applies to this system. Identify at least one potential conflict between principles.

---

## Answer Key

**Q1.** B — The application of moral principles to the design, development, and deployment of AI systems.

**Q2.** B — Five principles: beneficence, non-maleficence, autonomy, justice, explicability.

**Q3.** C — Justice, because the system distributes benefits (accurate diagnosis) and burdens (misdiagnosis) inequitably across groups.

**Q4.** B — The AI system's decisions should be understandable and accountable to those affected.

**Q5.** C — Profitability is not one of the five principles.

**Q6.** A model can be accurate on average but perform poorly for specific subgroups. Example: a skin cancer classifier trained mostly on light skin images achieves 95% accuracy overall but only 70% accuracy on dark skin. The average hides the disparity. This violates the justice principle.

**Q7.** Privacy requires protecting personal data; transparency requires explaining how decisions are made. If an AI denies a loan, transparency demands an explanation, but the explanation might reveal sensitive patterns in the training data. A designer could use post-hoc explainability methods (like LIME or SHAP) that provide explanations without exposing raw data.

**Q8.** (Sample response) Beneficence: the system could reduce human bias in admissions and identify qualified candidates who might otherwise be overlooked. Non-maleficence: the system must not systematically disadvantage applicants from under-resourced schools or specific demographic groups. Autonomy: applicants should know an AI is involved in the decision and have the right to appeal. Justice: the system must be tested for fairness across socioeconomic, racial, and geographic groups before deployment. Explicability: rejected applicants deserve meaningful explanations, not just a score. Conflict: maximizing predictive accuracy (beneficence) may require using features that correlate with demographic characteristics (violating justice); the designer must decide which features to exclude even if they improve performance.
