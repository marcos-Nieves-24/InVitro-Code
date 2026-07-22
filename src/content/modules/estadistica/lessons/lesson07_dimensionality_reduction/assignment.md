# Assignment: PCA Analysis

## Objectives

- Apply PCA to analyze high-dimensional data
- Determine optimal number of components
- Interpret principal components in terms of original features

## Instructions

1. Load the breast cancer dataset from sklearn:
```python
from sklearn.datasets import load_breast_cancer
cancer = load_breast_cancer()
```

2. **Standardization**: Standardize all 30 features

3. **PCA Application**:
   - Apply PCA keeping all components
   - Create a scree plot with cumulative explained variance
   - Determine the number of components needed for 80%, 90%, and 95% explained variance

4. **2D Visualization**:
   - Project data onto PC1 and PC2
   - Create a scatter plot colored by diagnosis (malignant vs benign)
   - Interpret the separation

5. **Loadings Analysis**:
   - Extract the top 5 features contributing to PC1
   - Extract the top 5 features contributing to PC2
   - Interpret PC1 and PC2 biologically (what types of features dominate?)

6. **Reconstruction**:
   - Keep only the first N components (where N explains 90% variance)
   - Reconstruct the data and compute reconstruction MSE
   - Discuss the information loss

7. **Report**: Write a summary interpreting what PCA reveals about the breast cancer dataset

## Deliverables

- Jupyter notebook with code, plots, and written interpretations

## Evaluation Rubric

| Criteria | Excellent (4 pts) | Good (3 pts) | Adequate (2 pts) | Poor (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| PCA application | Correct with all steps | Minor issues | Partial | Missing |
| Scree + components selection | Clear and justified | Basic | Confusing | Missing |
| 2D visualization | Informative with interpretation | Good plot | Basic | Missing |
| Loadings analysis | Insightful interpretation | Good | Superficial | Missing |
| Reconstruction | Correct with discussion | Correct only | Incomplete | Missing |
| Written summary | Excellent synthesis | Good | Basic | Missing |

**Total: 24 points**

## Estimated Time

3 hours
