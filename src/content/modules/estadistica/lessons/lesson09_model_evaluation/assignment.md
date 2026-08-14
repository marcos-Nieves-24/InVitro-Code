# Assignment: Informe de evaluación de modelos

## Objetivos

- Entrenar múltiples modelos de regresión y comparar su rendimiento
- Usar validación cruzada para una evaluación confiable
- Diagnosticar el sobreajuste y los supuestos del modelo
- Escribir un informe de evaluación profesional

## Instrucciones

1. Cargá el dataset de California housing
2. Entrená y compará 3 modelos:
   - LinearRegression
   - Un modelo que siempre predice la media (baseline)
   - Regresión Ridge (de sklearn.linear_model)

3. Para cada modelo:
   - Realizá validación cruzada de 10 folds
   - Informá la media ± desviación estándar de R², MAE, RMSE
   - Compará el rendimiento en entrenamiento vs prueba

4. **Análisis profundo del mejor modelo**:
   - Tomá el mejor modelo (mayor R² de VC)
   - Ajustalo sobre el set de entrenamiento completo
   - Creá gráficos de residuos
   - Verificá la homocedasticidad (varianza constante de los residuos)
   - Verificá la normalidad de los residuos
   - Informá las 3 features más influyentes

5. **Estructura del informe**:
   - Resumen ejecutivo (3-4 oraciones)
   - Metodología (cómo se evaluaron los modelos)
   - Resultados (tabla comparando todos los modelos)
   - Análisis del mejor modelo (gráficos e interpretaciones)
   - Conclusiones y recomendaciones

## Entregables

- Notebook de Jupyter con todo el código y un informe en markdown

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Deficiente (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Comparación de modelos | Los 3 modelos, VC correcta | Problemas menores | Falta uno | Incompleta |
| Métricas de rendimiento | Todas las métricas para todos los modelos | La mayoría de las métricas | Parcial | Faltante |
| Análisis de residuos | Completo con interpretación | Bueno | Básico | Faltante |
| Calidad del informe | Profesional, bien estructurado | Bueno | Adecuado | Mal redactado |
| Interpretación de features | Con visión | Bueno | Básica | Faltante |

**Total: 20 puntos**

## Tiempo estimado

3 horas
