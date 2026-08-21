# Assignment: Análisis de correlación

## Objetivos

- Calcular e interpretar las correlaciones de Pearson y Spearman
- Crear visualizaciones de la matriz de correlación
- Detectar multicolinealidad y correlaciones espurias

## Instrucciones

1. **Comparación de correlaciones**: Carga el dataset `mpg`.
   - Calcula las correlaciones de Pearson y Spearman entre todos los pares numéricos
   - Encuentra los pares donde |Pearson - Spearman| > 0.1 y explica por qué
   - Crea scatter plots para los 3 pares más correlacionados

2. **Matriz de correlación**: Crea un heatmap de la matriz de correlación con estilo que incluya:
   - Todas las variables numéricas
   - Anotaciones que muestren los valores de correlación
   - Colormap divergente rojo-azul centrado en 0
   - Resaltar las correlaciones > 0.8 (posible multicolinealidad)

3. **Análisis del cuarteto de Anscombe**:
   - Carga el dataset `anscombe`
   - Para cada uno de los 4 grupos, calcula la correlación de Pearson, la media de x, la media de y y la línea de regresión
   - Muestra que los estadísticos resumidos son idénticos pero las visualizaciones revelan patrones muy diferentes
   - Crea un scatter plot de 2×2 con líneas de regresión

4. **Correlaciones espurias**: Encuentra un ejemplo de dos variables de los datasets que estén correlacionadas pero no tengan una relación causal plausible. Explica por qué existe la correlación a pesar de no haber causalidad.

