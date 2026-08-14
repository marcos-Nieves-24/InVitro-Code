# Lab: Distribución de datos

## Objetivo

Analizá la distribución de datos del mundo real usando histogramas, gráficos de densidad y estadísticas de forma.

## Duración

60 minutos

## Dataset

El dataset `diamonds` de Seaborn.

```python
import seaborn as sns
diamonds = sns.load_dataset('diamonds')
```

## Instrucciones

### Parte 1: Distribución univariada (15 min)

Para la columna `price`:
1. Creá un histograma con 30 bins
2. Superponé un gráfico KDE
3. Informá la asimetría (skewness) y la curtosis
4. Describí la forma (simétrica, sesgada, etc.)

### Parte 2: Transformación logarítmica (15 min)

1. Aplicá la transformación logarítmica a la columna `price` usando `np.log1p()`
2. Graficá el histograma con KDE de los datos transformados
3. Compará la asimetría antes y después
4. Interpretá: ¿la distribución se volvió más normal?

### Parte 3: Comparación de distribuciones por categoría (15 min)

1. Creá un histograma facetado de `price` agrupado por `cut` (usá `sns.histplot` con `hue`)
2. Creá un gráfico de densidad separado para cada calidad de cut
3. ¿Qué cut tiene la distribución de precios más amplia?

### Parte 4: Resumen de la distribución (15 min)

Escribí una función `distribution_report(series)` que devuelva un diccionario con:
- Media, mediana, desv. estándar, mín., máx.
- Asimetría (skewness), curtosis
- Si la distribución es aproximadamente normal (|skewness| < 0.5 y |kurtosis| < 0.5)

## Entregables

- Notebook de Jupyter con todo el código, los gráficos y las interpretaciones
- Una sección de markdown que resuma los hallazgos sobre la distribución de precios

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Histogramas y gráficos KDE | 3 |
| Análisis de transformación logarítmica | 2 |
| Comparaciones agrupadas | 3 |
| Función de informe de distribución | 2 |
Total: 10 puntos
