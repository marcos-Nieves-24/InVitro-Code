# Assignment: Distribuciones estadísticas en la práctica

## Objetivos

- Identificar distribuciones adecuadas para escenarios reales
- Calcular probabilidades usando scipy.stats
- Aplicar la estandarización e interpretar los puntajes Z

## Instrucciones

1. **Identificación de distribuciones**: Para cada escenario, identificá la distribución, los parámetros y calculá la probabilidad:
   - Un sitio web tiene una tasa de conversión del 2%. ¿Cuál es la probabilidad de obtener exactamente 5 conversiones de 200 visitantes?
   - La sala de emergencias de un hospital recibe en promedio 8 pacientes por hora. ¿Cuál es la probabilidad de que lleguen más de 12 pacientes en una hora?
   - Los puntajes de CI siguen N(100, 15). ¿Qué puntaje de CI está en el percentil 95?

2. **Ajuste normal con datos reales**: Cargá el dataset `penguins`.
   - Para `body_mass_g`, ajustá una distribución normal (calculá μ y σ)
   - Creá un gráfico Q-Q
   - Probá la normalidad usando `stats.normaltest()`
   - Si no es normal, aplicá una transformación y volvé a probar

3. **Pipeline de estandarización**: Escribí una función `standardize_df(df)` que:
   - Reciba un DataFrame con columnas numéricas
   - Devuelva un DataFrame estandarizado (media=0, desv. estándar=1)
   - Preserve los nombres de las columnas y el índice

4. **Demostración del TCL**: Escribí una simulación que demuestre el teorema central del límite:
   - Empezá con una distribución uniforme (claramente no normal)
   - Mostrá cómo la distribución de las medias muestrales se vuelve normal a medida que n aumenta de 2 a 5 a 30 a 100
   - Creá una cuadrícula de 2×2 que muestre esta evolución

