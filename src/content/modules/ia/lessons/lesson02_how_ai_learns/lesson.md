---
Module: 1
Lesson Number: 2
Lesson Title: ¿Cómo aprende la IA?
Estimated Duration: 60 minutos
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

<Section number={2} title="Aprendizaje supervisado" eyebrow="CONCEPTO">

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

<Section number={3} title="Frontera de decisión lineal" eyebrow="CONCEPTO">

Empecemos con el algoritmo más simple: el **perceptrón**. Un perceptrón traza una línea recta para separar dos clases.

<ConceptCard variant="key-idea">
La **frontera de decisión** es la línea (o superficie) que separa diferentes clases en el espacio de características. Del lado azul, el modelo predice *Aspergillus*; del lado rojo, *Penicillium*.
</ConceptCard>

</Section>

<Section number={4} title="Perceptrón en acción" eyebrow="INTERACTIVA">

<ChoiceQuestion
  question="¿Qué ajusta el perceptrón para trazar la frontera que separa dos clases?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-perceptron-1"
  allowContinueOnIncorrect
  explanation="La recta se define como w₁·x₁ + w₂·x₂ + b = 0. El perceptrón aprende corrigiendo w₁, w₂ y b solo cuando se equivoca."
  options={[
    { id: "a", label: "Dos pesos (w₁, w₂) y un sesgo (b) que definen la recta", correct: true, feedback: "¡Correcto! Esos tres números determinan la posición y orientación de la frontera." },
    { id: "b", label: "El número de datos de entrenamiento", correct: false, feedback: "El tamaño del dataset no se aprende; son los parámetros de la frontera los que se ajustan." },
    { id: "c", label: "Los colores que usa el gráfico para pintar cada clase", correct: false, feedback: "Los colores son visualización; el aprendizaje es matemático, no estético." },
    { id: "d", label: "La velocidad del procesador de la computadora", correct: false, feedback: "El hardware no forma parte de los parámetros del modelo." },
  ]}
/>

<PerceptronTrainer />

**¿Qué está pasando?**
- Cada punto es una biopsia real de mama (círculo = benigno, triángulo = maligno)
- El perceptrón traza una **frontera de decisión** lineal para separar las clases
- La tasa de aprendizaje controla qué tan grande es cada ajuste de pesos

**Probá vos:**
1. Ajustá la tasa de aprendizaje con el slider
2. Presioná "Paso" para entrenar una muestra a la vez y ver cómo se actualizan los pesos
3. Usá "Entrenar" para ver el aprendizaje automáticamente y "Pausar" para frenarlo
4. Hacé clic en un punto vacío del gráfico para predecir una muestra hipotética
5. Fijate en la bitácora cuándo el modelo acierta y cuándo corrige sus pesos

<ConceptCard variant="key-idea">
El perceptrón aprende **corrigiendo sus errores**: solo actualiza los pesos cuando su predicción es incorrecta, moviendo la frontera de decisión en la dirección correcta.
</ConceptCard>

</Section>

<Section number={5} title="Límites de la frontera lineal" eyebrow="CONCEPTO">

<ChoiceQuestion
  question="¿Qué pasa si las clases no son separables linealmente y por qué el accuracy no llega al 100%?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-frontera-1"
  allowContinueOnIncorrect
  explanation="Si no hay separación lineal, la frontera debe ser curva. El accuracy no llega al 100% por solapamiento natural: conidias atípicas, ruido y variabilidad biológica."
  options={[
    { id: "a", label: "La frontera seguiría siendo recta y el accuracy llegaría al 100% ajustando bien", correct: false, feedback: "No: ninguna recta separa poblaciones que se mezclan." },
    { id: "b", label: "La frontera sería curva y ninguna recta separa perfectamente por solapamiento natural", correct: true, feedback: "¡Exacto! Necesitas modelos más flexibles cuando las clases se mezclan." },
    { id: "c", label: "Hay que eliminar todos los datos atípicos para que sea lineal", correct: false, feedback: "Eliminar atípicos esconde el problema; la variabilidad es real." },
    { id: "d", label: "El accuracy siempre llega al 100% si aumentas los datos", correct: false, feedback: "Más datos no eliminan el solapamiento inherente entre clases." },
  ]}
