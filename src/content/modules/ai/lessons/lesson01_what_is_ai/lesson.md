---
Module: 1
Lesson Number: 1
Lesson Title: ¿Qué es la Inteligencia Artificial?
Estimated Duration: 60 minutos
Prerequisites: Ninguno
Learning Objectives:
  - Definir inteligencia artificial y distinguirla de la inteligencia natural
  - Explicar el concepto de "características" (features) en datos
  - Comprender cómo las máquinas reconocen patrones a partir de datos numéricos
  - Identificar las limitaciones de las reglas fijas frente al aprendizaje automático
Keywords: inteligencia artificial, features, patrones, clasificación, conidias, Aspergillus, Penicillium
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: Features, clasificación, reconocimiento de patrones
Datasets Used: module01_ai_cell_features.csv
---

# Lección 1: ¿Qué es la Inteligencia Artificial?

## Motivación

Imaginá que sos microbióloga/o y estás mirando al microscopio una muestra de un paciente inmunocomprometido. Ves cientos de conidias (esporas fúngicas) y necesitás identificar rápidamente si pertenecen al género *Aspergillus* o *Penicillium*. La diferencia es crítica: *Aspergillus* puede causar infecciones invasivas graves en pacientes neutropénicos.

Tradicionalmente, esto requiere un ojo entrenado y tiempo. ¿Y si una computadora pudiera aprender a hacer esta clasificación por vos, en segundos, con la misma precisión que un especialista? Eso es la inteligencia artificial aplicada a la biotecnología.

## Panorama General

Esta lección es la primera del Módulo 1. Vamos a construir desde cero qué significa que una máquina "aprenda". No asumimos ningún conocimiento previo de programación, estadística ni matemática. Solo curiosidad y ganas de entender.

```
Lección 1 (¿Qué es IA?) → Lección 2 (¿Cómo aprende?) → Lección 3 (IA en Biotecnología) → Lección 4 (Casos Reales)
```

## Teoría

### ¿Qué es la Inteligencia Artificial?

**Definición**: La inteligencia artificial (IA) es la rama de la computación que se ocupa de crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana.

**Intuición**: Cuando ves una foto y reconocés que es un gato, tu cerebro está haciendo un procesamiento increíblemente complejo en milisegundos. La IA intenta que las computadoras hagan ese mismo tipo de procesamiento.

**Pero ojo**: La IA no "piensa" como nosotros. No tiene conciencia, emociones ni entendimiento real. **Procesa datos numéricos y encuentra patrones estadísticos.** Eso es todo. Y es suficiente para ser extraordinariamente útil.

### El problema: clasificar conidias de *Aspergillus* y *Penicillium*

Vamos a usar un ejemplo concreto que nos va a acompañar todo el módulo.

Las conidias de *Aspergillus* y *Penicillium* tienen diferencias sutiles:

| Característica | *Aspergillus* | *Penicillium* |
|---|---|---|
| Forma | Más redondeada | Más alargada |
| Textura superficial | Rugosa (verrugosa) | Más lisa |
| Color | Verde-azulado | Verde |
| Tamaño | ~3-6 µm | ~2.5-5 µm |

Un micólogo entrenado reconoce estas diferencias visualmente. Pero una computadora solo entiende **números**. Necesitamos convertir esas características en datos numéricos.

### Características (Features)

En IA, llamamos **features** (características o atributos) a las propiedades medibles de los datos que usamos para hacer predicciones.

Para nuestras conidias, las features podrían ser:

- **Área** (µm²): qué tan grande es la conidia
- **Circularidad** (0-1): qué tan redonda es (1 = círculo perfecto)
- **Textura** (índice): qué tan rugosa es la superficie
- **Intensidad** (0-255): qué tan clara u oscura es al microscopio

Cada conidia se convierte en un **vector de números**. Eso es lo que la IA puede procesar.

> 💡 **Idea clave**: La IA no "ve" imágenes como nosotros. Ve matrices de números. Cada número es una pista que ayuda a clasificar.

### Demo interactiva 1: Visualizando características

Vamos a ver nuestras primeras conidias como datos.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>Si medimos solo el área de una conidia, ¿podemos distinguir siempre Aspergillus de Penicillium?</em></p>
</div>

<iframe src="/interactives/demo_01_features.html" width="100%" height="650px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>🔬 simulación educativa sobre datos sintéticos</small>

Cada punto en el gráfico es una conidia. Podés cambiar qué características comparar con el menú desplegable. Notá cómo algunas features separan mejor las especies que otras.

