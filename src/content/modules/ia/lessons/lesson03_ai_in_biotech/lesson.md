---
Module: 1
Lesson Number: 3
Lesson Title: IA en la Biotecnología
Estimated Duration: 60 minutos
Prerequisites: Lección 2 — ¿Cómo aprende la IA?
Learning Objectives:
  - Comprender cómo la IA predice estructuras de proteínas en 3D
  - Interpretar visualizaciones de proteínas y entender qué es el carbono alfa (Cα)
  - Relacionar la clasificación de conidias con problemas reales de microbiología
  - Describir el pipeline completo de un proyecto de ML en biotecnología
Keywords: proteínas, PDB, estructura 3D, AlphaFold, carbono alfa, pipeline de ML, conidias
Difficulty: Principiante
Programming Concepts: Ninguno
Mathematical Concepts: Coordenadas 3D (x, y, z)
Machine Learning Concepts: Pipeline de ML, clustering, clasificación, validación
Datasets Used: module01_ai_cell_features.csv, PDB structures (1MBN, 5K2P, 2X8R, 4HHB, 4INS)
---

# Lección 3: IA en la Biotecnología

## Motivación

Hasta ahora clasificamos conidias con algoritmos sencillos. Pero la IA en biotecnología va muchísimo más allá.

Imaginá que tenés una proteína recién descubierta en *Aspergillus fumigatus* y necesitás saber su estructura tridimensional para entender cómo funciona. Determinar una estructura experimentalmente puede llevar meses o años. Con IA, podemos predecirla en horas o minutos.

En esta lección vamos a ver dos aplicaciones concretas:
1. **Visualización 3D de proteínas** — cómo se representan las estructuras moleculares y qué datos usa la IA para predecirlas
2. **Pipeline completo de ML** — cómo se organiza un proyecto real de machine learning, desde los datos hasta la evaluación

## Panorama General

```
Lección 2 (Algoritmos básicos) → Lección 3 (Aplicaciones biotecnológicas)
                                        ↓
                          Visualización 3D de proteínas
                          Pipeline completo de ML
                                        ↓
                          Lección 4 (Casos reales: AlphaFold, Rentosertib)
```

## Teoría

### Proteínas en 3D: ¿qué estamos viendo realmente?

Las proteínas son cadenas de aminoácidos que se pliegan en estructuras tridimensionales complejas. La función de una proteína depende de su forma 3D.

En los archivos PDB (Protein Data Bank), las proteínas se representan como listas de átomos con coordenadas (x, y, z). Para visualizarlas de manera simple, usamos solo los **carbonos alfa (Cα)** — un átomo por cada aminoácido que sirve como "esqueleto" de la proteína.

```
Aminoácidos:   ALA — GLU — GLY — LYS — VAL — ...
Carbonos α:    ● — ● — ● — ● — ● — ...
Coordenadas: (x₁,y₁,z₁) (x₂,y₂,z₂) (x₃,y₃,z₃) ...
```

Cada punto en el visualizador 3D representa un aminoácido. La línea que conecta los puntos es el **backbone** (esqueleto) de la proteína.

### Demo interactiva 7: Visualizador 3D de proteínas

Vamos a explorar 5 proteínas reales, todas verificadas del RCSB PDB.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>¿Cuántos átomos de carbono alfa (Cα) creés que tiene una proteína de tamaño medio como una lisozima?</em></p>
</div>

<iframe src="/interactives/demo_07_protein_3d.html" width="100%" height="700px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>🧬 estructuras reales de PDB (RCSB.org) — extracción de carbonos alfa</small>

**Las proteínas que podés explorar:**

| PDB | Proteína | Organismo | Residuos (Cα) | Resolución |
|---|---|---|---|---|
| 1MBN | Mioglobina | *Physeter macrocephalus* (ballena) | 153 | 2.00 Å |
| 5K2P | Lisozima | *Gallus gallus* (gallina) | 129 | 1.24 Å |
| 2X8R | Lisozima GH25 | *Aspergillus fumigatus* | ~220 | 1.70 Å |
| 4HHB | Hemoglobina | *Homo sapiens* | 287 (2 cadenas) | 1.74 Å |
| 4INS | Insulina | *Sus scrofa* (cerdo) | 51 (2 cadenas) | 1.50 Å |

**¿Qué observar?**
- La **mioglobina** (1MBN) es una proteína globular compacta — transporta oxígeno en el músculo
- La **lisozima GH25** (2X8R) es de *Aspergillus fumigatus* — ¡directamente conectada con nuestro hilo narrativo! Es una enzima que degrada paredes bacterianas
- La **hemoglobina** (4HHB) tiene dos tipos de cadena (alfa y beta) en colores diferentes — es una proteína multimérica
- La **insulina** (4INS) es pequeña (solo 51 aminoácidos) y también tiene dos cadenas

> 💡 **Idea clave**: Cada punto en el espacio 3D es un aminoácido. La estructura tridimensional determina la función de la proteína. La IA (como AlphaFold) aprende a predecir estas coordenadas a partir de la secuencia de aminoácidos.

### ¿Por qué la estructura 3D importa?

