# Slides: PCA

## Slide 1: Title
Principal Component Analysis — Seeing High-Dimensional Data

## Slide 2: Motivation
- Humans can't see >3 dimensions
- Gene expression: 20,000 features
- Flow cytometry: 50+ markers
- PCA compresses dimensions while keeping structure

## Slide 3: The Curse of Dimensionality
- More dimensions → sparser data
- Distances become meaningless
- Models overfit more
- Visualization is impossible

## Slide 4: PCA Intuition
- Find directions of maximum variance
- First PC: direction with most variance
- Second PC: orthogonal to first, next most variance
- Project data onto these new axes

## Slide 5: Mathematics
1. Center data (subtract mean)
2. Compute covariance matrix
3. Eigendecomposition: Σv = λv
4. Top K eigenvectors → principal components
5. X × W → reduced representation

## Slide 6: Eigenvalues & Variance
- λₖ = variance of component k
- Explained variance ratio = λₖ / Σλⱼ
- Sum of all ratios = 1.0

## Slide 7: Choosing Components
- Scree plot: variance vs. component number
- Cumulative variance: choose threshold (90%, 95%)
- Elbow in scree plot
- For visualization: 2-3 components

## Slide 8: Demo — Iris PCA
- 4D → 2D preserves 97% variance
- Setosa clearly separated
- PC1 = petal measurements

## Slide 9: Demo — Breast Cancer
- 30 → 2 preserves ~63% variance
- 10 components for 95% variance
- Clear separation of malignant/benign

## Slide 10: Loadings Interpretation
- Loadings = contribution of original feature to PC
- High absolute loading → important for that PC
- PC1: worst radius, worst perimeter, worst area
- PC2: smoothness, compactness

## Slide 11: Scaling Matters!
- Without scaling: feature with largest variance dominates
- Always use StandardScaler before PCA
- Otherwise PCA = variable scale analysis

## Slide 12: Biotechnology Example
- Gene expression: 1000 genes → 2D
- Three subtypes visible in PCA space
- PC1 captures the main subtype difference

## Slide 13: SaaS Example
- User behavior metrics → 3 engagement factors
- PC1: engagement (pages, duration, features)
- PC2: support needs (tickets)
- PC3: growth (referrals)

## Slide 14: Common Mistakes
- No scaling
- Interpreting PCs causally
- Using PCA for feature selection
- Assuming PCA always helps
- Ignoring loadings

## Slide 15: Summary
- PCA finds orthogonal directions of max variance
- Eigenvectors = directions, eigenvalues = variance
- Explained variance ratio guides component choice
- Scale data first!
- Essential tool for high-dimensional data
