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

