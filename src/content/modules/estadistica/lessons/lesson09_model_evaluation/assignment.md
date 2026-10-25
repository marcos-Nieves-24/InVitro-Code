# Assignment: Informe de evaluación de modelos

## Objetivos

- Entrenar múltiples modelos de regresión y comparar su rendimiento
- Usar validación cruzada para una evaluación confiable
- Diagnosticar el sobreajuste y los supuestos del modelo
- Escribir un informe de evaluación profesional

## Instrucciones

1. Carga el dataset de California housing
2. Entrena y compara 3 modelos:
   - LinearRegression
   - Un modelo que siempre predice la media (baseline)
   - Regresión Ridge (de sklearn.linear_model)

3. Para cada modelo:
   - Realiza validación cruzada de 10 folds
   - Informa la media ± desviación estándar de R², MAE, RMSE
   - Compara el rendimiento en entrenamiento vs prueba

4. **Análisis profundo del mejor modelo**:
   - Toma el mejor modelo (mayor R² de VC)
   - Ajústalo sobre el set de entrenamiento completo
   - Crea gráficos de residuos
   - Verifica la homocedasticidad (varianza constante de los residuos)
   - Verifica la normalidad de los residuos
   - Informa las 3 features más influyentes

5. **Estructura del informe**:
   - Resumen ejecutivo (3-4 oraciones)
   - Metodología (cómo se evaluaron los modelos)
   - Resultados (tabla comparando todos los modelos)
   - Análisis del mejor modelo (gráficos e interpretaciones)
   - Conclusiones y recomendaciones

