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

# Jupyter Notebook

## Motivación

Escribir código Python en una terminal es funcional pero no es ideal para análisis de datos. Jupyter Notebook proporciona un entorno interactivo basado en la web donde podés combinar código, visualizaciones y texto explicativo en un solo documento. Es la herramienta estándar para científicos de datos en todo el mundo. En biotecnología, los notebooks de Jupyter se usan para documentar y compartir análisis de investigación. En SaaS, se usan para análisis exploratorio de datos y generación de reportes.

## Panorama General

En la lección anterior instalaste Python y verificaste que funciona. Ahora vas a aprender a usar Jupyter Notebook, el entorno donde vas a escribir la mayor parte de tu código Python en este curso. Las próximas lecciones sobre variables, tipos de datos y operadores se van a practicar todas dentro de Jupyter.

## Teoría

### ¿Qué es Jupyter Notebook?

Jupyter Notebook es una aplicación web de código abierto que te permite crear y compartir documentos que contienen código en vivo, ecuaciones, visualizaciones y texto narrativo.

**Componentes clave:**
- **Notebook** (`.ipynb`): Un documento que contiene celdas
- **Celda**: Una unidad de contenido (código o markdown)
- **Kernel**: El motor computacional que ejecuta el código
- **Dashboard**: La interfaz del explorador de archivos

### Tipos de Celdas

1. **Celdas de código**: Contienen código Python que se puede ejecutar. La salida aparece debajo de la celda.
2. **Celdas Markdown**: Contienen texto formateado usando sintaxis Markdown (títulos, listas, enlaces, imágenes, ecuaciones LaTeX).

### Modos

Jupyter tiene dos modos de teclado:

- **Modo comando** (borde azul): Los atajos de teclado actúan a nivel del notebook
- **Modo edición** (borde verde): Escribir inserta texto en la celda actual

### Modelo de Ejecución

Cuando ejecutás una celda de código, el kernel ejecuta el código. Las variables y funciones definidas en una celda están disponibles en las celdas siguientes. El kernel mantiene el estado hasta que se reinicia.

## Explicación Visual

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

## Implementación en Python

### Iniciando Jupyter

```bash
# Instalar si no está instalado
pip install jupyter

# Iniciar
jupyter notebook
```

Esto abre el dashboard de Jupyter en tu navegador en `http://localhost:8888`.

### Creando un Nuevo Notebook

1. Hacé clic en "New" → "Python 3"
2. Se abre un nuevo notebook con una celda de código vacía

### Trabajando con Celdas

```python
# Esta es una celda de código — presioná Shift+Enter para ejecutarla
print("¡Hola, Jupyter!")
```

### Formato Markdown

En una celda markdown podés escribir:
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

### Atajos de Teclado

| Atajo | Acción |
|----------|--------|
| Shift+Enter | Ejecutar celda y seleccionar siguiente |
| Ctrl+Enter | Ejecutar celda y quedarse |
| Alt+Enter | Ejecutar celda e insertar debajo |
| A | Insertar celda arriba (modo comando) |
| B | Insertar celda abajo (modo comando) |
| DD | Eliminar celda (modo comando) |
| M | Cambiar a celda markdown (modo comando) |
| Y | Cambiar a celda de código (modo comando) |
| Ctrl+S | Guardar notebook |
| Z | Deshacer eliminación de celda |

### Guardar y Exportar

- **Guardar**: File → Save and Checkpoint (o Ctrl+S)
- **Exportar**: File → Download as → HTML, PDF, Python script, etc.

## Ejemplo de Biotecnología

**Escenario**: Un investigador está analizando datos de expresión génica y quiere documentar los pasos del análisis.

La estructura del notebook sería:
- **Celda 1 (Markdown)**: Título y pregunta de investigación
- **Celda 2 (Código)**: Cargar datos de expresión con Pandas
- **Celda 3 (Markdown)**: Metodología de limpieza de datos
- **Celda 4 (Código)**: Filtrar y normalizar datos
- **Celda 5 (Markdown)**: Interpretación de resultados
- **Celda 6 (Código)**: Generar heatmap con Seaborn

