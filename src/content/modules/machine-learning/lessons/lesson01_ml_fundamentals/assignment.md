# Assignment 1: Fundamentos de ML

## Objetivos

- Aplicar el flujo de trabajo de ML a un dataset del mundo real
- Diagnosticar y corregir el sobreajuste y el subajuste
- Escribir un informe claro que explique tus hallazgos

## Dataset

Usa el dataset de **California Housing** de scikit-learn:

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

Este dataset contiene 20,640 muestras con 8 features (MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude) y los targets son los valores medios de las casas.

## Instrucciones

1. **Carga y explora** el dataset (forma, nombres de las features, distribución del target)
2. **Divide** en entrenamiento (70%), validación (15%) y prueba (15%)
3. **Entrena un modelo baseline** `LinearRegression`
4. **Experimenta con la complejidad:**
   - Crea características polinómicas (grado 2, 3, 5)
   - Entrena modelos con cada una
   - Grafica el R² de entrenamiento vs validación contra la complejidad
5. **Diagnostica el ajuste** de cada modelo
6. **Selecciona el mejor modelo** según el rendimiento en validación
7. **Evaluación final** sobre el set de prueba

