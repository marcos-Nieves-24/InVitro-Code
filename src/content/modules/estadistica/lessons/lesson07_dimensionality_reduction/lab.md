```python
# =========================================================================
# LAB 7: Reduccion de dimensionalidad con PCA
# -------------------------------------------------------------------------
# Aplicamos PCA al dataset iris: varianza explicada, proyeccion 2D y
# analisis de las cargas de los componentes. Cada figura termina con
# fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Cargar iris y estandarizar los features.
import numpy as np                         # Operaciones matematicas
import pandas as pd                        # DataFrames y manipulacion
import plotly.express as px                # Graficos interactivos
from sklearn.datasets import load_iris  # Cargar datasets de ejemplo
from sklearn.preprocessing import StandardScaler  # Preprocesamiento (escalado, etc.)
from sklearn.decomposition import PCA  # Reduccion de dimensionalidad (PCA)

iris = load_iris()
X = iris.data
y = iris.target
nombres = iris.target_names
features = iris.feature_names

escalador = StandardScaler()
X_std = escalador.fit_transform(X)
print("Datos estandarizados:", X_std.shape)
print("Media por feature (aprox 0):", np.round(X_std.mean(axis=0), 3))
print("Desvio por feature (aprox 1):", np.round(X_std.std(axis=0), 3))

# PASO 2: Aplicar PCA conservando todos los componentes.
pca = PCA(n_components=4)
X_pca = pca.fit_transform(X_std)

print("\nVarianza explicada por componente:")
print(np.round(pca.explained_variance_ratio_, 4))
print("Varianza acumulada:", np.round(np.cumsum(pca.explained_variance_ratio_), 4))

# PASO 3: Scree plot de la varianza explicada (individual y acumulada).
print("\nScree plot de la varianza explicada:")
componentes = [f"PC{i+1}" for i in range(4)]
fig = px.bar(x=componentes, y=pca.explained_variance_ratio_,
             title="Varianza explicada por cada componente")
fig.add_scatter(x=componentes, y=np.cumsum(pca.explained_variance_ratio_),
                mode="lines+markers", name="Acumulada")
fig.show()                                 # Mostrar grafico interactivo

# PASO 4: Proyeccion en 2D coloreada por especie.
print("\nProyeccion PCA 2D coloreada por especie:")
df_pca = pd.DataFrame({"PC1": X_pca[:, 0], "PC2": X_pca[:, 1],
                       "especie": [nombres[i] for i in y]})
fig = px.scatter(df_pca, x="PC1", y="PC2", color="especie",
                 title="Proyeccion PCA 2D del dataset iris")
fig.show()                                 # Mostrar grafico interactivo

# PASO 5: Analisis de cargas (contribucion de cada feature).
cargas = pd.DataFrame(pca.components_.T,
                      index=features,
                      columns=[f"PC{i+1}" for i in range(4)])
print("\nCargas de PC1 y PC2 (por feature):")
print(cargas[["PC1", "PC2"]].round(3))
print("\nFeature con mayor carga en PC1:", cargas["PC1"].abs().idxmax())

fig = px.imshow(cargas, text_auto=".2f", color_continuous_scale="RdBu_r",
                title="Heatmap de las cargas de los componentes")
fig.show()                                 # Mostrar grafico interactivo

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Los primeros 2 PCs explican la mayor parte de la varianza.")
print("PC1 separa la especie setosa del resto; las cargas muestran que feature pesa mas.")
```