/>

<ConceptCard variant="warning">
No todos los problemas se pueden resolver con una línea recta. Cuando las clases se mezclan, necesitamos algoritmos más flexibles.
</ConceptCard>

</Section>

<Section number={6} title="KNN: clasificar por cercanía" eyebrow="CONCEPTO">

Ahora veamos un enfoque completamente diferente: en lugar de trazar una línea como el perceptrón, KNN clasifica según los vecinos más cercanos. No aprende parámetros: simplemente recuerda los datos y consulta a los vecinos cuando llega un caso nuevo.

<ConceptCard variant="definition">
**KNN (K-Nearest Neighbors)**: el algoritmo mira los k puntos más cercanos al punto nuevo, cuenta cuántos son de cada clase, y asigna la clase mayoritaria.
</ConceptCard>

</Section>

<Section number={7} title="KNN en acción" eyebrow="INTERACTIVA">

<ChoiceQuestion
  question="Si k=1 usamos el vecino más cercano y si subimos a k=15, ¿qué crees que pasa con la frontera de KNN?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-knn-1"
  allowContinueOnIncorrect
  explanation="k grande suaviza la frontera y la hace menos sensible al ruido, pero puede ignorar patrones locales. Es un balance sesgo-varianza."
  options={[
    { id: "a", label: "La frontera se vuelve más suave y menos sensible al ruido", correct: true, feedback: "¡Exacto! k grande promedia más vecinos y diluye el efecto de datos atípicos." },
    { id: "b", label: "El accuracy de prueba siempre mejora, sin importar cuánto suba k", correct: false, feedback: "No: k demasiado grande pierde detalle local y puede empeorar." },
    { id: "c", label: "El modelo empieza a trazar una línea recta como el perceptrón", correct: false, feedback: "KNN no aprende rectas; su frontera siempre depende de la votación local." },
    { id: "d", label: "La frontera se vuelve más rugosa y sobreajustada", correct: false, feedback: "Al revés: la rugosidad es de k pequeño. k grande suaviza." },
  ]}
/>

<KnnTrainer />

**¿Cómo funciona KNN?**
1. El gráfico muestra 569 biopsias reales de mama (círculo = benigno, triángulo = maligno)
2. Elegí un valor de k con el slider — es la cantidad de vecinos que votan
3. Hacé clic en cualquier parte del gráfico para posicionar un punto de prueba nuevo
4. Los k vecinos más cercanos se resaltan y votan la clase del punto nuevo
5. La zona sombreada muestra la **frontera de decisión**: de un lado KNN predice benigno, del otro maligno

**Experimentá:**
1. Poné k=1 y mové el punto de prueba — ¿cómo es la frontera? ¿Y el accuracy de prueba?
2. Subí k a 15 — ¿cómo cambia la frontera? ¿El accuracy de entreno y prueba se acercan?
3. Mirá la curva de accuracy vs k: ¿dónde está el mejor k para este dataset?
4. Compará con el perceptrón de la sección anterior: ¿qué algoritmo tiene mejor accuracy?

<ConceptCard variant="key-idea">
KNN no "entrena" en el sentido tradicional: no aprende parámetros como el perceptrón. Simplemente **recuerda** todos los datos y, para cada predicción nueva, consulta a los k vecinos más cercanos. La elección de k es un **hiperparámetro**: no lo aprende el algoritmo, lo elegimos nosotros.
</ConceptCard>

</Section>

<Section number={8} title="Clasificación vs regresión" eyebrow="CONCEPTO">

