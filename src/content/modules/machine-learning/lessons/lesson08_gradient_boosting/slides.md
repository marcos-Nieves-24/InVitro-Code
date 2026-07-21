# Slides: Gradient Boosting

## Slide 1: Title
Gradient Boosting — Learning from Mistakes

## Slide 2: Motivation
- Bagging: parallel, independent trees
- Boosting: sequential, each tree fixes previous errors
- Dominates ML competitions
- Used in biotech, search, ads, recommendations

## Slide 3: Boosting Intuition
- Start with simple prediction (mean)
- Find errors (residuals)
- Train a tree to predict errors
- Add tree (scaled) to ensemble
- Repeat: residuals → new tree → add

## Slide 4: Analogy
- Bagging: 100 people guess weight independently
- Boosting: Person 1 guesses → Person 2 sees error → Person 3 sees combined error → ...
- Each focuses on harder cases

## Slide 5: Algorithm
1. F₀(x) = mean(y)
2. For m = 1 to M:
   - rᵢ = yᵢ - Fₘ₋₁(xᵢ) (residuals)
   - Train tree hₘ on (X, r)
   - Fₘ(x) = Fₘ₋₁(x) + η · hₘ(x)

## Slide 6: Learning Rate
- η (eta) shrinks each tree's contribution
- Low η (0.01-0.1) → more trees, better generalization
- High η (0.5-1.0) → fewer trees, risk overfitting

## Slide 7: Hyperparameters
- **learning_rate:** 0.01-0.3 (default 0.1)
- **n_estimators:** 100-1000+ (use early stopping)
- **max_depth:** 2-5 (shallow trees!)
- **subsample:** 0.5-1.0 (stochastic GB)

## Slide 8: Demo — Learning Rate Effect
- LR=1.0: fast but overfits
- LR=0.1: good balance
- LR=0.01: slow but steady (needs more trees)

## Slide 9: Demo — Learning Curves
- Train error always decreases
- Test error plateaus then increases (overfitting)
- Early stopping at the plateau

## Slide 10: Feature Importance
- Similar to Random Forest
- Sum of improvement across all trees
- Top features differ from RF sometimes

## Slide 11: XGBoost
- e**X**treme **G**radient **B**oosting
- Regularization (L1, L2)
- Efficient missing value handling
- Built-in cross-validation
- Parallel processing

## Slide 12: LightGBM
- Histogram-based: faster training
- Leaf-wise tree growth (depth-wise vs XGBoost)
- Lower memory usage
- Native categorical feature support
- Best for very large datasets

## Slide 13: Biotechnology Example
- Drug-target binding prediction
- Molecular properties → binding status
- logP and H-bond acceptors are key

## Slide 14: SaaS Example
- Click-through rate prediction
- User features, time, device, ad position
- Real-time prediction at scale

## Slide 15: Common Mistakes
- Trees too deep
- Learning rate too high with many trees
- No early stopping
- Using boosting on tiny datasets

## Slide 16: Summary
- Boosting: sequential, each tree fits residuals
- Shallow trees + low learning rate = best
- Early stopping prevents overfitting
- XGBoost/LightGBM for production
- One of the most powerful ML algorithms
