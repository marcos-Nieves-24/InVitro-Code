# Lab: Análisis exploratorio de datos

## Objetivo

Realizá un EDA completo sobre el dataset MPG, documentando los hallazgos y las decisiones de limpieza.

## Duración

90 minutos

## Dataset

El dataset `mpg` de seaborn.

## Instrucciones

### Parte 1: Carga de datos y vista general (10 min)
1. Cargá `mpg` de seaborn
2. Imprimí la forma, los nombres de las columnas y los dtypes
3. Generá `df.describe()` y `df.info()`

### Parte 2: Valores faltantes (15 min)
1. Identificá las columnas con valores faltantes
2. Calculá el porcentaje de valores faltantes
3. Visualizá los patrones de datos faltantes
4. Decidí la estrategia de manejo para cada columna con valores faltantes

### Parte 3: Análisis univariado (20 min)
1. Creá histogramas para `mpg`, `horsepower`, `weight`, `acceleration`
2. Calculá la asimetría (skewness) y la curtosis para cada uno
3. Identificá qué features necesitan transformación

### Parte 4: Análisis bivariado y multivariado (20 min)
1. Creá un heatmap de la matriz de correlación
2. Creá scatter plots: mpg vs horsepower, mpg vs weight
3. Creá boxplots: mpg por origin y por cylinders
4. Identificá las relaciones más fuertes

### Parte 5: Detección de valores atípicos (15 min)
1. Usá el método IQR en `mpg`, `horsepower`, `weight`
2. Informá la cantidad de valores atípicos por columna
3. Creá boxplots que resalten los valores atípicos

### Parte 6: Informe resumido (10 min)
Escribí un resumen en markdown con:
- Hallazgos clave sobre los datos
- Problemas de calidad de datos
- Pasos de preprocesamiento recomendados
- 3 patrones interesantes descubiertos

## Entregables

- Notebook de Jupyter con código, visualizaciones y resumen en markdown

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Análisis de valores faltantes | 2 |
| Análisis univariado (histogramas + estadísticos de forma) | 2 |
| Análisis bivariado (correlación + scatter) | 2 |
| Detección de valores atípicos | 2 |
| Informe resumido | 2 |
Total: 10 puntos
