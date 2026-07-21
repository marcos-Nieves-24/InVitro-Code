# Quiz: K-Means Clustering

## Multiple Choice (5 questions)

**Q1.** Which of the following best describes unsupervised learning?

a) The model learns from labeled data to predict outcomes
b) The model discovers patterns in data without labels
c) The model receives feedback on each prediction
d) The model requires a validation set for tuning

<details><summary>Answer</summary>b) The model discovers patterns in data without labels</details>

**Q2.** In K-Means, the "assignment step" consists of:

a) Randomly initializing centroids
b) Assigning each point to the nearest centroid
c) Computing the mean of all points in the dataset
d) Updating the number of clusters

<details><summary>Answer</summary>b) Assigning each point to the nearest centroid</details>

**Q3.** The elbow method for choosing K involves:

a) Selecting K where accuracy is highest
b) Selecting K where adding more clusters gives diminishing returns in inertia reduction
c) Selecting K that maximizes the number of clusters
d) Selecting K randomly and testing iteratively

<details><summary>Answer</summary>b) Selecting K where adding more clusters gives diminishing returns in inertia reduction</details>

**Q4.** A silhouette score of -0.2 for a point indicates:

a) The point is well-clustered
b) The point is likely assigned to the wrong cluster
c) The data has too many dimensions
d) K is too small

<details><summary>Answer</summary>b) The point is likely assigned to the wrong cluster (silhouette ranges from -1 to 1; negative means the point is closer to another cluster)</details>

**Q5.** Why is feature scaling important in K-Means?

a) It speeds up the algorithm
b) Features with larger units would dominate the distance calculation
c) It guarantees finding global optimum
d) It is not important — K-Means handles scale automatically

<details><summary>Answer</summary>b) Features with larger units would dominate the Euclidean distance calculation, making the algorithm effectively ignore smaller-scale features</details>

## Short Answer (2 questions)

**Q6.** Explain the difference between inertia and silhouette score. When would each be misleading?

<details><summary>Answer</summary>Inertia measures how compact clusters are (sum of squared distances to centroids). It always decreases as K increases (eventually to 0 when K=n). It can be misleading because it favors many small clusters. Silhouette measures both cohesion (within-cluster) and separation (between-cluster). A point with a negative silhouette is likely in the wrong cluster. Silhouette can be misleading on very small or irregularly shaped clusters.</details>

**Q7.** Why does K-Means sometimes produce different results when run multiple times on the same data?

<details><summary>Answer</summary>K-Means depends on random centroid initialization. Different initial positions lead to different local minima of the inertia objective (the problem is NP-hard). K-Means++ initialization (default in sklearn) helps but doesn't guarantee global optimum. Using n_init=10 runs the algorithm 10 times and returns the best one.</details>

## Coding Question (1 question)

**Q8.** Write a Python function `kmeans_with_metrics(X, K_range)` that performs K-Means for each K in K_range, computes inertia and silhouette scores, and returns a DataFrame with columns ['K', 'inertia', 'silhouette'].

<details><summary>Answer</summary>

```python
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

def kmeans_with_metrics(X, K_range):
    results = []
    for K in K_range:
        kmeans = KMeans(n_clusters=K, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X)
        results.append({
            'K': K,
            'inertia': kmeans.inertia_,
            'silhouette': silhouette_score(X, labels)
        })
    return pd.DataFrame(results)

from sklearn.datasets import make_blobs
X, _ = make_blobs(n_samples=300, centers=4, random_state=42)
df = kmeans_with_metrics(X, range(2, 11))
print(df.round(3))
```
</details>
</details>
