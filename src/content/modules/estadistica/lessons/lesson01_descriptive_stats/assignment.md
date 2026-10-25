# Assignment: Estadística descriptiva

## Objetivos

- Calcular estadística descriptiva usando numpy y pandas
- Identificar valores atípicos usando el método del RIQ
- Interpretar los resúmenes estadísticos en contextos biológicos y de negocios

## Instrucciones

1. Carga el dataset de viviendas de California desde sklearn:
```python
from sklearn.datasets import fetch_california_housing
housing = fetch_california_housing(as_frame=True)
df = housing.data
```

2. Para cada columna numérica, calcula:
   - Media, mediana, moda
   - Varianza, desviación estándar, rango, RIQ
   - Cantidad de valores atípicos usando la regla del RIQ (1.5×RIQ)

3. Crea un DataFrame llamado `summary_stats` con una fila por feature y columnas para todas las estadísticas anteriores.

4. Visualiza la columna `MedInc` (ingreso medio) usando un boxplot.

5. Responde en una celda de markdown:
   - ¿Qué feature tiene más valores atípicos? ¿Por qué podría ser?
   - ¿Deberíamos eliminar estos valores atípicos? Justifica tu respuesta.

