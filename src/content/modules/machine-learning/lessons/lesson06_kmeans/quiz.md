# Quiz: Agrupamiento K-Means

## Opción múltiple (5 preguntas)

**Q1.** ¿Cuál de las siguientes describe mejor el aprendizaje no supervisado?

a) El modelo aprende de datos etiquetados para predecir resultados
b) El modelo descubre patrones en los datos sin etiquetas
c) El modelo recibe feedback sobre cada predicción
d) El modelo requiere un set de validación para el ajuste

<details><summary>Respuesta</summary>b) El modelo descubre patrones en los datos sin etiquetas</details>

**Q2.** En K-Means, el "paso de asignación" consiste en:

a) Inicializar centroides al azar
b) Asignar cada punto al centroide más cercano
c) Calcular la media de todos los puntos del dataset
d) Actualizar el número de clusters

<details><summary>Respuesta</summary>b) Asignar cada punto al centroide más cercano</details>

**Q3.** El método del codo para elegir K implica:

a) Seleccionar la K donde la exactitud es mayor
b) Seleccionar la K donde agregar más clusters da rendimientos decrecientes en la reducción de la inercia
c) Seleccionar la K que maximiza el número de clusters
d) Seleccionar K al azar y probar de forma iterativa

<details><summary>Respuesta</summary>b) Seleccionar la K donde agregar más clusters da rendimientos decrecientes en la reducción de la inercia</details>

**Q4.** Un silhouette score de -0.2 para un punto indica:

a) El punto está bien agrupado
b) El punto probablemente está asignado al cluster incorrecto
c) Los datos tienen demasiadas dimensiones
d) K es demasiado pequeña

<details><summary>Respuesta</summary>b) El punto probablemente está asignado al cluster incorrecto (la silueta va de -1 a 1; un valor negativo significa que el punto está más cerca de otro cluster)</details>

**Q5.** ¿Por qué es importante el escalado de features en K-Means?

a) Acelera el algoritmo
b) Las features con unidades más grandes dominarían el cálculo de distancia
c) Garantiza encontrar el óptimo global
d) No es importante — K-Means maneja la escala automáticamente

<details><summary>Respuesta</summary>b) Las features con unidades más grandes dominarían el cálculo de la distancia euclidiana, haciendo que el algoritmo ignore efectivamente las features de menor escala</details>

## Respuesta corta (2 preguntas)

**Q6.** Explicá la diferencia entre la inercia y el silhouette score. ¿Cuándo podría ser engañoso cada uno?

<details><summary>Respuesta</summary>La inercia mide qué tan compactos son los clusters (suma de distancias al cuadrado a los centroides). Siempre decrece a medida que K aumenta (eventualmente a 0 cuando K=n). Puede ser engañosa porque favorece muchos clusters pequeños. La silueta mide tanto la cohesión (dentro del cluster) como la separación (entre clusters). Un punto con silueta negativa probablemente está en el cluster incorrecto. La silueta puede ser engañosa en clusters muy pequeños o de forma irregular.</details>

**Q7.** ¿Por qué K-Means a veces produce resultados diferentes cuando se corre varias veces sobre los mismos datos?

<details><summary>Respuesta</summary>K-Means depende de la inicialización aleatoria de los centroides. Diferentes posiciones iniciales llevan a diferentes mínimos locales del objetivo de inercia (el problema es NP-hard). La inicialización K-Means++ (la de sklearn por defecto) ayuda pero no garantiza el óptimo global. Usar n_init=10 corre el algoritmo 10 veces y devuelve el mejor resultado.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función en Python `kmeans_with_metrics(X, K_range)` que realice K-Means para cada K en K_range, calcule la inercia y los silhouette scores, y devuelva un DataFrame con las columnas ['K', 'inertia', 'silhouette'].

<details><summary>Respuesta</summary>

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
