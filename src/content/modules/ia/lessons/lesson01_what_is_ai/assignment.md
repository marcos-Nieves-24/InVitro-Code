# Assignment: Selección de Features por Correlación

## Objetivos

- Cargar el dataset Breast Cancer Wisconsin usando scikit-learn
- Analizar la correlación entre features para detectar redundancia
- Identificar y justificar las 3 features más discriminativas entre maligno y benigno
- Comunicar los hallazgos con visualizaciones y argumentos escritos

## Instrucciones

1. Cargá el dataset Breast Cancer Wisconsin:
```python
from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
X = data.data
y = data.target
feature_names = data.feature_names
```

2. Calculá la **matriz de correlación** de las 30 features y creá un heatmap (usá `numpy.corrcoef` o `pandas.DataFrame.corr` + `matplotlib.imshow`/`seaborn.heatmap`).

3. Identificá los pares de features con correlación mayor a 0.9 (en valor absoluto). ¿Qué implica que dos features estén altamente correlacionadas? ¿Cuál conviene conservar y por qué?

4. Separando por clase (maligno vs benigno), calculá la **diferencia relativa de medias** por feature (como en el laboratorio) y armá un ranking de discriminación. Elegí las **3 features más discriminativas**.

5. Creá las siguientes visualizaciones:
   - **Heatmap de correlación**: matriz 30×30 con barra de color
   - **Scatter plot 2D**: las 2 features más discriminativas, coloreadas por clase
   - **Histogramas comparativos**: para las 3 features elegidas, superponiendo maligno vs benigno

6. Respondé en una celda de markdown:
   - ¿Cómo elegiste las 3 features más discriminativas? Mostrá el criterio numérico
   - ¿Qué revela la matriz de correlación sobre la redundancia del dataset?
   - ¿Por qué es importante explorar y seleccionar features antes de entrenar un modelo de IA?

