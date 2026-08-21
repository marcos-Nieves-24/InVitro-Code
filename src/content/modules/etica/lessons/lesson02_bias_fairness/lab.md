# Lab: Auditoría de equidad de un modelo de machine learning

## Objetivo

Realizar una auditoría de equidad completa de un modelo de clasificación. Vas a detectar bias, calcular múltiples métricas de equidad y aplicar una estrategia de mitigación.

## Duración

60 minutos

## Requisitos previos

Lección 2: Bias y equidad, Python (pandas, sklearn)

## Dataset

Proveemos un dataset sintético `credit_data.csv` con las siguientes columnas:

- `age`: edad del postulante
- `income`: ingreso anual (USD)
- `credit_score`: score de crédito (300–850)
- `loan_amount`: monto del préstamo solicitado
- `gender`: género del postulante (M/F)
- `default`: si el postulante incurrió en default (1 = default, 0 = pagó)

El dataset contiene 10,000 registros.

## Instrucciones

### Parte 1: Exploración de datos (10 minutos)

1. Carga el dataset. Calcula la tasa de default por género.
2. Revisa la distribución de ingresos y score de crédito por género.
3. ¿Hay disparidades evidentes?

### Parte 2: Entrenamiento del modelo y métricas de equidad (20 minutos)

1. Entrena un modelo de regresión logística para predecir `default` (NO incluyas `gender`).
2. Evalúa accuracy, precision, recall, F1 en el conjunto de prueba.
3. Calcula y reporta las siguientes métricas de equidad:
   - Diferencia de paridad demográfica
   - Diferencia de igualdad de oportunidades (diferencia de TPR)
   - Diferencia de FPR
   - Ratio de impacto dispar
4. Visualiza las métricas con un gráfico de barras.

### Parte 3: Análisis de umbrales (10 minutos)

1. Varía el umbral de decisión de 0.1 a 0.9 en pasos de 0.1.
2. Para cada umbral, calcula las diferencias de paridad demográfica e igualdad de oportunidades.
3. Grafica ambas métricas en función del umbral.
4. ¿Hay un umbral que minimice la inequidad? ¿Qué pasa con la accuracy?

### Parte 4: Mitigación (15 minutos)

1. Aplica el reponderado de muestras (como se mostró en la lección) para balancear la representación por género.
2. Reentrena el modelo con los pesos de las muestras.
3. Recalcula todas las métricas de equidad.
4. Compara la accuracy antes y después de la mitigación.

### Parte 5: Discusión (5 minutos)

Escribe un párrafo resumiendo tus hallazgos. ¿Qué definición de equidad es más apropiada para la predicción de default de crédito? ¿Cuáles son las limitaciones de tu enfoque de mitigación?

## Entregables

Envía un notebook de Jupyter (`.ipynb`) con:
- Todo el código y las salidas
- Respuestas a las preguntas de discusión en celdas de markdown
- Visualizaciones

## Rúbrica

| Criterio | Puntos | Excelente | Bueno | Satisfactorio | Necesita mejorar |
|-----------|--------|-----------|------|--------------|-------------------|
| Exploración de datos | 15 | Completa con observaciones | Adecuada | Mínima | Faltante |
| Métricas de equidad | 30 | Todas calculadas e interpretadas | La mayoría calculadas | Algunas calculadas | Faltantes |
| Análisis de umbrales | 20 | Completo con gráfico e interpretación | Parcial | Mínimo | Faltante |
| Mitigación | 20 | Aplicada y comparada correctamente | Aplicada pero incompleta | Intentada | Faltante |
| Discusión | 15 | Análisis perspicaz | Buenas observaciones | Básica | Faltante |
