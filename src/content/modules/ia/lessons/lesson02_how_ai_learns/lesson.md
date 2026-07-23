---
Module: 1
Lesson Number: 2
Lesson Title: ¿Cómo aprende la IA?
Estimated Duration: 70 minutos
Prerequisites: Lección 1 — ¿Qué es la IA?
Learning Objectives:
  - Comprender el concepto de frontera de decisión en clasificación binaria
  - Explicar cómo funciona el algoritmo KNN (K-Nearest Neighbors)
  - Distinguir entre regresión y clasificación como problemas de aprendizaje
  - Reconocer el sobreajuste (overfitting) y por qué es problemático
Keywords: frontera de decisión, KNN, regresión lineal, clasificación, overfitting, perceptrón
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Concepto de distancia, promedios
Machine Learning Concepts: Clasificación binaria, regresión, KNN, perceptrón, overfitting, train/test
Datasets Used: module01_ai_cell_features.csv
---

<Section number={1} title="De reglas fijas a aprendizaje" eyebrow="INICIO">

<MascotMessage>
En la lección anterior viste que las reglas fijas tienen límites. Ahora vamos a ver cómo las máquinas realmente aprenden.
</MascotMessage>

En la Lección 1 vimos que las reglas fijas no son suficientes para clasificar conidias. Hay demasiada variabilidad natural, demasiadas excepciones. Necesitamos algo que se adapte a los datos, no al revés.

Acá entra el **aprendizaje automático** (machine learning). En lugar de que un humano programe cada regla, le mostramos ejemplos a la máquina y ella *descubre* las reglas por sí misma.

Pero... ¿cómo funciona ese "descubrimiento"? ¿Qué pasa adentro del algoritmo cuando "aprende"? Vamos a verlo con tres algoritmos fundamentales: frontera de decisión, KNN y regresión lineal. Después vamos a explorar un problema clave: el sobreajuste.

</Section>

<Section number={2} title="Mapa de la lección" eyebrow="ESTRUCTURA" description="De entender features y reglas fijas a ver cómo aprenden las máquinas: frontera de decisión, KNN, regresión, y el problema del sobreajuste.">

```
Lección 1 (Features + reglas fijas) → Lección 2 (¡Acá aprenden las máquinas!)
↓
Entender frontera de decisión → KNN → Regresión → Overfitting
↓
Lección 3 (Aplicaciones biotecnológicas)
```

</Section>

<Section number={3} title="Aprendizaje supervisado" eyebrow="CONCEPTO">

El tipo de aprendizaje que vamos a ver se llama **aprendizaje supervisado**. Funciona así:

1. Tenemos un conjunto de **ejemplos etiquetados** (conidias con su especie)
2. Cada ejemplo tiene **features** (área, circularidad, textura...)
3. El algoritmo busca patrones que relacionen las features con la etiqueta
4. Una vez que "aprendió", puede predecir la etiqueta de nuevas conidias no vistas

```
Ejemplos de entrenamiento → Algoritmo → Modelo → Predicciones
     (conidias + especie)                           (nuevas conidias)
```

<ConceptCard variant="definition">
**Modelo**: es el resultado del aprendizaje. Una representación matemática de los patrones que el algoritmo encontró en los datos.
</ConceptCard>

Pensalo así:
- Los **datos de entrenamiento** son como los ejercicios resueltos de un libro de texto
- El **algoritmo** es como el estudiante que estudia
- El **modelo** es el conocimiento que el estudiante adquirió
- Las **predicciones** son los ejercicios nuevos que el estudiante resuelve usando ese conocimiento

</Section>

<Section number={4} title="Frontera de decisión lineal" eyebrow="CONCEPTO">

Empecemos con el algoritmo más simple: el **perceptrón**. Un perceptrón traza una línea recta para separar dos clases.

<ConceptCard variant="key-idea">
La **frontera de decisión** es la línea (o superficie) que separa diferentes clases en el espacio de características. Del lado azul, el modelo predice *Aspergillus*; del lado rojo, *Penicillium*.
</ConceptCard>

</Section>

<Section number={5} title="Perceptrón: interactive" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l02-perceptron"
  prompt="¿Crees que una línea recta puede separar dos tipos de conidias si solo usamos dos características (área y circularidad)?"
  answer="Depende de los datos. Si las clases son linealmente separables, sí. Si hay solapamiento natural entre las poblaciones de conidias, una línea recta no alcanza y necesitamos fronteras no lineales."
/>

<InteractiveFrame src="/interactives/demo_04_boundary.html" height="700px" caption="simulación educativa sobre datos sintéticos" />

