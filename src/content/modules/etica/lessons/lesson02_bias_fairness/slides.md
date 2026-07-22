# Slides: Bias and Fairness

## Slide 1: Title Slide
- Bias and Fairness in Machine Learning
- Module 5, Lesson 2

## Slide 2: Learning Objectives
- Differentiate three types of bias
- Define and implement fairness metrics
- Analyze COMPAS and facial recognition cases
- Apply bias mitigation strategies

## Slide 3: Motivation
- COMPAS recidivism algorithm used in US courts
- ProPublica investigation (2016) revealed racial disparities
- Black defendants: 45% FPR vs 23% white defendants
- Same algorithm defended by developer as fair

## Slide 4: Three Types of Bias
- Data bias: representation, measurement, historical
- Algorithmic bias: features, objective, model choice
- Societal bias: reflected and amplified by AI

## Slide 5: Data Bias Examples
- Historical bias: past discrimination reflected in data
- Representation bias: underrepresentation of groups
- Measurement bias: different measurement quality across groups
- Label bias: biased target variables

## Slide 6: Algorithmic Bias
- Feature choice (proxies for protected attributes)
- Objective function (optimizing overall accuracy)
- Evaluation (inappropriate metrics)

## Slide 7: Societal Bias
- Feedback loops: biased decisions reinforce future bias
- Amplification: AI amplifies existing disparities
- Legitimization: algorithmic decisions seen as objective

## Slide 8: Fairness Definition 1 — Demographic Parity
- P(positive prediction) should be equal across groups
- Example: loan approval rate equal for all races
- Limitation: ignores base rate differences

## Slide 9: Fairness Definition 2 — Equal Opportunity
- True positive rate should be equal across groups
- Example: qualified applicants equally likely to be identified
- Limitation: ignores false positive disparities

## Slide 10: Fairness Definition 3 — Equalized Odds
- Both TPR and FPR should be equal across groups
- Most stringent definition
- Hardest to achieve

## Slide 11: Impossibility Theorem
- Chouldechova (2017): cannot satisfy all fairness definitions simultaneously
- Unless base rates are equal or classifier is perfect
- Fairness requires trade-offs

## Slide 12: Bias Detection Workflow
- Dataset audit: demographics, label distribution
- Model audit: metrics by group
- Error analysis: FPR, FNR disparities
- Mitigation: pre/in-processing/post-processing

## Slide 13: Fairness Metrics Table
- Demographic parity difference
- Equal opportunity difference
- Equalized odds difference
- Disparate impact ratio

## Slide 14: Case Study — COMPAS
- ProPublica: unequal FPR (45% vs 23%)
- Northpointe: equal calibration (risk score meaning consistent)
- Both used rigorous statistics; opposite conclusions
- Key lesson: fairness definition choice matters

## Slide 15: Case Study — Facial Recognition
- Buolamwini & Gebru (2018): Gender Shades study
- Commercial systems: 99% accuracy for light-skinned men
- 65% accuracy for dark-skinned women
- Intersectional bias: race + gender compounding

## Slide 16: Mitigation Strategies
- Pre-processing: reweighing, resampling
- In-processing: fairness constraints in optimization
- Post-processing: threshold adjustment by group
- No silver bullet

## Slide 17: Common Mistakes
- Fairness through unawareness (removing protected attribute)
- Ignoring intersectionality
- One fairness metric is enough
- Fairness is a one-time fix

## Slide 18: Summary
- Three types of bias affect ML systems
- Multiple competing fairness definitions exist
- Impossibility theorem requires trade-offs
- Mitigation is possible but imperfect
- Next lesson: Transparency and Explainability
