---
Module: 4
Lesson Number: 6
Lesson Title: Clustering K-Means
Estimated Duration: 75 minutos
Prerequisites: L1 (Fundamentos de ML)
Learning Objectives:
  - Explicar el algoritmo K-Means y sus pasos
  - Determinar el número óptimo de clústeres usando el método del codo y el puntaje de silueta
  - Implementar clustering K-Means con scikit-learn
  - Interpretar centros de clúster y asignaciones
  - Distinguir entre aprendizaje supervisado y no supervisado
Keywords: K-Means, clustering, método del codo, puntaje de silueta, inercia, aprendizaje no supervisado
Difficulty: Intermedio
Programming Concepts: sklearn.cluster.KMeans, sklearn.metrics.silhouette_score
Mathematical Concepts: distancia euclidiana, inercia, suma de cuadrados intra-clúster
Machine Learning Concepts: aprendizaje no supervisado, clustering, centroide
Datasets Used: make_blobs, iris (no supervisado), segmentación de clientes sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Clustering K-Means

## Motivación

Una empresa de biotecnología tiene miles de perfiles de expresión génica de pacientes y quiere descubrir nuevos subtipos de enfermedades — sin datos etiquetados. Una empresa SaaS quiere agrupar clientes en segmentos para marketing dirigido — sin categorías predefinidas. Estos son problemas de *clustering*, y K-Means es el algoritmo más popular para resolverlos. A diferencia de las lecciones anteriores, no hay etiquetas que predecir; descubrimos estructura oculta en los datos.

## Panorama general

**Anterior:** Bosque Aleatorio (supervisado — predicción de etiquetas). **Esta lección:** K-Means (no supervisado — descubrimiento de grupos). **Siguiente:** PCA (no supervisado — reducción de dimensiones).

## Teoría

### ¿Qué es el Clustering?

El clustering agrupa muestras similares entre sí. Responde: "¿Qué grupos naturales existen en los datos?"

### Algoritmo K-Means

1. Elegí K (cantidad de clústeres)
2. Inicializá K centroides aleatoriamente
3. **Paso de asignación:** asigná cada punto al centroide más cercano
4. **Paso de actualización:** recalculá los centroides como la media de los puntos asignados
5. Repetí los pasos 3-4 hasta converger (los centroides dejan de cambiar)

### Métrica de distancia

K-Means usa distancia euclidiana:

$$d(\mathbf{x}, \boldsymbol{\mu}_k) = \sqrt{\sum_{j=1}^{p}(x_j - \mu_{kj})^2}$$

### Inercia (Suma de Cuadrados Intra-Clúster)

