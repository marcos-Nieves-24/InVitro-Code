---
Module: 1
Lesson Number: 3
Lesson Title: IA en Biotecnología
Estimated Duration: 60 minutos
Prerequisites: Lección 2 — ¿Cómo aprende la IA?
Learning Objectives:
  - Reconocer las etapas de un pipeline de machine learning en biotecnología
  - Entender cómo AlphaFold predice estructuras de proteínas
  - Experimentar con visualización 3D de moléculas
  - Identificar fuentes y limitaciones de datos biológicos (PDB)
Keywords: pipeline ML, AlphaFold, PDB, proteínas, estructura terciaria, RMSD, folding
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Espacio tridimensional, distancias
Machine Learning Concepts: Pipeline ML, datos de entrenamiento, embeddings, PDB como dataset, RMSD como métrica de error
Datasets Used: PDB (Protein Data Bank), AF2, "module01_predict_effect.parquet"
---

<Section number={1} title="De la teoría a la práctica" eyebrow="INICIO">

<RevealSequence>

<div className="space-y-3">
<MascotMessage>
Viste cómo aprenden los algoritmos. Ahora veamos qué pasa cuando aplicamos ML a problemas reales de biotecnología.
</MascotMessage>
<p className="m-0 text-base text-gray-700">En la Lección 2 entendiste los fundamentos: frontera de decisión, KNN, regresión, y el problema del overfitting. Ahora vamos al laboratorio — literalmente. La biotecnología moderna genera datos masivos: secuencias genómicas, imágenes de microscopía, estructuras de proteínas y perfiles de expresión génica.</p>
</div>

<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">Vamos a explorar tres aplicaciones concretas:</p>
<ol className="m-0 list-decimal space-y-1.5 pl-5">
<li><strong>Visualización 3D de moléculas</strong> — cómo representar y analizar proteínas en el espacio</li>
<li><strong>AlphaFold</strong> — el modelo que revolucionó la biología estructural</li>
<li><strong>Pipeline completo de ML</strong> — desde los datos biológicos hasta la predicción</li>
</ol>
</div>

</RevealSequence>

</Section>

<Section number={2} title="Proteínas en 3D" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">Las proteínas no son solo secuencias lineales de aminoácidos. Su <strong>estructura tridimensional</strong> determina su función.</p>
<ConceptCard variant="definition">
La **estructura terciaria** de una proteína es su forma tridimensional final, determinada por cómo se pliega la cadena de aminoácidos. Esta forma dicta con qué moléculas puede interactuar y, por lo tanto, qué función biológica cumple.
</ConceptCard>
<p className="m-0 text-sm text-gray-700">Hasta hace poco, determinar la estructura 3D de una proteína requería meses de trabajo experimental (cristalografía de rayos X, criomicroscopía electrónica). El <strong>Protein Data Bank (PDB)</strong> es el repositorio global que almacena estas estructuras determinadas experimentalmente.</p>
</div>

<div className="space-y-3">
<ConceptCard variant="key-idea">
El PDB es como una biblioteca de planos arquitectónicos de proteínas. Cada entrada describe la posición de cada átomo en el espacio tridimensional, con coordenadas (x, y, z) para miles de átomos por proteína.
</ConceptCard>
<p className="m-0 text-sm text-gray-700">Pero hay un problema enorme: secuenciar una proteína es barato y rápido. Determinar su estructura experimentalmente es caro y lento. De millones de proteínas conocidas, solo ~200,000 tienen estructura resuelta. <strong>Aquí entra AlphaFold.</strong></p>
</div>

</RevealSequence>

</Section>

<Section number={3} title="Visualizador 3D: interactive" eyebrow="INTERACTIVA">

<RevealSequence>

<ChoiceQuestion
  question="Al rotar la proteína en 3D, ¿cómo distingues hélices alfa de regiones desordenadas (loops)?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-visualizador-1"
  allowContinueOnIncorrect
  explanation="Las hélices alfa se ven como tirabuzones, las láminas beta como flechas planas y los loops como fideos sin estructura fija."
  options={[
    { id: "a", label: "Las hélices alfa se ven como tirabuzones; los loops como fideos desordenados", correct: true, feedback: "¡Exacto! La forma 3D refleja la función." },
    { id: "b", label: "No hay diferencia visible, todo se ve igual al rotar", correct: false, feedback: "Sí hay diferencias: hélices y láminas tienen patrones visuales distintivos." },
    { id: "c", label: "Las hélices alfa son las regiones que no aparecen en la visualización", correct: false, feedback: "Las hélices sí se visualizan, como cintas en tirabuzón." },
    { id: "d", label: "Los loops son siempre hélices perfectas", correct: false, feedback: "Al revés: los loops son las zonas sin estructura regular." },
  ]}
