---
Module: 1
Lesson Number: 4
Lesson Title: Casos Reales en la Investigación Biotecnológica
Estimated Duration: 60 minutos
Prerequisites: Lección 3 — IA en la Biotecnología
Learning Objectives:
  - Comprender la historia y el impacto de AlphaFold en la biología estructural
  - Explicar cómo la IA aceleró el descubrimiento de Rentosertib (Insilico Medicine)
  - Identificar las etapas del descubrimiento de fármacos y dónde interviene la IA
  - Reconocer el estado del arte (Evo, AlphaFold3) y las limitaciones actuales de la IA
Keywords: AlphaFold, Rentosertib, Insilico Medicine, Evo, Nobel, drug discovery, CASP, PDB
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Ninguno
Machine Learning Concepts: Predicción de estructura, drug discovery, modelos genómicos
Datasets Used: PDB structures (1MBN, 5K2P, 2X8R, 4HHB, 4INS)
---

# Lección 4: Casos Reales en la Investigación Biotecnológica

## Motivación

Todo lo que vimos hasta acá —features, clasificación, regresión, fronteras de decisión— no es teoría abstracta. Es el fundamento de avances que están transformando la biotecnología hoy.

En esta lección vamos a ver dos casos concretos donde la IA tuvo un impacto real y medible. No son promesas de futuro: son hitos que ya ocurrieron.

## Panorama General

```
Lección 3 (Aplicaciones: visualización 3D, pipeline ML) → Lección 4 (Casos reales)
                                                              ↓
                    AlphaFold (Nobel 2024) → Rentosertib (Nature Medicine 2025) → Frontera
```

## Caso 1: AlphaFold — el Nobel de Química 2024

### ¿Cuál era el problema?

Desde los años 50 sabemos que la secuencia de aminoácidos de una proteína determina su estructura tridimensional (experimento de Anfinsen, Nobel 1972). Pero predecir esa estructura a partir de la secuencia —el llamado **"problema del plegamiento de proteínas"** — fue uno de los grandes desafíos de la biología computacional durante 50 años.

Determinar experimentalmente la estructura de una proteína requiere:
- **Cristalografía de rayos X**: la proteína debe formar cristales (no todas lo hacen). Meses de trabajo.
- **Resonancia magnética nuclear (RMN)**: limitada a proteínas pequeñas.
- **Crio-microscopía electrónica**: equipamiento que cuesta millones de dólares.

Para 2020, solo habíamos determinado experimentalmente ~170,000 estructuras. Se estima que existen ~200 millones de proteínas conocidas.

### La línea de tiempo

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>Antes de AlphaFold (2020), ¿cuánto tiempo tomaba determinar experimentalmente la estructura de una proteína mediana?</em></p>
</div>

<iframe src="/interactives/demo_08_alphafold.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>🧬 modelo sobre datos reales — Nature 2021, Nobel 2024</small>

**La historia en hitos:**

| Año | Hito | Impacto |
|---|---|---|
| 1972 | Anfinsen (Nobel) | "La secuencia determina la estructura" |
| 1994 | CASP (competencia) | Evaluación rigurosa de métodos de predicción |
| 2018 | AlphaFold 1 (DeepMind) | Score ~40 en CASP13 — prometedor, no revolucionario |
| **2020** | **AlphaFold 2** | **Score 92.4 en CASP14 — REVOLUCIÓN** |
| 2021 | Publicación en Nature | Código abierto, disponible para toda la comunidad |
| 2022 | AlphaFold DB | 200+ millones de estructuras predichas |
| 2024 | **Nobel de Química** | Hassabis y Jumper — reconocimiento máximo |

**¿Qué significa un score de 92.4?**
El CASP Score mide qué tan similar es la predicción a la estructura experimental. 90+ es considerado "equivalente a experimental". Antes de AlphaFold 2, nadie había superado 70.

> 💡 **Impacto concreto**: AlphaFold 2 predijo la estructura de ~200 millones de proteínas (casi todas las conocidas) en menos de 2 años. Sin IA, esto habría tomado siglos.

### ¿Qué aprendió AlphaFold?

AlphaFold no "conoce" física de proteínas. Aprendió a predecir distancias entre pares de aminoácidos analizando ~170,000 estructuras conocidas. Usa:

1. **Redes neuronales de atención** (similar a ChatGPT pero para proteínas)
2. **Información evolutiva**: secuencias de proteínas relacionadas en diferentes especies
3. **Iteración**: refina la predicción en múltiples pasos, mejorando gradualmente

No necesita saber física. Necesita **suficientes ejemplos** para encontrar patrones estadísticos.

## Caso 2: Rentosertib — el primer fármaco descubierto con IA

### ¿Cuál era el problema?

La fibrosis pulmonar idiopática (FPI) es una enfermedad progresiva y letal con pocas opciones terapéuticas. Identificar un nuevo fármaco para una enfermedad compleja puede llevar 10-15 años y costar más de 2,000 millones de dólares.

Insilico Medicine, una empresa fundada en 2014, usó IA generativa para acelerar drásticamente este proceso.

### Demo interactiva 9: Timeline de Rentosertib

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>Un fármaco típico tarda 10-15 años en desarrollarse. ¿Cuánto creés que la IA puede acortar solo la fase de descubrimiento (hasta candidato preclínico)?</em></p>
</div>

<iframe src="/interactives/demo_09_rentosertib.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>💊 modelo sobre datos reales — Nature Medicine 2025</small>

**Cronología real de Rentosertib:**

| Fecha | Evento |
|---|---|
| 2014 | Fundación de Insilico Medicine |
| 2016 | Selección del target TNIK (usando IA) |
| 2018 | Molécula líder sintetizada en solo **18 meses** |
| 2020 | Estudios preclínicos exitosos |
| 2021 | Fase clínica I (seguridad en humanos) |
| 2023 | Fase clínica II (eficacia) |
| 2025 | Publicación en *Nature Medicine* |

