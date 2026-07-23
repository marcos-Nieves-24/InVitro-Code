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

<MascotMessage>
Viste cómo aprenden los algoritmos. Ahora veamos qué pasa cuando aplicamos ML a problemas reales de biotecnología.
</MascotMessage>

En la Lección 2 entendiste los fundamentos: frontera de decisión, KNN, regresión, y el problema del overfitting. Ahora vamos al laboratorio — literalmente.

La biotecnología moderna genera datos masivos: secuencias genómicas, imágenes de microscopía, estructuras de proteínas, perfiles de expresión génica. El machine learning es la herramienta que permite encontrar patrones donde el ojo humano no llega.

Vamos a explorar tres aplicaciones concretas:
1. **Visualización 3D de moléculas** — cómo representar y analizar proteínas en el espacio
2. **AlphaFold** — el modelo que revolucionó la biología estructural
3. **Pipeline completo de ML** — desde los datos biológicos hasta la predicción

</Section>

<Section number={2} title="Mapa de la lección" eyebrow="ESTRUCTURA" description="De entender algoritmos a aplicarlos: visualización molecular 3D, AlphaFold, y el pipeline completo de ML en biotecnología.">

```
Lección 2 (Algoritmos y fundamentos) → Lección 3 (¡Aplicaciones reales!)
↓
Visualización 3D de moléculas → AlphaFold → Pipeline ML
↓
Lección 4 (Casos reales y futuro)
```

</Section>

<Section number={3} title="Proteínas en 3D" eyebrow="CONCEPTO">

Las proteínas no son solo secuencias lineales de aminoácidos. Su **estructura tridimensional** determina su función.

<ConceptCard variant="definition">
La **estructura terciaria** de una proteína es su forma tridimensional final, determinada por cómo se pliega la cadena de aminoácidos. Esta forma dicta con qué moléculas puede interactuar y, por lo tanto, qué función biológica cumple.
</ConceptCard>

Hasta hace poco, determinar la estructura 3D de una proteína requería meses de trabajo experimental (cristalografía de rayos X, criomicroscopía electrónica). El **Protein Data Bank (PDB)** es el repositorio global que almacena estas estructuras determinadas experimentalmente.

<ConceptCard variant="key-idea">
El PDB es como una biblioteca de planos arquitectónicos de proteínas. Cada entrada describe la posición de cada átomo en el espacio tridimensional, con coordenadas (x, y, z) para miles de átomos por proteína.
</ConceptCard>

Pero hay un problema enorme: secuenciar una proteína es barato y rápido. Determinar su estructura experimentalmente es caro y lento. De millones de proteínas conocidas, solo ~200,000 tienen estructura resuelta.

Acá entra AlphaFold.

</Section>

<Section number={4} title="Visualizador 3D: interactive" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l03-visualizador"
  prompt="¿Cómo cambia la forma de la proteína al rotarla en 3D? ¿Podrías identificar visualmente regiones que parezcan más estructuradas (hélices alfa, láminas beta) vs. regiones desordenadas?"
  answer="Las hélices alfa se ven como 'tirabuzones' y las láminas beta como flechas planas. Las regiones desordenadas se ven como 'fideos' sin estructura fija. La estructura 3D es clave porque la función de una proteína depende de su forma."
/>

<InteractiveFrame src="/interactives/demo_07_protein_viewer.html" height="700px" caption="visualización interactiva de datos reales del PDB" />

**Explorá el visualizador:**
- Rotá la proteína arrastrando el mouse
- Cambiá entre modos de visualización (cintas, esferas, líneas)
- Observá las diferentes regiones: hélices alfa, láminas beta, loops

<ConceptCard variant="key-idea">
Cada átomo en esa visualización tiene coordenadas (x, y, z) determinadas experimentalmente. Para el modelo de ML, predecir estas coordenadas es un problema de regresión — como el de la Lección 2, pero en 3D y con miles de puntos.
</ConceptCard>

</Section>

<Section number={5} title="AlphaFold: el desafío" eyebrow="CONCEPTO">

**AlphaFold** (DeepMind, 2021) resolvió un problema que la biología estructural tenía hace 50 años: predecir la estructura 3D de una proteína solo a partir de su secuencia de aminoácidos.

<ReflectionCheck
  blockId="reflection-l03-alphafold-desafio"
  prompt="AlphaFold predice la posición de cada átomo en una proteína (coordenadas x, y, z). ¿Qué tipo de problema de ML es: clasificación o regresión? ¿Cómo se mide el error entre la estructura real y la predicha?"
  answer="Es regresión — predecimos valores continuos (coordenadas x, y, z para cada átomo). El error se mide con RMSD (Root Mean Square Deviation): es el ECM aplicado a coordenadas 3D, calculando la distancia entre átomos equivalentes en la estructura real y la predicha."
