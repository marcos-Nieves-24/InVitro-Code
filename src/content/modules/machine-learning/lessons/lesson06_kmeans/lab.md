```python
# =========================================================================
# LAB 6: Agrupamiento K-Means
# -------------------------------------------------------------------------
# Buscamos la K optima con inercia y silueta, visualizamos los clusters
# con sus centroides, agrupamos iris escalado con una tabla cruzada y
# cerramos con datos de alta dimensionalidad proyectados con PCA.
# =========================================================================

# PASO 1: Datos sinteticos con 5 grupos reales.
# Generamos 400 puntos alrededor de 5 centroides con dispersion controlada.
import numpy as np
from sklearn.datasets import make_blobs, load_iris
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

np.random.seed(42)
X, y_true = make_blobs(n_samples=400, centers=5, cluster_std=0.9,
                       random_state=42)

inercia = []
silueta = []
Ks = list(range(2, 11))
for k in Ks:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    etiquetas = km.fit_predict(X)
    inercia.append(km.inertia_)
    silueta.append(silhouette_score(X, etiquetas))
print("PASO 1 - K optima segun silueta:", Ks[int(np.argmax(silueta))])

# PASO 2: Curvas de inercia y silueta.
# La inercia siempre baja; la silueta indica la cohesion entre clusters.
import plotly.express as px

fig = px.line(x=Ks, y=inercia,
              labels={"x": "K", "y": "Inercia"},
              title="Metodo del codo (inercia)")
fig.show()

fig = px.line(x=Ks, y=silueta,
              labels={"x": "K", "y": "Silhouette"},
              title="Silhouette segun K")
fig.show()
print("PASO 2 - El codo y la silueta sugieren K=5.")

# PASO 3: Clusters finales con K=5 y sus centroides.
# Coloreamos cada punto por su cluster y superponemos los centroides.
import plotly.graph_objects as go

km_final = KMeans(n_clusters=5, n_init=10, random_state=42)
etiquetas = km_final.fit_predict(X)

fig = px.scatter(x=X[:, 0], y=X[:, 1], color=etiquetas.astype(str),
                 title="Clusters K-Means (K=5)",
                 labels={"x": "Feature 1", "y": "Feature 2"})
fig.add_trace(go.Scatter(x=km_final.cluster_centers_[:, 0],
                         y=km_final.cluster_centers_[:, 1],
                         mode="markers",
                         marker=dict(symbol="x", size=14, color="black"),
                         name="Centroides"))
fig.update_layout(showlegend=False)
fig.show()
print("PASO 3 - Los centroides (X negros) marcan el nucleo de cada cluster.")

# PASO 4: Iris escalado con K=3 y tabla cruzada.
# Escalar evita que una feature domine la distancia euclidiana.
iris = load_iris()
X_iris = StandardScaler().fit_transform(iris.data)
km_iris = KMeans(n_clusters=3, n_init=10, random_state=42)
etiquetas_iris = km_iris.fit_predict(X_iris)

tabla = np.zeros((3, 3), dtype=int)
for real, pred in zip(iris.target, etiquetas_iris):
    tabla[real, pred] += 1
print("PASO 4 - Tabla cruzada (filas: especie, columnas: cluster)")
print(tabla)

# PASO 5: Alta dimensionalidad + PCA.
# K-Means sigue funcionando en 50 dimensiones; PCA ayuda a visualizarlo.
X_alto, y_alto = make_blobs(n_samples=200, n_features=50, centers=4,
                            random_state=42)
km_alto = KMeans(n_clusters=4, n_init=10, random_state=42)
etiquetas_alto = km_alto.fit_predict(X_alto)
sil = silhouette_score(X_alto, etiquetas_alto)
print(f"PASO 5 - Silhouette en 50 dimensiones: {sil:.3f}")

proyeccion = PCA(n_components=2).fit_transform(X_alto)
fig = px.scatter(x=proyeccion[:, 0], y=proyeccion[:, 1],
                 color=etiquetas_alto.astype(str),
                 title="Clusters en 50D proyectados con PCA",
                 labels={"x": "PC1", "y": "PC2"})
fig.show()
```