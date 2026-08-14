# Lab 3: Clasificación

## Objetivos

- Entrenar modelos de regresión logística con scikit-learn
- Evaluar usando matriz de confusión, precisión, sensibilidad, F1 y ROC AUC
- Visualizar los límites de decisión
- Ajustar los umbrales de clasificación

## Parte 1: Datos sintéticos

```python
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                            class_sep=1.0, random_state=42)
```

Entrená un modelo de regresión logística y graficá el límite de decisión (similar al ejemplo del notebook).

## Parte 2: Clasificación de cáncer de mama

Cargá `load_breast_cancer()`, dividí con `stratify=y`, entrená una regresión logística e informá:

- Matriz de confusión
- Precisión, sensibilidad y F1 para ambas clases
- Curva ROC con AUC

## Parte 3: Exploración del umbral

Para el modelo de cáncer de mama:
1. Calculá la precisión, la sensibilidad y el F1 para los umbrales [0.1, 0.3, 0.5, 0.7, 0.9]
2. Para cada umbral, explicá qué tipo de errores aumentan
3. ¿Qué umbral elegirías si los falsos negativos cuestan 10× más que los falsos positivos?

## Parte 4: Datos desbalanceados

```python
from sklearn.datasets import make_classification
X_imb, y_imb = make_classification(n_samples=1000, weights=[0.95, 0.05],
                                    random_state=42)
```

Entrená una regresión logística. Informá exactitud, precisión, sensibilidad y F1. ¿Por qué la exactitud es engañosa aquí?

## Entregables

- Notebook con las 4 partes
- Gráfico del límite de decisión (Parte 1)
- Curva ROC (Parte 2)
- Tabla de métricas por umbral (Parte 3)
- Explicación escrita de exactitud vs. F1 (Parte 4)

## Tiempo estimado: 45 minutos
