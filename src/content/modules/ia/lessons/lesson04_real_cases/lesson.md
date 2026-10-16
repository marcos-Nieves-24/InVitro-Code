---
Module: 1
Lesson Number: 4
Lesson Title: Casos Reales y Futuro
Estimated Duration: 60 minutos
Prerequisites: Lección 3 — IA en Biotecnología
Learning Objectives:
  - Analizar cómo se aplicó ML en el desarrollo de la vacuna mRNA del COVID-19
  - Comprender el reposicionamiento de fármacos mediante modelos predictivos
  - Evaluar las limitaciones actuales de la IA en biotecnología
  - Discutir el futuro de la IA en el laboratorio
Keywords: mRNA, vacunas, reposicionamiento, ARN, nanolípidos, docking, DeepMind, Isomorphic Labs
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno nuevos
Machine Learning Concepts: Aplicaciones, limitaciones, pipeline completo
Datasets Used: Ninguno específico
---

<Section number={1} title="De los fundamentos a las aplicaciones" eyebrow="INICIO">

<RevealSequence>

<MascotMessage>
Llegamos a la última lección del módulo. Hasta aquí viste features, reglas, algoritmos, y pipelines. Ahora veamos dónde se aplica TODO.
</MascotMessage>

<div className="space-y-3">
<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">En tres lecciones recorrimos un camino enorme:</p>
<ol className="m-0 list-decimal space-y-1.5 pl-5">
<li><strong>Features y reglas fijas</strong>: cómo describir conidias por sus características y por qué las reglas manuales fallan</li>
<li><strong>Algoritmos de aprendizaje</strong>: frontera de decisión, KNN, regresión, y el problema del overfitting</li>
<li><strong>Aplicaciones biotecnológicas</strong>: visualización 3D de proteínas, AlphaFold, pipelines de ML</li>
</ol>
</div>
<p className="m-0 text-sm text-gray-700">La Lección 4 cierra el módulo con casos reales donde todo esto confluye: el desarrollo de la vacuna mRNA del COVID-19, el reposicionamiento de fármacos existentes, el diseño de nanopartículas y una mirada crítica a lo que la IA puede — y no puede — hacer en biotecnología.</p>
</div>

</RevealSequence>

</Section>

<Section number={2} title="El problema: COVID-19" eyebrow="CONTEXTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">A principios de 2020, el mundo enfrentó una pandemia. En menos de un año se desarrollaron vacunas efectivas — un hito que normalmente toma 5-10 años. La IA jugó un papel clave.</p>
<ConceptCard variant="definition">
El **desafío de una vacuna** es encontrar la molécula que le enseñe al sistema inmune a reconocer un patógeno sin causar la enfermedad. Con la vacuna mRNA, en lugar de inyectar el virus inactivado, se inyecta el **mensaje genético** para que nuestras propias células produzcan la proteína viral y generen inmunidad.
</ConceptCard>
<p className="m-0 text-sm text-gray-700">Pero el mRNA es frágil y no entra fácilmente a las células. Aquí es donde la IA entró en juego.</p>
</div>

</RevealSequence>

</Section>

<Section number={3} title="IA en las nanopartículas lipídicas" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">La vacuna mRNA necesita un <strong>vehículo</strong> para llevar el mensaje genético a las células: las nanopartículas lipídicas (LNPs). Son burbujas microscópicas de grasa que encapsulan el mRNA.</p>
<ChoiceQuestion
  question="Diseñar la LNP óptima implica miles de formulaciones. ¿Cómo acelera la IA ese proceso?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-lnp-1"
  allowContinueOnIncorrect
  explanation="La IA entrena con formulaciones previas y predice las 50 más prometedoras, evitando probar 1.000 al azar y ahorrando meses."
  options={[
    { id: "a", label: "Probando todas las combinaciones al azar en el laboratorio sin usar datos", correct: false, feedback: "Eso es lo que hacía el método tradicional lento; la IA justamente evita eso." },
    { id: "b", label: "Entrenando un modelo con formulaciones previas para predecir las más efectivas y priorizarlas", correct: true, feedback: "¡Correcto! El modelo aprende composición → rendimiento y guía los experimentos." },
    { id: "c", label: "Reemplazando por completo los experimentos de laboratorio", correct: false, feedback: "La IA no reemplaza el laboratorio; lo hace más inteligente y enfocado." },
    { id: "d", label: "Eligiendo lípidos solo por su precio más barato", correct: false, feedback: "El costo no determina eficacia ni estabilidad; importan las propiedades químicas." },
  ]}
