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

# Lección 2: ¿Cómo aprende la IA?

## Motivación

En la Lección 1 vimos que las reglas fijas no son suficientes para clasificar conidias. Hay demasiada variabilidad natural, demasiadas excepciones. Necesitamos algo que se adapte a los datos, no al revés.

Acá entra el **aprendizaje automático** (machine learning). En lugar de que un humano programe cada regla, le mostramos ejemplos a la máquina y ella *descubre* las reglas por sí misma.

Pero... ¿cómo funciona ese "descubrimiento"? ¿Qué pasa adentro del algoritmo cuando "aprende"? Vamos a verlo con tres algoritmos fundamentales: frontera de decisión, KNN y regresión lineal. Después vamos a explorar un problema clave: el sobreajuste.

## Panorama General

```
Lección 1 (Features + reglas fijas) → Lección 2 (¡Acá aprenden las máquinas!)
↓
Entender frontera de decisión → KNN → Regresión → Overfitting
↓
Lección 3 (Aplicaciones biotecnológicas)
```

## Teoría

### Aprendizaje supervisado: aprender con ejemplos

El tipo de aprendizaje que vamos a ver se llama **aprendizaje supervisado**. Funciona así:

1. Tenemos un conjunto de **ejemplos etiquetados** (conidias con su especie)
2. Cada ejemplo tiene **features** (área, circularidad, textura...)
3. El algoritmo busca patrones que relacionen las features con la etiqueta
4. Una vez que "aprendió", puede predecir la etiqueta de nuevas conidias no vistas

```
Ejemplos de entrenamiento → Algoritmo → Modelo → Predicciones
     (conidias + especie)                              (nuevas conidias)
```

### ¿Qué es un "modelo"?

Un **modelo** es el resultado del aprendizaje. Es una representación matemática de los patrones que el algoritmo encontró en los datos.

Pensalo así:
- Los **datos de entrenamiento** son como los ejercicios resueltos de un libro de texto
- El **algoritmo** es como el estudiante que estudia
- El **modelo** es el conocimiento que el estudiante adquirió
- Las **predicciones** son los ejercicios nuevos que el estudiante resuelve usando ese conocimiento

### interactiva 4: Frontera de decisión lineal

Empecemos con el algoritmo más simple: el **perceptrón**. Un perceptrón traza una línea recta para separar dos clases.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>Antes de interactuar, respondé:</strong>
  <p><em>¿Crees que una línea recta puede separar dos tipos de conidias si solo usamos dos características (área y circularidad)?</em></p>
</div>

<iframe src="/interactives/demo_04_boundary.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>simulación educativa sobre datos sintéticos</small>

**¿Qué está pasando?**
- Cada punto es una conidia (azul = *Aspergillus*, rojo = *Penicillium*)
- La línea es la **frontera de decisión** que el modelo aprende
- Del lado azul de la línea, el modelo predice *Aspergillus*; del lado rojo, *Penicillium*
- El accuracy muestra qué porcentaje de conidias están bien clasificadas

**Probá vos:**
1. Mové los sliders para ajustar la línea manualmente
2. Fijate cómo cambia el accuracy
3. Después presioná "Entrenar automáticamente" y observá cómo el algoritmo encuentra la mejor línea por sí solo

**Concepto clave**: El aprendizaje consiste en *ajustar parámetros* (en este caso, pendiente e intercepto) para minimizar errores. Cada slider es un parámetro que el algoritmo optimiza.

### interactiva 5: KNN — clasificar por cercanía

Ahora veamos un enfoque completamente diferente: en lugar de trazar una línea, KNN clasifica según los vecinos más cercanos.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>Antes de interactuar, respondé:</strong>
  <p><em>Si k=1 clasificamos según el vecino más cercano. ¿Qué crees que pasa si aumentamos k a 15?</em></p>
</div>

<iframe src="/interactives/demo_05_knn.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>simulación educativa sobre datos sintéticos</small>

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

**Concepto clave**: La elección de **k** es un **hiperparámetro**. No lo aprende el modelo; lo elegimos nosotros. Encontrar el valor óptimo es parte del arte del machine learning.

### Regresión: predecir números, no categorías

Hasta ahora clasificamos conidias en dos categorías. Pero ¿qué pasa si queremos predecir un **valor numérico**? Por ejemplo: "dada una concentración de fármaco antifúngico, ¿qué diámetro de halo de inhibición esperamos?"

Eso es **regresión**. En lugar de predecir una etiqueta (Aspergillus/Penicillium), predecimos un número continuo.

### Demo interactiva 6: Regresión lineal

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>Antes de interactuar, respondé:</strong>
  <p><em>Si duplicamos la concentración de un fármaco, ¿esperás que el efecto inhibitorio se duplique exactamente?</em></p>
</div>

<iframe src="/interactives/demo_06_regression.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>modelo sobre datos reales simulados (basado en curvas dosis-respuesta de antifúngicos)</small>

**¿Qué muestra?**
- Cada punto es un experimento: concentración de fármaco vs. halo de inhibición
- La recta es el **modelo de regresión lineal**: la mejor línea que pasa entre los puntos
- El **Error Cuadrático Medio (ECM)** mide qué tan lejos están los puntos de la recta

