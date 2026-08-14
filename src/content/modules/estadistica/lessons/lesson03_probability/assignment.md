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

   a) Calculá P(enfermedad | positivo) usando el teorema de Bayes
   b) Si se criban 10,000 personas, ¿cuántos falsos positivos esperás?
   c) El hospital decide informar solo a los pacientes que den positivo dos veces (asumiendo tests independientes). Recalculá P(enfermedad | dos positivos).

2. **Simulación**: Escribí una simulación del escenario anterior con 1 millón de pacientes virtuales para verificar tus cálculos.

3. **Modelo de churn de SaaS**: Una empresa SaaS predice el churn con:
   - Tasa de churn previa (prior): 8%
   - Sensibilidad del modelo: 85%
   - Especificidad del modelo: 80%

   Creá una función `churn_probability(prior, sensitivity, specificity)` que devuelva la probabilidad posterior. Usala para:
   - Calcular P(churn | churn predicho)
   - Crear un gráfico que muestre cómo cambia la probabilidad posterior a medida que el prior varía de 0.01 a 0.50

4. **Escribí un informe breve** (1 página) que interprete estos resultados para una audiencia no técnica.

## Entregables

- Notebook de Jupyter con el código, las simulaciones y los gráficos
- Una sección de informe en markdown

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Adecuado (2 pts) | Deficiente (1 pt) |
|----------|------------------|--------------|------------------|-------------|
| Cálculos de Bayes | Todos correctos | Errores menores | Uno correcto | Faltante |
| Simulación | Verificada analíticamente | Funciona pero limitada | Funciona parcialmente | Faltante |
| Modelo de churn + gráfico | Completo y claro | Problemas menores | Incompleto | Faltante |
| Informe | Claro, no técnico | Bueno pero técnico | Demasiado breve | Faltante |

**Total: 16 puntos**

## Tiempo estimado

2.5 horas