<ChoiceQuestion
  question="Clasificar un patógeno por similitud con aislamientos previos, ¿es clasificación o regresión? ¿Qué riesgo tiene k=1 con datos ruidosos?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-clasif-1"
  allowContinueOnIncorrect
  explanation="Es clasificación (categoría discreta). k=1 es muy sensible al ruido: un dato mal medido decide la clase. k grande diluye el ruido."
  options={[
    { id: "a", label: "Es clasificación; k=1 puede fallar por un vecino ruidoso, k=20 diluye el ruido", correct: true, feedback: "¡Correcto! k controla el balance entre detalle local y robustez al ruido." },
    { id: "b", label: "Es regresión; k no importa porque KNN siempre es regresión", correct: false, feedback: "Regresión predice números continuos; acá predecimos especie (categoría) → clasificación." },
    { id: "c", label: "Es clasificación; k=1 siempre es más preciso que k=20", correct: false, feedback: "No siempre: k=1 sobreajusta. k grande generaliza mejor aunque pierda algo de detalle." },
    { id: "d", label: "Son lo mismo, clasificación y regresión son sinónimos", correct: false, feedback: "No: clasificación = categorías discretas; regresión = valores continuos." },
  ]}
/>

Hasta ahora clasificamos conidias en dos categorías. Pero ¿qué pasa si queremos predecir un **valor numérico**? Por ejemplo: "dada una concentración de fármaco antifúngico, ¿qué diámetro de halo de inhibición esperamos?"

<ConceptCard variant="definition">
**Clasificación** predice categorías discretas (Aspergillus/Penicillium). **Regresión** predice valores continuos (concentración, peso, temperatura).
</ConceptCard>

</Section>

<Section number={9} title="Regresión lineal en acción" eyebrow="INTERACTIVA">

<ChoiceQuestion
  question="Si solo conocemos el radio medio de una biopsia, ¿podemos predecir con precisión la textura media?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-regresion-1"
  allowContinueOnIncorrect
  explanation="No con gran precisión: R²≈0,10. La textura depende de muchos factores más; la recta es la mejor aproximación lineal, pero siempre tiene dispersión."
  options={[
    { id: "a", label: "Sí, con precisión casi perfecta porque la relación es fuerte", correct: false, feedback: "No: es una relación débil, los puntos están muy dispersos alrededor de la recta." },
    { id: "b", label: "No, la relación es débil (R²≈0,10); la textura depende de más factores que el radio", correct: true, feedback: "¡Exacto! Datos reales son ruidosos; la regresión da la mejor recta, no una predicción perfecta." },
    { id: "c", label: "Sí, moviendo los sliders de pendiente se logra R²=1", correct: false, feedback: "Ninguna recta puede pasar por todos los puntos con datos ruidosos reales." },
    { id: "d", label: "No, porque regresión solo funciona con clasificación", correct: false, feedback: "Regresión predice valores continuos como la textura; es diferente a clasificar." },
  ]}
/>

<RegressionTrainer />

**¿Qué muestra?**
- Cada punto es una biopsia real del dataset BCW: radio medio del núcleo vs. textura media del tejido
- La recta es el **modelo de regresión lineal**: la mejor línea que pasa entre los 569 puntos
- El **Error Cuadrático Medio (ECM)** mide qué tan lejos están los puntos de la recta — con datos reales, siempre hay dispersión
- Las líneas verticales (residuales) muestran la distancia de cada punto a la recta

**Probá:**
1. Mové los sliders de pendiente e intercepto para ajustar la recta manualmente
2. Fijate cómo el ECM y R² cambian en vivo al mover la recta
3. Presioná "Calcular mejor recta" para ver la solución óptima por mínimos cuadrados
4. Usá "Predecir" para estimar la textura a partir de un valor de radio

</Section>

<Section number={10} title="ECM y límites de la regresión" eyebrow="CONCEPTO">