**¿Qué está pasando?**
- Cada punto es una conidia (azul = *Aspergillus*, rojo = *Penicillium*)
- La línea es la **frontera de decisión** que el modelo aprende
- El accuracy muestra qué porcentaje de conidias están bien clasificadas

**Probá vos:**
1. Mové los sliders para ajustar la línea manualmente
2. Fijate cómo cambia el accuracy
3. Después presioná "Entrenar automáticamente" y observá cómo el algoritmo encuentra la mejor línea por sí solo

<ConceptCard variant="key-idea">
El aprendizaje consiste en *ajustar parámetros* (pendiente e intercepto) para minimizar errores. Cada slider es un parámetro que el algoritmo optimiza.
</ConceptCard>

</Section>

<Section number={6} title="Límites de la frontera lineal" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l02-frontera"
  prompt="¿Qué pasa si las clases no son separables linealmente? ¿Cómo cambiaría la frontera? ¿Por qué el accuracy no llega al 100% aunque ajustemos bien la línea?"
  answer="La frontera no sería una línea recta sino una curva (o superficie más compleja). El accuracy no llega al 100% porque siempre hay solapamiento natural entre clases — conidias atípicas, ruido de medición, variabilidad biológica. Ninguna línea recta puede separar perfectamente poblaciones que se mezclan."
/>

<ConceptCard variant="warning">
No todos los problemas se pueden resolver con una línea recta. Cuando las clases se mezclan, necesitamos algoritmos más flexibles.
</ConceptCard>

</Section>

<Section number={7} title="KNN: clasificar por cercanía" eyebrow="CONCEPTO">

Ahora veamos un enfoque completamente diferente: en lugar de trazar una línea, KNN clasifica según los vecinos más cercanos.

<ConceptCard variant="definition">
**KNN (K-Nearest Neighbors)**: el algoritmo mira los k puntos más cercanos al punto nuevo, cuenta cuántos son de cada clase, y asigna la clase mayoritaria.
</ConceptCard>

</Section>

<Section number={8} title="KNN: interactive" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l02-knn"
  prompt="Si k=1 clasificamos según el vecino más cercano. ¿Qué crees que pasa si aumentamos k a 15?"
  answer="La frontera se vuelve más suave y menos sensible al ruido, pero puede perder detalles finos en zonas donde las clases cambian rápidamente. k grande reduce varianza pero aumenta sesgo: el modelo se vuelve más estable pero puede subestimar patrones locales."
/>

<InteractiveFrame src="/interactives/demo_05_knn.html" height="700px" caption="simulación educativa sobre datos sintéticos" />

**¿Cómo funciona KNN?**
1. Tenemos puntos de entrenamiento ya clasificados
2. Llega un punto nuevo (marcado con "?")
3. El algoritmo mira los k puntos más cercanos
4. Cuenta cuántos son de cada clase
5. Asigna la clase mayoritaria

**Experimentá:**
- Mové el slider de k (1 a 15) y observá cómo cambia la clasificación
- Arrastrá el punto de prueba a diferentes zonas
- Con k pequeño, la frontera es más irregular y sensible al ruido
- Con k grande, la frontera se vuelve más suave, pero puede perder detalles finos

<ConceptCard variant="key-idea">
La elección de **k** es un **hiperparámetro**. No lo aprende el modelo; lo elegimos nosotros. Encontrar el valor óptimo es parte del arte del machine learning.
</ConceptCard>

</Section>

<Section number={9} title="Clasificación vs regresión" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l02-clasif-reg"
  prompt="En un laboratorio de microbiología, clasificar un patógeno por su similitud con aislamientos previos documentados — ¿es clasificación o regresión? Si k=1 clasificamos según el único vecino más cercano, ¿qué riesgo hay con datos ruidosos? ¿Y si k=20?"
  answer="Es clasificación porque predecimos una categoría discreta (especie A o B), no un valor continuo. Con k=1, una medición mal tomada (dato ruidoso) clasifica incorrectamente el punto porque el vecino más cercano es espurio. Con k=20, el ruido se promedia entre varios vecinos y el efecto se diluye."
/>

Hasta ahora clasificamos conidias en dos categorías. Pero ¿qué pasa si queremos predecir un **valor numérico**? Por ejemplo: "dada una concentración de fármaco antifúngico, ¿qué diámetro de halo de inhibición esperamos?"

<ConceptCard variant="definition">
**Clasificación** predice categorías discretas (Aspergillus/Penicillium). **Regresión** predice valores continuos (concentración, peso, temperatura).
</ConceptCard>

</Section>