Este notebook se puede compartir con colaboradores que pueden reproducir el análisis.

## Ejemplo SaaS

**Escenario**: Un analista de datos en una empresa SaaS necesita explorar datos de churn de clientes y compartir hallazgos.

La estructura del notebook:
- **Celda 1 (Markdown)**: Análisis de churn para el informe del Q1
- **Celda 2 (Código)**: Cargar datos de clientes
- **Celda 3 (Código)**: Calcular tasa de churn por cohorte
- **Celda 4 (Markdown)**: Hallazgos clave
- **Celda 5 (Código)**: Visualización de tendencias de churn
- **Celda 6 (Markdown)**: Recomendaciones

El notebook se puede exportar a HTML y compartir con el equipo de producto.

## Errores Comunes

1. **Ejecutar celdas fuera de orden**: Las variables definidas después pueden no estar disponibles. Usá "Run All" (Cell → Run All) para ejecutar secuencialmente.
2. **No reiniciar el kernel**: Cuando el código se comporta de forma inesperada, reiniciá el kernel (Kernel → Restart & Run All).
3. **Olvidarse de guardar**: Jupyter guarda automáticamente, pero guardá manualmente antes de cerrar.
4. **Usar print() excesivamente**: La última expresión de una celda se muestra automáticamente.
5. **Cerrar la terminal**: El servidor de Jupyter corre en la terminal. Cerrarla detiene el servidor.

## Buenas Prácticas

- Usá celdas markdown para documentar tu análisis
- Mantené las celdas enfocadas en una sola tarea
- Ejecutá las celdas en orden de arriba hacia abajo
- Reiniciá y ejecutá todo antes de compartir un notebook
- Usá nombres de archivo significativos (ej: `analisis_expresion_genica.ipynb`)
- Limpiá las salidas antes de subir notebooks al control de versiones

## Resumen

- Jupyter Notebook es un entorno interactivo basado en web para análisis de datos
- Los notebooks contienen celdas de código y markdown
- Las celdas de código ejecutan Python; las celdas markdown muestran texto e imágenes formateados
- El kernel mantiene el estado entre ejecuciones de celdas
- Los atajos de teclado agilizan el flujo de trabajo
- Exportá notebooks para compartir resultados

## Términos Clave

- **Notebook** (`.ipynb`): Documento JSON que contiene código, texto y salidas
- **Celda**: Unidad individual de contenido (código o markdown)
- **Kernel**: Motor de Python que ejecuta las celdas de código
- **Modo comando**: Modo de borde azul para acciones a nivel del notebook
- **Modo edición**: Modo de borde verde para editar el contenido de la celda
- **Dashboard**: Interfaz del explorador de archivos de Jupyter
- **Shift+Enter**: Ejecutar celda actual y pasar a la siguiente

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es la diferencia entre una celda de código y una celda markdown?
2. ¿Qué hace `Shift+Enter` en Jupyter?
3. ¿Cómo creás una nueva celda debajo de la actual?

### Nivel 2: Implementación

4. Creá un notebook con al menos una celda markdown (con un título y una lista con viñetas) y una celda de código que imprima "¡Jupyter está funcionando!"
5. Exportá tu notebook como HTML.

### Nivel 3: Pensamiento Crítico

6. ¿Por qué es importante ejecutar las celdas en orden de arriba hacia abajo? ¿Qué problemas pueden ocurrir si se ejecutan fuera de orden?
7. En un entorno de investigación colaborativa, ¿qué ventajas ofrece un notebook de Jupyter sobre un script de Python tradicional?

## Desafío de Código

Creá un notebook de Jupyter llamado `mi_primer_notebook.ipynb` que:
1. Tenga una celda de título (Markdown H1): "Mi Primer Notebook"
2. Una celda markdown explicando de qué trata el notebook
3. Una celda de código que cree una lista de tus 5 cosas favoritas
4. Una celda de código que imprima cada elemento con un número
5. Una celda markdown con una conclusión
Exportá el notebook como HTML.
