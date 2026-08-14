# Quiz: PCA

## Opción múltiple (5 preguntas)

**Q1.** ¿Cuál es el objetivo principal de PCA?

a) Predecir una variable objetivo
b) Encontrar las direcciones de máxima varianza en los datos
c) Agrupar puntos de datos similares
d) Seleccionar las features originales más importantes

<details><summary>Respuesta</summary>b) Encontrar las direcciones de máxima varianza en los datos</details>

**Q2.** En PCA, los eigenvectors representan:

a) La cantidad de varianza en cada componente
b) La dirección de cada componente principal
c) Las asignaciones de cluster
d) Los valores predichos

<details><summary>Respuesta</summary>b) La dirección de cada componente principal (las cargas/pesos de las features originales)</details>

**Q3.** Si la varianza explicada acumulada de los primeros 3 componentes es 0.92, esto significa:

a) Se retiene el 92% de las features originales
b) El 92% de la varianza total es capturado por 3 componentes
c) La exactitud del modelo es 92%
d) El 8% de los datos es ruido

<details><summary>Respuesta</summary>b) El 92% de la varianza total de los datos es capturado por los primeros 3 componentes principales</details>

**Q4.** ¿Por qué es importante el escalado antes de PCA?

a) Acelera la eigendecomposition
b) Las features con mayor varianza dominarían el primer PC
c) PCA solo funciona con datos estandarizados
d) Reduce el número de componentes necesarios

<details><summary>Respuesta</summary>b) Las features con mayor varianza dominarían el primer PC, ocultando potencialmente estructura importante en otras features</details>

**Q5.** ¿Cuál de las siguientes afirmaciones es VERDADERA sobre los componentes principales?

a) Están correlacionados entre sí
b) Son ortogonales (no correlacionados)
c) Son los mismos que las features originales
d) El primer componente siempre separa las clases

<details><summary>Respuesta</summary>b) Son ortogonales (no correlacionados). PCA rota los datos para que los componentes tengan correlación cero.</details>

## Respuesta corta (2 preguntas)

**Q6.** Explicá la relación entre los eigenvalues y la varianza explicada en PCA.

<details><summary>Respuesta</summary>Cada eigenvalue (λₖ) representa la varianza capturada por su componente principal correspondiente. El ratio de varianza explicada del componente k es λₖ / Σλⱼ. Los componentes con eigenvalues más grandes capturan más varianza. El primer componente tiene el eigenvalue más grande, el segundo el siguiente más grande, y así sucesivamente. La suma de todos los eigenvalues equivale a la varianza total del dataset.</details>

**Q7.** Un colega corre PCA sobre un dataset y los 20 componentes tienen una varianza explicada aproximadamente igual (~5% cada uno). ¿Qué sugiere esto?

<details><summary>Respuesta</summary>Esto sugiere que no hay estructura dominante de baja dimensionalidad en los datos — la varianza está distribuida uniformemente en todas las dimensiones. Esto podría significar que los datos son aproximadamente esféricos (isotrópicos) sin correlaciones fuertes entre las features. En este caso, PCA puede no ser útil para la reducción de dimensionalidad. Posibles causas: features mal elegidas, datos ya no correlacionados o ruido aleatorio dominando.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función en Python `pca_scree_plot(X, n_components=10)` que:
1. Escale los datos
2. Ajuste PCA con n_components
3. Cree un scree plot (gráfico de barras de los ratios de varianza explicada)
4. Devuelva el objeto PCA

<details><summary>Respuesta</summary>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def pca_scree_plot(X, n_components=10):
    X_scaled = StandardScaler().fit_transform(X)
    pca = PCA(n_components=min(n_components, X.shape[1]))
    pca.fit(X_scaled)

    plt.figure(figsize=(8, 5))
    x = range(1, len(pca.explained_variance_ratio_) + 1)
    plt.bar(x, pca.explained_variance_ratio_, alpha=0.7)
    plt.plot(x, np.cumsum(pca.explained_variance_ratio_), 'ro-', label='Cumulative')
    plt.xlabel('Principal Component')
    plt.ylabel('Explained Variance Ratio')
    plt.title('Scree Plot')
    plt.legend()
    plt.grid(True)
    plt.show()

    return pca

from sklearn.datasets import load_iris
pca = pca_scree_plot(load_iris().data, n_components=4)
```
</details>
</details>