<Section number={10} title="Regresión lineal: interactive" eyebrow="INTERACTIVA">

<ReflectionCheck
  blockId="reflection-l02-regresion"
  prompt="Si duplicamos la concentración de un fármaco, ¿esperás que el efecto inhibitorio se duplique exactamente?"
  answer="No necesariamente. La relación dosis-respuesta en biología suele ser sigmoidea: a bajas concentraciones el efecto es pequeño, luego crece rápidamente en un rango, y finalmente se satura (meseta). La regresión lineal solo aproxima bien en el rango casi lineal de la curva."
/>

<InteractiveFrame src="/interactives/demo_06_regression.html" height="700px" caption="modelo sobre datos reales simulados (basado en curvas dosis-respuesta de antifúngicos)" />

**¿Qué muestra?**
- Cada punto es un experimento: concentración de fármaco vs. halo de inhibición
- La recta es el **modelo de regresión lineal**: la mejor línea que pasa entre los puntos
- El **Error Cuadrático Medio (ECM)** mide qué tan lejos están los puntos de la recta

**Probá:**
1. Ajustá pendiente e intercepto manualmente
2. Fijate cómo el ECM se reduce al acercarte a la mejor recta
3. Presioná "Calcular mejor recta" para ver la solución óptima
4. Usá "Predecir" para estimar el halo para una concentración nueva

</Section>

<Section number={11} title="ECM y límites de la regresión" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l02-ecm"
  prompt="¿Por qué elevamos al cuadrado los errores (ECM) en lugar de sumar las diferencias directamente? Si la relación dosis-respuesta es sigmoidea (no lineal), ¿la regresión lineal sigue siendo útil para aproximarla en algún rango?"
  answer="Elevar al cuadrado penaliza más los errores grandes y evita que errores positivos y negativos se cancelen entre sí. La regresión lineal puede aproximar una sigmoidea en su rango casi lineal (la zona media de la curva), pero no en los extremos donde se aplana."
/>

<ConceptCard variant="key-idea">
La regresión lineal encuentra la relación lineal entre una variable independiente (concentración) y una dependiente (efecto). La "mejor recta" minimiza el ECM — esto se llama **mínimos cuadrados**.
</ConceptCard>

No toda relación es lineal; en biología muchas son curvas sigmoideas (dosis-respuesta).

</Section>

<Section number={12} title="Overfitting: interactive" eyebrow="INTERACTIVA">

Vamos a ver en vivo cómo la complejidad de un modelo afecta su capacidad de generalizar.

<ReflectionCheck
  blockId="reflection-l02-overfitting-predict"
  prompt="Si un modelo tiene error CERO en los datos de entrenamiento, ¿creés que funcionará igual de bien con datos nuevos?"
  answer="No. Error cero en entrenamiento es señal de sobreajuste: el modelo memorizó los datos de entrenamiento pero no generalizará a datos nuevos. Es como un estudiante que memoriza las respuestas del examen anterior pero no entiende los conceptos."
/>

<InteractiveFrame src="/interactives/demo_06b_overfitting.html" height="800px" caption="simulación educativa sobre datos sintéticos" />

**¿Qué muestra este demo?**
- El panel izquierdo muestra puntos de **entrenamiento** (azul) y **prueba** (rojo), con la curva de ajuste polinomial
- El panel derecho muestra el **Error Cuadrático Medio (ECM)** para cada conjunto
- La línea punteada gris es la **función real subyacente** — que el modelo nunca ve, igual que en la vida real

</Section>

<Section number={13} title="Tres regímenes de complejidad" eyebrow="CONCEPTO">

| Grado | Diagnóstico | ¿Qué pasa? |
|---|---|---|
| **1–2** (muy simple) | **Subajuste** (underfitting) | El modelo no captura la tendencia. Ambos errores (train y test) son altos. El modelo es demasiado *poco* expresivo. |
| **3–6** (balanceado) | **Punto óptimo** | El modelo captura la tendencia general sin memorizar el ruido. Ambos errores son bajos y cercanos entre sí. |
| **8–15** (demasiado complejo) | **Sobreajuste** (overfitting) | El modelo memoriza cada punto de entrenamiento (error train ~0), pero al ser muy sensible al ruido, falla con datos nuevos (error test alto). |

<ConceptCard variant="key-idea">
El objetivo no es minimizar el error de entrenamiento. Es minimizar el error en datos **nuevos y no vistos**. El punto óptimo está en el equilibrio entre subajuste y sobreajuste.
</ConceptCard>

</Section>

