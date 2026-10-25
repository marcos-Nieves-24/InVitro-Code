---
Module: 2
Lesson Number: 2
Lesson Title: Jupyter Notebook
Estimated Duration: 45 minutos
Prerequisites: L1 — Instalando Python
Learning Objectives:
  - Iniciar Jupyter Notebook desde la línea de comandos
  - Crear y editar celdas de código y celdas markdown
  - Ejecutar código Python interactivamente en un notebook
  - Usar atajos de teclado para navegar eficientemente
  - Exportar un notebook a HTML o PDF
Keywords: Jupyter, notebook, celda, kernel, markdown, REPL
Difficulty: Beginner
Programming Concepts: Interfaz de notebook, markdown, ejecución de código, kernel
Datasets Used: None
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Jupyter Notebook" eyebrow="INICIO">
<RevealSequence>

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "Escribir código Python en una terminal es funcional pero no es ideal para análisis de datos.",
    "Jupyter Notebook proporciona un entorno interactivo basado en la web donde puedes combinar código, visualizaciones y texto explicativo en un solo documento.",
    "Es la herramienta estándar para científicos de datos en todo el mundo.",
    "En biotecnología, los notebooks de Jupyter se usan para documentar y compartir análisis de investigación.",
    "En SaaS, se usan para análisis exploratorio de datos y generación de reportes.",
  ]}
/>


<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  lines={[
    "En la lección anterior instalaste Python y verificaste que funciona.",
    "Ahora vas a aprender a usar Jupyter Notebook, el entorno donde vas a escribir la mayor parte de tu código Python en este curso.",
    "Las próximas lecciones sobre variables, tipos de datos y operadores se van a practicar todas dentro de Jupyter.",
  ]}
/>
</RevealSequence>

</Section>

<Section number={2} title="¿Qué es Jupyter Notebook?" eyebrow="CONCEPTO">
<RevealSequence>


<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Un notebook es un laboratorio en el navegador: una celda lee el CSV de expresión génica, la siguiente filtra genes, y el kernel recuerda ambas salidas.",
    "Si reinicias el kernel a mitad del análisis, todas las variables desaparecen y debes re-ejecutar de arriba abajo.",
    "Por eso el orden de las celdas no es decorativo: es tu historia reproducible.",
  ]}
/>



Jupyter Notebook es una aplicación web de código abierto que te permite crear y compartir documentos que contienen código en vivo, ecuaciones, visualizaciones y texto narrativo.

**Componentes clave:**
- **Notebook** (`.ipynb`): Un documento que contiene celdas
- **Celda**: Una unidad de contenido (código o markdown)
- **Kernel**: El motor computacional que ejecuta el código
- **Dashboard**: La interfaz del explorador de archivos


1. **Celdas de código**: Contienen código Python que se puede ejecutar. La salida aparece debajo de la celda.
2. **Celdas Markdown**: Contienen texto formateado usando sintaxis Markdown (títulos, listas, enlaces, imágenes, ecuaciones LaTeX).


Jupyter tiene dos modos de teclado:

- **Modo comando** (borde azul): Los atajos de teclado actúan a nivel del notebook
- **Modo edición** (borde verde): Escribir inserta texto en la celda actual


Cuando ejecutas una celda de código, el kernel ejecuta el código. Las variables y funciones definidas en una celda están disponibles en las celdas siguientes. El kernel mantiene el estado hasta que se reinicia.


```
┌────────────────────────────────────────────────────┐
│                  Jupyter Notebook                    │
├────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐│
│  │ [File] [Edit] [View] [Insert] [Cell] [Kernel]  ││
│  ├────────────────────────────────────────────────┤│
│  │ [-] Celda Markdown (Título)                    ││
│  │    # Mi Análisis                               ││
│  ├────────────────────────────────────────────────┤│
│  │ [ ] Celda de Código                            ││
│  │    import pandas as pd                         ││
│  │    df = pd.read_csv('datos.csv')               ││
│  │    df.head()                                   ││
│  │                                                ││
│  │ Out[1]: [salida en tabla]                      ││
│  ├────────────────────────────────────────────────┤│
│  │ [-] Celda Markdown (Explicación)               ││
│  │    ## Resultados                               ││
│  │    Los datos muestran...                       ││
│  └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```
</RevealSequence>

</Section>

<Section number={3} title="Usando Jupyter Notebook" eyebrow="IMPLEMENTACIÓN">
<RevealSequence>


```bash
# Instalar si no está instalado
pip install jupyter

# Iniciar
jupyter notebook
```

Esto abre el dashboard de Jupyter en tu navegador en `http://localhost:8888`.


1. Haz clic en "New" → "Python 3"
2. Se abre un nuevo notebook con una celda de código vacía


```python
# Esta es una celda de código — presiona Shift+Enter para ejecutarla
print("¡Hola, Jupyter!")
```


