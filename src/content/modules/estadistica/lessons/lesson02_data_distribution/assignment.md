# Assignment: Análisis de distribución de datos

## Objetivos

- Analizar la distribución de datos del mundo real
- Aplicar la transformación logarítmica para normalizar
- Interpretar la asimetría (skewness) y la curtosis en contexto

## Instrucciones

1. Carga el dataset `diamonds` de seaborn
2. Para la columna `price`:
   - Crea un histograma con KDE superpuesto
   - Calcula e interpreta la asimetría (skewness) y la curtosis
   - Aplica la transformación logarítmica y repite el análisis
3. Para cada categoría de `cut`, crea un gráfico de densidad de `price` (superpuestos)
4. Para las columnas `carat`, `depth` y `table`:
   - Crea una cuadrícula de 2×2 de histogramas
   - Informa las estadísticas de forma
   - Identifica qué columnas son aproximadamente normales
5. Escribe un resumen (3-4 párrafos) que aborde:
   - Por qué los precios de los diamantes están sesgados a la derecha
   - Cómo ayuda la transformación logarítmica
   - Qué features podrían necesitar transformación antes del modelado de machine learning

