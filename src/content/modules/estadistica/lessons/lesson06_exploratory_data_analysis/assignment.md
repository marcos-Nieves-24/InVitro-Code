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

## Entregables

- Notebook de Jupyter con código, visualizaciones e informe escrito

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Deficiente (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Vista general de datos y valores faltantes | Completo | Omisiones menores | Parcial | Faltante |
| Análisis univariado | Los 4 features analizados | 3 features | 2 features | <2 |
| Análisis bivariado | Correlaciones + interpretaciones | Correlaciones básicas | Incompleto | Faltante |
| Detección de valores atípicos | Correcta con interpretación | Correcta solamente | Parcial | Faltante |
| Análisis agrupado | Patrones claros identificados | Agrupación básica | Limitado | Faltante |
| Informe escrito | Con insight y accionable | Buen resumen | Superficial | Faltante |

**Total: 24 puntos**

## Tiempo estimado

3 horas