**Probá:**
1. Ajustá pendiente e intercepto manualmente
2. Fijate cómo el ECM se reduce al acercarte a la mejor recta
3. Presioná "Calcular mejor recta" para ver la solución óptima
4. Usá "Predecir" para estimar el halo para una concentración nueva

**Conceptos clave:**
- La regresión lineal encuentra la relación lineal entre una variable independiente (concentración) y una dependiente (efecto)
- La "mejor recta" minimiza el ECM — esto se llama **mínimos cuadrados**
- No toda relación es lineal; en biología muchas son curvas sigmoideas (dosis-respuesta)

### Demo interactiva 6b: Sobreajuste y subajuste

Vamos a ver en vivo cómo la complejidad de un modelo afecta su capacidad de generalizar.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>Antes de interactuar, respondé:</strong>
  <p><em>Si un modelo tiene error CERO en los datos de entrenamiento, ¿creés que funcionará igual de bien con datos nuevos?</em></p>
</div>

<iframe src="/interactives/demo_06b_overfitting.html" width="100%" height="800px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>simulación educativa sobre datos sintéticos</small>

**¿Qué muestra este demo?**
- El panel izquierdo muestra puntos de **entrenamiento** (azul) y **prueba** (rojo), con la curva de ajuste polinomial
- El panel derecho muestra el **Error Cuadrático Medio (ECM)** para cada conjunto
- La línea punteada gris es la **función real subyacente** — que el modelo nunca ve, igual que en la vida real

**Tres regímenes de complejidad:**

| Grado | Diagnóstico | ¿Qué pasa? |
|---|---|---|
| **1–2** (muy simple) | **Subajuste** (underfitting) | El modelo no captura la tendencia. Ambos errores (train y test) son altos. El modelo es demasiado *poco* expresivo. |
| **3–6** (balanceado) | **Punto óptimo** | El modelo captura la tendencia general sin memorizar el ruido. Ambos errores son bajos y cercanos entre sí. |
| **8–15** (demasiado complejo) | **Sobreajuste** (overfitting) | El modelo memoriza cada punto de entrenamiento (error train ~0), pero al ser muy sensible al ruido, falla con datos nuevos (error test alto). |

**Subajuste (underfitting)** ocurre cuando el modelo es **demasiado simple** para capturar la estructura de los datos. Se reconoce porque **ambos errores (train y test) son altos**.

**Sobreajuste (overfitting)** ocurre cuando el modelo es **demasiado complejo** y memoriza el ruido en lugar de la señal. Se reconoce porque hay una **brecha grande entre el error de entrenamiento (muy bajo) y el de prueba (alto)**.

>  **Idea clave**: El objetivo no es minimizar el error de entrenamiento. Es minimizar el error en datos **nuevos y no vistos**. El punto óptimo está en el equilibrio entre subajuste y sobreajuste.

**La solución**: 
- **Train/test split**: separar los datos en entrenamiento y prueba. El modelo solo ve los de entrenamiento. Probamos en los de prueba.
- **Validación cruzada**: probar el modelo en múltiples particiones de los datos
- **Modelos más simples**: a veces menos es más (navaja de Occam)

## Resumen

| Algoritmo | Tipo | ¿Qué hace? | Ejemplo en biotech |
|---|---|---|---|
| Perceptrón | Clasificación | Traza una línea para separar dos clases | Clasificar conidias por especie |
| KNN | Clasificación | Clasifica según los k vecinos más cercanos | Identificar cepas por similitud de perfil |
| Regresión lineal | Regresión | Predice valores numéricos | Estimar concentración inhibitoria |
| Overfitting | Problema | El modelo memoriza en lugar de generalizar | Modelo que solo funciona en el laboratorio de entrenamiento |
| Underfitting | Problema | El modelo es demasiado simple para capturar la estructura | Regresión lineal en datos no lineales |

## Checkpoint de conceptos

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

<details>
<summary>Ver respuestas</summary>
<p><strong>1.</strong> b) La frontera separa clases. En 2D es una línea; en 3D es un plano; en más dimensiones es un hiperplano.</p>
<p><strong>2.</strong> b) k grande suaviza la frontera pero puede perder detalle local. Es un balance.</p>
<p><strong>3.</strong> b) Clasificación → categorías (Aspergillus/Penicillium). Regresión → números continuos (concentración, peso, temperatura).</p>
<p><strong>4.</strong> a) Subajuste: el modelo es demasiado simple (ambos errores altos). Sobreajuste: el modelo es demasiado complejo (train bajo, test alto). Son los dos extremos del espectro de complejidad.</p>
<p><strong>5.</strong> b) El modelo memoriza los datos de entrenamiento y no generaliza. Es el problema más común en ML.</p>
</details>

## Para la próxima lección

Ahora que entendés cómo aprenden los algoritmos, en la Lección 3 vamos a ver aplicaciones concretas en biotecnología: AlphaFold para predicción de estructuras de proteínas, cómo se visualizan moléculas en 3D con datos de PDB, y el pipeline completo de un proyecto de ML aplicado a la microbiología.
