# Assignment: Análisis de equidad de COMPAS

## Objetivos

- Analizar un caso real de bias algorítmico usando múltiples definiciones de equidad
- Implementar métricas de equidad e interpretar resultados
- Evaluar críticamente afirmaciones contrapuestas sobre la equidad algorítmica

## Instrucciones

### Parte 1: Lee y resume (500 palabras)

Lee el artículo "Machine Bias" de ProPublica (Angwin et al., 2016) y resume:
1. ¿Qué es COMPAS? ¿Qué predice?
2. ¿Cómo evaluó ProPublica su equidad?
3. ¿Cuáles fueron los hallazgos principales?
4. ¿Cómo respondió Northpointe (el desarrollador)?

### Parte 2: Replica el análisis (Python)

Usando el dataset de COMPAS de ProPublica (disponible en https://github.com/propublica/compas-analysis), replica el análisis de equidad clave:

1. Carga los datos crudos de COMPAS (fecha de arresto de 2013–2014).
2. Filtra para crear la misma muestra usada en el análisis de ProPublica (mismos criterios de filtrado).
3. Calcula accuracy, TPR, FPR por raza (solo acusados negros y blancos).
4. Calcula paridad demográfica, igualdad de oportunidades y probabilidades igualadas.
5. Crea una visualización que muestre las disparidades.

### Parte 3: Compara definiciones (500 palabras)

Escribe un análisis que compare las posiciones de ProPublica y Northpointe:
1. ¿Qué definición de equidad usó ProPublica?
2. ¿Qué definición de equidad usó Northpointe (calibración)?
3. ¿Pueden tener razón ambas? Explica el teorema de imposibilidad en este contexto.
4. ¿Qué definición de equidad crees que es más apropiada para las sentencias penales? ¿Por qué?

### Parte 4: Recomendaciones (300 palabras)

Propone al menos tres recomendaciones sobre cómo se deberían mejorar COMPAS (o herramientas similares de evaluación de riesgo). Considera cambios técnicos, procedimentales y de política.

## Entrega

Envía el notebook y el PDF a través del sistema de gestión de aprendizaje del curso.
