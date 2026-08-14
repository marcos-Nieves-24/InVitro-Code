# Lab 4: Árboles de Decisión

## Objetivos

- Entrenar y visualizar árboles de decisión
- Entender cómo afecta la profundidad al sobreajuste
- Calcular la importancia de las features
- Comparar Gini vs. entropía

## Parte 1: Visualizar un árbol

Cargá `load_iris()`, entrená un `DecisionTreeClassifier(max_depth=3)` y visualizalo usando `plot_tree`.

**Preguntas:**
- ¿Qué feature se usa en la división raíz?
- ¿Cuál es la impureza de Gini de cada hoja?

## Parte 2: Profundidad y sobreajuste

Sobre el dataset de cáncer de mama, entrená árboles con max_depth = 1 a 15. Graficá la exactitud de entrenamiento y prueba vs. la profundidad.

**Preguntas:**
- ¿A qué profundidad empieza el árbol a sobreajustarse?
- ¿Cuál es la profundidad óptima?
- ¿Qué pasa cuando max_depth = None?

## Parte 3: Importancia de las features

Entrená un árbol con `max_depth=4` sobre el cáncer de mama. Imprimí las importancias de las features ordenadas por valor.

- ¿Cuáles son las 5 features principales?
- ¿Las importancias coinciden con el conocimiento del dominio (p. ej., worst radius, worst concavity suelen ser importantes)?

## Parte 4: Gini vs. Entropía

Compará `criterion='gini'` vs `criterion='entropy'` en el cáncer de mama con max_depth=4. Informá la exactitud de prueba para ambos.

**Pregunta:** ¿Hay una diferencia significativa?

## Parte 5: Regresor de árbol de decisión

Usá `DecisionTreeRegressor` sobre el dataset de diabetes. Informá el R² de entrenamiento y prueba en varias profundidades.

```python
from sklearn.tree import DecisionTreeRegressor
```

## Entregables

- Notebook con las 5 partes
- Visualización del árbol (Parte 1)
- Gráfico de profundidad vs. exactitud (Parte 2)
- Gráfico de barras de importancia de features (Parte 3)

## Tiempo estimado: 45 minutos
