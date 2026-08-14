# Assignment: Análisis de distribución de datos

## Objetivos

- Analizar la distribución de datos del mundo real
- Aplicar la transformación logarítmica para normalizar
- Interpretar la asimetría (skewness) y la curtosis en contexto

## Instrucciones

1. Cargá el dataset `diamonds` de seaborn
2. Para la columna `price`:
   - Creá un histograma con KDE superpuesto
   - Calculá e interpretá la asimetría (skewness) y la curtosis
   - Aplicá la transformación logarítmica y repetí el análisis
3. Para cada categoría de `cut`, creá un gráfico de densidad de `price` (superpuestos)
4. Para las columnas `carat`, `depth` y `table`:
   - Creá una cuadrícula de 2×2 de histogramas
   - Informá las estadísticas de forma
   - Identificá qué columnas son aproximadamente normales
5. Escribí un resumen (3-4 párrafos) que aborde:
   - Por qué los precios de los diamantes están sesgados a la derecha
   - Cómo ayuda la transformación logarítmica
   - Qué features podrían necesitar transformación antes del modelado de machine learning

## Entregables

- Notebook de Jupyter con el código, los gráficos y el resumen escrito

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Deficiente (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Histogramas/KDE | Todos creados correctamente | Problemas menores | Faltan elementos | Mala calidad |
| Estadísticas de forma | Calculadas e interpretadas correctamente | Correctas pero breves | Algunos errores | Faltantes/incompletas |
| Transformación logarítmica | Hecha correctamente con comparación | Hecha pero sin comparación | Incompleta | Faltante |
| Resumen escrito | Perspicaz, bien estructurado | Buen análisis | Superficial | Faltante |

**Total: 16 puntos**

## Tiempo estimado

2 horas
