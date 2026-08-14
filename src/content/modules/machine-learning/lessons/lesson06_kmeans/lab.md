# Lab 6: Agrupamiento K-Means

## Objetivos

- Implementá K-Means con scikit-learn
- Determiná la K óptima usando el codo y la silueta
- Entendé el efecto del escalado
- Aplicá el agrupamiento a segmentos del mundo real

## Parte 1: Datos sintéticos

Generá datos con `make_blobs(n_samples=400, centers=5, cluster_std=0.9)`. Corré K-Means con K=2 hasta K=10. Graficá la inercia y los silhouette scores.

**Preguntas:**
- ¿Qué K sugiere el codo?
- ¿Qué K sugiere la silueta?
- ¿Coinciden?

## Parte 2: Experimento de escalado

Creá datos donde una feature tenga 100× la escala de otra:
```python
X_unscaled = np.column_stack([np.random.randn(200) * 100, np.random.randn(200)])
```

Corré K-Means (K=3) con y sin StandardScaler. Graficá ambos resultados lado a lado.

**Pregunta:** ¿Cómo cambia el escalado el agrupamiento?

## Parte 3: Agrupamiento de Iris

Cargá `load_iris()`, escalá las features, corré K-Means (K=3) y creá una tabla cruzada de las especies reales vs. las etiquetas de los clusters.

**Pregunta:** ¿Qué especie confunde K-Means con más frecuencia?

## Parte 4: Segmentación de clientes

Creá datos sintéticos de clientes (n=500) con las features: spending score, frecuencia de compra, recencia. Escalá, agrupá y perfila cada segmento (valores medios).

**Pregunta:** ¿Podés nombrar cada segmento (p. ej., "high-value loyal", "dormant", "new")?

## Parte 5: Agrupamiento de alta dimensionalidad

Generá datos con `make_blobs(n_samples=200, n_features=50, centers=4)`. Calculá la silueta para K=2..10. Compará con la visualización 2D de PCA.

```python
from sklearn.decomposition import PCA
```

**Pregunta:** ¿Sigue funcionando bien K-Means en 50 dimensiones?

## Entregables

- Notebook con las 5 partes
- Gráficos de codo + silueta (Parte 1)
- Gráfico de comparación de escalado (Parte 2)
- Perfiles de segmentos (Parte 4)

## Tiempo estimado: 45 minutos