/>

<ConceptCard variant="definition">
El **RMSD (Root Mean Square Deviation)** mide la distancia promedio entre los átomos de la estructura predicha y los de la estructura real. RMSD < 1Å (ángstrom, 10⁻¹⁰ m) se considera excelente. RMSD > 3Å indica una predicción poco confiable.
</ConceptCard>

</Section>

<Section number={6} title="AlphaFold: cómo funciona" eyebrow="CONCEPTO">

¿Cómo lo logró AlphaFold? No es un solo modelo, sino un sistema que combina múltiples ideas de ML:

**Paso 1 — Embedding de secuencia**: la secuencia de aminoácidos se convierte en un vector numérico (embedding), transformando letras en números que el modelo puede procesar.

**Paso 2 — Evolución simulada**: AlphaFold busca secuencias similares en bases de datos y genera un "perfil evolutivo". Las regiones que cambian poco entre especies suelen ser importantes para la estructura.

**Paso 3 — Atención espacial**: usando transformers (la misma arquitectura de GPT), el modelo aprende qué pares de aminoácidos están cerca en el espacio 3D aunque estén lejos en la secuencia lineal. Una proteína lineal de 100 aminoácidos puede tener su aminoácido #1 y #99 cerca físicamente porque se pliega.

**Paso 4 — Refinamiento iterativo**: el modelo predice la estructura, calcula la energía, y refina la predicción en múltiples ciclos.

<ConceptCard variant="key-idea">
La gran innovación de AlphaFold fue modelar el **plegamiento como un problema de aprendizaje**, no de física. En lugar de simular las fuerzas físicas (impracticable para proteínas grandes), aprendió de 170,000 estructuras resueltas experimentalmente en el PDB.
</ConceptCard>

</Section>

<Section number={7} title="AlphaFold: impacto y limitaciones" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l03-alphafold"
  prompt="AlphaFold predijo 200 millones de estructuras de proteínas (prácticamente todas las conocidas). ¿Qué problemas biotecnológicos se pueden resolver ahora que antes eran inviables por falta de estructuras? ¿Qué limitaciones tiene predecir una estructura que nunca fue resuelta experimentalmente?"
  answer="Aplicaciones: diseño de fármacos (docking molecular), ingeniería de enzimas, comprensión de enfermedades por malplegamiento (Alzheimer, Parkinson). Limitaciones: AlphaFold predice la estructura más probable, pero las proteínas son dinámicas y cambian de forma; no predice bien interacciones con otras moléculas ni estados transitorios."
/>

</Section>

<Section number={8} title="Pipeline de ML en biotecnología" eyebrow="CONCEPTO">

Un **pipeline de ML** es el flujo de trabajo completo, desde los datos brutos hasta el modelo en producción. En biotecnología tiene particularidades:

<ConceptCard variant="definition">
Un **pipeline de machine learning** es una secuencia de etapas que transforma datos brutos en predicciones útiles: recolección, limpieza, feature engineering, entrenamiento, evaluación, despliegue.
</ConceptCard>

Cada etapa del pipeline tiene desafíos específicos:

| Etapa | En biotecnología |
|---|---|
| **Datos** | Secuencias, imágenes microscopía, PDB, datos ómicos |
| **Limpieza** | Lotes de laboratorio, errores de medición, bias de equipos |
| **Features** | Fingerprints moleculares, perfiles evolutivos, descriptores de forma |
| **Modelo** | AlphaFold, CNN para imágenes, modelos de predicción de interacciones |
| **Validación** | RMSD, sensibilidad/especificidad, validación cruzada por laboratorio |
| **Interpretación** | SHAP para entender qué features importan |

</Section>

<Section number={9} title="Pipeline ML: interactive" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l03-pipeline"
  prompt="En un pipeline de ML para clasificación de conidias (microscopía), ¿cuál etapa del pipeline creés que consume más tiempo? ¿Y cuál tiene más probabilidad de errores silenciosos — errores que parecen estar bien pero después arruinan todo?"
  answer="En la práctica, la limpieza de datos consume >60% del tiempo en proyectos de ML biotecnológico. La etapa con más errores silenciosos es feature engineering: si un feature tiene un error sistemático (ej., calibración del microscopio), el modelo 'aprende' a explotar ese error y funciona en el laboratorio de origen pero falla al transferirse."
/>

<InteractiveFrame src="/interactives/demo_10_pipeline_ml.html" height="700px" caption="simulación educativa (basada en pipeline típico de bioinformática)" />

