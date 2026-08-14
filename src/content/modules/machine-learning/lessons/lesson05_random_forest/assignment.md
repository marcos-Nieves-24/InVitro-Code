# Assignment 5: Bosque Aleatorio

## Objetivos

- Aplicá el bosque aleatorio a un dataset biológico de alta dimensionalidad
- Usá la importancia de características para descubrir biomarcadores
- Ajustá el modelo para un rendimiento óptimo
- Interpretá los resultados en contexto biológico

## Dataset

Usá `make_classification` para simular un **dataset de expresión génica** con:
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

Sos un bioinformático analizando datos de expresión génica de un ensayo clínico. Tu objetivo es identificar qué genes predicen la respuesta al fármaco y construir un clasificador.

## Instrucciones

1. **Dividí** en entrenamiento (60%), validación (20%) y prueba (20%)
2. **Entrená el baseline:** un árbol de decisión individual (ajustá la profundidad)
3. **Entrená un bosque aleatorio** con parámetros por defecto
4. **Ajustá los hiperparámetros:** n_estimators, max_depth, min_samples_leaf
5. **Identificá los 10 genes principales** del mejor bosque aleatorio
6. **Reentrená** usando solo los 10, 50 y 100 genes principales — ¿cambia el rendimiento?
7. **Evaluación final** en el set de prueba

## Entregables

- Notebook con todo el código
- Tabla que compare todos los modelos (exactitud de entrenamiento/validación/prueba)
- Gráfico de barras de las importancias de los 10 genes principales
- Gráfico de la exactitud de validación vs. el número de genes usados
- Informe corto (máx. 300 palabras):
  - ¿Cuántos genes se necesitan realmente para una buena predicción?
  - ¿Confiarías en la importancia basada en impureza para el descubrimiento biológico? ¿Por qué sí o por qué no?
  - ¿Cómo validarías estos biomarcadores en el laboratorio?

## Rúbrica

| Criterio | Excelente (4) | Bueno (3) | Adecuado (2) | Deficiente (1) |
|----------|--------------|----------|-------------|----------------|
| Pipeline | Completo con todos los pasos | Faltan detalles menores | Faltan varios pasos | Incompleto |
| Ajuste de hiperparámetros | Búsqueda sistemática en grid | Parcial | Mínimo | Faltante |
| Análisis de selección de genes | Comparación 10/50/100 | Una comparación | Solo importancia cruda | Faltante |
| Interpretación biológica | Discusión con insights | Clara | Básica | Faltante |
| Calidad del código | Limpio, reproducible | Legible | Desordenado | No corre |

## Tiempo estimado: 2 horas