<ChoiceQuestion
  question="¿Por qué elevamos al cuadrado los errores (ECM) y por qué el R² radio→textura es tan bajo (≈0,10)?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-ecm-1"
  allowContinueOnIncorrect
  explanation="Cuadrar penaliza errores grandes y evita cancelación. R² bajo porque la textura depende de muchos factores, no solo del radio: datos reales son ruidosos."
  options={[
    { id: "a", label: "Para que el gráfico se vea más bonito", correct: false, feedback: "No es estética: es matemática para evitar cancelación y penalizar errores grandes." },
    { id: "b", label: "Cuadrar evita cancelación y penaliza errores grandes; R² bajo porque faltan factores", correct: true, feedback: "¡Exacto! La regresión da la mejor recta, pero no explica toda la variabilidad." },
    { id: "c", label: "Porque sin cuadrado el ECM siempre es cero", correct: false, feedback: "Sin cuadrado puede cancelarse, pero no es cero; es engañoso." },
    { id: "d", label: "R² bajo significa que el modelo está mal programado", correct: false, feedback: "R² bajo refleja complejidad biológica, no un bug." },
  ]}
/>

<ConceptCard variant="key-idea">
La regresión lineal encuentra la relación lineal entre una variable independiente (radio medio) y una dependiente (textura media). La "mejor recta" minimiza el ECM — esto se llama **mínimos cuadrados**. Con datos reales, el R² rara vez es perfecto, y eso está bien: nos dice cuánta información aporta nuestra variable.
</ConceptCard>

No toda relación es lineal; en biología muchas variables tienen relaciones complejas que una sola recta no puede capturar. Un R² bajo no significa que el modelo esté mal — significa que el problema es difícil, como casi siempre en datos reales.

</Section>

<Section number={11} title="Overfitting: interactive" eyebrow="INTERACTIVA">

Vamos a ver en vivo cómo la complejidad de un modelo afecta su capacidad de generalizar.

<ChoiceQuestion
  question="Un modelo con error cero en entrenamiento, ¿generalizará bien a datos nuevos?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-overfitting-1"
  allowContinueOnIncorrect
  explanation="Error cero en entrenamiento suele indicar que el modelo memorizó ruido, no el patrón general. Falla con datos nuevos."
  options={[
    { id: "a", label: "Sí, error cero garantiza rendimiento perfecto en datos nuevos", correct: false, feedback: "No: el modelo probablemente memorizó el ruido de entrenamiento y fallará en datos nuevos." },
    { id: "b", label: "No, es señal de sobreajuste: memorizó los datos y no generaliza", correct: true, feedback: "¡Correcto! Como un estudiante que memoriza el examen anterior sin entender los conceptos." },
    { id: "c", label: "Solo si el dataset es muy grande", correct: false, feedback: "Incluso con dataset grande, memorizar es sobreajuste; lo clave es generalizar, no recordar." },
    { id: "d", label: "Sí, porque entreno y prueba son siempre idénticos", correct: false, feedback: "Entreno y prueba son distintas muestras de la población; lo importante es rendir en datos no vistos." },
  ]}
/>

<InteractiveFrame src="/interactives/demo_06b_overfitting.html" height="800px" caption="simulación educativa sobre datos sintéticos" />

**¿Qué muestra este demo?**
- El panel izquierdo muestra puntos de **entrenamiento** (azul) y **prueba** (rojo), con la curva de ajuste polinomial
- El panel derecho muestra el **Error Cuadrático Medio (ECM)** para cada conjunto
- La línea punteada gris es la **función real subyacente** — que el modelo nunca ve, igual que en la vida real

</Section>

<Section number={12} title="Tres regímenes de complejidad" eyebrow="CONCEPTO">

| Grado | Diagnóstico | ¿Qué pasa? |
|---|---|---|
| **1–2** (muy simple) | **Subajuste** (underfitting) | El modelo no captura la tendencia. Ambos errores (train y test) son altos. El modelo es demasiado *poco* expresivo. |
| **3–6** (balanceado) | **Punto óptimo** | El modelo captura la tendencia general sin memorizar el ruido. Ambos errores son bajos y cercanos entre sí. |
| **8–15** (demasiado complejo) | **Sobreajuste** (overfitting) | El modelo memoriza cada punto de entrenamiento (error train ~0), pero al ser muy sensible al ruido, falla con datos nuevos (error test alto). |

