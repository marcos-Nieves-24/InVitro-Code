# Quiz: Clustering (K-Means)

## Opción múltiple (5 preguntas)

**1. K-Means es un ejemplo de:**

a) Aprendizaje supervisado
b) Aprendizaje no supervisado
c) Aprendizaje por refuerzo
d) Aprendizaje semi-supervisado

**2. La inercia de una solución de K-Means mide:**

a) La distancia entre los centroides de los clusters
b) La suma de las distancias al cuadrado desde los puntos hasta su centroide
c) El silhouette score
d) La cantidad de iteraciones

**3. Un silhouette score cercano a 1 indica:**

a) Que los puntos pueden estar en el cluster equivocado
b) Que los puntos están bien emparejados con su propio cluster y mal emparejados con los clusters vecinos
c) Que el algoritmo de clustering falló
d) Que los datos no tienen clusters naturales

**4. ¿Cuál de los siguientes NO es un método para determinar el k óptimo?**

a) Método del codo
b) Análisis de silhouette
c) El p-valor del clustering
d) Estadístico de brecha (gap statistic)

**5. K-Means funciona mejor para clusters que son:**

a) Esféricos y de tamaño similar
b) De forma irregular
c) Jerárquicos
d) Superpuestos

## Respuesta corta (2 preguntas)

**6.** ¿Por qué es importante estandarizar los features antes de aplicar K-Means?

**7.** Un bioinformático aplica K-Means a datos de single-cell RNA-seq y encuentra clusters que no coinciden con los tipos celulares conocidos. Mencioná tres explicaciones posibles.

## Pregunta de código (1 pregunta)

**8.** Escribí código en Python usando sklearn que:
- Genere datos sintéticos con `make_blobs` (300 muestras, 3 centros)
- Aplique K-Means con k=3
- Calcule e imprima el silhouette score

---

# Clave de respuestas

1. b) Aprendizaje no supervisado
2. b) La suma de las distancias al cuadrado desde los puntos hasta su centroide
3. b) Que los puntos están bien emparejados con su propio cluster y mal emparejados con los clusters vecinos
4. c) El p-valor del clustering
5. a) Esféricos y de tamaño similar

6. K-Means usa la distancia euclidiana. Los features con escalas más grandes dominarán el cálculo de la distancia. La estandarización asegura que todos los features contribuyan por igual.

7. (1) Los subtipos biológicos reales no son esféricos (K-Means asume clusters esféricos). (2) El ruido técnico o los efectos de lote pueden dominar el clustering. (3) Los datos pueden necesitar primero una normalización o transformación.

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
