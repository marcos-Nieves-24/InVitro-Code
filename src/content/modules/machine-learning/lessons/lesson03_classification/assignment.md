# Assignment 3: Clasificación

## Objetivos

- Construir un pipeline de clasificación completo
- Manejar datos desbalanceados de forma apropiada
- Elegir métricas de evaluación según el contexto del negocio
- Escribir una recomendación basada en datos

## Escenario

Trabajás en una **startup de healthtech** que desarrolló un análisis de sangre para detectar una enfermedad. La enfermedad tiene 3% de prevalencia en la población evaluada. Tu análisis produce 30 mediciones de biomarcadores por paciente.

## Dataset

Usá `load_breast_cancer()` de scikit-learn. Tratá malignant = positivo (enfermedad presente), benign = negativo.

## Instrucciones

1. **Dividí** en entrenamiento (60%), validación (20%) y prueba (20%) con estratificación
2. **Entrená** una regresión logística (configuración por defecto)
3. **Evaluá** usando todas las métricas en el set de validación
4. **Encontrá el umbral óptimo** para dos escenarios:
   - Escenario A: Perderse un caso cuesta 50× más que una falsa alarma
   - Escenario B: Las falsas alarmas cuestan 10× más que perderse un caso
5. **Evaluación final** en el set de prueba usando los umbrales elegidos
6. **Escribí una recomendación** (máx. 300 palabras) para el CEO:
   - ¿Qué umbral usarías para evaluar a la población general?
   - ¿Qué tradeoff estás haciendo?
   - ¿Cuál es la tasa esperada de falsos positivos?