En una celda markdown puedes escribir:
```markdown
# Encabezado 1
## Encabezado 2
### Encabezado 3

**Texto en negrita**, *texto en cursiva*, `código en línea`

- Elemento de lista 1
- Elemento de lista 2

[Texto del enlace](https://ejemplo.com)

$$ E = mc^2 $$
```


<ConceptCard variant="key-idea">
Atajos de teclado de Jupyter:

- **Shift+Enter** — Ejecutar celda y seleccionar siguiente
- **Ctrl+Enter** — Ejecutar celda y quedarse
- **Alt+Enter** — Ejecutar celda e insertar debajo
- **A** — Insertar celda arriba (modo comando)
- **B** — Insertar celda abajo (modo comando)
- **DD** — Eliminar celda (modo comando)
- **M** — Cambiar a celda markdown (modo comando)
- **Y** — Cambiar a celda de código (modo comando)
- **Ctrl+S** — Guardar notebook
- **Z** — Deshacer eliminación de celda
</ConceptCard>


- **Guardar**: File → Save and Checkpoint (o Ctrl+S)
- **Exportar**: File → Download as → HTML, PDF, Python script, etc.



</RevealSequence>

</Section>

<Section number={4} title="Ejemplo: Biotecnología" eyebrow="APLICACIÓN">
<RevealSequence>

**Escenario**: Un investigador está analizando datos de expresión génica y quiere documentar los pasos del análisis.

La estructura del notebook sería:
- **Celda 1 (Markdown)**: Título y pregunta de investigación
- **Celda 2 (Código)**: Cargar datos de expresión con Pandas
- **Celda 3 (Markdown)**: Metodología de limpieza de datos
- **Celda 4 (Código)**: Filtrar y normalizar datos
- **Celda 5 (Markdown)**: Interpretación de resultados
- **Celda 6 (Código)**: Generar heatmap con Seaborn

Este notebook se puede compartir con colaboradores que pueden reproducir el análisis.


**Escenario**: Un analista de datos en una empresa SaaS necesita explorar datos de churn de clientes y compartir hallazgos.

La estructura del notebook:
- **Celda 1 (Markdown)**: Análisis de churn para el informe del Q1
- **Celda 2 (Código)**: Cargar datos de clientes
- **Celda 3 (Código)**: Calcular tasa de churn por cohorte
- **Celda 4 (Markdown)**: Hallazgos clave
- **Celda 5 (Código)**: Visualización de tendencias de churn
- **Celda 6 (Markdown)**: Recomendaciones

El notebook se puede exportar a HTML y compartir con el equipo de producto.

<ChoiceQuestion
  question="Tu colaboradora recibe un notebook con salida visible, pero al ejecutar «Run All» obtiene NameError en celdas que antes funcionaban. ¿Cuál es la causa más probable?"
  moduleSlug="python"
  lessonSlug="lesson02_jupyter_notebook"
  blockId="choice-python-l02-dens-1"
  allowContinueOnIncorrect
  explanation="El estado del kernel vive en memoria: si las celdas originales se ejecutaron fuera de orden, esa variable nunca existió en una ejecución limpia."
  options={[
    { id: "a", label: "Las celdas se ejecutaron fuera de orden en la sesión original", correct: true, feedback: "¡Correcto! El kernel guardó el estado de otra sesión, no el de Run All." },
    { id: "b", label: "Jupyter borró el archivo por falta de Ctrl+S", correct: false, feedback: "Guardar conserva el documento, no el estado del kernel." },
    { id: "c", label: "El navegador cacheó la página", correct: false, feedback: "El render no explica un NameError en el kernel." },
    { id: "d", label: "localhost:8888 cambió de puerto", correct: false, feedback: "El puerto no afecta las variables en memoria." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={5} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence>

1. **Ejecutar celdas fuera de orden**: Las variables definidas después pueden no estar disponibles. Usa "Run All" (Cell → Run All) para ejecutar secuencialmente.
2. **No reiniciar el kernel**: Cuando el código se comporta de forma inesperada, reinicia el kernel (Kernel → Restart & Run All).
3. **Olvidarse de guardar**: Jupyter guarda automáticamente, pero guarda manualmente antes de cerrar.
4. **Usar print() excesivamente**: La última expresión de una celda se muestra automáticamente.
5. **Cerrar la terminal**: El servidor de Jupyter corre en la terminal. Cerrarla detiene el servidor.


- Usa celdas markdown para documentar tu análisis
- Mantén las celdas enfocadas en una sola tarea
- Ejecuta las celdas en orden de arriba hacia abajo
- Reinicia y ejecuta todo antes de compartir un notebook
- Usa nombres de archivo significativos (ej: `analisis_expresion_genica.ipynb`)
- Limpia las salidas antes de subir notebooks al control de versiones
</RevealSequence>

</Section>

<Section number={6} title="Resumen y Conceptos Clave" eyebrow="CIERRE">

<RevealSequence>

<ConceptCard variant="key-idea">
Jupyter combina código, resultados y texto en un único documento interactivo cuyo estado vive en el kernel entre ejecuciones de celdas.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "entorno", label: "Entorno interactivo", detail: "Jupyter Notebook es un entorno interactivo basado en web para análisis de datos." },
    { id: "celdas", label: "Celdas de código y markdown", detail: "Los notebooks contienen celdas de código y markdown; las de código ejecutan Python y las markdown muestran texto e imágenes formateados." },
    { id: "kernel-estado", label: "Kernel con estado", detail: "El kernel mantiene el estado entre ejecuciones de celdas." },
    { id: "atajos", label: "Atajos de teclado", detail: "Los atajos de teclado agilizan el flujo de trabajo." },
    { id: "exportar", label: "Exportar", detail: "Exporta notebooks para compartir resultados." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "notebook", label: "Notebook (.ipynb)", detail: "Documento JSON que contiene código, texto y salidas." },
    { id: "celda", label: "Celda", detail: "Unidad individual de contenido (código o markdown)." },
    { id: "kernel", label: "Kernel", detail: "Motor de Python que ejecuta las celdas de código." },
    { id: "modo-comando", label: "Modo comando", detail: "Modo de borde azul para acciones a nivel del notebook." },
    { id: "modo-edicion", label: "Modo edición", detail: "Modo de borde verde para editar el contenido de la celda." },
    { id: "dashboard", label: "Dashboard", detail: "Interfaz del explorador de archivos de Jupyter." },
    { id: "shift-enter", label: "Shift+Enter", detail: "Ejecutar celda actual y pasar a la siguiente." },
  ]}
