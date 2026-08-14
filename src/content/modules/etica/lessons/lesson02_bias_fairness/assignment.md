# Assignment: Análisis de equidad de COMPAS

## Objetivos

- Analizar un caso real de bias algorítmico usando múltiples definiciones de equidad
- Implementar métricas de equidad e interpretar resultados
- Evaluar críticamente afirmaciones contrapuestas sobre la equidad algorítmica

## Instrucciones

### Parte 1: Leé y resumí (500 palabras)

Leé el artículo "Machine Bias" de ProPublica (Angwin et al., 2016) y resumí:
1. ¿Qué es COMPAS? ¿Qué predice?
2. ¿Cómo evaluó ProPublica su equidad?
3. ¿Cuáles fueron los hallazgos principales?
4. ¿Cómo respondió Northpointe (el desarrollador)?

### Parte 2: Replicá el análisis (Python)

Usando el dataset de COMPAS de ProPublica (disponible en https://github.com/propublica/compas-analysis), replicá el análisis de equidad clave:

1. Cargá los datos crudos de COMPAS (fecha de arresto de 2013–2014).
2. Filtrá para crear la misma muestra usada en el análisis de ProPublica (mismos criterios de filtrado).
3. Calculá accuracy, TPR, FPR por raza (solo acusados negros y blancos).
4. Calculá paridad demográfica, igualdad de oportunidades y probabilidades igualadas.
5. Creá una visualización que muestre las disparidades.

### Parte 3: Compará definiciones (500 palabras)

Escribí un análisis que compare las posiciones de ProPublica y Northpointe:
1. ¿Qué definición de equidad usó ProPublica?
2. ¿Qué definición de equidad usó Northpointe (calibración)?
3. ¿Pueden tener razón ambas? Explicá el teorema de imposibilidad en este contexto.
4. ¿Qué definición de equidad creés que es más apropiada para las sentencias penales? ¿Por qué?

### Parte 4: Recomendaciones (300 palabras)

Proponé al menos tres recomendaciones sobre cómo se deberían mejorar COMPAS (o herramientas similares de evaluación de riesgo). Considerá cambios técnicos, procedimentales y de política.

## Entregables

- Un notebook de Jupyter con la Parte 2 (código y salidas)
- Un informe en PDF con las Partes 1, 3 y 4

## Rúbrica

| Criterio | Puntos | Excelente | Bueno | Satisfactorio | Necesita mejorar |
|-----------|--------|-----------|------|--------------|-------------------|
| Resumen del caso | 15 | Preciso, exhaustivo | Mayormente preciso | Básico | Faltante o incorrecto |
| Implementación del código | 30 | Correcto, limpio, bien comentado | Mayormente correcto | Parcial | No funciona |
| Análisis de equidad | 25 | Todas las métricas calculadas e interpretadas | La mayoría de las métricas | Algunas métricas | Faltantes |
| Comparación de definiciones | 20 | Comprensión matizada de definiciones contrapuestas | Buen análisis | Básico | Limitado o incorrecto |
| Recomendaciones | 10 | Específicas, viables, reflexivas | Razonables | Genéricas | Faltantes |

**Total: 100 puntos**

## Tiempo estimado

5–6 horas

## Entrega

Enviá el notebook y el PDF a través del sistema de gestión de aprendizaje del curso.
