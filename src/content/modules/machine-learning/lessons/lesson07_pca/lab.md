```python
# =========================================================================
# LAB 7: PCA - reduccion de dimensionalidad
# -------------------------------------------------------------------------
# Estandarizamos el dataset de cancer de mama, aplicamos PCA y analizamos
# la varianza explicada, la proyeccion 2D y las cargas de los componentes.
# =========================================================================

# PASO 1: Carga y estandarizacion.
# PCA maximiza la varianza: sin escalar, las features con mayor magnitud
# dominarian el resultado.
import numpy as np                         # Operaciones matematicas
from sklearn.datasets import load_breast_cancer  # Cargar datasets de ejemplo
from sklearn.preprocessing import StandardScaler  # Preprocesamiento (escalado, etc.)
from sklearn.decomposition import PCA  # Reduccion de dimensionalidad (PCA)

cancer = load_breast_cancer()
X = StandardScaler().fit_transform(cancer.data)
y = cancer.target
nombres = cancer.feature_names

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)
print("PASO 1 - Varianza explicada por los 2 componentes:")
print(pca.explained_variance_ratio_)
print(f"Total capturado: {pca.explained_variance_ratio_.sum():.3f}")

# PASO 2: Scree plot con varianza acumulada.
# El scree plot muestra cuantas componentes hacen falta para un umbral.
pca_full = PCA()
pca_full.fit(X)
varianza = pca_full.explained_variance_ratio_
acumulada = np.cumsum(varianza)

print(f"PASO 2 - Componentes para 90%: {int(np.argmax(acumulada >= 0.90) + 1)}")
print(f"Componentes para 95%: {int(np.argmax(acumulada >= 0.95) + 1)}")

import plotly.express as px                # Graficos interactivos

fig = px.bar(x=list(range(1, len(varianza) + 1)), y=varianza,
             labels={"x": "Componente", "y": "Varianza explicada"},
             title="Scree plot - varianza explicada")
fig.add_scatter(x=list(range(1, len(acumulada) + 1)), y=acumulada,
                mode="lines", name="Acumulada")
fig.update_layout(legend_title="Curva")
fig.show()                                 # Mostrar grafico interactivo

# PASO 3: Proyeccion 2D coloreada por clase.
# Si el PCA separa visualmente las clases, los datos son distinguibles.
fig = px.scatter(x=X_pca[:, 0], y=X_pca[:, 1], color=y.astype(str),
                 labels={"x": "PC1", "y": "PC2"},
                 title="Proyeccion PCA 2D - cancer de mama")
fig.show()                                 # Mostrar grafico interactivo
print("PASO 3 - PC1 separa claramente benigno de maligno.")

# PASO 4: Cargas de los componentes.
# Las cargas indican que features originales pesan mas en cada componente.
cargas = pca.components_
indices = np.argsort(np.abs(cargas[0]))[::-1][:5]
print("PASO 4 - Top 5 cargas de PC1:")
for i in indices:
    print(f"  {nombres[i]}: {cargas[0][i]:.3f}")

fig = px.bar(x=nombres[indices], y=np.abs(cargas[0][indices]),
             labels={"x": "Feature", "y": "|Carga| en PC1"},
             title="Cargas absolutas de PC1")
fig.show()                                 # Mostrar grafico interactivo
```