# Quiz: Clustering (K-Means)

## Multiple Choice (5 questions)

**1. K-Means is an example of:**

a) Supervised learning
b) Unsupervised learning
c) Reinforcement learning
d) Semi-supervised learning

**2. The inertia of a K-Means solution measures:**

a) The distance between cluster centroids
b) The sum of squared distances from points to their centroid
c) The silhouette score
d) The number of iterations

**3. A silhouette score close to 1 indicates:**

a) Points may be in the wrong cluster
b) Points are well-matched to their own cluster and poorly matched to neighboring clusters
c) The clustering algorithm failed
d) The data has no natural clusters

**4. Which of the following is NOT a method to determine the optimal k?**

a) Elbow method
b) Silhouette analysis
c) P-value of the clustering
d) Gap statistic

**5. K-Means works best for clusters that are:**

a) Spherical and similarly sized
b) Irregularly shaped
c) Hierarchical
d) Overlapping

## Short Answer (2 questions)

**6.** Why is it important to standardize features before applying K-Means?

**7.** A bioinformatician applies K-Means to single-cell RNA-seq data and finds clusters that don't match known cell types. List three possible explanations.

## Coding Question (1 question)

**8.** Write Python code using sklearn that:
- Generates synthetic data with `make_blobs` (300 samples, 3 centers)
- Applies K-Means with k=3
- Computes and prints the silhouette score

---

# Answer Key

1. b) Unsupervised learning
2. b) The sum of squared distances from points to their centroid
3. b) Points are well-matched to their own cluster and poorly matched to neighboring clusters
4. c) P-value of the clustering
5. a) Spherical and similarly sized

6. K-Means uses Euclidean distance. Features on larger scales will dominate the distance calculation. Standardization ensures all features contribute equally.

7. (1) The true biological subtypes are not spherical (K-Means assumes spherical clusters). (2) Technical noise or batch effects may dominate the clustering. (3) The data may need normalization or transformation first.

8. 
```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=3, random_state=42)
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X)
score = silhouette_score(X, labels)
print(f"Silhouette score: {score:.3f}")
```