**La métrica que importa:**
- **Tradicional**: 2.5 a 4 años de la idea al candidato preclínico (PCC)
- **Con IA**: **18 meses** — la mitad del tiempo

### ¿Cómo usó Insilico la IA?

Insilico aplicó tres tipos de IA en paralelo:

1. **IA generativa** (Pharma.AI): diseñar moléculas nuevas con propiedades deseadas, no solo buscar en bibliotecas existentes
2. **Predicción de propiedades**: estimar toxicidad, permeabilidad, metabolismo antes de sintetizar
3. **Selección de target**: identificar qué proteína inhibir para tratar la enfermedad

> 💡 **Dato clave**: No fue un solo algoritmo, sino un **sistema de IA integrado** que aceleró todas las etapas del descubrimiento. La molécula de Rentosertib fue diseñada por IA, no encontrada en una biblioteca química.

## ¿Qué sigue? La frontera actual

### Evo: IA para el diseño genómico

Mientras AlphaFold predice estructuras de proteínas, **Evo** (Science 2024, Arc Institute) es un modelo de lenguaje entrenado en genomas completos. Puede:

- Predecir el efecto de mutaciones en el genoma
- Diseñar sistemas CRISPR-Cas funcionales (Evo 1, 2024)
- Modelar genomas de todos los dominios de la vida (Evo 2, 2025)

Evo representa una nueva frontera: pasar de predecir estructuras a **diseñar sistemas biológicos funcionales**.

### Limitaciones actuales de la IA en biotecnología

| Limitación | ¿Por qué? |
|---|---|
| No entiende mecanismos | La IA predice correlaciones, no causalidad |
| Datos de entrenamiento limitados | Muchas áreas biológicas tienen pocos datos de calidad |
| Generalización dudosa | Un modelo entrenado en un organismo puede no funcionar en otro |
| "Caja negra" | Difícil explicar por qué la IA hace ciertas predicciones |
| Validación experimental necesaria | Toda predicción de IA debe confirmarse en laboratorio |

## Resumen final del módulo

Lo que construimos en estas 4 lecciones:

| Lección | Skills adquiridas |
|---|---|
| **L1. ¿Qué es IA?** | Features, patrones, reconocimiento visual, reglas vs aprendizaje |
| **L2. ¿Cómo aprende?** | Frontera de decisión, KNN, regresión, overfitting, train/test |
| **L3. IA en Biotech** | Visualización 3D de proteínas, pipeline completo de ML |
| **L4. Casos reales** | AlphaFold, drug discovery acelerado por IA, frontera actual |

**El mensaje central**: La IA no es magia. Es matemática aplicada a datos. En biotecnología, su impacto es real, medible y está acelerando descubrimientos que salvan vidas. Pero siempre requiere supervisión humana y validación experimental.

## Checkpoint de conceptos

1. **¿Qué puntaje obtuvo AlphaFold 2 en CASP14?**
   - a) 40
   - b) 70
   - c) 92.4
   - d) 100

2. **¿Cuánto tiempo tomó descubrir Rentosertib (hasta candidato preclínico)?**
   - a) 6 meses
   - b) 18 meses
   - c) 3 años
   - d) 5 años

3. **¿Cuál de las siguientes NO es una limitación actual de la IA en biotecnología?**
   - a) No entiende mecanismos causales
   - b) Requiere validación experimental
   - c) Puede predecir estructuras con precisión atómica
   - d) Depende de la calidad de los datos de entrenamiento

4. **¿Qué es Evo?**
   - a) Una proteína diseñada por IA
   - b) Un modelo de lenguaje para genomas completos
   - c) Un fármaco aprobado por la FDA
   - d) Un método experimental para determinar estructuras

<details>
<summary>Ver respuestas</summary>
<p><strong>1.</strong> c) 92.4 — un salto enorme respecto al score 40 de AlphaFold 1 en 2018.</p>
<p><strong>2.</strong> b) 18 meses hasta PCC, comparado con 2.5-4 años del método tradicional. Fuente: Nature Biotechnology 2024, citado en Nature Medicine 2025.</p>
<p><strong>3.</strong> c) Predecir estructuras con precisión atómica NO es una limitación — ¡es justamente lo que AlphaFold logra! (aunque siempre requiere confirmación experimental).</p>
<p><strong>4.</strong> b) Evo es un modelo fundacional genómico. Evo 1 (Science 2024) demostró diseño funcional de CRISPR-Cas. Evo 2 (2025) escala a genomas de todos los dominios de la vida.</p>
</details>

## Referencias

- Jumper, J. et al. "Highly accurate protein structure prediction with AlphaFold." *Nature* 596, 583–589 (2021). [DOI: 10.1038/s41586-021-03819-2](https://doi.org/10.1038/s41586-021-03819-2)
- Ren, F. et al. "A small-molecule TNIK inhibitor for idiopathic pulmonary fibrosis." *Nature Medicine* (2025). [DOI: 10.1038/s41591-025-03743-y](https://doi.org/10.1038/s41591-025-03743-y)
- Nguyen, E. et al. "Sequence modeling and design from to million nucleotides." *Science* 386, eado9336 (2024). [DOI: 10.1126/science.ado9336](https://doi.org/10.1126/science.ado9336)
- Muskat, L. C. et al. Trabajos relacionados en PLoS One sobre clasificación de conidias con deep learning.
- Todas las estructuras PDB verificadas de [RCSB.org](https://www.rcsb.org/): 1MBN, 5K2P, 2X8R, 4HHB, 4INS.
