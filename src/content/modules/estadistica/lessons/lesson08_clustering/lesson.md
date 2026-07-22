---
Module: 3
Lesson Number: 8
Lesson Title: Clustering (K-Means)
Estimated Duration: 90 minutos
Prerequisites: Lección 1 (Estadística Descriptiva), Lección 5 (Relaciones)
Learning Objectives:
  - Explicar el algoritmo de clustering K-Means y su intuición
  - Determinar el número óptimo de clusters usando el método del codo y el puntaje de silueta
  - Implementar clustering K-Means usando sklearn.cluster.KMeans
  - Visualizar resultados de clustering con PCA
  - Interpretar las características de los clusters
Keywords: K-Means, clustering, método del codo, puntaje de silueta, aprendizaje no supervisado, centroide
Difficulty: Intermedio
Programming Concepts: sklearn.cluster.KMeans, numpy, pandas, matplotlib
Mathematical Concepts: distancia euclídea, inercia, suma de cuadrados intra-cluster
Machine Learning Concepts: aprendizaje no supervisado, clustering, segmentación
Datasets Used: iris, pingüinos, clientes de centro comercial (sintético)
Notebook: 08_clustering.ipynb
Assignment: clustering_assignment.md
Quiz: clustering_quiz.md
---

# Lección 8: Clustering (K-Means)

## Motivación

No todos los datos vienen con etiquetas. En muchos escenarios del mundo real — segmentación de clientes, análisis de expresión génica, compresión de imágenes — necesitamos descubrir grupos dentro de los datos sin conocimiento previo. Los algoritmos de clustering encuentran estos grupos automáticamente. K-Means es el algoritmo de clustering más usado debido a su simplicidad, velocidad e interpretabilidad.

En biotecnología, el clustering identifica subgrupos de pacientes con perfiles moleculares similares (medicina de precisión). En SaaS, el clustering segmenta usuarios para marketing dirigido y experiencias personalizadas.

## Panorama General

Esta lección introduce el aprendizaje no supervisado, un paradigma central de ML. Se basa en la estadística descriptiva (Lección 1 — distancias) y relaciones (Lección 5 — similitud). Se conecta con la Lección 7 (PCA), que se usa a menudo para visualizar clusters. K-Means reaparecerá en el Módulo 4 como un algoritmo de aprendizaje no supervisado.

## Teoría

### Algoritmo K-Means

**Objetivo**: Particionar \(n\) observaciones en \(k\) clusters, donde cada observación pertenece al cluster con el centroide más cercano.

**Algoritmo**:
1. Inicializar \(k\) centroides (aleatoriamente o con k-means++)
2. Asignar cada punto al centroide más cercano
3. Recalcular centroides como la media de los puntos asignados
4. Repetir pasos 2-3 hasta convergencia

**Objetivo (Inercia)**: Minimizar la suma de cuadrados intra-cluster:

$$\text{Inercia} = \sum_{i=1}^{k} \sum_{x \in C_i} \| x - \mu_i \|^2$$

Donde \(\mu_i\) es el centroide del cluster \(C_i\).

Intuición: K-Means encuentra clusters circulares de tamaño similar. Los puntos dentro de un cluster están cerca entre sí y de su centroide.

### Elección de k: Método del Codo

Trazar la inercia vs k. El "codo" (donde la curva se aplana) sugiere el k óptimo.

Intuición: Agregar más clusters siempre reduce la inercia, pero después del k óptimo, la mejora se vuelve marginal.

### Elección de k: Puntaje de Silueta

Para cada punto, el puntaje de silueta mide qué tan similar es a su propio cluster vs otros clusters:

$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$

Donde \(a(i)\) es la distancia promedio a los puntos del mismo cluster, y \(b(i)\) es la distancia promedio a los puntos del cluster diferente más cercano.

- La silueta va de [-1, 1]
- > 0.5: Buen clustering
- > 0.25: Estructura razonable
- < 0: Los puntos podrían estar en el cluster equivocado

### Inicialización K-Means++

Inicialización inteligente de centroides que separa los centroides iniciales, mejorando la convergencia y los resultados. Es el valor predeterminado en sklearn.

## Implementación en Python

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import seaborn as sns