<Section number={14} title="Analogía biotecnológica" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
Un modelo sobreajustado es como un protocolo de PCR que funciona solo en tu termociclador, con tus reactivos, en tu mesada del laboratorio — pero falla cuando otro laboratorio lo replica. Memorizaste las condiciones específicas de tu entorno (temperatura exacta del termociclador, marca de la polimerasa, humedad ambiental) en lugar de aprender el principio biológico general. El modelo, como el protocolo, necesita generalizar, no memorizar.
</ConceptCard>

**La solución**:
- **Train/test split**: separar los datos en entrenamiento y prueba. El modelo solo ve los de entrenamiento. Probamos en los de prueba.
- **Validación cruzada**: probar el modelo en múltiples particiones de los datos
- **Modelos más simples**: a veces menos es más (navaja de Occam)

</Section>

<Section number={15} title="Overfitting: reflexión final" eyebrow="CONCEPTO">

<ReflectionCheck
  blockId="reflection-l02-overfitting"
  prompt="Un modelo con 99% de accuracy en entrenamiento pero 60% en datos nuevos — ¿es subajuste o sobreajuste? ¿Qué harías para mejorarlo? Entre un modelo simple con 80% de accuracy que funciona consistentemente y uno complejo con 99% en train pero 70% en test, ¿cuál preferirías para diagnosticar una infección?"
  answer="Es sobreajuste. Soluciones: simplificar el modelo (reducir complejidad), aumentar datos de entrenamiento, aplicar regularización. Para diagnosticar una infección prefiero el modelo simple y consistente (80%) — es más confiable porque generaliza mejor; un falso negativo por sobreajuste podría tener consecuencias graves."
/>

</Section>

<Section number={16} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

1. **¿Qué es una frontera de decisión?**
   - a) El límite ético de lo que la IA puede decidir
   - b) La línea (o superficie) que separa diferentes clases en el espacio de características
   - c) El momento en que el algoritmo deja de aprender
   - d) La máxima precisión que puede alcanzar un modelo

2. **En KNN, ¿qué significa que k sea muy grande (ej. k=20)?**
   - a) El modelo clasifica más rápido
   - b) La frontera se vuelve más suave, pero puede perder patrones locales
   - c) El modelo necesita más memoria
   - d) El accuracy siempre mejora

3. **¿Cuál es la diferencia entre clasificación y regresión?**
   - a) Clasificación es más precisa que regresión
   - b) Clasificación predice categorías discretas; regresión predice valores continuos
   - c) No hay diferencia, son sinónimos
   - d) Regresión solo funciona con datos biológicos

4. **¿Qué diferencia al subajuste (underfitting) del sobreajuste (overfitting)?**
   - a) En subajuste ambos errores son altos; en sobreajuste el error train es bajo pero el test es alto
   - b) En subajuste el error train es bajo; en sobreajuste ambos errores son altos
   - c) Son lo mismo visto desde distintos ángulos
   - d) El subajuste solo ocurre con KNN, el sobreajuste solo con regresión

5. **¿Por qué el overfitting es problemático?**
   - a) Porque el modelo tarda mucho en entrenar
   - b) Porque el modelo funciona bien en datos de entrenamiento pero mal en datos nuevos
   - c) Porque usa demasiada memoria RAM
   - d) Porque solo funciona con redes neuronales

<AnswerReveal summary="Ver respuestas">
<p><strong>1.</strong> b) La frontera separa clases. En 2D es una línea; en 3D es un plano; en más dimensiones es un hiperplano.</p>
<p><strong>2.</strong> b) k grande suaviza la frontera pero puede perder detalle local. Es un balance.</p>
<p><strong>3.</strong> b) Clasificación → categorías (Aspergillus/Penicillium). Regresión → números continuos (concentración, peso, temperatura).</p>
<p><strong>4.</strong> a) Subajuste: el modelo es demasiado simple (ambos errores altos). Sobreajuste: el modelo es demasiado complejo (train bajo, test alto). Son los dos extremos del espectro de complejidad.</p>
<p><strong>5.</strong> b) El modelo memoriza los datos de entrenamiento y no generaliza. Es el problema más común en ML.</p>
</AnswerReveal>

</Section>

<Section number={17} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
Tres algoritmos, un problema fundamental (overfitting) y las herramientas para resolverlo. Ya entendés cómo aprenden las máquinas.
</MascotMessage>

Ahora que entendés cómo aprenden los algoritmos, en la Lección 3 vamos a ver aplicaciones concretas en biotecnología: AlphaFold para predicción de estructuras de proteínas, cómo se visualizan moléculas en 3D con datos de PDB, y el pipeline completo de un proyecto de ML aplicado a la microbiología.

</Section>
