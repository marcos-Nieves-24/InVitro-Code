# Lab: Análisis Integral de Casos de Estudio de Ética de la IA

## Objetivo

Realiza un análisis ético completo de un sistema de IA real o hipotético, aplicando todos los conceptos del Módulo 5 (principios, bias, fairness, transparencia, privacidad, impacto social, regulación).

## Duración

75 minutos

## Requisitos previos

Lecciones 1–7

## Instrucciones

### Parte 1: Selección y descripción del caso (10 minutos)

Elige uno de los siguientes casos. Lee la descripción y los recursos vinculados.

**Caso A: Selección de currículums impulsada por IA**

Una empresa despliega un sistema de IA para filtrar currículums y ordenar a los candidatos para entrevistas. El sistema se entrenó con los datos históricos de contratación de la empresa (10 años). El equipo de ingeniería de la empresa es 82% masculino y 74% blanco. El sistema ordena a los candidatos. Después del despliegue, la diversidad de los candidatos que llegan a entrevistas cae un 40%.

**Caso B: IA en el reclutamiento para ensayos clínicos**

Una empresa farmacéutica usa un sistema de IA para identificar pacientes elegibles para un ensayo clínico de un nuevo fármaco cardíaco. El modelo se entrena con historias clínicas electrónicas de grandes hospitales urbanos. El modelo identifica menos pacientes elegibles de zonas rurales y poblaciones minoritarias. El fármaco debe probarse en una población diversa para la aprobación de la FDA.

**Caso C: Chatbot de IA para apoyo de salud mental**

Una empresa SaaS lanza un chatbot de IA que brinda apoyo de salud mental a los usuarios. El chatbot se entrenó con transcripciones de terapia y datos clínicos licenciados. Los usuarios comparten información personal sensible con el chatbot. La empresa quiere usar los datos de las conversaciones para mejorar el modelo.

### Parte 2: Análisis estructurado (35 minutos)

Para tu caso elegido, analiza usando el siguiente marco:

**1. Análisis de los cinco principios (10 min)**
Para cada principio (beneficencia, no maleficencia, autonomía, justicia, explicabilidad), indica si el sistema satisface, satisface parcialmente o viola el principio. Explica tu razonamiento.

**2. Análisis de bias (5 min)**
- ¿Qué tipos de bias podrían estar presentes (de datos, algorítmico, social)?
- ¿Qué métricas de fairness calcularías?
- ¿Qué estrategias de mitigación de bias recomendarías?

**3. Análisis de explicabilidad (5 min)**
- ¿El sistema necesita ser explicable? ¿Por qué sí o por qué no?
- ¿Qué tipo de explicaciones se necesitan (globales, locales, ambas)?
- ¿Qué método (LIME, SHAP u otro) usarías?

**4. Análisis de privacidad (5 min)**
- ¿Qué datos recolecta el sistema?
- ¿Qué riesgos de privacidad existen?
- ¿Sería apropiada la privacidad diferencial? ¿Qué epsilon usarías?

**5. Impacto social (5 min)**
- ¿Cuáles son los impactos sociales más amplios (empleo, equidad, desinformación)?
- ¿Quién se beneficia? ¿Quién asume los costos o riesgos?

**6. Análisis regulatorio (5 min)**
- ¿Qué regulaciones aplican (Ley de IA de la UE, GDPR, HIPAA, otras)?
- ¿Qué clasificación de riesgo según la Ley de IA de la UE?
- ¿Qué pasos de cumplimiento se necesitan?

### Parte 3: Recomendaciones (15 minutos)

Escribe tres recomendaciones específicas y accionables:
1. Un arreglo rápido (implementable en < 1 mes)
2. Una mejora a mediano plazo (1–6 meses)
3. Un cambio sistémico a largo plazo (6+ meses)

### Parte 4: Discusión en grupo (15 minutos)

Comparte tu análisis con un compañero o un grupo pequeño. Discute:
- ¿Identificaron riesgos distintos para el mismo caso?
- ¿Qué compensaciones encontraron?
- ¿Son factibles sus recomendaciones?
- ¿Qué priorizarían?

## Entregables

Envía tu análisis estructurado (Parte 2) y tus recomendaciones (Parte 3).

## Rúbrica

| Criterio | Puntos | Excelente | Bueno | Satisfactorio | Necesita mejorar |
|-----------|--------|-----------|------|--------------|-------------------|
| Cinco principios | 20 | Todos aplicados correctamente con matices | Cuatro correctos | Tres correctos | < 3 o incorrectos |
| Bias y fairness | 15 | Tipos, métricas y mitigaciones todos abordados | Bueno | Básico | Faltante |
| Explicabilidad | 15 | Método apropiado, adecuado a la audiencia | Bueno | Básico | Faltante |
| Privacidad | 15 | Riesgos identificados, protecciones apropiadas | Bueno | Básico | Faltante |
| Impacto social | 10 | Minucioso, matizado | Bueno | Básico | Faltante |
| Regulación | 10 | Clasificación correcta, requisitos específicos | Bueno | Básico | Faltante |
| Recomendaciones | 15 | Tres específicas, factibles, con plazos | Dos buenas | Una buena | Faltantes |
