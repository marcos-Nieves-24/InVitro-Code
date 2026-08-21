---
Module: 5
Lesson Number: 6
Lesson Title: Regulación y Gobernanza
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Describir el marco regulatorio de IA de la UE (EU AI Act)
  - Clasificar sistemas de IA por nivel de riesgo
  - Comparar enfoques regulatorios de UE, EE.UU. y China
  - Identificar requisitos de cumplimiento para sistemas de IA en salud
Keywords: EU AI Act, GDPR, regulación, gobernanza, riesgo, cumplimiento, FDA, HIPAA
Difficulty: Intermedio
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: AI governance, risk classification, conformity assessment
Datasets Used: Ninguno
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="La ley alcanzó a la IA" eyebrow="INICIO">

<MascotMessage mood="neutral">
La era del "move fast and break things" en IA se terminó. La EU AI Act entró en vigor. Si construyes sistemas de IA para salud, biotecnología o SaaS en Europa, cumplir no es opcional — es legalmente obligatorio.
</MascotMessage>

Durante años, la IA operó en un vacío regulatorio. Las empresas se auto-regulaban con "principios éticos" voluntarios. Eso cambió. La **EU AI Act** (2024) es la primera regulación integral de IA del mundo, y establece un marco basado en riesgo que clasifica los sistemas en cuatro niveles.

<ConceptCard variant="key-idea">
La regulación no es el enemigo de la innovación. Es el marco que establece las reglas del juego para que la innovación no ocurra a costa de los derechos de las personas. Un mercado sin reglas no es libre — es salvaje.
</ConceptCard>

</Section>

<Section number={2} title="EU AI Act: los 4 niveles de riesgo" eyebrow="REGULACIÓN">

<ComparisonTable
  rows={[
    { feature: "🔴 Riesgo inaceptable", left: "PROHIBIDO. Sistemas de puntuación social gubernamental, identificación biométrica en tiempo real en espacios públicos, manipulación subliminal. No se pueden desplegar en la UE." },
    { feature: "🟠 Alto riesgo", left: "REGULADO ESTRICTAMENTE. Dispositivos médicos con IA, sistemas de contratación, crédito, justicia penal, infraestructura crítica. Requieren evaluación de conformidad, supervisión humana, transparencia, documentación técnica." },
    { feature: "🟡 Riesgo limitado", left: "OBLIGACIONES DE TRANSPARENCIA. Chatbots (revelar que son IA), deepfakes (etiquetar como generados), sistemas de recomendación. Los usuarios deben saber que interactúan con IA." },
    { feature: "🟢 Riesgo mínimo", left: "SIN RESTRICCIONES. Filtros de spam, videojuegos con IA, sistemas de recomendación de bajo impacto. La mayoría de las aplicaciones actuales." },
  ]}
/>

<CalloutInfo>
**Lo que más te afecta como ML engineer:** los sistemas de alto riesgo deben documentar datasets de entrenamiento, realizar evaluación de sesgos, mantener registros de funcionamiento, y garantizar supervisión humana. Si tu modelo de diagnóstico médico no tiene esto documentado, no es legal en la UE.
</CalloutInfo>

</Section>

<Section number={3} title="Panorama regulatorio global" eyebrow="REGULACIÓN">

<ComparisonTable
  rows={[
    { feature: "UE (EU AI Act)", left: "Basado en riesgo. Prohíbe usos inaceptables, regula estrictamente alto riesgo. Enfoque preventivo. Multas de hasta 7% de ingresos globales." },
    { feature: "EE.UU. (sectorial)", left: "Regulación por sector: FDA para dispositivos médicos, FTC para protección al consumidor, EEOC para empleo. No hay ley federal integral. Enfoque reactivo (demandas)." },
    { feature: "China (control estatal)", left: "Regulación de algoritmos de recomendación, deepfakes, y IA generativa. Requiere licencias para modelos fundacionales. Enfoque de control estatal sobre contenido y competencia." },
  ]}
/>

<CalloutCheck>
Si tu SaaS opera globalmente, necesitas cumplir con las regulaciones de cada mercado. La EU AI Act es la más estricta, y su efecto Bruselas significa que muchas empresas globales la adoptan como estándar mínimo en todas sus operaciones.
</CalloutCheck>

</Section>

<Section number={4} title="Gobernanza interna: lo que tu equipo necesita" eyebrow="HERRAMIENTA">

<ConceptCard variant="key-idea">
La gobernanza de IA no es solo cumplir regulaciones externas. Es establecer procesos internos para que cada modelo que construyes pase por un checklist ético antes de desplegarse.
</ConceptCard>

**Checklist mínimo de gobernanza:**

1. **Inventario de modelos:** ¿Qué modelos tienes en producción? ¿Qué datos usan? ¿A quién afectan?
2. **Clasificación de riesgo:** ¿Es alto riesgo según EU AI Act? ¿Qué pasaría si falla?
3. **Auditoría de sesgo:** ¿Mediste disparidades entre grupos? ¿Documentaste los resultados?
4. **Registro de decisiones:** ¿Por qué elegiste este modelo y no otro? ¿Qué métricas priorizaste?
5. **Plan de respuesta a incidentes:** Si el modelo causa daño, ¿quién responde? ¿Cómo se corrige?

<ReflectionCheck
  blockId="reflection-e06-governance-gap"
  moduleSlug="etica"
  lessonSlug="lesson06_regulation"
  prompt="Tu startup de biotech tiene 5 personas. ¿Necesitas gobernanza de IA? ¿O eso es solo para Google y OpenAI?"
  answer="Sí, necesitas gobernanza — adaptada a tu escala. No necesitas un comité de ética de 20 personas. Pero sí necesitas: (1) documentar qué modelos usas y por qué, (2) un checklist de 5 preguntas que todo modelo debe responder antes de deploy, (3) saber quién es responsable si algo sale mal. La gobernanza escala con la empresa. Lo que no escala es la responsabilidad: un modelo que causa daño no es menos dañino porque lo hizo una startup."
/>

</Section>

<Section number={5} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La EU AI Act clasifica sistemas por nivel de riesgo y establece obligaciones crecientes. Los sistemas de alto riesgo (salud, biotecnología) requieren documentación exhaustiva. La gobernanza interna no es burocracia — es proteger a tus usuarios y a tu empresa. La regulación no frena la innovación: la encauza.
</ConceptCard>

</Section>
