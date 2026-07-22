# Lab: K-Means Clustering

## Objective

Apply K-Means clustering to segment data and evaluate cluster quality.

## Duration

60 minutes

## Dataset

Seaborn's `penguins` dataset.

## Instructions

### Part 1: Data Preparation (10 min)
1. Load penguins, drop missing values
2. Select numeric features: bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g
3. Standardize features

### Part 2: Finding Optimal k (15 min)
1. Run K-Means for k = 2 to 8
2. Record inertia and silhouette score for each k
3. Plot elbow curve and silhouette scores side by side
4. Determine optimal k

### Part 3: Clustering and Visualization (15 min)
1. Apply K-Means with optimal k
2. Use PCA to project data to 2D
3. Create scatter plot colored by cluster with centroids marked

### Part 4: Cluster Interpretation (20 min)
1. Compute mean feature values per cluster
2. Create a profile table
3. Compare cluster assignments with actual species (cross-tabulation)
4. Write a 1-paragraph interpretation of each cluster's characteristics

## Deliverables

- Jupyter notebook with code, plots, and interpretations

## Rubric

| Criteria | Points |
|----------|--------|
| Elbow + silhouette analysis | 3 |
| K-Means application | 2 |
| PCA visualization | 2 |
| Cluster interpretation | 3 |
Total: 10 points
