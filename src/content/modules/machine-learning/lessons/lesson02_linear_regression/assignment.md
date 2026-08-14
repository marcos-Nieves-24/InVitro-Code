# Assignment 2: Regresión Lineal

## Objetivos

- Aplicar la regresión lineal a un problema real
- Comparar múltiples subconjuntos de features
- Diagnosticar violaciones de supuestos
- Escribir un informe profesional

## Dataset

Alternativa a **Boston Housing**: usá `fetch_california_housing` de scikit-learn.

## Instrucciones

1. **Dividí** los datos en entrenamiento (70%), validación (15%) y prueba (15%)
2. **Entrená tres modelos:**
   - Modelo A: solo MedInc (simple)
   - Modelo B: las 8 features
   - Modelo C: las 8 features + términos de interacción (MedInc × AveRooms, Latitude × Longitude)
3. **Evaluá** cada modelo en el set de validación usando R² y RMSE
4. **Analizá los residuos** del mejor modelo
5. **Seleccioná el mejor modelo** y evaluá en el set de prueba

## Entregables

- Script de Python o notebook
- Tabla comparando los tres modelos (R² y RMSE de entrenamiento y validación)
- Scatter plot: predichos vs. reales para el mejor modelo
- Gráficos de residuos para el mejor modelo
- Informe (máx. 500 palabras):
  - ¿Qué modelo rindió mejor y por qué?
  - ¿Se violó algún supuesto?
  - ¿Cómo mejorarías el modelo aún más?

## Rúbrica

| Criterio | Excelente (4) | Bueno (3) | Adecuado (2) | Deficiente (1) |
|----------|--------------|----------|-------------|----------------|
| Múltiples modelos | 3 modelos con interacción | 2 modelos | 1 modelo | Faltante |
| Evaluación | R² + RMSE para entrenamiento/validación | Ambas métricas | Una métrica | Faltante |
| Análisis de residuos | Gráficos + interpretación | Solo gráficos | Un gráfico | Faltante |
| Informe | Con perspectiva, bien escrito | Claro | Básico | Faltante |
| Calidad del código | Limpio, bien comentado | Legible | Desordenado | No corre |

## Tiempo estimado: 2 horas
