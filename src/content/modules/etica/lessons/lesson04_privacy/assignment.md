# Assignment: Evaluación de impacto sobre la privacidad de un sistema de ML

## Objetivos

- Realizar una evaluación de impacto sobre la privacidad para un sistema de ML real o hipotético
- Identificar riesgos de privacidad en cada etapa del ciclo de vida del ML
- Proponer mitigaciones de preservación de privacidad
- Analizar la concesión entre privacidad y utilidad

## Instrucciones

### Parte 1: Descripción del sistema (300 palabras)

Describí un sistema de ML que procesa datos personales. Elegí uno:
- Una IA de diagnóstico que analiza registros médicos de pacientes
- Una plataforma SaaS de análisis de producto que rastrea el comportamiento de los usuarios
- Una IA de reclutamiento que filtra postulantes
- Un sistema de recomendación de redes sociales

Incluí: qué datos se recolectan, cómo se procesan, qué predice el modelo, quién tiene acceso y dónde está implementado el sistema.

### Parte 2: Identificación de riesgos de privacidad (500 palabras)

Para cada etapa del ciclo de vida del ML, identificá los riesgos de privacidad:

| Etapa | Riesgos de privacidad |
|-------|--------------|
| Recolección de datos | Consentimiento, transparencia, minimización de datos |
| Almacenamiento de datos | Seguridad, control de acceso, retención |
| Entrenamiento del modelo | Memorización, inferencia de membresía |
| Implementación del modelo | Acceso por API, inversión de modelo |
| Compartición del modelo | Fuga de datos en los parámetros |
| Eliminación de datos | Derecho al olvido, reentrenamiento del modelo |

### Parte 3: Análisis regulatorio (500 palabras)

Analizá cómo se aplican dos regulaciones a tu sistema:
1. GDPR: ¿Qué artículos son más relevantes? ¿Tu sistema cumple?
2. HIPAA (si hay datos de salud) o CCPA/otra regulación relevante para tu dominio

### Parte 4: Diseño con preservación de privacidad (500 palabras)

Proponé un rediseño de tu sistema con preservación de privacidad. Incluí:
1. ¿Qué medidas de minimización de datos implementarías?
2. ¿Usarías privacidad diferencial? ¿Qué epsilon elegirías? ¿Por qué?
3. ¿Cómo manejarías el consentimiento de los usuarios y las solicitudes de eliminación de datos?
4. ¿Qué controles técnicos implementarías (cifrado, control de acceso, registro de auditoría)?

### Parte 5: Apéndice técnico (opcional, crédito extra)

Implementá una versión con privacidad diferencial de una estadística clave o de una salida del modelo de tu sistema. Mostrá la concesión entre privacidad y utilidad.

## Entrega

Subí el PDF a través del sistema de gestión de aprendizaje del curso.
