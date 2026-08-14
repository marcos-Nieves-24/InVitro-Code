# Lab: Relaciones entre variables

## Objetivo

Explorá las correlaciones entre variables en datasets reales e interpretá la fuerza y la dirección de las relaciones.

## Duración

60 minutos

## Dataset

El dataset `mpg` de seaborn.

## Instrucciones

### Parte 1: Scatter plots por pares (15 min)

1. Cargá el dataset `mpg`
2. Creá scatter plots para: mpg vs horsepower, mpg vs weight, mpg vs displacement
3. Para cada uno, describí la relación (dirección, fuerza, linealidad)

### Parte 2: Cálculo de correlaciones (15 min)

1. Calculá las correlaciones de Pearson y Spearman para todos los pares de variables numéricas
2. Creá un DataFrame que muestre ambos coeficientes lado a lado
3. Identificá los pares donde Pearson y Spearman difieren en más de 0.1 — ¿qué significa esto?

### Parte 3: Heatmap de correlaciones (10 min)

1. Creá un heatmap de la matriz de correlación para el dataset mpg
2. ¿Qué features están más correlacionados con mpg?
3. ¿Qué features están más correlacionados entre sí (posible multicolinealidad)?

### Parte 4: El efecto del cuarteto de Anscombe (20 min)

El dataset de Anscombe muestra que datasets muy diferentes pueden tener correlaciones idénticas.

```python
anscombe = sns.load_dataset('anscombe')
```

1. Calculá la correlación de Pearson para cada grupo (I, II, III, IV)
2. Creá un scatter plot para cada grupo con la correlación en el título
3. Explicá por qué correlaciones idénticas no implican relaciones idénticas

## Entregables

- Notebook de Jupyter con todas las visualizaciones e interpretaciones
- Respuesta escrita identificando los features más importantes para predecir mpg

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Scatter plots con interpretaciones | 3 |
| Comparación Pearson vs Spearman | 2 |
| Heatmap de correlaciones | 2 |
| Análisis de Anscombe | 3 |
Total: 10 puntos
