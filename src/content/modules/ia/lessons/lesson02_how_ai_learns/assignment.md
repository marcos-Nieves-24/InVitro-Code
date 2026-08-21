# Assignment: Entrenamiento, validación y sobreajuste

## Objetivos

- Cargar el dataset Breast Cancer Wisconsin y separarlo en entrenamiento/prueba
- Entrenar un clasificador KNN variando el valor de `k`
- Graficar el error o *accuracy* en entrenamiento y prueba en función de `k`
- Identificar el valor óptimo de `k` y explicar el fenómeno de sobreajuste observado

## Instrucciones

1. Carga el dataset Breast Cancer Wisconsin:
```python
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X = data.data
y = data.target
```

2. Divide los datos en entrenamiento (70%) y prueba (30%) usando `train_test_split` con `stratify=y` y `random_state=42` para que sea reproducible.

3. Entrena un clasificador `KNeighborsClassifier` para valores de `k` entre 1 y 20 (ambos inclusive).

4. Para cada `k`, calcula:
   - *Accuracy* en entrenamiento
   - *Accuracy* en prueba
   - También puedes usar `mean_squared_error` o `1 - accuracy` para graficar errores

5. Grafica en un mismo gráfico:
   - La curva de *accuracy* (o error) en entrenamiento vs. `k`
   - La curva de *accuracy* (o error) en prueba vs. `k`
   - Marca con una línea vertical o un punto el valor de `k` que consideras óptimo

6. Responde en una celda de markdown:
   - ¿Cuál es el valor óptimo de `k`? ¿Por qué lo elegiste?
   - ¿Qué pasa con `k=1`? ¿Qué observas en el *accuracy* de entrenamiento?
   - ¿Qué pasa con `k=20` o más grande? ¿La frontera se vuelve más suave o más irregular?
   - ¿Cuándo dices que un modelo está sobreajustado? ¿Qué evidencia hay en tus gráficos?

