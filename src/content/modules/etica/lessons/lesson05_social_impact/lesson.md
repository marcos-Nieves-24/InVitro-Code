---
Module: 5
Lesson Number: 5
Lesson Title: Impacto Social de la IA
Estimated Duration: 60 minutos
Prerequisites: L1 (Introducción a la Ética en IA)
Learning Objectives:
  - Identificar impactos sociales de la IA en empleo, desigualdad y medio ambiente
  - Analizar bucles de retroalimentación en sistemas algorítmicos
  - Evaluar el costo ambiental del entrenamiento de modelos grandes
  - Proponer estrategias para maximizar impacto positivo
Keywords: impacto social, automatización, desigualdad, brecha digital, sostenibilidad, desplazamiento laboral
Difficulty: Intermedio
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: system-level thinking, feedback loops, deployment considerations
Datasets Used: Ninguno
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Más allá del modelo: el mundo que cambia" eyebrow="INICIO">

<MascotMessage mood="thinking">
Un modelo de ML no vive en un vacío. Cuando lo despliegas, cambia el comportamiento de las personas que interactúan con él. Y ese cambio genera nuevos datos. Y esos datos re-entrenan el modelo. Entender estos bucles es tan importante como entender el algoritmo.
</MascotMessage>

Los modelos de ML no solo hacen predicciones — cambian el mundo. Un sistema de recomendación de contenido no solo sugiere videos; moldea lo que la gente ve, piensa y comparte. Un algoritmo de contratación no solo filtra candidatos; redefine qué significa "ser un buen candidato". Estos efectos de segundo orden son el impacto social de la IA.

</Section>

<Section number={2} title="Bucles de retroalimentación" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Un **bucle de retroalimentación algorítmica** ocurre cuando las predicciones de un modelo influyen en los datos futuros con los que se re-entrenará, creando un ciclo que se auto-refuerza.
</ConceptCard>

Ejemplos:
- **YouTube:** El algoritmo recomienda contenido extremo porque genera más engagement → la gente ve más contenido extremo → el algoritmo aprende que "extremo = engagement" → recomienda más
- **Policía predictiva:** El modelo envía más patrullas a zonas con más arrestos históricos → se registran más arrestos en esas zonas → el modelo "confirma" que esas zonas son peligrosas
- **Contratación:** El modelo aprende de contrataciones pasadas (mayoría hombres) → recomienda más hombres → la empresa contrata más hombres → datos futuros refuerzan el sesgo

<CalloutCheck>
La pregunta clave: ¿tus predicciones cambian la distribución de los datos futuros? Si la respuesta es sí, estás en un bucle de retroalimentación. Modelar el sistema, no solo el modelo.
</CalloutCheck>

</Section>

<Section number={3} title="Automatización y empleo" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
La IA no elimina trabajos — transforma tareas. El impacto no es uniforme: los trabajos rutinarios y de ingresos medios son los más afectados. Los trabajos que requieren creatividad, empatía o juicio contextual son más resistentes. La pregunta no es "¿cuántos empleos se pierden?" sino "¿quién pierde, quién gana, y qué hacemos al respecto?"
</ConceptCard>

- **Biotecnología:** La IA acelera el descubrimiento de fármacos pero cambia el rol del científico de "probar compuestos" a "diseñar experimentos que la IA no puede diseñar"
- **SaaS:** La IA automatiza soporte al cliente (chatbots) pero crea nuevos roles en "conversational design" y supervisión de calidad
- **Medicina:** La IA asiste en diagnóstico pero no reemplaza al médico — redefine su rol hacia la interpretación y comunicación

</Section>

<Section number={4} title="Costo ambiental" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
Entrenar un solo modelo de lenguaje grande (LLM) puede emitir tanto CO₂ como 5 autos durante toda su vida útil. La inferencia (uso diario del modelo) multiplica ese costo. El impacto ambiental del ML no es un efecto secundario — es parte del diseño.
</ConceptCard>

<CalloutInfo>
- **GPT-3:** ~552 toneladas de CO₂ para entrenar
- **Una búsqueda con IA:** ~10x más energía que una búsqueda tradicional
- **Data centers:** Consumen ~1% de la electricidad mundial (y creciendo)
- **Agua:** Un centro de datos puede consumir millones de litros diarios para refrigeración
</CalloutInfo>

<CalloutCheck>
Buenas prácticas: prefiere modelos más chicos cuando la ganancia marginal no justifica el costo. Reporta el costo ambiental junto con las métricas de accuracy. Elige regiones de nube con energía renovable. La sustentabilidad es un requisito ético, no un nice-to-have.
</CalloutCheck>

</Section>

<Section number={5} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
Los modelos de ML crean bucles de retroalimentación que transforman los datos futuros. La automatización afecta desproporcionadamente a ciertos sectores. El costo ambiental del entrenamiento es real y medible. Diseñar para impacto social positivo requiere pensar en sistemas, no solo en modelos.
</ConceptCard>

</Section>
