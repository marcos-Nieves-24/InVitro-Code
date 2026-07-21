# Quiz: PCA

## Multiple Choice (5 questions)

**Q1.** What is the primary goal of PCA?

a) Predict a target variable
b) Find directions of maximum variance in the data
c) Group similar data points together
d) Select the most important original features

<details><summary>Answer</summary>b) Find directions of maximum variance in the data</details>

**Q2.** In PCA, eigenvectors represent:

a) The amount of variance in each component
b) The direction of each principal component
c) The cluster assignments
d) The predicted values

<details><summary>Answer</summary>b) The direction of each principal component (the loadings/weights of original features)</details>

**Q3.** If the cumulative explained variance for the first 3 components is 0.92, this means:

a) 92% of the original features are retained
b) 92% of the total variance is captured by 3 components
c) The model accuracy is 92%
d) 8% of data is noise

<details><summary>Answer</summary>b) 92% of the total variance in the data is captured by the first 3 principal components</details>

**Q4.** Why is scaling important before PCA?

a) It speeds up eigendecomposition
b) Features with larger variance would dominate the first PC
c) PCA only works on standardized data
d) It reduces the number of components needed

<details><summary>Answer</summary>b) Features with larger variance would dominate the first PC, potentially hiding important structure in other features</details>

**Q5.** Which of the following is TRUE about principal components?

a) They are correlated with each other
b) They are orthogonal (uncorrelated)
c) They are the same as the original features
d) The first component always separates classes

<details><summary>Answer</summary>b) They are orthogonal (uncorrelated). PCA rotates the data so components have zero correlation.</details>

## Short Answer (2 questions)

**Q6.** Explain the relationship between eigenvalues and explained variance in PCA.

<details><summary>Answer</summary>Each eigenvalue (λₖ) represents the variance captured by its corresponding principal component. The explained variance ratio for component k is λₖ / Σλⱼ. Components with larger eigenvalues capture more variance. The first component has the largest eigenvalue, the second the next largest, and so on. The sum of all eigenvalues equals the total variance in the dataset.</details>

**Q7.** A colleague runs PCA on a dataset and all 20 components have roughly equal explained variance (~5% each). What does this suggest?

<details><summary>Answer</summary>This suggests there is no dominant low-dimensional structure in the data — variance is spread evenly across all dimensions. This could mean the data is approximately spherical (isotropic) with no strong correlations between features. PCA may not be helpful for dimensionality reduction in this case. Possible causes: poorly chosen features, data already uncorrelated, or random noise dominating.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `pca_scree_plot(X, n_components=10)` that:
1. Scales the data
2. Fits PCA with n_components
3. Creates a scree plot (bar plot of explained variance ratios)
4. Returns the PCA object

<details><summary>Answer</summary>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def pca_scree_plot(X, n_components=10):
    X_scaled = StandardScaler().fit_transform(X)
    pca = PCA(n_components=min(n_components, X.shape[1]))
    pca.fit(X_scaled)

    plt.figure(figsize=(8, 5))
    x = range(1, len(pca.explained_variance_ratio_) + 1)
    plt.bar(x, pca.explained_variance_ratio_, alpha=0.7)
    plt.plot(x, np.cumsum(pca.explained_variance_ratio_), 'ro-', label='Cumulative')
    plt.xlabel('Principal Component')
    plt.ylabel('Explained Variance Ratio')
    plt.title('Scree Plot')
    plt.legend()
    plt.grid(True)
    plt.show()

    return pca

from sklearn.datasets import load_iris
pca = pca_scree_plot(load_iris().data, n_components=4)
```
</details>
</details>