/>
</div>

<ConceptCard variant="key-idea">
La IA no reemplazó los experimentos de laboratorio. Los hizo **más inteligentes**: en lugar de probar 1,000 formulaciones al azar, los modelos predijeron cuáles 50 tenían más probabilidad de funcionar. Eso aceleró el desarrollo meses.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={4} title="Reposicionamiento de fármacos" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">Otro uso de la IA durante la pandemia fue el <strong>reposicionamiento</strong> (drug repositioning): encontrar fármacos existentes que pudieran tratar el COVID-19.</p>
<ChoiceQuestion
  question="Si tienes datos de qué fármacos se unen a qué proteínas virales, ¿cómo modelas el reposicionamiento y qué métrica priorizas?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-reposition-1"
  allowContinueOnIncorrect
  explanation="Es clasificación binaria (se une/no se une). En clínica priorizas sensibilidad/recall para no descartar fármacos útiles, balanceando con especificidad para no generar falsos positivos costosos."
  options={[
    { id: "a", label: "Regresión para predecir concentración; métrica principal R²", correct: false, feedback: "No es predecir número continuo, sino decidir si hay unión o no." },
    { id: "b", label: "Clasificación binaria se une/no se une; priorizar sensibilidad para minimizar falsos negativos", correct: true, feedback: "¡Exacto! Un falso negativo descarta un fármaco que podría salvar vidas." },
    { id: "c", label: "Clustering sin etiquetas; no hay métrica clínica", correct: false, feedback: "Tenemos etiquetas (se une/no), así que es supervisado, no clustering." },
    { id: "d", label: "Clasificación pero priorizar accuracy sin distinguir errores", correct: false, feedback: "Accuracy solo oculta la diferencia entre falso positivo y falso negativo, crítica en clínica." },
  ]}
/>
</div>

<div className="space-y-3">
<ConceptCard variant="definition">
**Reposicionamiento**: usar modelos de ML para predecir qué fármacos aprobados podrían interactuar con una nueva proteína diana. Ahorra años de desarrollo porque el fármaco ya pasó las pruebas de seguridad (ej. **Baricitinib** para artritis reumatoide y **Remdesivir** acelerados por predicciones computacionales).
</ConceptCard>
<CalloutInfo>
<strong>Rentosertib (INS018_055):</strong> Insilico Medicine descubrió este candidato usando modelos generativos de IA en solo <strong>18 meses</strong> desde la identificación del objetivo hasta el candidato preclínico (PCC). El proceso tradicional suele llevar de 4 a 6 años, lo que muestra cuánto puede acelerar la IA el descubrimiento de fármacos.
</CalloutInfo>
</div>