# Cargar datos
iris = sns.load_dataset('iris')
X = iris.drop('species', axis=1)

# Estandarizar
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Método del codo
inertias = []
silhouettes = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels))

# Graficar
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('Número de Clusters (k)')
axes[0].set_ylabel('Inercia')
axes[0].set_title('Método del Codo')
axes[0].axvline(3, color='red', linestyle='--', alpha=0.5)

axes[1].plot(K_range, silhouettes, 'ro-')
axes[1].set_xlabel('Número de Clusters (k)')
axes[1].set_ylabel('Puntaje de Silueta')
axes[1].set_title('Análisis de Silueta')
axes[1].axvline(3, color='blue', linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()

# Aplicar K-Means con k óptimo
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
iris['cluster'] = kmeans.fit_predict(X_scaled)

# Comparar con etiquetas reales
cross_tab = pd.crosstab(iris['species'], iris['cluster'])
print("Tabla cruzada (Especie vs Cluster):")
print(cross_tab)

# Visualizar clusters usando PCA
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=iris['cluster'],
                      cmap='viridis', alpha=0.7)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            c='red', marker='X', s=200, label='Centroides')
plt.xlabel('CP1')
plt.ylabel('CP2')
plt.title('Clusters K-Means (Dataset Iris)')
plt.legend()
plt.show()
```

## Ejemplo Guiado

Segmentación de clientes para un negocio minorista.

```python
from sklearn.datasets import make_blobs

# Generar datos sintéticos de clientes
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=1.5, random_state=42)
customer_df = pd.DataFrame(X, columns=['annual_income', 'spending_score'])

# Determinar k óptimo
inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

plt.figure(figsize=(8, 4))
plt.plot(range(1, 11), inertias, 'bo-')
plt.axvline(4, color='red', linestyle='--')
plt.xlabel('k')
plt.ylabel('Inercia')
plt.title('Método del Codo para Segmentación de Clientes')
plt.show()

# Aplicar K-Means
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
customer_df['segment'] = kmeans.fit_predict(X)

plt.figure(figsize=(8, 6))
plt.scatter(X[:, 0], X[:, 1], c=customer_df['segment'], cmap='viridis', alpha=0.7)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            c='red', marker='X', s=200)
plt.xlabel('Ingreso Anual')
plt.ylabel('Puntaje de Gasto')
plt.title('Segmentos de Clientes')
plt.show()

# Perfiles de segmentos
print("\nPerfiles de Segmentos:")
print(customer_df.groupby('segment').mean())
```

Interpretación: Surgen cuatro segmentos de clientes: ingresos altos-gasto alto, ingresos altos-gasto bajo, ingresos bajos-gasto alto e ingresos bajos-gasto bajo.

## Ejemplo de Biotecnología

Clustering de perfiles de expresión génica de pacientes.

```python
np.random.seed(42)
n_patients = 100
n_genes = 50

expression = np.random.randn(n_patients, n_genes)
# Crear 3 subtipos
expression[:30, :20] += 2  # Subtype A / Subtipo A
expression[30:65, 20:35] -= 1.5  # Subtype B / Subtipo B
expression[65:, 35:] += 1  # Subtype C / Subtipo C

true_subtypes = ['A'] * 30 + ['B'] * 35 + ['C'] * 35

# PCA + K-Means
pca = PCA(n_components=10)
expr_pca = pca.fit_transform(expression)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
predicted_clusters = kmeans.fit_predict(expr_pca)

# Visualize
pca_2d = PCA(n_components=2)
expr_2d = pca_2d.fit_transform(expression)

plt.figure(figsize=(8, 6))
plt.scatter(expr_2d[:, 0], expr_2d[:, 1], c=predicted_clusters, cmap='viridis', alpha=0.7)
plt.title('Clusters de Pacientes Basados en Expresión Génica')
plt.xlabel('CP1')
plt.ylabel('CP2')
plt.show()

# Evaluar vs etiquetas reales
from sklearn.metrics import adjusted_rand_score
print(f"Índice de Rand Ajustado: {adjusted_rand_score(true_subtypes, predicted_clusters):.3f}")
```

## Ejemplo SaaS

Segmentación de comportamiento de usuarios.

```python
np.random.seed(42)
n_users = 1000
user_data = pd.DataFrame({
    'avg_session_min': np.random.exponential(15, n_users),
    'logins_per_week': np.random.poisson(4, n_users),
    'features_used': np.random.poisson(6, n_users),
    'support_tickets': np.random.poisson(0.5, n_users)
})

