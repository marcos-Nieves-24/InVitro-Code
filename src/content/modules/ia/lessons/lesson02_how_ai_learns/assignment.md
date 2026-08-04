# Assignment: Entrenamiento, validación y sobreajuste

## Objetivos

- Cargar el dataset Breast Cancer Wisconsin y separarlo en entrenamiento/prueba
- Entrenar un clasificador KNN variando el valor de `k`
- Graficar el error o *accuracy* en entrenamiento y prueba en función de `k`
- Identificar el valor óptimo de `k` y explicar el fenómeno de sobreajuste observado

## Instrucciones

1. Cargá el dataset Breast Cancer Wisconsin:
```python
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X = data.data
y = data.target
```

2. Dividí los datos en entrenamiento (70%) y prueba (30%) usando `train_test_split` con `stratify=y` y `random_state=42` para que sea reproducible.

3. Entrená un clasificador `KNeighborsClassifier` para valores de `k` entre 1 y 20 (ambos inclusive).

4. Para cada `k`, calculá:
   - *Accuracy* en entrenamiento
   - *Accuracy* en prueba
   - También podés usar `mean_squared_error` o `1 - accuracy` para graficar errores

5. Graficá en un mismo gráfico:
   - La curva de *accuracy* (o error) en entrenamiento vs. `k`
   - La curva de *accuracy* (o error) en prueba vs. `k`
   - Marcá con una línea vertical o un punto el valor de `k` que considerás óptimo

6. Respondé en una celda de markdown:
   - ¿Cuál es el valor óptimo de `k`? ¿Por qué lo elegiste?
   - ¿Qué pasa con `k=1`? ¿Qué observás en el *accuracy* de entrenamiento?
   - ¿Qué pasa con `k=20` o más grande? ¿La frontera se vuelve más suave o más irregular?
   - ¿Cuándo decís que un modelo está sobreajustado? ¿Qué evidencia hay en tus gráficos?

## Entregables

- Un notebook Jupyter (`.ipynb`) con todo el código, los gráficos y las respuestas escritas

## Rúbrica de Evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Insuficiente (1 pt) |
|----------|-------------------|---------------|-------------------|---------------------|
| Carga y split del dataset | Dataset cargado correctamente, split 70/30 con estratificación y semilla fija | Split correcto con estratificación o semilla fija (falta una) | Split realizado pero sin estratificación ni semilla | Errores graves o no se realiza el split |
| KNN con k-tuning | KNN entrenado para k=1..20 con métricas de train y test correctas | KNN entrenado para varios k, pequeños errores en métricas | Solo algunos valores de k evaluados | KNN no implementado o errores graves |
| Visualización | Ambas curvas (train y test) con títulos, ejes, leyendas y marcado del k óptimo | Ambas curvas presentes con títulos y ejes | Gráfico básico sin marcar k óptimo | Faltan gráficos o son incorrectos |
| Interpretación | Identifica k óptimo, explica sobreajuste con evidencia del gráfico y conecta con concepto de generalización | Identifica k óptimo y explica sobreajuste superficialmente | Análisis parcial sin conexión con el gráfico | Sin interpretación o incorrecta |

**Total: 16 puntos**

## Tiempo Estimado

2 horas