$$\text{Inercia} = \sum_{k=1}^{K}\sum_{i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|^2$$

La inercia mide qué tan compactos son los clústeres. Menor inercia → clústeres más ajustados.

### Cómo elegir K

**Método del codo:** Graficá inercia vs. K. Buscá el "codo" donde la inercia deja de disminuir bruscamente.

**Puntaje de silueta:** Mide qué tan similar es un punto a su propio clúster vs. otros clústeres. Varía de -1 a 1. Cuanto más alto, mejor.

$$s(i) = \frac{b(i) - a(i)}{\max\{a(i), b(i)\}}$$

Donde $a(i)$ es la distancia media a otros puntos en el mismo clúster, y $b(i)$ es la distancia media a puntos en el clúster diferente más cercano.

## Fundamento matemático

### K-Means como optimización

K-Means minimiza el objetivo de inercia:

$$\min_{\{\boldsymbol{\mu}_k\}} \sum_{k=1}^{K} \sum_{i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|^2$$

Este es un problema NP-difícil (exponencial en K y n). El algoritmo iterativo encuentra un mínimo local.

### Inicialización

La inicialización aleatoria puede llevar a resultados diferentes. **K-Means++** (valor por defecto en scikit-learn) inicializa los centroides separados para mejorar la convergencia.

## Explicación visual

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

fig, axes = plt.subplots(2, 3, figsize=(15, 10))

for i, K in enumerate([2, 3, 4, 5, 6, 8]):
    kmeans = KMeans(n_clusters=K, random_state=42, n_init=10)
    y_pred = kmeans.fit_predict(X)

    ax = axes[i // 3, i % 3]
    ax.scatter(X[:, 0], X[:, 1], c=y_pred, cmap='viridis', alpha=0.6)
    ax.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
               c='red', marker='x', s=200, linewidths=3)
    ax.set_title(f'K = {K}')
    ax.set_xlabel('Feature 1')
    ax.set_ylabel('Feature 2')

plt.tight_layout()
plt.savefig('figures/kmeans_different_k.png', dpi=150)
plt.show()
```

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs

# Generate data
X, y = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

# Elbow method
inertias = []
silhouettes = []
K_range = range(2, 11)

for K in K_range:
    kmeans = KMeans(n_clusters=K, random_state=42, n_init=10)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X, kmeans.labels_))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(K_range, inertias, 'o-')
axes[0].set_xlabel('K')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')
axes[0].grid(True)

axes[1].plot(K_range, silhouettes, 'o-')
axes[1].set_xlabel('K')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Score')
axes[1].grid(True)

plt.tight_layout()
plt.savefig('figures/elbow_silhouette.png', dpi=150)
plt.show()

# Best model
best_kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
best_kmeans.fit(X)
print(f"Cluster centers:\n{best_kmeans.cluster_centers_}")
print(f"Inertia: {best_kmeans.inertia_:.2f}")
print(f"Silhouette: {silhouette_score(X, best_kmeans.labels_):.3f}")
```

## Ejemplo guiado: Clustering de Iris

**Problema:** ¿Puede K-Means descubrir las 3 especies de Iris sin etiquetas?

```python
from sklearn.datasets import load_iris
iris = load_iris()
X = iris.data

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)

# Compare with true labels
print(pd.crosstab(iris.target, labels, rownames=['True'], colnames=['Cluster']))
```

**Resultado:** K-Means recupera las especies razonablemente bien (cierta confusión entre versicolor y virginica).

## Ejemplo en biotecnología: Subtipos de expresión génica

```python
np.random.seed(42)
n_patients, n_genes = 200, 500

# Simulate 3 disease subtypes
X_expr = np.random.randn(n_patients, n_genes)
X_expr[:70, :50] += 0.5  # Subtype 1
X_expr[70:130, 50:100] += 0.5  # Subtype 2
X_expr[130:, 100:150] += 0.5  # Subtype 3

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_expr)

# Create subtype labels
true_subtypes = np.array([0]*70 + [1]*60 + [2]*70)
print(pd.crosstab(true_subtypes, clusters, rownames=['True'], colnames=['Cluster']))
```

**Interpretación:** K-Means descubre los tres subtipos, potencialmente revelando subgrupos de enfermedades novedosos.

## Ejemplo en SaaS: Segmentación de clientes

```python
np.random.seed(42)
n_customers = 500

customers = pd.DataFrame({
    'annual_spend': np.random.exponential(1000, n_customers),
    'purchase_frequency': np.random.poisson(12, n_customers),
    'avg_order_value': np.random.normal(50, 20, n_customers),
    'tenure_months': np.random.exponential(24, n_customers),
})

scaler = StandardScaler()
X_scaled = scaler.fit_transform(customers)

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
customers['segment'] = kmeans.fit_predict(X_scaled)

# Analyze segments
segments = customers.groupby('segment').mean()
print(segments.round(1))
```

**Interpretación:** Segmento 0 = gastadores altos con alta frecuencia, Segmento 1 = clientes nuevos, etc.

## Errores comunes

1. **No escalar las características** — las características con unidades más grandes dominan los cálculos de distancia.
2. **Asumir que K es conocido** — usá siempre el codo + silueta para determinar K.
3. **Interpretar clústeres de forma causal** — los clústeres son geométricos, no necesariamente biológicos.
4. **Usar K-Means en altas dimensiones** — la distancia euclidiana pierde sentido en más de 50 dimensiones.
5. **Esperar clústeres del mismo tamaño** — K-Means tiende a producir clústeres balanceados.

## Buenas prácticas

- Escalá siempre las características (StandardScaler) antes de clusterizar
- Usá inicialización K-Means++ (valor por defecto en sklearn)
- Ejecutá múltiples inicializaciones (n_init=10)
- Usá el codo + silueta juntos para elegir K
- Probá t-SNE o PCA para visualizar clústeres de alta dimensionalidad

## Resumen

- K-Means agrupa datos en K clústeres minimizando la inercia
- Algoritmo: asignar → actualizar → repetir
- El método del codo + puntaje de silueta eligen K
- Las características deben escalarse
- El clustering descubre estructura oculta sin etiquetas
- Útil para estratificación de pacientes, segmentación de clientes

## Términos clave

| Término | Definición |
|---------|------------|
| Centroide | Centro de un clúster (media de sus puntos) |
| Inercia | Suma de distancias al cuadrado desde los puntos a los centroides |
| Método del codo | Elegir K donde la mejora de inercia se desacelera |
| Puntaje de silueta | Medida de cohesión del clúster vs. separación |
| K-Means++ | Inicialización inteligente de centroides |
| WCSS | Suma de cuadrados intra-clúster (inercia) |

## Ejercicios

**Nivel 1 — Básico:** ¿Cuál es la diferencia principal entre aprendizaje supervisado y no supervisado? Dá un ejemplo de cada uno.

**Nivel 2 — Implementación:** Generá datos sintéticos con `make_blobs(n_samples=500, centers=5)`. Aplicá K-Means con K=2..10, graficá las curvas de codo y silueta, y determiná el K óptimo.

**Nivel 3 — Pensamiento crítico:** Tu análisis de K-Means en datos de pacientes produce 3 clústeres. Un médico dice que el clúster 2 es biológicamente significativo. ¿Cómo validarías si los clústeres representan biología real o solo artefactos estadísticos?

## Desafío de programación

Escribí una función `optimal_k(X, max_k=10)` que calcule la inercia y el puntaje de silueta para K=2..max_k y devuelva el K óptimo según ambos métodos (si coinciden) o reporte un conflicto.
