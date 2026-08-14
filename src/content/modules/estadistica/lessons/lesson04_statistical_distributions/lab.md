# Lab: Distribuciones estadísticas

## Objetivo

Trabajá con distribuciones conocidas para modelar fenómenos del mundo real y entendé la estandarización.

## Duración

60 minutos

## Dataset

Datos sintéticos y reales (dataset iris).

## Instrucciones

### Parte 1: Identificación de distribuciones (15 min)

Para cada escenario, identificá la distribución adecuada y calculá la probabilidad pedida usando scipy.stats:

1. Una droga funciona en el 70% de los pacientes. De 30 pacientes, ¿cuál es la probabilidad de que exactamente 20 respondan?
2. Un laboratorio recibe en promedio 5 muestras por hora. ¿Cuál es la probabilidad de recibir exactamente 3 muestras en la próxima hora?
3. Los niveles de glucosa en sangre siguen N(100, 15) mg/dL. ¿Qué porcentaje de pacientes tiene glucosa > 140 mg/dL?

### Parte 2: Ajuste de una distribución normal (20 min)

1. Cargá el dataset iris
2. Para `sepal_length`, ajustá una distribución normal (calculá mu y sigma a partir de los datos)
3. Graficá el histograma con la PDF normal ajustada superpuesta
4. Creá un gráfico Q-Q usando `stats.probplot()` para verificar la normalidad
5. ¿`sepal_length` parece tener distribución normal?

### Parte 3: Estandarización (15 min)

1. Estandarizá todas las columnas numéricas del dataset iris
2. Verificá que la media ≈ 0 y la desv. estándar ≈ 1 para cada columna
3. Graficá boxplots de los datos originales vs. los estandarizados lado a lado

### Parte 4: Demostración del teorema central del límite (10 min)

1. Generá 1000 muestras de una distribución exponencial (¡sesgada!)
2. Tomá medias muestrales para tamaños de muestra n = 5, 10, 30, 100 (1000 cada uno)
3. Graficá histogramas de las medias muestrales
4. Observá cómo la distribución se vuelve normal a medida que n aumenta

## Entregables

- Script de Python o notebook con todos los cálculos y gráficos
- Respuestas escritas a las preguntas de interpretación

## Rúbrica

| Criterio | Puntos |
|----------|--------|
| Identificación de distribuciones | 3 |
| Ajuste normal y gráfico Q-Q | 3 |
| Estandarización | 2 |
| Demostración del TCL | 2 |
Total: 10 puntos
