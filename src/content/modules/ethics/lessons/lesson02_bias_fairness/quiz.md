# Quiz: Bias and Fairness

## Multiple Choice (5 questions)

**Q1.** Which type of bias arises when the training data does not accurately represent the population the model will be applied to?

A. Algorithmic bias
B. Societal bias
C. Data bias
D. Confirmation bias

**Q2.** A model predicts loan repayment. The approval rate is 60% for Group A and 40% for Group B. Which fairness definition is violated?

A. Equal opportunity
B. Demographic parity
C. Equalized odds
D. Individual fairness

**Q3.** The "impossibility theorem" in algorithmic fairness states that:

A. Fair AI systems are mathematically impossible
B. Multiple fairness definitions cannot be simultaneously satisfied unless base rates are equal or the classifier is perfect
C. Bias can never be fully removed from any ML model
D. Fairness metrics are not well-defined mathematically

**Q4.** In the COMPAS recidivism case, ProPublica found that:

A. The algorithm was perfectly calibrated across racial groups
B. Black defendants had higher false positive rates than white defendants
C. The algorithm was ruled unconstitutional by the Supreme Court
D. The algorithm was more accurate than human judges for all groups

**Q5.** "Fairness through unawareness" refers to:

A. Removing protected attributes from the model
B. Not telling users how the model works
C. Using unsupervised learning to avoid bias
D. Blindly selecting features without domain knowledge

## Short Answer (2 questions)

**Q6.** Explain how a feature like "zip code" can act as a proxy for race even when race is removed from the model. What does this imply about "fairness through unawareness"?

**Q7.** What is intersectionality in the context of algorithmic bias? Provide an example where bias might not be visible when analyzing groups on a single attribute.

## Coding Question (1 question)

**Q8.** Write a Python function `compute_equalized_odds(y_true, y_pred, protected_attr)` that:
- Takes three arrays: true labels, predicted labels, and a binary protected attribute
- Returns a dictionary with the True Positive Rate (TPR) and False Positive Rate (FPR) for each group
- Also returns the absolute difference in TPR and FPR between the two groups

You may use `sklearn.metrics.confusion_matrix`.

---

## Answer Key

**Q1.** C — Data bias (also called representation or sample bias).

**Q2.** B — Demographic parity requires equal rates of positive predictions across groups. The approval rate differs between groups.

**Q3.** B — Multiple fairness definitions (e.g., demographic parity and equalized odds) cannot simultaneously be satisfied unless base rates are equal or the classifier is perfect.

**Q4.** B — Black defendants had higher false positive rates (labeled high risk but did not recidivate) compared to white defendants.

**Q5.** A — Removing protected attributes from the model, under the (incorrect) assumption that this eliminates bias.

**Q6.** Zip code correlates strongly with race due to historical housing discrimination and segregation (redlining). When race is removed, a model can still discriminate using zip code as a proxy. This means fairness through unawareness is insufficient — models must be tested for disparate impact even when protected attributes are excluded.

**Q7.** Intersectionality recognizes that people hold multiple identities (race, gender, class, etc.) and that bias at the intersection may differ from bias along any single dimension. For example, a facial recognition system might have similar error rates for Black men and white women overall, but much higher error rates for Black women specifically. Analyzing race alone or gender alone would miss this compounded disparity.

**Q8.** Sample solution:

```python
def compute_equalized_odds(y_true, y_pred, protected_attr):
    results = {}
    groups = np.unique(protected_attr)
    for g in groups:
        mask = protected_attr == g
        yt = y_true[mask]
        yp = y_pred[mask]
        tn, fp, fn, tp = confusion_matrix(yt, yp).ravel()
        tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
        results[f'group_{g}'] = {'TPR': tpr, 'FPR': fpr}
    tpr_diff = abs(results['group_0']['TPR'] - results['group_1']['TPR'])
    fpr_diff = abs(results['group_0']['FPR'] - results['group_1']['FPR'])
    results['TPR_difference'] = tpr_diff
    results['FPR_difference'] = fpr_diff
    return results
```
