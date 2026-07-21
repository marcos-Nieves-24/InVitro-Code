# Slides: Dimensionality Reduction (PCA)

## Slide 1: Title
- Dimensionality Reduction with PCA
- Module 3, Lesson 7

## Slide 2: Learning Objectives
- Explain PCA intuition
- Interpret explained variance
- Apply PCA with sklearn
- Determine optimal components

## Slide 3: The Curse of Dimensionality
- More features → more data needed
- Distance metrics break down
- Models overfit
- Visualization impossible beyond 3D

## Slide 4: PCA Intuition
- Find directions of maximum variance
- First PC: direction of most variance
- Second PC: orthogonal, next most variance
- Rotate data to align with these axes

## Slide 5: Mathematical Foundation
- Compute covariance matrix
- Find eigenvalues and eigenvectors
- Eigenvectors = directions (PCs)
- Eigenvalues = variance captured
- Project data onto top k eigenvectors

## Slide 6: Explained Variance
- λᵢ / Σλⱼ = proportion of variance
- Scree plot: eigenvalues by PC number
- Cumulative: how much variance captured
- Choose enough PCs for 70-95%

## Slide 7: Standardization is Crucial
- PCA is scale-sensitive
- Variable with larger range dominates
- Always use StandardScaler before PCA

## Slide 8: PCA for Visualization
- Project high-D data to 2D or 3D
- Often reveals clusters
- Iris example: species separate in PC1-PC2

## Slide 9: Loadings Interpretation
- Loadings = feature contributions to PCs
- Large absolute value = important feature
- PC1 might represent "overall size"
- PC2 might represent "shape ratio"

## Slide 10: Key Takeaways
- PCA captures maximum variance directions
- Use scree plot to choose components
- Always standardize
- PCA is unsupervised
- Loadings make PCs interpretable