**¿Qué muestra exactamente?**
- Cada etapa del pipeline es un paso que transforma datos biológicos en un modelo
- Podés simular el efecto de diferentes parámetros en cada etapa
- Las barras de error muestran dónde se introducen imprecisiones

**Probá:**
1. Recorré cada etapa del pipeline haciendo clic
2. Cambiá parámetros como tamaño de muestra, calidad de imagen, o método de clustering
3. Observá cómo las decisiones tempranas afectan el resultado final

</Section>

<Section number={10} title="Pipeline real: conidias y Antifúngicos" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l03-pipeline-real"
  prompt="En el problema de las conidias que venimos trabajando, ¿cómo aplicarías un pipeline de ML? ¿Dónde entrenarías y dónde probarías si trabajás con datos de 3 laboratorios diferentes que usan distintos microscopios? ¿Qué problema del overfitting vimos en la Lección 2 que puede aparecer si mezclás los datos de todos los laboratorios?"
  answer="Pipeline: recolección de imágenes → extracción de features (área, circularidad, textura) → entrenar clasificador → validar. Con 3 laboratorios, lo correcto es entrenar con 2 y probar en el 3° (validación cruzada por laboratorio). Si mezclamos todo, el modelo aprende a reconocer cada microscopio (ruido de laboratorio) en lugar de conidias — es sobreajuste aplicado al equipamiento."
/>

<ConceptCard variant="warning">
El mayor error en ML biotecnológico es la **contaminación de datos**: cuando información del "futuro" (o de otro laboratorio) se filtra al entrenamiento. Siempre separar train/test por experimento, no al azar.
</ConceptCard>

</Section>

<Section number={11} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

1. **¿Qué mide el RMSD en el contexto de AlphaFold?**
   - a) La cantidad de proteínas predichas por segundo
   - b) La distancia promedio entre la estructura predicha y la estructura real
   - c) La velocidad de plegamiento de una proteína
   - d) La cantidad de aminoácidos en la proteína

2. **¿Por qué AlphaFold fue un avance tan significativo?**
   - a) Porque fue el primer modelo de deep learning
   - b) Porque resolvió el plegamiento de proteínas como un problema de aprendizaje a partir de datos, sin simulaciones físicas costosas
   - c) Porque eliminó la necesidad de experimentos de laboratorio
   - d) Porque predice secuencias de ADN

3. **¿Cuál es la principal limitación del PDB como dataset para entrenar modelos como AlphaFold?**
   - a) Es demasiado grande para descargarlo
   - b) Solo ~200,000 estructuras resueltas vs. millones de proteínas conocidas
   - c) Los datos están en formato incorrecto
   - d) No contiene proteínas humanas

4. **En un pipeline de ML, ¿cuál etapa consume más tiempo en proyectos biotecnológicos?**
   - a) El entrenamiento del modelo
   - b) La limpieza y preparación de datos
   - c) El despliegue en producción
   - d) La elección del algoritmo

5. **¿Qué es un embedding de secuencia?**
   - a) Una imagen de la proteína
   - b) Una representación numérica de la secuencia de aminoácidos que el modelo puede procesar
   - c) El archivo PDB de la proteína
   - d) El nombre de la proteína

<AnswerReveal summary="Ver respuestas">
<p><strong>1.</strong> b) RMSD es el ECM en 3D — la distancia promedio entre átomos equivalentes. RMSD &lt; 1Å es excelente.</p>
<p><strong>2.</strong> b) AlphaFold reformuló un problema de física como uno de aprendizaje. En lugar de simular fuerzas moleculares, aprendió de ~170,000 estructuras experimentales.</p>
<p><strong>3.</strong> b) El PDB tiene ~200,000 estructuras, pero conocemos millones de proteínas por su secuencia. Esa diferencia es lo que hizo que AlphaFold fuera tan necesario.</p>
<p><strong>4.</strong> b) La limpieza de datos consume >60% del tiempo en proyectos reales de ML. En biotecnología, esto incluye control de calidad, normalización entre lotes, y corrección de artefactos experimentales.</p>
<p><strong>5.</strong> b) Un embedding transforma datos no numéricos (secuencias de letras: aminoácidos) en vectores numéricos que el modelo puede procesar. Es el paso inicial en casi todos los modelos de ML modernos.</p>
</AnswerReveal>

</Section>

<Section number={12} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
AlphaFold, PDB, pipelines de ML — ya ves cómo la IA está transformando la biotecnología, un experimento a la vez.
</MascotMessage>

En la Lección 4 vamos a ver casos reales de aplicación: desde el reposicionamiento de fármacos hasta cómo modelos de IA ayudaron a desarrollar la vacuna del COVID-19. Todo lo que viste hasta ahora confluye en aplicaciones concretas que ya están cambiando la ciencia.

</Section>
