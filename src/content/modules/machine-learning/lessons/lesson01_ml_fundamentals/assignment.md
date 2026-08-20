# Assignment 1: Fundamentos de ML

## Objetivos

- Aplicar el flujo de trabajo de ML a un dataset del mundo real
- Diagnosticar y corregir el sobreajuste y el subajuste
- Escribir un informe claro que explique tus hallazgos

## Dataset

Usá el dataset de **California Housing** de scikit-learn:

```python
from sklearn.datasets import fetch_california_housing
data = fetch_california_housing()
```

Este dataset contiene 20,640 muestras con 8 features (MedInc, HouseAge, AveRooms, AveBedrms, Population, AveOccup, Latitude, Longitude) y los targets son los valores medios de las casas.

## Instrucciones

1. **Cargá y explorá** el dataset (forma, nombres de las features, distribución del target)
2. **Dividí** en entrenamiento (70%), validación (15%) y prueba (15%)
3. **Entrená un modelo baseline** `LinearRegression`
4. **Experimentá con la complejidad:**
   - Creá características polinómicas (grado 2, 3, 5)
   - Entrená modelos con cada una
   - Graficá el R² de entrenamiento vs validación contra la complejidad
5. **Diagnosticá el ajuste** de cada modelo
6. **Seleccioná el mejor modelo** según el rendimiento en validación
7. **Evaluación final** sobre el set de prueba