scaler = StandardScaler()
user_scaled = scaler.fit_transform(user_data)

# Encontrar k óptimo
sil_scores = []
for k in range(2, 9):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(user_scaled)
    sil_scores.append(silhouette_score(user_scaled, labels))

optimal_k = range(2, 9)[np.argmax(sil_scores)]
print(f"k óptimo (silueta): {optimal_k}")

kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
user_data['segment'] = kmeans.fit_predict(user_scaled)

print("\nPerfiles de Segmentos:")
print(user_data.groupby('segment').describe().round(1))
```

## Errores Comunes

1. **No estandarizar las features**: K-Means usa distancia euclídea; las features en escalas más grandes dominan.
2. **Asumir que se conoce k**: Validá siempre k con el método del codo y el puntaje de silueta.
3. **Usar K-Means para clusters no esféricos**: K-Means encuentra clusters circulares. Usá DBSCAN para formas arbitrarias.
4. **Interpretar clusters sin validación del dominio**: Los clusters son construcciones matemáticas — verificá que tengan sentido.
5. **Ejecutar K-Means una sola vez**: Los resultados dependen de la inicialización; usá `n_init=10` y establecé `random_state`.

## Mejores Prácticas

- Estandarizá siempre las features antes de clusterizar
- Usá inicialización k-means++ (predeterminada en sklearn)
- Validá k con los métodos del codo y de silueta
- Visualizá los clusters con PCA
- Perfilá cada cluster para entender sus características
- Ejecutá K-Means múltiples veces con diferentes semillas

## Resumen

- K-Means particiona datos en k grupos basados en la distancia euclídea a los centroides
- El método del codo traza la inercia vs k para encontrar el k óptimo
- El puntaje de silueta mide la calidad del cluster (-1 a 1)
- Estandarizá siempre los datos antes de K-Means
- K-Means funciona mejor para clusters esféricos y bien separados

## Términos Clave

| Término | Definición |
|---------|------------|
| K-Means | Algoritmo de clustering basado en particiones |
| Centroide | Centro de un cluster (media de los puntos asignados) |
| Inercia | Suma de distancias al cuadrado de los puntos a su centroide |
| Método del Codo | Técnica para encontrar k localizando el codo en la curva de inercia |
| Puntaje de Silueta | Medida de cohesión y separación del cluster |
| K-Means++ | Método de inicialización inteligente de centroides |
| Aprendizaje No Supervisado | Aprendizaje sin datos etiquetados |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. Explicá el algoritmo K-Means en 3 pasos.
2. ¿Qué significa un puntaje de silueta de -0.1? ¿Y de 0.7?

**Nivel 2: Implementación**

3. Cargá el dataset de pingüinos, estandarizá las features numéricas y aplicá K-Means con k=3. Compará las asignaciones de clusters con las especies reales usando una tabla cruzada.
4. Para el dataset iris, calculá los puntajes de silueta para k=2 a k=8. ¿Qué k es óptimo?

**Nivel 3: Pensamiento Crítico**

5. Un bioinformático aplica K-Means a datos de RNA-seq de célula única y obtiene clusters que no coinciden con los tipos celulares conocidos. ¿Qué podría explicar esto? Sugerí tres verificaciones de diagnóstico.
6. ¿Por qué K-Means falla en datos con clusters alargados o de forma irregular? ¿Qué algoritmo alternativo funcionaría mejor?

## Desafío de Programación

Escribí un script en Python que:
1. Genere datos sintéticos con `make_blobs` (4 centros, diferentes desviaciones estándar)
2. Pruebe k = 2 a k = 8 usando el método del codo y el puntaje de silueta
3. Trace ambas métricas lado a lado
4. Aplique K-Means con el k óptimo
5. Visualice los clusters (use PCA si hay más de 2 features)
6. Imprima las coordenadas de los centroides y los tamaños de los clusters
7. Cree una tabla de perfiles que muestre los valores medios de las features por cluster