<ChoiceQuestion
  question="¿Por qué es revolucionario descubrir un fármaco en 18 meses y qué validaciones siguen siendo obligatorias?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-rentosertib-1"
  allowContinueOnIncorrect
  explanation="Ahorra años y costos vs 4-6 años tradicionales, pero no reemplaza toxicología, seguridad y fases clínicas en humanos."
  options={[
    { id: "a", label: "Porque reemplaza todos los ensayos y ya se puede usar en humanos", correct: false, feedback: "No: sigue requiriendo validación clínica completa." },
    { id: "b", label: "Acelera el acceso pero siguen siendo obligatorias toxicología y fases clínicas", correct: true, feedback: "¡Exacto! IA acelera, validación confirma." },
    { id: "c", label: "No es revolucionario, siempre se descubren fármacos en 18 meses", correct: false, feedback: "Tradicional lleva 4-6 años; 18 meses es un salto enorme." },
    { id: "d", label: "Solo importa el costo, no la seguridad", correct: false, feedback: "Seguridad y eficacia son prioritarias, no solo el costo." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={5} title="AlphaFold en la práctica" eyebrow="CONCEPTO">

<RevealSequence>

<ChoiceQuestion
  question="AlphaFold predice estructuras para docking de fármacos. ¿Qué limitación puede causar falsos positivos si te basas solo en la predicción?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-alphafold-1"
  allowContinueOnIncorrect
  explanation="AlphaFold da la conformación más probable, pero las proteínas son dinámicas y cambian al unirse. Validar experimentalmente sigue siendo obligatorio."
  options={[
    { id: "a", label: "Las proteínas son dinámicas; la predicción es estática y puede no reflejar el estado activo", correct: true, feedback: "¡Correcto! Por eso una predicción útil sigue necesitando confirmación experimental." },
    { id: "b", label: "AlphaFold solo predice proteínas humanas, no virales", correct: false, feedback: "Predice cualquier secuencia, incluidas proteínas virales." },
    { id: "c", label: "Las predicciones son siempre incorrectas por definición", correct: false, feedback: "No: CASP14 alcanzó 92.4 GDT, comparable a métodos experimentales en muchos casos." },
    { id: "d", label: "El docking no se puede simular con computadoras", correct: false, feedback: "Sí se puede simular; justamente la estructura predicha permite el screening virtual." },
  ]}
/>

<div className="space-y-3">
<ConceptCard variant="key-idea">
<strong>CASP14 y el score de 92.4 GDT:</strong> En 2020, AlphaFold 2 alcanzó una puntuación mediana de <strong>92.4 sobre 100</strong> en la competencia CASP14, muy por encima del segundo equipo (~80). Este fue un punto de inflexión para la biología computacional: por primera vez una IA predijo estructuras de proteínas con una precisión comparable a los métodos experimentales en muchos casos.
</ConceptCard>
<ConceptCard variant="warning">
AlphaFold predice estructuras, pero las proteínas no son estáticas. Se mueven, vibran, cambian de forma al interactuar. Una estructura predicha es una aproximación útil, no la verdad absoluta. Los experimentos de laboratorio siguen siendo necesarios para validar.
</ConceptCard>
</div>

</RevealSequence>

</Section>

<Section number={6} title="AlphaFold en la industria" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">DeepMind se asoció con Isomorphic Labs para llevar AlphaFold a la industria farmacéutica. El objetivo: usar predicciones de estructura para acelerar el diseño de fármacos.</p>
<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">Casos de uso actuales:</p>
<ul className="m-0 list-disc space-y-1.5 pl-5">
<li><strong>Enfermedades parasitarias</strong>: AlphaFold ayudó a predecir estructuras de proteínas de parásitos que antes no tenían estructura resuelta, identificando nuevas dianas terapéuticas</li>
<li><strong>Resistencia antimicrobiana</strong>: predecir cómo mutan las proteínas bacterianas para volverse resistentes a antibióticos</li>
<li><strong>Enfermedades raras</strong>: cuando una mutación genética cambia la forma de una proteína, AlphaFold puede predecir el efecto y ayudar a diseñar terapias</li>
</ul>
</div>
</div>

<ChoiceQuestion
  question="AlphaFold democratizó estructuras 3D: ¿qué oportunidades y riesgos crea para labs con menos recursos?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-industria-1"
  allowContinueOnIncorrect
  explanation="Oportunidad: investigación que antes requería equipamiento costoso ahora es accesible. Riesgo: confiar ciegamente sin validación y seleccionar una diana incorrecta, desperdiciando años."
  options={[
    { id: "a", label: "Solo riesgos: no sirve para nada en países con menos recursos", correct: false, feedback: "Al revés: abre puertas, pero exige criterio." },
    { id: "b", label: "Amplía acceso pero exige validar; confiar ciegamente puede desperdiciar años en una diana errónea", correct: true, feedback: "¡Exacto! Democratiza, pero no elimina la validación." },
    { id: "c", label: "Elimina la necesidad de validar experimentalmente", correct: false, feedback: "No: prioriza mejor la validación, no la elimina." },
    { id: "d", label: "Solo beneficia a laboratorios con criomicroscopía", correct: false, feedback: "Beneficia justamente a quienes no tienen esos equipos." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={7} title="IA en el laboratorio del futuro" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">¿Cómo será un laboratorio de biotecnología con IA integrada en 5-10 años?</p>
<ConceptCard variant="key-idea">
La IA no va a reemplazar a científicos. Va a **aumentar** su capacidad: experimentos más inteligentes, menos ensayo y error, decisiones basadas en datos en lugar de intuición.
</ConceptCard>
</div>

<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">Tendencias del laboratorio del futuro:</p>
<ol className="m-0 list-decimal space-y-1.5 pl-5">
<li><strong>Laboratorios autónomos</strong>: robots + ML que diseñan, ejecutan y analizan experimentos 24/7</li>
<li><strong>Gemelos digitales</strong>: simulaciones completas de experimentos antes de tocarlos en el laboratorio</li>
<li><strong>ML en tiempo real</strong>: microscopios inteligentes que detectan conidias y clasifican automáticamente</li>
<li><strong>Diseño de proteínas</strong>: modelos generativos que crean proteínas nuevas con funciones específicas</li>
<li><strong>Medicina personalizada</strong>: modelos que predicen la mejor terapia según el perfil genómico del paciente</li>
</ol>
<p className="mt-3 mb-0 font-semibold text-gray-900">Pero todo esto tiene límites.</p>
</div>

</RevealSequence>

</Section>

<Section number={8} title="Evo: modelos fundacionales para la genómica" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">Hasta ahora vimos modelos que predicen estructuras a partir de secuencias. Pero la IA también puede aprender directamente del lenguaje del ADN.</p>
<ConceptCard variant="definition">
<strong>Evo</strong> es un modelo fundacional para genómica desarrollado por el Arc Institute (publicado en <em>Science</em> en 2024). Se entrenó con <strong>300 mil millones de bases de ADN</strong> del Tree of Life y puede predecir el efecto de variantes genéticas, diseñar proteínas funcionales y generar secuencias de ADN novedosas.
</ConceptCard>
<div className="rounded-lg border border-gray-200 bg-surface-card p-3.5 text-sm text-gray-700">
<p className="m-0 mb-1.5 font-semibold text-gray-900">Esto lo hace distinto de AlphaFold:</p>
<ul className="m-0 list-disc space-y-1 pl-5">
<li><strong>AlphaFold</strong> predice la estructura 3D de una proteína a partir de su secuencia de aminoácidos.</li>
<li><strong>Evo</strong> genera y comprende secuencias genómicas completas, incluyendo regiones no codificantes.</li>
</ul>
</div>
</div>

<ModelCompare caption="Explora cada dimensión para comparar AlphaFold, Evo y los métodos tradicionales" />

<div className="space-y-3">
<ChoiceQuestion
  question="¿En qué se diferencia Evo de AlphaFold?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-evo-1"
  allowContinueOnIncorrect
  explanation="AlphaFold predice coordenadas 3D a partir de aminoácidos. Evo es generativo sobre ADN completo (incluyendo no codificante) y puede diseñar secuencias novedosas."
  options={[
    { id: "a", label: "AlphaFold genera secuencias nuevas de ADN, Evo solo predice estructuras", correct: false, feedback: "Al revés: Evo genera, AlphaFold predice estructura." },
    { id: "b", label: "AlphaFold predice estructura 3D de proteínas; Evo genera y comprende secuencias genómicas completas", correct: true, feedback: "¡Perfecto! Son complementarios: forma vs secuencia generativa." },
    { id: "c", label: "No hay diferencia, son el mismo modelo con distinto nombre", correct: false, feedback: "Son arquitecturas y objetivos distintos, publicados por equipos diferentes." },
    { id: "d", label: "Ambos requieren cristalografía de rayos X para cada predicción", correct: false, feedback: "No requieren experimento nuevo; aprenden de datos previos." },
  ]}
/>
<ConceptCard variant="key-idea">
Ambos modelos son herramientas poderosas, pero complementarias: AlphaFold resuelve el problema de <em>qué forma</em> tiene una proteína, mientras que Evo explora <em>qué secuencias</em> pueden producir funciones biológicas útiles.
</ConceptCard>
</div>

</RevealSequence>

</Section>

<Section number={9} title="Limitaciones de la IA en biotecnología" eyebrow="CRÍTICO">

<RevealSequence>

<ChoiceQuestion
  question="Si un modelo predice con 95% que un fármaco funciona, ¿lo usarías directo en pacientes?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-limites-1"
  allowContinueOnIncorrect
  explanation="No: 95% del modelo no es probabilidad clínica. Puede esconder sesgos, falta de fisiología real y efectos no modelados. Validación clínica en fases es obligatoria."
  options={[
    { id: "a", label: "Sí, 95% del modelo equivale a 95% de éxito en humanos", correct: false, feedback: "No: esa confianza no incluye lo que el modelo no modeló (metabolismo, genética)." },
    { id: "b", label: "No, faltan sesgos, fisiología real y efectos no modelados; requiere validación clínica", correct: true, feedback: "¡Correcto! La incertidumbre real está fuera del 5% reportado." },
    { id: "c", label: "Sí, si es barato aunque no esté validado", correct: false, feedback: "Costo no sustituye seguridad clínica." },
    { id: "d", label: "No, pero basta con repetir el mismo modelo", correct: false, feedback: "Repetir el mismo sesgo no corrige la validación faltante." },
  ]}
/>

<ConceptCard variant="warning">
La IA en biotecnología tiene limitaciones fundamentales:
1. **Datos limitados**: a diferencia de imágenes o texto, los datos biológicos son escasos y caros de generar
2. **Causalidad vs. correlación**: la IA encuentra patrones, pero no entiende mecanismos biológicos
3. **Generalización**: un modelo entrenado con datos de un laboratorio puede fallar en otro
4. **Interpretabilidad**: muchos modelos son "cajas negras" — no sabemos por qué predicen lo que predicen (crítico en un contexto clínico donde se necesita explicar por qué se recomienda un tratamiento)
5. **Validación experimental**: toda predicción de IA necesita confirmación en el laboratorio o en ensayos clínicos
</ConceptCard>

</RevealSequence>

</Section>

<Section number={10} title="Lo que aprendimos en el Módulo 1" eyebrow="CIERRE">

<RevealSequence>

<div className="space-y-3">
<MascotMessage mood="celebrating">
Cuatro lecciones para transformar una idea (¿cómo aprende la IA?) en un recorrido completo: features, algoritmos, pipelines, y aplicaciones reales.
</MascotMessage>
<ConceptCard variant="key-idea">
**Lección 1** — Las máquinas ven el mundo con features; las reglas fijas tienen límites
</ConceptCard>
<ConceptCard variant="key-idea">
**Lección 2** — Cómo aprenden: frontera de decisión, KNN, regresión, y el peligro del overfitting
</ConceptCard>
</div>

<div className="space-y-3">
<ConceptCard variant="key-idea">
**Lección 3** — AlphaFold, PDB, visualización 3D, y el pipeline completo de ML en biotecnología
</ConceptCard>
<ConceptCard variant="key-idea">
**Lección 4** — Vacunas mRNA, reposicionamiento, el laboratorio del futuro, y las limitaciones de la IA
</ConceptCard>
</div>

<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">Las ideas centrales para llevar:</p>
<ol className="m-0 list-decimal space-y-1.5 pl-5">
<li>Los <strong>features</strong> son la materia prima — sin buenos datos, ningún algoritmo funciona</li>
<li>El <strong>aprendizaje supervisado</strong> descubre patrones a partir de ejemplos etiquetados</li>
<li>El <strong>overfitting</strong> es el enemigo número uno — y la validación en datos nuevos es la única defensa</li>
<li>La IA <strong>acelera</strong> la ciencia, pero no la reemplaza — los experimentos y el criterio humano son irremplazables</li>
<li>La biotecnología es uno de los campos donde la IA tiene mayor potencial de impacto real</li>
</ol>
</div>

</RevealSequence>

</Section>

<Section number={11} title="Checkpoint final" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Checkpoint final del módulo. Valida las ideas centrales antes de celebrar el fin del Módulo 1.</div>

<ChoiceQuestion
  question="¿Cómo ayudó la IA al desarrollo de la vacuna mRNA del COVID-19?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-check-1"
  explanation="Los modelos predijeron qué formulaciones de LNPs tenían más chance de funcionar, reduciendo meses de prueba al azar."
  options={[
    { id: "a", label: "Diseñó la secuencia genética del virus", correct: false, feedback: "La secuencia viral se obtuvo por secuenciación, no por diseño de IA." },
    { id: "b", label: "Predijo qué formulaciones de nanopartículas lipídicas serían más efectivas", correct: true, feedback: "¡Correcto! Priorizó 50 candidatas prometedoras sobre 1.000 posibles." },
    { id: "c", label: "Fabricó las vacunas en laboratorios autónomos sin humanos", correct: false, feedback: "Los laboratorios autónomos son tendencia futura, no lo usado en 2020." },
    { id: "d", label: "Reemplazó por completo los ensayos clínicos", correct: false, feedback: "Los ensayos clínicos siguen siendo obligatorios; la IA no los reemplaza." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué es el reposicionamiento de fármacos?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-check-2"
  explanation="Encontrar nuevos usos para fármacos aprobados usando ML predictivo; ahorra años porque ya pasaron pruebas de seguridad."
  options={[
    { id: "a", label: "Mover fármacos de un laboratorio a otro", correct: false, feedback: "No es logística; es predicción computacional de nuevas indicaciones." },
    { id: "b", label: "Usar modelos de ML para predecir si fármacos existentes pueden tratar nuevas enfermedades", correct: true, feedback: "¡Exacto! Baricitinib y remdesivir son ejemplos reales." },
    { id: "c", label: "Rediseñar la estructura química de un fármaco desde cero", correct: false, feedback: "Eso sería diseño de novo, no reposicionamiento." },
    { id: "d", label: "Almacenar fármacos en condiciones óptimas", correct: false, feedback: "Eso es logística de almacenamiento, no ML." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué una estructura predicha por AlphaFold no es suficiente para diseñar un fármaco?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-check-3"
  explanation="Es una foto estática de la conformación más probable; la proteína real es dinámica y puede adoptar otras conformaciones al unirse."
  options={[
    { id: "a", label: "Porque AlphaFold solo funciona con proteínas humanas", correct: false, feedback: "Funciona con cualquier secuencia, incluidas virales." },
    { id: "b", label: "Porque las proteínas son dinámicas y la predicción muestra un estado estático", correct: true, feedback: "¡Correcto! Por eso el docking basado solo en predicción puede dar falsos positivos." },
    { id: "c", label: "Porque las predicciones son siempre incorrectas", correct: false, feedback: "Muchas predicciones alcanzan 92.4 GDT, comparables a experimental." },
    { id: "d", label: "Porque requiere demasiado poder computacional para docking", correct: false, feedback: "El docking es factible; el límite es la dinámica, no el cómputo." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es una limitación FUNDAMENTAL de la IA en biotecnología?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-check-4"
  explanation="Datos escasos y caros, correlación sin causalidad, mala generalización entre laboratorios y cajas negras difíciles de interpretar."
  options={[
    { id: "a", label: "Es demasiado cara para usarla", correct: false, feedback: "El costo baja; el problema es la calidad y cantidad de datos biológicos." },
    { id: "b", label: "Los datos biológicos son escasos, caros, y el modelo no entiende mecanismos causales", correct: true, feedback: "¡Exacto! La IA encuentra correlaciones, no explica mecanismos biológicos." },
    { id: "c", label: "No hay suficientes científicos que sepan usarla", correct: false, feedback: "La brecha de formación existe, pero no es la limitación fundamental técnica." },
    { id: "d", label: "Las computadoras no tienen la potencia necesaria", correct: false, feedback: "El cómputo es mayormente suficiente; los datos siguen siendo el cuello de botella." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la idea más importante de este módulo?"
  moduleSlug="ia"
  lessonSlug="lesson04_real_cases"
  blockId="choice-l04-check-5"
  explanation="Sin buenos datos, features relevantes, modelo adecuado y validación rigurosa, ningún modelo es confiable. No hay atajos."
  options={[
    { id: "a", label: "La IA reemplazará a los científicos", correct: false, feedback: "La IA aumenta la capacidad del científico, no la reemplaza." },
    { id: "b", label: "Sin buenos datos y validación rigurosa, ningún modelo es confiable", correct: true, feedback: "¡Ese es el hilo conductor del módulo!" },
    { id: "c", label: "Solo las redes neuronales profundas son útiles", correct: false, feedback: "Algoritmos simples como perceptrón y KNN ya son útiles y didácticos." },
    { id: "d", label: "La biotecnología no necesita IA", correct: false, feedback: "Al contrario: es uno de los campos con mayor impacto potencial de la IA." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={12} title="Fin del Módulo 1" eyebrow="COMPLETADO">

<RevealSequence>

<MascotMessage mood="celebrating">
Completaste el Módulo 1. Features, algoritmos, pipelines, casos reales. Tienes las bases para entender cómo la IA está transformando la biotecnología.
</MascotMessage>

<div className="space-y-3">
<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">¿Qué sigue?</p>
<ul className="m-0 list-disc space-y-1.5 pl-5 text-sm text-gray-700">
<li><strong>Módulo 2 · Python para Biotecnología</strong>: programar en Python para analizar secuencias, expresión génica y datos biológicos — <a className="text-brand underline underline-offset-2" href="/learn/python/lesson01_installing_python">empezar el Módulo 2</a></li>
<li><strong>Módulo 3 · Estadística y Probabilidad</strong>: diseñar experimentos y validar hallazgos con estadística aplicada — <a className="text-brand underline underline-offset-2" href="/learn/estadistica/lesson01_descriptive_stats">empezar el Módulo 3</a></li>
<li><strong>Módulo 4 · Machine Learning</strong>: entrenar y evaluar modelos predictivos con datos biomédicos — <a className="text-brand underline underline-offset-2" href="/learn/machine-learning/lesson01_ml_fundamentals">empezar el Módulo 4</a></li>
</ul>
</div>
<ConceptCard variant="key-idea">
Tómate un momento para mirar lo que lograste hoy. Pasaste de no saber qué es un feature a entender AlphaFold, overfitting, pipelines de ML, y cómo la IA aceleró una vacuna que salvó millones de vidas. **No es poco.**
</ConceptCard>
</div>

</RevealSequence>

</Section>
