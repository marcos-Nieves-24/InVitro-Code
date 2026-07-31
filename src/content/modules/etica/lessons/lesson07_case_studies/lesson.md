---
Module: 5
Lesson Number: 7
Lesson Title: Casos de Estudio en Salud y SaaS
Estimated Duration: 75 minutos
Prerequisites: L1-L6 (todas las lecciones anteriores)
Learning Objectives:
  - Analizar casos reales de fallas éticas en IA aplicando los cinco principios
  - Identificar patrones comunes en fallas éticas de IA
  - Proponer estrategias de mitigación para escenarios del mundo real
  - Evaluar compensaciones éticas en el diseño de sistemas de IA
Keywords: caso de estudio, COMPAS, Obermeyer, Amazon hiring, Apple Card, falla ética
Difficulty: Avanzado
Programming Concepts: Análisis de métricas de equidad, auditoría de modelos
Mathematical Concepts: Ninguno
Machine Learning Concepts: Evaluación de equidad, interpretación de modelos
Datasets Used: COMPAS recidivism, Adult Census Income
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Cinco casos que todo ML engineer debería conocer" eyebrow="INICIO">

<MascotMessage mood="neutral">
Estos no son ejercicios académicos. Son sistemas reales que afectaron a millones de personas. Cada uno falló de una manera distinta. Estudiarlos es la mejor vacuna contra repetir los mismos errores.
</MascotMessage>

La ética en IA se aprende en los casos reales. Cada falla tiene un patrón, una causa raíz, y una lección. Estos cinco casos cubren el espectro completo: sesgo algorítmico, discriminación de género, sesgo en datos de entrenamiento, y más.

</Section>

<Section number={2} title="Caso 1: COMPAS — Sesgo en justicia penal" eyebrow="CASO">

**Qué pasó:** Algoritmo de predicción de reincidencia usado en cortes de EE.UU. etiquetaba a acusados negros como alto riesgo al doble de tasa que blancos (45% vs 23% falsos positivos).

**Causa raíz:** Datos históricos sesgados + definición de equidad en disputa. El algoritmo no usaba raza como variable, pero otras variables actuaban como proxies.

**Principios violados:** Justicia, No maleficencia.

**Lección:** Que tu modelo no use atributos protegidos no garantiza que sea justo. Los proxies están en todos lados — código postal, nivel educativo, historial laboral.

</Section>

<Section number={3} title="Caso 2: Obermeyer — Sesgo en salud" eyebrow="CASO">

**Qué pasó:** Un algoritmo de salud usado en hospitales de EE.UU. asignaba sistemáticamente menor riesgo a pacientes negros que a pacientes blancos con el mismo nivel de enfermedad. Millones de pacientes afectados.

**Causa raíz:** **Label bias.** El algoritmo predecía "costo de salud futuro" como proxy de "necesidad de salud". Pero pacientes negros históricamente gastan menos en salud (por menor acceso, no por menor necesidad). El modelo aprendió que "negro = más barato = más sano".

**Principios violados:** Justicia, Beneficencia, No maleficencia.

<ConceptCard variant="key-idea">
**La lección más importante del caso Obermeyer:** la elección de la variable objetivo (label) es una decisión ética. "Costo de salud" no es lo mismo que "necesidad de salud". Si tu label ya está sesgado, ningún algoritmo te salva.
</ConceptCard>

</Section>

<Section number={4} title="Caso 3: Amazon Hiring — Sesgo de género" eyebrow="CASO">

**Qué pasó:** Amazon desarrolló un sistema de IA para filtrar currículums (2014-2017). El modelo penalizaba currículums que contenían la palabra "women's" (ej. "women's chess club captain") y favorecía verbos asociados a hombres.

**Causa raíz:** Datos de entrenamiento basados en 10 años de contrataciones históricas — dominadas por hombres en roles técnicos. El modelo aprendió que "hombre = buen candidato".

**Principios violados:** Justicia, No maleficencia.

**Lección:** Amazon detectó el sesgo y **canceló el proyecto**. Hicieron lo correcto. No todo modelo que construís debe desplegarse.

</Section>

<Section number={5} title="Caso 4: Apple Card — Discriminación algorítmica" eyebrow="CASO">

**Qué pasó:** En 2019, múltiples usuarios reportaron que Apple Card (en alianza con Goldman Sachs) ofrecía límites de crédito dramáticamente más bajos a mujeres que a hombres, incluso cuando compartían finanzas con sus esposos y tenían mejores historiales crediticios.

**Causa raíz:** Algoritmo de caja negra de Goldman Sachs. Sin explicación posible — el banco no podía explicar por qué esposas con mejor crédito recibían límites más bajos.

**Principios violados:** Justicia, Explicabilidad, No maleficencia.

<ReflectionCheck
  blockId="reflection-e07-apple-card"
  moduleSlug="etica"
  lessonSlug="lesson07_case_studies"
  prompt="El algoritmo de Apple Card era una caja negra. Nadie podía explicar por qué una mujer con mejor crédito recibía menos límite. Si fueras el CTO de Goldman Sachs, ¿qué harías diferente?"
  answer="(1) Auditoría de equidad antes del lanzamiento: medir disparities entre género, raza, edad en datos sintéticos o históricos. (2) Explicabilidad obligatoria: si el modelo no puede explicar una decisión, no se aprueba. (3) Monitoreo post-deploy: alertas automáticas cuando las disparidades entre grupos superen un umbral. (4) Canal de apelación humano: si un usuario cuestiona una decisión, un humano revisa y puede anularla. Apple Card falló en los cuatro."
/>

</Section>

<Section number={6} title="Patrones comunes" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
Los cinco casos comparten patrones: (1) el sesgo estaba en los datos, no en el código; (2) la métrica de éxito (accuracy, profit) ocultaba el daño; (3) nadie auditó el modelo antes de desplegarlo; (4) no había mecanismo de apelación para los afectados. Construir éticamente no es agregar un paso al final — es diseñar distinto desde el principio.
</ConceptCard>

<CalloutCheck>
**Checklist para no ser el próximo caso de estudio:** (1) Auditá tus datos antes de entrenar. (2) Medí disparidades entre grupos. (3) Preguntate qué pasa si tu modelo falla. (4) Documentá tus decisiones. (5) Tené un plan B si descubrís sesgo en producción.
</CalloutCheck>

</Section>
