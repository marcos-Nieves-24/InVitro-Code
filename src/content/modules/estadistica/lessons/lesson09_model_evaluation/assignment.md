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