<ConceptCard variant="key-idea">
El objetivo no es minimizar el error de entrenamiento. Es minimizar el error en datos **nuevos y no vistos**. El punto óptimo está en el equilibrio entre subajuste y sobreajuste.
</ConceptCard>

</Section>

<Section number={13} title="Analogía biotecnológica" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
Un modelo sobreajustado es como un protocolo de PCR que funciona solo en tu termociclador, con tus reactivos, en tu mesada del laboratorio — pero falla cuando otro laboratorio lo replica. Memorizaste las condiciones específicas de tu entorno (temperatura exacta del termociclador, marca de la polimerasa, humedad ambiental) en lugar de aprender el principio biológico general. El modelo, como el protocolo, necesita generalizar, no memorizar.
</ConceptCard>

**La solución**:
- **Train/test split**: separar los datos en entrenamiento y prueba. El modelo solo ve los de entrenamiento. Probamos en los de prueba.
- **Validación cruzada**: probar el modelo en múltiples particiones de los datos
- **Modelos más simples**: a veces menos es más (navaja de Occam)

</Section>

<Section number={14} title="Overfitting: reflexión final" eyebrow="CONCEPTO">

<ChoiceQuestion
  question="Un modelo con 99% en entreno y 60% en test — ¿qué es y cuál preferirías para diagnosticar una infección?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-overfitting-final-1"
  allowContinueOnIncorrect
  explanation="Es sobreajuste. Soluciones: simplificar, más datos, regularización. Para diagnóstico, preferir el simple consistente (80%) que generaliza; el sobreajustado arriesga falsos negativos."
  options={[
    { id: "a", label: "Es subajuste; prefiero el complejo con 99% en train", correct: false, feedback: "No: 99% train / 60% test es sobreajuste clásico, no subajuste." },
    { id: "b", label: "Es sobreajuste; prefiero el simple 80% consistente que generaliza mejor", correct: true, feedback: "¡Correcto! Consistencia y generalización valen más que memorizar." },
    { id: "c", label: "Es sobreajuste pero no se puede mejorar", correct: false, feedback: "Sí se puede: simplificar, más datos o regularización." },
    { id: "d", label: "Ambos modelos son equivalentes, da igual cuál usar", correct: false, feedback: "No: el que generaliza es más seguro en clínica." },
  ]}
/>

</Section>

<Section number={15} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence blockOnQuiz>

<div>Cinco preguntas para verificar los conceptos clave. Responde cada una para continuar.</div>

<ChoiceQuestion
  question="¿Qué es una frontera de decisión?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-1"
  explanation="En 2D es una línea; en 3D un plano; en más dimensiones, un hiperplano que separa clases."
  options={[
    { id: "a", label: "El límite ético de lo que la IA puede decidir", correct: false, feedback: "Esa es una frontera ética, no la técnica de ML." },
    { id: "b", label: "La línea (o superficie) que separa diferentes clases en el espacio de features", correct: true, feedback: "¡Exacto! Del lado azul predice una clase, del otro la otra." },
    { id: "c", label: "El momento en que el algoritmo deja de aprender", correct: false, feedback: "El aprendizaje termina por criterio de convergencia, no es la frontera." },
    { id: "d", label: "La máxima precisión que puede alcanzar un modelo", correct: false, feedback: "La precisión es una métrica; la frontera es el límite geométrico entre clases." },
  ]}
/>

