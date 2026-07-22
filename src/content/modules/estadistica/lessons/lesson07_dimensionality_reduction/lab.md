# Lab: Dimensionality Reduction with PCA

## Objective

Apply PCA to real and synthetic high-dimensional data and interpret the results.

## Duration

60 minutes

## Dataset

Wine dataset from sklearn.

## Instructions

### Part 1: PCA on Wine Dataset (20 min)
1. Load wine dataset
2. Standardize features
3. Apply PCA (keep all components)
4. Plot the scree plot with cumulative explained variance
5. How many components explain 90% of variance?

### Part 2: 2D Visualization (15 min)
1. Project data onto first 2 PCs
2. Create a scatter plot colored by cultivar
3. Interpret: are the cultivars separable?

### Part 3: Loadings Analysis (15 min)
1. Extract loadings for PC1 and PC2
2. Identify top 3 features contributing to each
3. Create a heatmap of loadings
4. Interpret PC1 and PC2 in terms of original features

### Part 4: Dimensionality Reduction Impact (10 min)
1. Reconstruct data using only first 3 PCs
2. Compute reconstruction error (MSE between original and reconstructed)
3. Discuss: how much information is lost?

## Deliverables

- Jupyter notebook with all analyses and interpretations

## Rubric

| Criteria | Points |
|----------|--------|
| PCA application and scree plot | 3 |
| 2D visualization with interpretation | 2 |
| Loadings analysis | 3 |
| Reconstruction analysis | 2 |
Total: 10 points
