```python
# =========================================================================
# LAB 8: Clustering con K-Means
# -------------------------------------------------------------------------
# Buscamos el k optimo con inercia y silhouette sobre blobs sinteticos y
# luego agrupamos el dataset iris, comparando con las especies reales.
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Generar datos sinteticos con make_blobs (400 puntos, 5 centros).
import numpy as np                         # Operaciones matematicas
import pandas as pd                        # DataFrames y manipulacion
import plotly.express as px                # Graficos interactivos
from sklearn.datasets import make_blobs, load_iris  # Cargar datasets de ejemplo
from sklearn.preprocessing import StandardScaler  # Preprocesamiento (escalado, etc.)
from sklearn.cluster import KMeans  # Algoritmos de clustering
from sklearn.metrics import silhouette_score  # Metricas de evaluacion

np.random.seed(42)                         # Fijar semilla para reproducibilidad
X, y_true = make_blobs(n_samples=400, centers=5, cluster_std=1.2, random_state=42)
print("Blobs generados:", X.shape, "- centros reales:", len(np.unique(y_true)))

# PASO 2: Inercia y silhouette para k = 2 a 8.
ks = list(range(2, 9))
inercia = []
sil = []
for k in ks:
    modelo = KMeans(n_clusters=k, n_init=10, random_state=42)
    etiquetas = modelo.fit_predict(X)
    inercia.append(modelo.inertia_)
    sil.append(silhouette_score(X, etiquetas))
    print(f"k={k}: inercia={modelo.inertia_:.1f}, silhouette={sil[-1]:.3f}")

# PASO 3: Curva del codo e silhouette por k.
print("\nCurva del codo (inercia vs k):")
fig = px.line(x=ks, y=inercia, markers=True,
              title="Curva del codo (inercia vs k)",
              labels={"x": "k", "y": "Inercia"})
fig.show()                                 # Mostrar grafico interactivo

fig = px.line(x=ks, y=sil, markers=True,
              title="Silhouette score vs k",
              labels={"x": "k", "y": "Silhouette"})
fig.show()                                 # Mostrar grafico interactivo

# PASO 4: Aplicar K-Means con el k optimo y visualizar los clusters.
print("\nGraficando los clusters finales con sus centroides:")
k_optimo = 5
modelo = KMeans(n_clusters=k_optimo, n_init=10, random_state=42)
etiquetas = modelo.fit_predict(X)

df_blobs = pd.DataFrame({"x": X[:, 0], "y": X[:, 1], "cluster": etiquetas})
fig = px.scatter(df_blobs, x="x", y="y", color="cluster",
                 title=f"Clusters de K-Means (k={k_optimo})")
fig.add_scatter(x=modelo.cluster_centers_[:, 0],
                y=modelo.cluster_centers_[:, 1],
                mode="markers", marker=dict(size=14, symbol="x", color="black"),
                name="Centroides")
fig.show()                                 # Mostrar grafico interactivo

# PASO 5: K-Means sobre iris estandarizado con k = 3.
iris = load_iris()
escalador = StandardScaler()
X_iris = escalador.fit_transform(iris.data)

modelo_iris = KMeans(n_clusters=3, n_init=10, random_state=42)
etiquetas_iris = modelo_iris.fit_predict(X_iris)
print("\nSilhouette sobre iris (k=3):",
      round(silhouette_score(X_iris, etiquetas_iris), 3))

# PASO 6: Tabla de contingencia clusters vs especies reales.
tabla = pd.crosstab(etiquetas_iris, iris.target)
tabla.columns = [f"especie_{n}" for n in iris.target_names]
print("\nTabla de contingencia (clusters vs especies):")
print(tabla)

# PASO 7: Visualizar los clusters de iris proyectados con PCA.
print("\nClusters de iris en el plano PCA:")
from sklearn.decomposition import PCA  # Reduccion de dimensionalidad (PCA)

pca = PCA(n_components=2)
X_2d = pca.fit_transform(X_iris)
df_iris = pd.DataFrame({"PC1": X_2d[:, 0], "PC2": X_2d[:, 1],
                        "cluster": etiquetas_iris})
fig = px.scatter(df_iris, x="PC1", y="PC2", color="cluster",
                 title="Clusters de iris proyectados con PCA")
fig.show()                                 # Mostrar grafico interactivo

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("El codo y el silhouette sugieren un k optimo cercano a 5 para los blobs.")
print("En iris, K-Means separa setosa claramente y distingue casi del todo al resto.")
```