<ChoiceQuestion
  question="En KNN, ¿qué significa que k sea muy grande (ej. k=20)?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-2"
  explanation="k grande reduce varianza y ruido, pero puede perder patrones locales; es un hiperparámetro a elegir."
  options={[
    { id: "a", label: "El modelo clasifica más rápido siempre", correct: false, feedback: "k grande implica más vecinos a consultar; no es más rápido." },
    { id: "b", label: "La frontera se vuelve más suave, pero puede perder patrones locales", correct: true, feedback: "¡Correcto! k controla el balance suavidad vs detalle." },
    { id: "c", label: "El modelo necesita más memoria para entrenar", correct: false, feedback: "KNN almacena los mismos datos sin importar k; k solo afecta la votación." },
    { id: "d", label: "El accuracy siempre mejora al aumentar k", correct: false, feedback: "No: existe un k óptimo. k demasiado grande subajusta." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la diferencia entre clasificación y regresión?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-3"
  explanation="Clasificación predice categorías discretas; regresión predice valores continuos."
  options={[
    { id: "a", label: "Clasificación es siempre más precisa que regresión", correct: false, feedback: "Precisión depende del problema y los datos, no del tipo de tarea." },
    { id: "b", label: "Clasificación predice categorías discretas; regresión predice valores continuos", correct: true, feedback: "¡Exacto! Aspergillus/Penicillium es clasificación; predecir concentración es regresión." },
    { id: "c", label: "No hay diferencia, son sinónimos", correct: false, feedback: "Son familias distintas de problemas con métricas diferentes." },
    { id: "d", label: "Regresión solo funciona con datos biológicos", correct: false, feedback: "Regresión es general; funciona en cualquier dominio con variable continua." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué diferencia al subajuste (underfitting) del sobreajuste (overfitting)?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-4"
  explanation="Subajuste: modelo demasiado simple (ambos errores altos). Sobreajuste: demasiado complejo (train bajo, test alto)."
  options={[
    { id: "a", label: "En subajuste ambos errores son altos; en sobreajuste train bajo pero test alto", correct: true, feedback: "¡Perfecto! Son los dos extremos del espectro de complejidad." },
    { id: "b", label: "En subajuste train bajo; en sobreajuste ambos altos", correct: false, feedback: "Al revés: subajuste alto en ambos, sobreajuste bajo en train y alto en test." },
    { id: "c", label: "Son lo mismo visto desde distintos ángulos", correct: false, feedback: "No: son diagnósticos opuestos con soluciones diferentes." },
    { id: "d", label: "El subajuste solo ocurre con KNN, el sobreajuste solo con regresión", correct: false, feedback: "Ambos pueden ocurrir en cualquier algoritmo." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué el overfitting es problemático?"
  moduleSlug="ia"
  lessonSlug="lesson02_how_ai_learns"
  blockId="choice-l02-check-5"
  explanation="El modelo memoriza variaciones y ruido de entreno y falla en datos nuevos; la validación en test es la defensa."
  options={[
    { id: "a", label: "Porque el modelo tarda mucho en entrenar", correct: false, feedback: "El tiempo de entreno puede ser alto, pero el problema esencial es la mala generalización." },
    { id: "b", label: "Porque funciona bien en entreno pero mal en datos nuevos", correct: true, feedback: "¡Correcto! Ese es el problema más común en ML." },
    { id: "c", label: "Porque usa demasiada memoria RAM", correct: false, feedback: "El consumo de memoria no define el sobreajuste." },
    { id: "d", label: "Porque solo ocurre con redes neuronales", correct: false, feedback: "Puede ocurrir en cualquier modelo demasiado complejo, no solo redes." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={16} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
Tres algoritmos, un problema fundamental (overfitting) y las herramientas para resolverlo. Ya entendés cómo aprenden las máquinas.
</MascotMessage>

Ahora que entendés cómo aprenden los algoritmos, en la Lección 3 vamos a ver aplicaciones concretas en biotecnología: AlphaFold para predicción de estructuras de proteínas, cómo se visualizan moléculas en 3D con datos de PDB, y el pipeline completo de un proyecto de ML aplicado a la microbiología.

</Section>
