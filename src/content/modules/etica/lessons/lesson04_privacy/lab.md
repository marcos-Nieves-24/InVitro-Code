# Lab: Análisis de datos con preservación de privacidad

## Objetivo

Implementar y comparar técnicas de preservación de privacidad para publicar resúmenes estadísticos. Evaluar la concesión entre privacidad y utilidad para diferentes valores de epsilon.

## Duración

60 minutos

## Requisitos previos

Lección 4, Python (numpy, pandas, matplotlib)

## Dataset

Usá el dataset de ingresos de adultos de UCI (o un dataset sintético con columnas demográficas y de ingresos).

## Instrucciones

### Parte 1: Estadísticas de base (10 minutos)

1. Cargá el dataset de Adultos.
2. Calculá y reportá: edad media, ingreso medio, distribución de ingresos por género, distribución de educación.
3. Estos son tus valores "verdaderos". No pueden publicarse si los datos son sensibles.

### Parte 2: Privacidad diferencial para estadísticas resumidas (20 minutos)

1. Implementá la función del mecanismo de Laplace (de la lección).
2. Para cada estadística (edad media, ingreso medio, proporción de mujeres), publicá una versión con privacidad diferencial.
3. Para epsilon = [0.01, 0.1, 0.5, 1, 5, 10], ejecutá 100 pruebas por cada uno y calculá:
   - Error absoluto medio
   - Desviación estándar del error
4. Creá un gráfico que muestre el MAE vs. epsilon para cada estadística.
5. ¿Qué estadística es más fácil de publicar con alta precisión? ¿Por qué?

### Parte 3: Privacidad diferencial para un histograma (15 minutos)

1. Creá un histograma de ingresos (10 bins).
2. Publicá un histograma con privacidad diferencial con epsilon = [0.1, 1, 10].
3. Graficá el histograma verdadero vs. los histogramas privados.
4. ¿Con qué epsilon el histograma se vuelve reconocible?

### Parte 4: Composición (15 minutos)

1. Suponé que publicás tres estadísticas: edad media, ingreso medio y un histograma de 10 bins.
2. Con composición básica, el epsilon total es la suma de los epsilones individuales.
3. Para un presupuesto total de epsilon=1, ¿cómo asignarías el presupuesto entre las tres estadísticas para minimizar el error total?
4. Implementá y probá tu estrategia de asignación.

## Entregables

Enviá un notebook de Jupyter con:
- Todo el código y las visualizaciones
- Un párrafo sobre tu estrategia de asignación de presupuesto y la justificación

## Rúbrica

| Criterio | Puntos | Excelente | Bueno | Satisfactorio | Necesita mejorar |
|-----------|--------|-----------|------|--------------|-------------------|
| Estadísticas de base | 10 | Todas calculadas correctamente | La mayoría | Algunas | Faltantes |
| DP para estadísticas | 25 | Implementación completa con análisis | Buena | Parcial | Faltante |
| Histograma DP | 25 | Visualización y comparación claras | Adecuada | Básica | Faltante |
| Análisis de composición | 25 | Asignación reflexiva, probada | Buena estrategia | Básica | Faltante |
| Discusión | 15 | Perspicaz sobre la concesión privacidad-utilidad | Buena | Básica | Faltante |