/>

<ChoiceQuestion
  question="¿Qué atajo ejecuta la celda actual y avanza a la siguiente?"
  moduleSlug="python"
  lessonSlug="lesson02_jupyter_notebook"
  blockId="choice-python-l02-resumen-1"
  allowContinueOnIncorrect
  explanation="Shift+Enter ejecuta la celda actual y mueve el foco a la siguiente celda."
  options={[
    { id: "a", label: "Shift+Enter", correct: true, feedback: "¡Exacto! Es el atajo principal de Jupyter." },
    { id: "b", label: "Enter", correct: false, feedback: "Enter solo añade una línea dentro de la celda." },
    { id: "c", label: "Ctrl+C", correct: false, feedback: "Ctrl+C interrumpe la ejecución del kernel, no avanza celdas." },
    { id: "d", label: "Tab", correct: false, feedback: "Tab sirve para autocompletar, no para ejecutar." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Jupyter listo! El kernel guarda estado; ahora las variables guardarán valores.
</MascotMessage>

</RevealSequence>

</Section>


<Section number={7} title="Ejercicios y Desafío" eyebrow="EVALUACIÓN">
<RevealSequence>


1. ¿Cuál es la diferencia entre una celda de código y una celda markdown?
2. ¿Qué hace `Shift+Enter` en Jupyter?
3. ¿Cómo creas una nueva celda debajo de la actual?


4. Crea un notebook con al menos una celda markdown (con un título y una lista con viñetas) y una celda de código que imprima "¡Jupyter está funcionando!"
5. Exporta tu notebook como HTML.


6. ¿Por qué es importante ejecutar las celdas en orden de arriba hacia abajo? ¿Qué problemas pueden ocurrir si se ejecutan fuera de orden?
7. En un entorno de investigación colaborativa, ¿qué ventajas ofrece un notebook de Jupyter sobre un script de Python tradicional?


Crea un notebook de Jupyter llamado `mi_primer_notebook.ipynb` que:
1. Tenga una celda de título (Markdown H1): "Mi Primer Notebook"
2. Una celda markdown explicando de qué trata el notebook
3. Una celda de código que cree una lista de tus 5 cosas favoritas
4. Una celda de código que imprima cada elemento con un número
5. Una celda markdown con una conclusión
Exporta el notebook como HTML.
</RevealSequence>

</Section>

<Section number={8} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">

<RevealSequence>

<ChoiceQuestion
  question="¿Qué componente de Jupyter mantiene el estado entre ejecuciones de celdas?"
  moduleSlug="python"
  lessonSlug="lesson02_jupyter_notebook"
  blockId="choice-python-l02-conceptos-1"
  allowContinueOnIncorrect
  explanation="El kernel ejecuta el código y mantiene variables y funciones definidas entre celdas."
  options={[
    { id: "a", label: "El kernel", correct: true, feedback: "¡Correcto! El kernel mantiene el estado." },
    { id: "b", label: "El navegador", correct: false, feedback: "El navegador solo muestra la interfaz." },
    { id: "c", label: "La celda markdown", correct: false, feedback: "Las celdas markdown no ejecutan código." },
    { id: "d", label: "El sistema de archivos", correct: false, feedback: "El disco no mantiene el estado en memoria." },
  ]}
/>

</RevealSequence>

</Section>
