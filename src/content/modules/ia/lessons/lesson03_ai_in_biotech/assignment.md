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

