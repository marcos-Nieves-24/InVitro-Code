# Lab: Estadística descriptiva

## Objetivo

Aplicá la estadística descriptiva para analizar un dataset del mundo real usando Python.

## Duración

60 minutos

## Dataset

Vamos a usar el dataset de Diabetes de sklearn.

```python
from sklearn.datasets import load_diabetes
diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df['target'] = diabetes.target
```

## Instrucciones

### Parte 1: Vista general de los datos (10 min)

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes

diabetes = load_diabetes(as_frame=True)
df = diabetes.data
df['target'] = diabetes.target
print(df.head())
print(df.info())
```

### Parte 2: Tendencia central (10 min)

Calculá e interpretá la media, la mediana y la moda de las columnas `age`, `bmi` y `bp`.

### Parte 3: Dispersión (10 min)

Calculá la varianza, la desviación estándar, el rango y el RIQ para todas las columnas numéricas.

### Parte 4: Detección de valores atípicos (15 min)

Para la columna `bmi`:
1. Calculá Q1, Q3 y el RIQ
2. Identificá los valores atípicos usando la regla del RIQ
3. Creá un boxplot
4. Informá cuántos valores atípicos existen y si parecen errores de datos

### Parte 5: Informe resumen (15 min)

Escribí una función `summarize(df)` que devuelva un DataFrame con:
- Nombre de la columna
- Media, mediana, desv. estándar, mín., máx.
- Q1, Q3, RIQ
- Cantidad de valores atípicos

## Entregables

Entregá un único script de Python (`.py` o `.ipynb`) que contenga:
- Todo el código con comentarios
- La interpretación de la estadística descriptiva para el dataset de diabetes
- Un boxplot que muestre los valores atípicos en el BMI

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Cálculo correcto de la estadística descriptiva | 4 |
| Implementación de la detección de valores atípicos | 3 |
| Boxplot con formato adecuado | 2 |
| Interpretación escrita | 1 |

Total: 10 puntos
