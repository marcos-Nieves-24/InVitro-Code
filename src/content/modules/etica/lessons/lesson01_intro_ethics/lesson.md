---
Module: 5
Lesson Number: 1
Lesson Title: Introducción a la Ética en IA
Estimated Duration: 60 minutos
Prerequisites: Módulo 4 (Machine Learning)
Learning Objectives:
  - Definir la ética en el contexto de la inteligencia artificial
  - Explicar por qué la ética en IA es importante para biotecnología y aplicaciones SaaS
  - Identificar los cinco principios éticos clave para IA: beneficencia, no maleficencia, autonomía, justicia, explicabilidad
  - Analizar casos reales donde fallas éticas en IA causaron daño
  - Evaluar las compensaciones entre principios éticos en conflicto en el diseño de sistemas
Keywords: ética, beneficencia, no maleficencia, autonomía, justicia, explicabilidad, equidad, rendición de cuentas
Difficulty: Introductory
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: Evaluación de modelos, clasificación, regresión (repaso)
Datasets Used: Ninguno
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Cuando la precisión no alcanza" eyebrow="INICIO">

<MascotMessage mood="serious">
La ética en IA no es filosofía abstracta. Es ingeniería aplicada. Un modelo con 94% de accuracy puede estar matando gente si ese 6% de error se concentra en una población vulnerable. Hoy aprendés a ver lo que las métricas no muestran.
</MascotMessage>

Imaginá que construís un modelo que predice diabetes con 94% de precisión. Lo desplegás en un hospital. Meses después descubrís que subdiagnostica sistemáticamente a mujeres de color — justamente la población que más necesita detección temprana.

Esto no es hipotético. En 2019, investigadores descubrieron que un algoritmo de salud usado en hospitales de EE.UU. estaba sesgado contra pacientes negros, clasificándolos como más saludables que pacientes blancos igualmente enfermos (Obermeyer et al., 2019). El algoritmo estaba desplegado en hospitales que atienden a millones.

<ConceptCard variant="key-idea">
La ética en IA pregunta: ¿Qué deberíamos construir? ¿Cómo deberíamos construirlo? ¿Quién podría resultar dañado? ¿Qué responsabilidades tenemos hacia las personas afectadas por nuestros sistemas? Si trabajás en biotecnología, salud o SaaS, entender esto es tan esencial como entender el gradiente descendente.
</ConceptCard>

</Section>

<Section number={2} title="Por qué importa (y no es opcional)" eyebrow="CONTEXTO">

<CalloutInfo>
1. **Prevención de daños.** Los sistemas de ML causan daño real — predicciones sesgadas, violaciones de privacidad, desplazamiento laboral. La ética minimiza el daño previsible.

2. **Confianza.** Una sola falla ética destruye la credibilidad. Pacientes, usuarios y reguladores exigen sistemas confiables.

3. **Cumplimiento legal.** La EU AI Act, GDPR, HIPAA imponen requisitos legales. La ignorancia no es defensa.

4. **Mejor ciencia.** Considerar quién está en tus datos, cómo construís features, y para qué optimizás conduce a modelos más robustos.
</CalloutInfo>

</Section>

<Section number={3} title="Los cinco principios" eyebrow="CONCEPTO">

Floridi y Cowls (2019) sintetizaron más de 50 guías de ética en IA en cinco principios:

<ConceptCard variant="definition">
**1. Beneficencia — Hacer el bien.** Los sistemas de IA deben diseñarse para beneficiar a la humanidad. Evaluá no solo la precisión, sino si el sistema realmente mejora resultados. Una IA de diagnóstico debe medirse por si los pacientes mejoran, no solo por su accuracy.
</ConceptCard>

<ConceptCard variant="definition">
**2. No maleficencia — No hacer daño.** Prevenir daño directo (diagnóstico erróneo), indirecto (sesgo, discriminación) y a largo plazo (desigualdad social). Antes de desplegar un sistema de contratación, evaluá si rechaza desproporcionadamente a ciertos grupos.
</ConceptCard>

<ConceptCard variant="definition">
**3. Autonomía — Humanos al mando.** Consentimiento informado, derecho a rechazar decisiones automatizadas, supervisión humana significativa. Un paciente debe saber cuándo un diagnóstico viene de una IA, y el médico debe tener la última palabra.
</ConceptCard>

<ConceptCard variant="definition">
**4. Justicia — Ser equitativo.** Los beneficios de la IA deben distribuirse entre todas las poblaciones. Proteger grupos vulnerables. Si tu modelo predice riesgo de enfermedad, debe funcionar igual de bien en todos los grupos demográficos.
</ConceptCard>

