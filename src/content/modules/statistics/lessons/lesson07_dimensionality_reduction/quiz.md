# Quiz: Dimensionality Reduction (PCA)

## Multiple Choice (5 questions)

**1. PCA finds directions that maximize:**

a) The correlation between variables
b) The variance in the data
c) The accuracy of a classifier
d) The number of features

**2. The explained variance ratio of a principal component tells us:**

a) How many features it uses
b) The proportion of total variance it captures
c) How correlated it is with the target
d) The number of iterations needed

**3. Why must we standardize data before PCA?**

a) To reduce computation time
b) PCA is scale-sensitive; variables with larger scales would dominate
c) To make the data categorical
d) To increase the number of components

**4. The elbow in a scree plot suggests:**

a) The optimal number of features to remove
b) The optimal number of principal components to retain
c) The learning rate
d) The correlation threshold

**5. PCA loadings represent:**

a) The predicted values of the model
b) The contribution of each original feature to a PC
c) The eigenvalues of the covariance matrix
d) The residuals after transformation

## Short Answer (2 questions)

**6.** Explain why PCA is considered an unsupervised technique.

**7.** A dataset with 100 features is reduced to 3 PCs that explain 85% of the variance. Interpret this result and discuss the trade-off.

## Coding Question (1 question)

**8.** Write Python code using sklearn that:
- Loads the iris dataset
- Standardizes the features
- Applies PCA and keeps 2 components
- Prints the explained variance ratios and the cumulative variance

---

# Answer Key

1. b) The variance in the data
2. b) The proportion of total variance it captures
3. b) PCA is scale-sensitive; variables with larger scales would dominate
4. b) The optimal number of principal components to retain
5. b) The contribution of each original feature to a PC

6. PCA does not use any label information. It finds patterns (directions of maximum variance) purely from the feature matrix X, without reference to a target variable y. This makes it an unsupervised learning method.

7. 3 PCs capture 85% of the variability in 100 features — the data has a low-dimensional structure. Trade-off: we lose 15% of information but gain a much simpler representation, faster computation, and reduced overfitting risk.

8. 
```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris
iris = load_iris()
X_scaled = StandardScaler().fit_transform(iris.data)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print("Explained variance:", pca.explained_variance_ratio_)
print("Cumulative:", pca.explained_variance_ratio_.sum())
```
