# Assignment: Aplicaciones de la probabilidad

## Objetivos

- Aplicar el teorema de Bayes a pruebas de diagnóstico
- Simular experimentos de probabilidad en Python
- Interpretar resultados probabilísticos en contexto

## Instrucciones

1. **Cribado médico**: Un hospital implementa un programa de cribado para una enfermedad con:
   - Prevalencia: 0.5%
   - Sensibilidad del test: 98%
   - Especificidad del test: 97%

   a) Calcula P(enfermedad | positivo) usando el teorema de Bayes
   b) Si se criban 10,000 personas, ¿cuántos falsos positivos esperas?
   c) El hospital decide informar solo a los pacientes que den positivo dos veces (asumiendo tests independientes). Recalcula P(enfermedad | dos positivos).

2. **Simulación**: Escribe una simulación del escenario anterior con 1 millón de pacientes virtuales para verificar tus cálculos.

3. **Modelo de churn de SaaS**: Una empresa SaaS predice el churn con:
   - Tasa de churn previa (prior): 8%
   - Sensibilidad del modelo: 85%
   - Especificidad del modelo: 80%

   Crea una función `churn_probability(prior, sensitivity, specificity)` que devuelva la probabilidad posterior. Úsala para:
   - Calcular P(churn | churn predicho)
   - Crear un gráfico que muestre cómo cambia la probabilidad posterior a medida que el prior varía de 0.01 a 0.50

4. **Escribe un informe breve** (1 página) que interprete estos resultados para una audiencia no técnica.