/>

<InteractiveFrame src="/interactives/demo_07_protein_3d.html" height="440px" caption="Visualización interactiva de datos reales del PDB" />

<div className="space-y-3">
<div className="rounded-lg border border-gray-200 bg-surface-card p-4 text-sm text-gray-700">
<p className="m-0 mb-2 font-semibold text-gray-900">Explora el visualizador:</p>
<ul className="m-0 list-disc space-y-1 pl-5">
<li>Rota la proteína arrastrando el mouse</li>
<li>Cambia entre modos de visualización (cintas, esferas, líneas)</li>
<li>Observa las diferentes regiones: hélices alfa, láminas beta, loops</li>
</ul>
</div>
<ConceptCard variant="key-idea">
Cada átomo en esa visualización tiene coordenadas (x, y, z) determinadas experimentalmente. Para el modelo de ML, predecir estas coordenadas es un problema de regresión — como el de la Lección 2, pero en 3D y con miles de puntos.
</ConceptCard>
</div>

</RevealSequence>

</Section>

<Section number={4} title="AlphaFold: el desafío" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700"><strong>AlphaFold</strong> (DeepMind, 2021) resolvió un problema que la biología estructural tenía hace 50 años: predecir la estructura 3D de una proteína solo a partir de su secuencia de aminoácidos.</p>
<ChoiceQuestion
  question="AlphaFold predice la posición (x, y, z) de cada átomo. ¿Es clasificación o regresión y cómo se mide el error?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-alphafold-desafio-1"
  allowContinueOnIncorrect
  explanation="Es regresión: coordenadas continuas. El error se mide con RMSD, que es el ECM en 3D: distancia promedio entre átomos equivalentes."
  options={[
    { id: "a", label: "Clasificación; se mide con accuracy", correct: false, feedback: "No: clasificar sería elegir una categoría. Acá predecimos números continuos." },
    { id: "b", label: "Regresión; se mide con RMSD (ECM en 3D) entre átomos equivalentes", correct: true, feedback: "¡Correcto! RMSD < 1Å es excelente; >3Å es poco confiable." },
    { id: "c", label: "Clasificación; se mide con RMSD como si fuera clasificación", correct: false, feedback: "RMSD es métrica de regresión, no de clasificación." },
    { id: "d", label: "Regresión; se mide contando cuántos aminoácidos coinciden", correct: false, feedback: "Coincidencia binaria sería clasificación; acá importan las coordenadas exactas." },
  ]}
/>
</div>

<ConceptCard variant="definition">
El **RMSD (Root Mean Square Deviation)** mide la distancia promedio entre los átomos de la estructura predicha y los de la estructura real. RMSD &lt; 1Å (ángstrom, 10⁻¹⁰ m) se considera excelente. RMSD &gt; 3Å indica una predicción poco confiable.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={5} title="AlphaFold: cómo funciona" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">¿Cómo lo logró AlphaFold? No es un solo modelo, sino un sistema que combina múltiples ideas de ML:</p>
<div className="grid gap-3 sm:grid-cols-2">
<div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 text-sm text-gray-800">
<p className="m-0 mb-1 font-semibold text-gray-900">Paso 1 — Embedding de secuencia</p>
<p className="m-0 text-xs text-gray-700">La secuencia de aminoácidos se convierte en un vector numérico (embedding), transformando letras en números que el modelo puede procesar.</p>
</div>
<div className="rounded-lg border border-teal-200 bg-teal-50/70 p-3.5 text-sm text-gray-800">
<p className="m-0 mb-1 font-semibold text-gray-900">Paso 2 — Evolución simulada</p>
<p className="m-0 text-xs text-gray-700">AlphaFold busca secuencias similares en bases de datos y genera un &quot;perfil evolutivo&quot;. Las regiones que cambian poco entre especies suelen ser importantes para la estructura.</p>
</div>
</div>
</div>