**¿Qué observamos?**
- Si usamos solo una característica, hay superposición entre especies
- Con dos o más características, la separación mejora
- El "espacio de características" (feature space) es donde la IA trabaja

### Demo interactiva 2: Reconocimiento de patrones

Ahora vamos a hacer el ejercicio inverso: vos actuás como clasificador.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>¿Crees que un ojo humano entrenado puede clasificar mejor que un algoritmo simple?</em></p>
</div>

<iframe src="/interactives/demo_02_patterns.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>🔬 simulación educativa sobre datos sintéticos</small>

Cada cuadrícula de 5×5 representa el patrón de una conidia simplificado. Tu tarea es clasificar cada una como *Aspergillus* o *Penicillium* basándote en el patrón visual.

**¿Qué aprendemos?**
- Los humanos reconocemos patrones visuales intuitivamente
- Pero no podemos explicar fácilmente *cómo* lo hacemos
- La IA necesita convertir esos patrones en números para aprender

### Demo interactiva 3: Reglas fijas vs. aprendizaje automático

Antes de que existiera el machine learning, se usaban **sistemas basados en reglas**. Veamos por qué no son suficientes.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>Si creamos reglas manuales (área > X y textura > Y), ¿podemos clasificar todas las conidias correctamente?</em></p>
</div>

<iframe src="/interactives/demo_03_rules.html" width="100%" height="650px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>🔬 simulación educativa sobre datos sintéticos</small>

Mové los sliders para ajustar los umbrales. Fijate cómo cambiar las reglas afecta la precisión. Por más que ajustes, siempre hay puntos que se clasifican mal.

**¿Por qué fallan las reglas fijas?**
- La naturaleza es difusa, no binaria
- Hay superposición natural entre especies
- Para capturar la complejidad, necesitaríamos cientos de reglas → imposible de mantener
- **Acá entra el machine learning**: en lugar de programar reglas, la máquina *aprende* los patrones de los datos

## Resumen

| Concepto | Idea clave |
|---|---|
| Inteligencia Artificial | Máquinas que realizan tareas que requieren inteligencia humana |
| Features (características) | Propiedades medibles de los datos que usamos para clasificar |
| Espacio de características | El "universo" multidimensional donde la IA busca patrones |
| Reglas fijas | Funcionan para problemas simples, fallan en la complejidad del mundo real |
| Aprendizaje automático | La máquina encuentra patrones por sí misma a partir de ejemplos |

## Checkpoint de conceptos

<div style="border: 2px solid #d62728; border-radius: 8px; padding: 12px; margin: 16px 0; background: #fff5f5;">
  <strong>📝 Respondé estas preguntas antes de seguir:</strong>
</div>

1. **¿Qué es una "feature" en el contexto de IA?**
   - a) Una característica del hardware de la computadora
   - b) Una propiedad medible de los datos que usamos para clasificar
   - c) Un tipo de algoritmo de aprendizaje
   - d) Un error en el modelo

2. **¿Por qué los sistemas basados en reglas fijas no son ideales para clasificar conidias?**
   - a) Porque las reglas son muy lentas de ejecutar
   - b) Porque la naturaleza tiene variabilidad natural que las reglas no capturan
   - c) Porque las computadoras no entienden reglas
   - d) Porque las conidias cambian de forma constantemente

3. **¿Qué significa que una máquina "aprenda"?**
   - a) Que entiende el significado de lo que clasifica
   - b) Que encuentra patrones estadísticos en los datos sin ser programada explícitamente
   - c) Que puede tener conversaciones como un humano
   - d) Que reemplaza completamente al científico

<details>
<summary>Ver respuestas</summary>
<p><strong>1.</strong> b) Una propiedad medible de los datos. Las features son los números que la IA usa para aprender.</p>
<p><strong>2.</strong> b) La variabilidad natural hace que las reglas fijas siempre tengan excepciones. El ML se adapta a esa variabilidad.</p>
<p><strong>3.</strong> b) La IA no "entiende" como nosotros. Encuentra correlaciones estadísticas en los datos. Es poderoso... pero limitado.</p>
</details>

## Para la próxima lección

Viste que las reglas fijas no alcanzan. En la Lección 2 vamos a ver *cómo* las máquinas realmente aprenden: desde la frontera de decisión más simple (el perceptrón) hasta algoritmos como KNN que clasifican por cercanía. También vamos a entender qué es el "sobreajuste" (overfitting) y por qué un modelo demasiado complejo puede ser peor que uno simple.
