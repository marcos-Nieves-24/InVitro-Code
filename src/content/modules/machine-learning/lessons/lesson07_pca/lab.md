# Lab 7: PCA

## Objectives

- Apply PCA for dimensionality reduction
- Interpret explained variance and component loadings
- Visualize high-dimensional data in 2D
- Understand the effect of scaling

## Part 1: PCA on Iris

Load iris, apply PCA with 2 components, and create a scatter plot colored by species.

**Questions:**
- What % of variance is captured by 2 components?
- Which species is most clearly separated?

## Part 2: Scree Plot

On the breast cancer dataset, run PCA on scaled data and plot:
- Bar plot of individual explained variance
- Cumulative variance line
- 90% and 95% threshold lines

**Question:** How many components for 90%? For 95%?

## Part 3: Loadings Analysis

For PCA on breast cancer with 2 components:
1. Examine loadings: which original features contribute most to PC1? To PC2?
2. Create a bar plot of the top 5 absolute loadings for each component.

**Question:** Can you interpret what PC1 and PC2 represent biologically?

## Part 4: PCA vs. No Scaling

Create data: `np.column_stack([feature1 * 1000, feature2, feature3])` where all features have built-in group structure. Run PCA with and without scaling.

**Question:** How does scaling change the explained variance distribution?

## Part 5: PCA + K-Means

Apply PCA to reduce breast cancer to 2 components, then run K-Means (K=2) on the PCA-transformed data. Compare the clusters with the true labels.

**Question:** Does K-Means on PCA space recover the malignant/benign split?

## Deliverables

- Notebook with all 5 parts
- Iris PCA plot (Part 1)
- Scree plot with thresholds (Part 2)
- Loadings bar plot (Part 3)
- Scaling comparison (Part 4)
- PCA + K-Means comparison (Part 5)

## Estimated time: 45 minutes
