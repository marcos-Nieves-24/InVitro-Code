# Slides: Applications

## Slide 1: Title
Applications — End-to-End Machine Learning

## Slide 2: Two Case Studies
- **Biotech:** Predict product quality from process parameters
- **SaaS:** Segment customers + predict churn

## Slide 3: Case Study 1 — Biotech Quality
- Problem: predict final product quality score (0-100)
- 7 process parameters (temperature, pH, O₂, etc.)
- Quality depends on deviation from optimal conditions

## Slide 4: Biotech Pipeline
1. Load data → EDA
2. Scale features
3. Compare LR, RF, GB
4. Tune best model
5. Interpret: feature importance + PDP
6. Recommend: tighten pH and temperature control

## Slide 5: Biotech Results
- GB best: R² ~0.85
- Key features: pH deviation, temperature deviation
- PDP: quality drops sharply when pH > 7.4

## Slide 6: Business Impact
- Reduce batch failures by 40%
- Predict quality before lab testing (save 3 days)
- Optimize process parameters in real time

## Slide 7: Case Study 2 — SaaS
- Goal 1: Segment customers (unsupervised)
- Goal 2: Predict churn per segment (supervised)
- 6 features: spend, logins, features, tickets, etc.

## Slide 8: SaaS Segmentation
- K-Means with K=3
- Segment 0: high-engagement loyal
- Segment 1: at-risk (low logins, high tickets)
- Segment 2: new users (low tenure, exploring)

## Slide 9: SaaS Churn Prediction
- Separate model per segment
- Segment 0: churn drivers = price sensitivity
- Segment 1: churn drivers = support tickets, days idle
- AUC > 0.85 for all segments

## Slide 10: Business Actions
- Segment 0: loyalty rewards
- Segment 1: proactive support outreach
- Segment 2: onboarding campaigns

## Slide 11: Pipelines with Mixed Data
- ColumnTransformer: different transforms per column
- Pipeline chains preprocessing + model
- GridSearchCV tunes hyperparameters

## Slide 12: Demo — Biotech Pipeline
- Create data, build pipeline, GridSearchCV
- Best params, CV R², test R²
- Feature importance plot

## Slide 13: Demo — SaaS Pipeline
- Create data, segment with K-Means
- Build churn model per segment
- Compare AUC across segments

## Slide 14: Common Mistakes
- Skipping EDA
- Tuning on test data
- Ignoring business constraints
- Poor communication
- No monitoring plan

## Slide 15: Best Practices
- Start with a simple baseline
- Use pipelines for reproducibility
- Cross-validate everything
- Communicate in business language
- Document assumptions and limitations

## Slide 16: Course Summary
- 10 lessons, from fundamentals to applications
- Supervised: regression, classification, trees, RF, GB
- Unsupervised: K-Means, PCA
- Interpretation: how to understand models
- You are ready for the final project!
