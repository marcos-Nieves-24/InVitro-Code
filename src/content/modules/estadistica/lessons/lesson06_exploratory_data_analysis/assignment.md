# Assignment: EDA completo

## Objetivos

- Realizar un EDA sistemático sobre un dataset del mundo real
- Detectar y manejar problemas de calidad de datos
- Generar insights accionables a partir de la exploración de los datos

## Instrucciones

1. Cargá el dataset `diamonds` de seaborn
2. Completá el EDA siguiendo este flujo de trabajo:
   - Vista general de los datos (forma, columnas, tipos, memoria)
   - Análisis de valores faltantes (cantidad, porcentaje, patrones)
   - Estadísticos descriptivos para todas las columnas numéricas
   - Análisis univariado: histogramas + KDE para `price`, `carat`, `depth`, `table`
   - Análisis bivariado: heatmap de la matriz de correlación, scatter matrix
   - Detección de valores atípicos: método IQR en `price` y `carat`
   - Análisis agrupado: distribución de precios por cut, color, clarity

3. Creá una función `eda_pipeline(df)` que automatice los pasos anteriores

4. Escribí un informe (2-3 párrafos):
   - ¿Cuáles son las características clave de los precios de los diamantes?
   - ¿Qué features están más correlacionados con el precio?
   - ¿Hay valores atípicos? ¿Deberían eliminarse?
   - ¿Qué preprocesamiento recomendarías antes del modelado?

