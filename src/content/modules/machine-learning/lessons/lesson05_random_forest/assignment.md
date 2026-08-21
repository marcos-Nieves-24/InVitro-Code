# Assignment 5: Bosque Aleatorio

## Objetivos

- Aplica el bosque aleatorio a un dataset biológico de alta dimensionalidad
- Usa la importancia de características para descubrir biomarcadores
- Ajusta el modelo para un rendimiento óptimo
- Interpreta los resultados en contexto biológico

## Dataset

Usa `make_classification` para simular un **dataset de expresión génica** con:
- 500 samples
- 5000 features (genes)
- 10 features informativas
- Resultado binario (responder / non-responder)

```python
from sklearn.datasets import make_classification
X, y = make_classification(n_samples=500, n_features=5000, n_informative=10,
                            n_redundant=0, random_state=42)
```

## Escenario

Eres un bioinformático analizando datos de expresión génica de un ensayo clínico. Tu objetivo es identificar qué genes predicen la respuesta al fármaco y construir un clasificador.

## Instrucciones

1. **Divide** en entrenamiento (60%), validación (20%) y prueba (20%)
2. **Entrena el baseline:** un árbol de decisión individual (ajusta la profundidad)
3. **Entrena un bosque aleatorio** con parámetros por defecto
4. **Ajusta los hiperparámetros:** n_estimators, max_depth, min_samples_leaf
5. **Identifica los 10 genes principales** del mejor bosque aleatorio
6. **Reentrena** usando solo los 10, 50 y 100 genes principales — ¿cambia el rendimiento?
7. **Evaluación final** en el set de prueba