<div className="grid gap-3 sm:grid-cols-2">
<div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-3.5 text-sm text-gray-800">
<p className="m-0 mb-1 font-semibold text-gray-900">Paso 3 — Atención espacial</p>
<p className="m-0 text-xs text-gray-700">Usando transformers (la misma arquitectura de GPT), el modelo aprende qué pares de aminoácidos están cerca en el espacio 3D aunque estén lejos en la secuencia lineal (ej. #1 y #99).</p>
</div>
<div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-sm text-gray-800">
<p className="m-0 mb-1 font-semibold text-gray-900">Paso 4 — Refinamiento iterativo</p>
<p className="m-0 text-xs text-gray-700">El modelo predice la estructura, calcula la energía y refina la predicción en múltiples ciclos hasta converger.</p>
</div>
</div>

<ConceptCard variant="key-idea">
La gran innovación de AlphaFold fue modelar el **plegamiento como un problema de aprendizaje**, no de física. En lugar de simular las fuerzas físicas (impracticable para proteínas grandes), aprendió de 170,000 estructuras resueltas experimentalmente en el PDB.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={6} title="AlphaFold: impacto y limitaciones" eyebrow="CONCEPTO">

<RevealSequence>

<ChoiceQuestion
  question="AlphaFold predijo 200 millones de estructuras. ¿Qué aplicaciones desbloquea y cuál es su limitación principal?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-alphafold-1"
  allowContinueOnIncorrect
  explanation="Desbloquea docking, ingeniería de enzimas y estudio de malplegamiento. Limitación: predice la conformación más probable, pero las proteínas son dinámicas y no modela bien interacciones ni estados transitorios."
  options={[
    { id: "a", label: "Solo sirve para contar proteínas, sin aplicaciones reales", correct: false, feedback: "No: habilita diseño de fármacos, ingeniería de enzimas y estudio de enfermedades." },
    { id: "b", label: "Permite docking e ingeniería de enzimas, pero falla en dinámicas e interacciones", correct: true, feedback: "¡Exacto! Es una foto estática de la conformación más probable, no la dinámica completa." },
    { id: "c", label: "Reemplaza por completo los experimentos de laboratorio", correct: false, feedback: "No reemplaza validación experimental; la hace más enfocada." },
    { id: "d", label: "Solo funciona si la proteína ya tiene estructura en el PDB", correct: false, feedback: "Justamente predice las que no tienen estructura experimental resuelta." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={7} title="Pipeline de ML en biotecnología" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">Un <strong>pipeline de ML</strong> es el flujo de trabajo completo, desde los datos brutos hasta el modelo en producción. En biotecnología tiene particularidades:</p>
<ConceptCard variant="definition">
Un **pipeline de machine learning** es una secuencia de etapas que transforma datos brutos en predicciones útiles: recolección, limpieza, feature engineering, entrenamiento, evaluación, despliegue.
</ConceptCard>
</div>

<PipelineStages caption="El token recorre las seis etapas en orden: cada una transforma la salida de la anterior" />

</RevealSequence>

</Section>

<Section number={8} title="Pipeline ML: interactive" eyebrow="INTERACTIVA">

<RevealSequence>

<ChoiceQuestion
  question="En un pipeline de conidias, ¿qué etapa consume más tiempo y cuál genera más errores silenciosos?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-pipeline-1"
  allowContinueOnIncorrect
  explanation="Limpieza consume >60% del tiempo. Feature engineering genera errores silenciosos: si el microscopio está mal calibrado, el modelo aprende el artefacto y falla al transferirse."
  options={[
    { id: "a", label: "Entrenamiento y despliegue son las etapas más largas y con más errores silenciosos", correct: false, feedback: "No: entrenar es rápido comparado con conseguir y limpiar datos." },
    { id: "b", label: "Limpieza consume más tiempo; feature engineering genera errores silenciosos de calibración", correct: true, feedback: "¡Exacto! Un error sistemático de calibración contamina todo el modelo." },
    { id: "c", label: "La elección del algoritmo es lo más costoso", correct: false, feedback: "Elegir algoritmo es rápido; lo caro es tener datos limpios y bien definidos." },
    { id: "d", label: "Ninguna etapa tiene errores silenciosos", correct: false, feedback: "Sí existen: errores que parecen correctos localmente pero arruinan la generalización." },
  ]}
/>

<InteractiveFrame src="/interactives/demo_10_pipeline.html" height="440px" caption="Simulación educativa basada en un pipeline típico de bioinformática" />

<div className="grid gap-3 sm:grid-cols-2">
<div className="rounded-lg border border-gray-200 bg-surface-card p-3.5 text-xs text-gray-700">
<p className="m-0 mb-1.5 font-semibold text-gray-900">¿Qué muestra exactamente?</p>
<ul className="m-0 list-disc space-y-1 pl-4">
<li>Cada etapa del pipeline es un paso que transforma datos biológicos en un modelo</li>
<li>Puedes simular el efecto de diferentes parámetros en cada etapa</li>
<li>Las barras de error muestran dónde se introducen imprecisiones</li>
</ul>
</div>
<div className="rounded-lg border border-gray-200 bg-surface-card p-3.5 text-xs text-gray-700">
<p className="m-0 mb-1.5 font-semibold text-gray-900">Prueba:</p>
<ol className="m-0 list-decimal space-y-1 pl-4">
<li>Recorre cada etapa del pipeline haciendo clic</li>
<li>Cambia parámetros como tamaño de muestra, calidad de imagen o método de clustering</li>
<li>Observa cómo las decisiones tempranas afectan el resultado final</li>
</ol>
</div>
</div>

</RevealSequence>

</Section>

<Section number={9} title="Pipeline real: conidias y Antifúngicos" eyebrow="CONCEPTO">

<RevealSequence>

<ChoiceQuestion
  question="Con datos de 3 laboratorios con distintos microscopios, ¿dónde entrenas y pruebas para evitar sobreajuste al equipamiento?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-pipeline-real-1"
  allowContinueOnIncorrect
  explanation="Entrenar con 2 laboratorios y probar en el 3° (validación cruzada por laboratorio). Mezclar todo hace que el modelo aprenda el microscopio en lugar de la conidia."
  options={[
    { id: "a", label: "Mezclar todo al azar y dividir 80/20 sin importar el laboratorio", correct: false, feedback: "Eso filtra ruido de laboratorio al entreno y da un optimismo falso." },
    { id: "b", label: "Entrenar con 2 labs y probar en el 3° para validar generalización real", correct: true, feedback: "¡Correcto! Separar por experimento evita contaminación." },
    { id: "c", label: "Entrenar y probar solo con el mejor microscopio", correct: false, feedback: "No generaliza a otros equipos y esconde la variabilidad real." },
    { id: "d", label: "No importa la separación, cualquier split funciona igual", correct: false, feedback: "La estrategia de split cambia drásticamente la evaluación." },
  ]}
/>

<ConceptCard variant="warning">
El mayor error en ML biotecnológico es la **contaminación de datos**: cuando información del "futuro" (o de otro laboratorio) se filtra al entrenamiento. Siempre separar train/test por experimento, no al azar.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={10} title="Matriz de confusión" eyebrow="CONCEPTO">

<RevealSequence>

<div className="space-y-3">
<p className="m-0 text-sm text-gray-700">Cuando un clasificador predice, no solo importa cuántas acertó: importa <strong>qué tipo de errores comete</strong>. La matriz de confusión desagrega los aciertos y errores por clase.</p>
<ConceptCard variant="definition">
En una clasificación binaria:
- **Verdadero Positivo (TP)**: el modelo predijo positivo y realmente era positivo.
- **Falso Positivo (FP)**: el modelo predijo positivo, pero era negativo.
- **Falso Negativo (FN)**: el modelo predijo negativo, pero era positivo.
- **Verdadero Negativo (TN)**: el modelo predijo negativo y realmente era negativo.
</ConceptCard>
</div>

<ConfusionMatrixVisual caption="Explora cada métrica sobre las 100 conidias clasificadas (Aspergillus vs Penicillium)" />

<ChoiceQuestion
  question="¿Por qué la matriz de confusión es más útil que solo el porcentaje de aciertos?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-confusion-1"
  allowContinueOnIncorrect
  explanation="Desagrega los errores: falso negativo (patógeno no detectado) y falso positivo (falsa alarma) tienen costos clínicos distintos. Accuracy solo los oculta."
  options={[
    { id: "a", label: "Porque es más vistosa que un número solo", correct: false, feedback: "No es estética: revela tipos de error con distinto costo." },
    { id: "b", label: "Porque distingue falsos negativos vs falsos positivos con costos clínicos distintos", correct: true, feedback: "¡Exacto! En clínica, perder un patógeno no es lo mismo que una falsa alarma." },
    { id: "c", label: "Porque reemplaza al accuracy y lo hace innecesario", correct: false, feedback: "Complementa, no reemplaza: accuracy sigue siendo útil junto a precisión/recall." },
    { id: "d", label: "Solo sirve para regresión, no para clasificación", correct: false, feedback: "Es específica de clasificación; regresión usa ECM/R²." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={11} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Cinco preguntas para consolidar esta lección. Responde correctamente cada una para avanzar.</div>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Qué mide el RMSD en el contexto de AlphaFold?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-check-1"
  explanation="RMSD es el ECM en 3D: distancia promedio entre átomos equivalentes. RMSD < 1Å es excelente."
  options={[
    { id: "a", label: "La cantidad de proteínas predichas por segundo", correct: false, feedback: "Eso sería velocidad de inferencia, no RMSD." },
    { id: "b", label: "La distancia promedio entre la estructura predicha y la estructura real", correct: true, feedback: "¡Correcto! Es la métrica clave para evaluar la predicción 3D." },
    { id: "c", label: "La velocidad de plegamiento de una proteína", correct: false, feedback: "No mide tiempo, sino error geométrico." },
    { id: "d", label: "La cantidad de aminoácidos en la proteína", correct: false, feedback: "Eso es longitud de secuencia, no calidad de la predicción." },
  ]}
/>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Por qué AlphaFold fue un avance tan significativo?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-check-2"
  explanation="Reformuló el plegamiento como aprendizaje a partir de 170k estructuras, sin simulaciones físicas costosas."
  options={[
    { id: "a", label: "Porque fue el primer modelo de deep learning", correct: false, feedback: "Hubo muchos antes; lo disruptivo fue el enfoque aplicado al plegamiento." },
    { id: "b", label: "Porque resolvió el plegamiento como aprendizaje sin simulaciones físicas costosas", correct: true, feedback: "¡Exacto! Aprendió de datos experimentales del PDB." },
    { id: "c", label: "Porque eliminó la necesidad de experimentos de laboratorio", correct: false, feedback: "Acelera, pero la validación experimental sigue siendo necesaria." },
    { id: "d", label: "Porque predice secuencias de ADN", correct: false, feedback: "Predice estructuras 3D a partir de secuencia de aminoácidos, no ADN." },
  ]}
/>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Cuál es la principal limitación del PDB como dataset para entrenar modelos como AlphaFold?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-check-3"
  explanation="Solo ~200k estructuras resueltas vs millones de secuencias conocidas; por eso predecir las faltantes era tan valioso."
  options={[
    { id: "a", label: "Es demasiado grande para descargarlo", correct: false, feedback: "El tamaño es manejable; el problema es la cobertura." },
    { id: "b", label: "Solo ~200.000 estructuras resueltas vs millones de proteínas conocidas", correct: true, feedback: "¡Correcto! Esa brecha hizo necesario AlphaFold." },
    { id: "c", label: "Los datos están en formato incorrecto", correct: false, feedback: "El formato PDB es estándar; no es el problema." },
    { id: "d", label: "No contiene proteínas humanas", correct: false, feedback: "Sí contiene miles de proteínas humanas, pero faltan muchas otras." },
  ]}
/>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="En un pipeline de ML, ¿cuál etapa consume más tiempo en proyectos biotecnológicos?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-check-4"
  explanation="La limpieza y preparación de datos consume más del 60% del tiempo; además es donde aparecen errores silenciosos."
  options={[
    { id: "a", label: "El entrenamiento del modelo", correct: false, feedback: "El entreno es rápido comparado con conseguir y limpiar datos biológicos." },
    { id: "b", label: "La limpieza y preparación de datos", correct: true, feedback: "¡Exacto! Control de calidad, normalización entre lotes y corrección de artefactos llevan la mayor parte." },
    { id: "c", label: "El despliegue en producción", correct: false, feedback: "Desplegar es menor comparado con la preparación inicial." },
    { id: "d", label: "La elección del algoritmo", correct: false, feedback: "Elegir algoritmo es rápido; lo costoso es tener datos limpios." },
  ]}
/>

<ChoiceQuestion
  allowContinueOnIncorrect
  question="¿Qué es un embedding de secuencia?"
  moduleSlug="ia"
  lessonSlug="lesson03_ai_in_biotech"
  blockId="choice-l03-check-5"
  explanation="Convierte letras (aminoácidos) en vectores numéricos que el modelo puede procesar; es el paso inicial de AlphaFold."
  options={[
    { id: "a", label: "Una imagen de la proteína", correct: false, feedback: "No es visual; es una representación numérica." },
    { id: "b", label: "Una representación numérica de la secuencia que el modelo puede procesar", correct: true, feedback: "¡Correcto! Transforma secuencia en números para el aprendizaje." },
    { id: "c", label: "El archivo PDB de la proteína", correct: false, feedback: "El PDB almacena coordenadas, no es el embedding." },
    { id: "d", label: "El nombre de la proteína", correct: false, feedback: "El nombre es texto, no un vector procesable por el modelo." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={12} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence>

<MascotMessage mood="celebrating">
AlphaFold, PDB, pipelines de ML — ya ves cómo la IA está transformando la biotecnología, un experimento a la vez.
</MascotMessage>

<ConceptCard variant="key-idea">
En la Lección 4 vamos a ver casos reales de aplicación: desde el reposicionamiento de fármacos hasta cómo modelos de IA ayudaron a desarrollar la vacuna del COVID-19. Todo lo que viste hasta ahora confluye en aplicaciones concretas que ya están cambiando la ciencia.
</ConceptCard>

</RevealSequence>

</Section>
