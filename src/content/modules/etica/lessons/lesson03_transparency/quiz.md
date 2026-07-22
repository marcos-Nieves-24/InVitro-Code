# Quiz: Transparency and Explainability

## Multiple Choice (5 questions)

**Q1.** Which of the following best describes the difference between interpretability and explainability?

A. Interpretability is about global understanding; explainability is about local understanding
B. Interpretability refers to understanding the model's inner workings; explainability refers to understanding why a specific prediction was made
C. Interpretability is for linear models; explainability is for tree-based models
D. There is no meaningful difference

**Q2.** LIME explains a prediction by:

A. Computing gradients through the model to identify influential features
B. Fitting a simple interpretable model locally around the prediction
C. Calculating each feature's contribution using game theory
D. Visualizing the decision tree that produced the prediction

**Q3.** Which property of SHAP values ensures that the sum of feature attributions equals the prediction minus the average prediction?

A. Symmetry
B. Efficiency
C. Additivity
D. Dummy

**Q4.** A model-agnostic explanation method:

A. Only works for neural networks
B. Works with any machine learning model
C. Requires access to the training data
D. Only works for classification problems

**Q5.** What is a key limitation of post-hoc explanation methods like LIME?

A. They are too slow for real-time use
B. They approximate the model and can be incorrect or unstable
C. They only work for linear models
D. They require the model to be open-source

## Short Answer (2 questions)

**Q6.** Explain the black box problem. Why is it especially concerning in healthcare and criminal justice applications?

**Q7.** A bank uses a Gradient Boosting model for loan approvals and uses LIME to generate explanations for denied applicants. A denied applicant receives an explanation and sues, claiming the model is discriminatory. The bank argues the explanation shows the model is fair. What are the weaknesses of the bank's position?

## Coding Question (1 question)

**Q8.** Write a Python function `explain_prediction(model, instance, feature_names, explainer_type='lime')` that:
- Takes a trained classifier, a single instance (1D array), feature names, and explainer type
- If `explainer_type='lime'`, creates a LIME explainer and returns the explanation as a list of (feature, weight) tuples
- If `explainer_type='shap'`, creates a SHAP explainer (assume model supports SHAP) and returns the SHAP values for the instance

You do not need to train the model. Assume `lime` and `shap` libraries are imported.

---

## Answer Key

**Q1.** B — Interpretability = understanding model inner workings; explainability = understanding why a specific prediction was made.

**Q2.** B — LIME fits a simple interpretable model locally around the prediction.

**Q3.** B — Efficiency ensures the sum of Shapley values equals the prediction minus the average prediction.

**Q4.** B — Model-agnostic methods work with any model type.

**Q5.** B — Post-hoc explanations approximate the model and can be incorrect, unstable, or misleading.

**Q6.** The black box problem refers to the opacity of complex ML models (deep neural networks, ensembles) whose internal decision processes are not directly understandable. In healthcare, a black box diagnostic model could miss rare conditions without anyone understanding why. In criminal justice, a defendant's sentence could be influenced by an unexplainable model, violating due process and making accountability impossible.

**Q7.** Weaknesses: (1) LIME explanations are approximations and can be unstable — different perturbation parameters might yield different explanations. (2) LIME explains individual predictions but may miss systematic biases that only appear across populations. (3) The explanation may highlight non-discriminatory features while the model still uses proxy features for protected attributes. (4) An explanation does not prove the model is fair overall — a local explanation can be correct while global behavior is discriminatory.

**Q8.** Sample solution:

```python
def explain_prediction(model, instance, feature_names, explainer_type='lime'):
    import lime.lime_tabular
    import shap
    import numpy as np

    if explainer_type == 'lime':
        # Dummy training data needed for LIME explainer (use instance as proxy)
        explainer = lime.lime_tabular.LimeTabularExplainer(
            instance.reshape(1, -1),
            feature_names=feature_names,
            mode='classification'
        )
        exp = explainer.explain_instance(instance, model.predict_proba, num_features=len(feature_names))
        return exp.as_list()

    elif explainer_type == 'shap':
        explainer = shap.Explainer(model, instance.reshape(1, -1))
        shap_values = explainer(instance.reshape(1, -1))
        return shap_values[0].values

    else:
        raise ValueError("explainer_type must be 'lime' or 'shap'")
```
