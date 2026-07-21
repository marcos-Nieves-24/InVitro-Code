# Quiz: Case Studies in Health and SaaS

## Multiple Choice (5 questions)

**Q1.** In the Obermeyer et al. (2019) healthcare algorithm study, what was the root cause of racial bias?

A. The algorithm explicitly used race as a feature
B. The algorithm used health costs as a proxy for health needs, and costs are lower for Black patients due to unequal access to care
C. The training data included too few Black patients
D. The algorithm was trained on biased labels provided by physicians

**Q2.** What percentage of the bias was eliminated when Obermeyer et al. retrained the algorithm to predict number of chronic conditions instead of cost?

A. 25%
B. 50%
C. 84%
D. 100%

**Q3.** Under the Equal Credit Opportunity Act (ECOA), lenders must:

A. Approve all applicants regardless of credit history
B. Provide specific reasons for adverse credit decisions (adverse action notice)
C. Use only income and credit score in lending decisions
D. Achieve demographic parity in approval rates

**Q4.** In the context of the healthcare algorithm case study, the "proxy problem" refers to:

A. Using hidden variables that cannot be measured directly
B. Using a variable (cost) that correlates with the target (need) but has group-level bias
C. Using patient data without consent
D. Delegating medical decisions to an algorithm

**Q5.** Which fairness metric is most directly relevant to the healthcare algorithm case (equal identification of high-need patients across groups)?

A. Demographic parity
B. Equal opportunity (equal TPR)
C. Individual fairness
D. Disparate impact ratio

## Short Answer (2 questions)

**Q6.** Explain how the Obermeyer algorithm caused harm despite being well-intentioned. What ethical principle (from Lesson 1) was primarily violated?

**Q7.** A SaaS company builds a churn prediction model and plans to offer retention discounts only to customers predicted as high-churn. Discuss at least two ethical concerns with this approach.

## Coding Question (1 question)

**Q8.** Write a Python function `audit_healthcare_algorithm(y_true, y_pred, protected_attr, group_names=None)` that:
- Takes true labels, predicted labels, and a protected attribute
- Returns a dictionary with: overall accuracy, TPR by group, FPR by group, TPR difference, FPR difference
- Uses sklearn's confusion_matrix

---

## Answer Key

**Q1.** B — The algorithm used cost as a proxy for need. Due to unequal access to care, Black patients with the same health needs had lower costs, so the algorithm systematically underestimated their needs.

**Q2.** C — 84% of the bias was eliminated by using number of chronic conditions instead of cost.

**Q3.** B — ECOA requires lenders to provide specific reasons for adverse actions (adverse action notice).

**Q4.** B — The proxy problem is using a proxy variable that correlates with the target but has group-level bias.

**Q5.** B — Equal opportunity (equal TPR) is most relevant: the algorithm should identify high-need patients at equal rates across groups.

**Q6.** The algorithm used cost as a proxy for health need. Because Black patients have historically lower access to healthcare (systemic racism, insurance disparities), their costs are lower even when they have the same health needs. The algorithm learned that low cost = healthy, which was incorrect for Black patients. This primarily violated the **justice** principle — distributing healthcare resources inequitably — and **non-maleficence** by causing real harm.

**Q7.** (1) Transparency: customers may not know their behavior is being modeled for retention targeting. (2) Fairness: enterprise customers (high revenue, lower churn risk) receive fewer discounts than small businesses (lower revenue, higher churn risk), which may be seen as punishing smaller customers or as fair resource allocation depending on perspective. (3) Manipulation: personalized discounts based on predicted behavior may cross into manipulative practices. (4) Privacy: churn prediction requires collecting detailed usage data.

**Q8.** Sample solution:

```python
def audit_healthcare_algorithm(y_true, y_pred, protected_attr, group_names=None):
    from sklearn.metrics import confusion_matrix
    import numpy as np

    groups = np.unique(protected_attr)
    results = {'overall_accuracy': (y_pred == y_true).mean()}

    for g in groups:
        mask = protected_attr == g
        yt = y_true[mask]
        yp = y_pred[mask]
        tn, fp, fn, tp = confusion_matrix(yt, yp).ravel()
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        name = group_names[g] if group_names else f'group_{g}'
        results[f'TPR_{name}'] = tpr
        results[f'FPR_{name}'] = fpr

    groups_list = np.unique(protected_attr)
    g0_name = group_names[groups_list[0]] if group_names else f'group_{groups_list[0]}'
    g1_name = group_names[groups_list[1]] if group_names else f'group_{groups_list[1]}'
    results['TPR_difference'] = abs(results[f'TPR_{g0_name}'] - results[f'TPR_{g1_name}'])
    results['FPR_difference'] = abs(results[f'FPR_{g0_name}'] - results[f'FPR_{g1_name}'])

    return results
```
