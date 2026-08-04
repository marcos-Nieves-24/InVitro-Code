# Assignment: Pipeline de ML y métricas de evaluación

## Objetivos

- Construir un clasificador KNN sobre el dataset Breast Cancer Wisconsin
- Calcular e interpretar la matriz de confusión y las métricas derivadas
- Comparar el modelo de ML con un clasificador baseline basado en reglas
- Discutir el impacto de los errores en un contexto biotecnológico

## Instrucciones

1. Cargá el dataset Breast Cancer Wisconsin:

```python
from sklearn.datasets import load_breast_cancer

data = load_breast_cancer()
X = data.data
y = data.target
```

2. Separá los datos en entrenamiento (70%) y prueba (30%) usando `train_test_split` con `stratify=y` y `random_state=42`.

3. Entrená un clasificador `KNeighborsClassifier` con `k=5`. Predecí sobre el conjunto de prueba y calculá:
   - Matriz de confusión (TP, FP, FN, TN)
   - Accuracy
   - Precision
   - Recall
   - F1-score

4. Implementá un clasificador baseline basado en una regla simple. Por ejemplo, predecir siempre la clase mayoritaria, o usar un solo feature threshold:

```python
import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix

# Baseline: predecir siempre la clase mayoritaria
majority_class = int(np.bincount(y_train).argmax())
y_baseline = np.full_like(y_test, majority_class)

print("Accuracy baseline:", accuracy_score(y_test, y_baseline))
print("Matriz de confusión baseline:")
print(confusion_matrix(y_test, y_baseline))
```

5. Compará KNN vs baseline en una tabla con accuracy, precision, recall y F1-score.

6. Respondé en una celda de markdown:
   - ¿Cuál modelo tiene mejor F1-score? ¿Por qué?
   - ¿Cuántos falsos negativos comete KNN? ¿Qué implicaría eso si el modelo se usara como ayuda al diagnóstico?
   - ¿Cuándo una regla simple puede ser útil y cuándo preferirías un modelo de ML?
   - ¿Qué métrica elegirías para priorizar si un falso negativo es más costoso que un falso positivo?

## Entregables

- Un notebook Jupyter (`.ipynb`) con todo el código, las métricas, las comparaciones y las respuestas escritas

## Rúbrica de Evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Insuficiente (1 pt) |
|----------|-------------------|---------------|-------------------|---------------------|
| Clasificador KNN | KNN entrenado correctamente, split 70/30 con estratificación, matriz de confusión y métricas bien calculadas | KNN entrenado correctamente con pequeños errores en métricas | KNN entrenado pero sin estratificación o con errores en métricas | KNN no implementado o errores graves |
| Métricas derivadas | Precision, recall y F1 calculados e interpretados correctamente | Métricas calculadas correctamente, interpretación superficial | Faltan algunas métricas o interpretación incorrecta | No se calculan métricas o errores graves |
| Baseline basado en reglas | Baseline implementado y comparado con KNN de forma clara | Baseline implementado, comparación básica | Baseline incompleto o comparación confusa | No hay baseline |
| Interpretación biotecnológica | Análisis profundo del costo de FN/FP, justifica métrica elegida y conecta con pipeline de ML | Buen análisis del costo de errores | Análisis superficial, sin conexión con el contexto | Sin interpretación o incorrecta |

**Total: 16 puntos**

## Tiempo Estimado

2 horas