La forma de una proteína determina:
- **Con qué otras moléculas interactúa** (clave para diseño de fármacos)
- **Dónde se localiza en la célula**
- **Qué función puede realizar** (enzima, transportador, receptor, etc.)
- **Si es estable o se degrada rápido**

Sin IA, determinar la estructura requiere cristalografía de rayos X (meses, costoso) o criomicroscopía electrónica (equipamiento millonario). Con AlphaFold, podemos predecir estructuras con precisión cercana a la experimental en minutos.

### Demo interactiva 10: Pipeline completo de ML

Ahora que vimos aplicaciones, volvamos a nuestro problema de clasificación de conidias y veamos cómo se organiza un proyecto real de ML de principio a fin.

<div style="border: 2px solid #1f77b4; border-radius: 8px; padding: 12px; margin: 16px 0; background: #f0f7ff;">
  <strong>🧪 Antes de interactuar, respondé:</strong>
  <p><em>En un proyecto real de ML, ¿qué paso creés que consume más tiempo: entrenar el modelo o preparar los datos?</em></p>
</div>

<iframe src="/interactives/demo_10_pipeline.html" width="100%" height="750px" style="border: 1px solid #ddd; border-radius: 8px; margin: 16px 0;"></iframe>

<small>🔬 simulación educativa sobre datos sintéticos</small>

**Los 4 pasos del pipeline:**

| Paso | ¿Qué pasa? | ¿Por qué importa? |
|---|---|---|
| **1. Datos** | Inspeccionamos las muestras, sus features y etiquetas | "Basura entra, basura sale" — datos de calidad son lo más importante |
| **2. Entrenamiento/Test** | Separamos 70% para entrenar, 30% para probar | Evaluamos si el modelo generaliza a datos no vistos |
| **3. Modelo (KNN)** | Entrenamos un KNN con k ajustable | El algoritmo aprende los patrones de los datos de entrenamiento |
| **4. Evaluación** | Matriz de confusión + métricas (accuracy, precision, recall) | Medimos objetivamente qué tan bien funciona el modelo |

**Experimentá:**
- Cambiá k en el paso 3 y observá cómo cambian las métricas
- Presioná "Re-ejecutar con nuevo split" — notá cómo la variabilidad del split afecta el resultado
- Observá la **matriz de confusión**: muestra verdaderos positivos, falsos positivos, etc.

> 💡 **Idea clave**: Preparar los datos consume ~80% del tiempo en proyectos reales de ML. El modelo es la parte más pequeña (y a menudo la más fácil) del pipeline.

## Conclusión: el pipeline completo

Cada concepto de las Lecciones 1 y 2 aparece en este pipeline:
- **Features** → paso 1 (Datos)
- **Train/test split** → paso 2
- **KNN y frontera de decisión** → paso 3 (Modelo)
- **Accuracy y métricas** → paso 4 (Evaluación)

En la Lección 4 vamos a ver dos casos reales donde la IA transformó la biotecnología: AlphaFold (premio Nobel 2024) y Rentosertib de Insilico Medicine (Nature Medicine 2025).

## Checkpoint de conceptos

1. **¿Qué representa cada punto en el visualizador 3D de proteínas?**
   - a) Un átomo de hidrógeno
   - b) Un carbono alfa (Cα) — un aminoácido de la cadena
   - c) Una molécula de agua
   - d) Un enlace peptídico

2. **¿Cuál es la principal ventaja de usar IA para predecir estructuras de proteínas?**
   - a) Es más precisa que la cristalografía de rayos X
   - b) Es mucho más rápida y accesible que los métodos experimentales
   - c) Puede predecir proteínas que no existen en la naturaleza
   - d) No requiere la secuencia de aminoácidos

3. **En el pipeline de ML, ¿qué paso consume más tiempo en proyectos reales?**
   - a) Entrenar el modelo
   - b) Preparar y limpiar los datos
   - c) Desplegar el modelo en producción
   - d) Elegir el algoritmo

4. **¿Qué información da la matriz de confusión?**
   - a) Solo el porcentaje de aciertos totales
   - b) El desglose detallado de predicciones correctas e incorrectas por clase
   - c) Los parámetros internos del modelo
   - d) El tiempo que tardó el entrenamiento

<details>
<summary>Ver respuestas</summary>
<p><strong>1.</strong> b) Cada Cα representa un aminoácido. La nube de puntos forma el esqueleto de la proteína.</p>
<p><strong>2.</strong> b) La velocidad y accesibilidad. AlphaFold predice en horas lo que antes tomaba meses o años. No reemplaza los métodos experimentales, los complementa.</p>
<p><strong>3.</strong> b) Preparar datos (limpiar, etiquetar, manejar valores faltantes) es ~80% del trabajo. Entrenar el modelo suele ser menos del 5%.</p>
<p><strong>4.</strong> b) La matriz de confusión muestra TP, FP, FN, TN — mucho más informativo que solo el accuracy.</p>
</details>

## Para la próxima lección

En la Lección 4 vamos a cerrar el módulo con dos casos reales que cambiaron la biotecnología: la historia completa de AlphaFold (de CASP a Nobel) y el caso de Rentosertib, el primer fármaco descubierto con IA en llegar a fases clínicas. También vamos a mencionar Evo, el modelo genómico que está abriendo nuevas fronteras en biología sintética.
