# Slides: Clustering (K-Means)

## Slide 1: Title
- Clustering with K-Means
- Module 3, Lesson 8

## Slide 2: Learning Objectives
- Explain K-Means algorithm
- Find optimal k with elbow + silhouette
- Apply K-Means with sklearn
- Interpret cluster profiles

## Slide 3: Unsupervised Learning
- No labels, find patterns in data
- Clustering: group similar points
- K-Means: most popular clustering algorithm

## Slide 4: K-Means Algorithm
- Step 1: Initialize k centroids
- Step 2: Assign each point to nearest centroid
- Step 3: Recompute centroids (mean of points)
- Step 4: Repeat until convergence

## Slide 5: Inertia (Objective)
- Sum of squared distances to centroid
- Minimize within-cluster variation
- Always decreases as k increases
- Diminishing returns after optimal k

## Slide 6: Finding k: Elbow Method
- Plot inertia vs k
- Look for the "elbow"
- Point where improvement flattens

## Slide 7: Finding k: Silhouette Score
- Measures cluster cohesion + separation
- Range: [-1, 1]
- > 0.5: good clustering
- Higher is better
- Choose k with highest silhouette

## Slide 8: K-Means++ Initialization
- Spread initial centroids apart
- Better convergence
- Default in sklearn
- Use n_init=10 for stability

## Slide 9: Limitations of K-Means
- Assumes spherical clusters
- Sensitive to scale (standardize!)
- Need to specify k
- Sensitive to initialization

## Slide 10: Key Takeaways
- K-Means finds k clusters via centroids
- Validate k with elbow + silhouette
- Always standardize features
- Profile clusters to interpret
- Not suitable for non-spherical clusters