<ConceptCard variant="definition">
**5. Explicabilidad — Poder explicar.** Las decisiones de IA deben ser comprensibles. Los afectados tienen derecho a saber por qué se tomó una decisión. Un modelo de crédito que dice "rechazado" sin explicación no es aceptable.
</ConceptCard>

</Section>

<Section number={4} title="Compensaciones: cuando los principios chocan" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Precisión vs Justicia", left: "Un modelo más complejo puede ser más preciso pero introducir sesgo difícil de detectar" },
    { feature: "Privacidad vs Beneficencia", left: "Más datos de pacientes mejoran el diagnóstico pero comprometen la privacidad" },
    { feature: "Explicabilidad vs Rendimiento", left: "Los modelos más interpretables (regresión) suelen ser menos precisos que cajas negras (deep learning)" },
    { feature: "Autonomía vs Eficiencia", left: "La supervisión humana ralentiza las decisiones pero protege contra errores automáticos" },
  ]}
/>

<ReflectionCheck
  blockId="reflection-e01-tradeoffs"
  moduleSlug="etica"
  lessonSlug="lesson01_intro_ethics"
  prompt="Estás diseñando un sistema de diagnóstico de cáncer. ¿Qué principio priorizás si tenés que elegir entre maximizar la precisión (más vidas salvadas en general) y garantizar justicia (igual precisión en todos los grupos demográficos)?"
  answer="No hay respuesta universal — es una decisión de diseño con implicaciones éticas. Podés argumentar justicia: si el modelo falla más en ciertos grupos, estás creando un sistema de dos niveles donde algunos reciben peor atención médica. O podés argumentar beneficencia: más vidas totales salvadas es mejor, aunque la distribución no sea perfecta. La clave es hacer la decisión explícita y documentarla, no pretender que la métrica la tomó por vos."
/>

</Section>

<Section number={5} title="El caso real que lo cambió todo" eyebrow="INTERACTIVA">

En 2016, ProPublica investigó COMPAS, un algoritmo usado en cortes de EE.UU. para predecir reincidencia criminal:

- **Accuracy general:** ~65% (modesta pero "aceptable" para el contexto)
- **Falsos positivos en personas negras:** 45% (el algoritmo dijo "reincidirá" y no lo hizo)
- **Falsos positivos en personas blancas:** 23%
- **Falsos negativos en personas blancas:** 48% (el algoritmo dijo "no reincidirá" y sí lo hizo)

<ConceptCard variant="key-idea">
El algoritmo no usaba la raza como variable. El sesgo emergió de los datos históricos: un sistema de justicia que ya era desigual produjo datos desiguales, y el modelo aprendió y amplificó esa desigualdad. Esto se llama **sesgo histórico**.
</ConceptCard>

<CalloutCheck>
La lección de COMPAS: que tu modelo no use una variable protegida (raza, género) no garantiza que sea justo. Otras variables (código postal, nivel educativo, historial laboral) pueden actuar como proxies y producir exactamente el mismo sesgo.
</CalloutCheck>

</Section>

<Section number={6} title="Marco para análisis ético" eyebrow="HERRAMIENTA">

Cuando evalúes un sistema de IA, hacete estas preguntas:

1. **¿A quién afecta?** ¿Quiénes son los stakeholders? ¿Hay grupos vulnerables?
2. **¿Qué podría salir mal?** ¿Cuáles son los peores escenarios?
3. **¿Qué datos estoy usando?** ¿Representan a todas las poblaciones? ¿Hay sesgo histórico?
4. **¿Quién es responsable?** Si algo sale mal, ¿quién rinde cuentas?
5. **¿Puedo explicarlo?** ¿Entiendo por qué el modelo toma cada decisión?

<CalloutInfo>
Este marco no reemplaza el juicio ético — lo estructura. La ética no se automatiza. Pero hacer estas preguntas sistemáticamente es mejor que no hacerlas.
</CalloutInfo>

</Section>

<Section number={7} title="Resumen" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
La ética en IA es una disciplina de ingeniería, no filosofía abstracta. Los cinco principios — beneficencia, no maleficencia, autonomía, justicia, explicabilidad — son tu checklist. Los principios chocan en la práctica y tenés que elegir. La precisión no es suficiente: un modelo puede ser preciso en promedio y causar daño real. Los datos heredan los sesgos del mundo que los produjo.
</ConceptCard>

</Section>
