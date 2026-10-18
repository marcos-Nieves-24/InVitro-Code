---
Module: 2
Lesson Number: 15
Lesson Title: Matplotlib
Estimated Duration: 75 minutos
Prerequisites: L14 — Pandas
Learning Objectives:
  - "Crear gráficos básicos usando pyplot: líneas, dispersión, barras, histogramas"
  - Personalizar gráficos con títulos, etiquetas, leyendas y colores
  - Usar la interfaz figure/axes para gráficos multi-panel
  - Guardar figuras a archivos en varios formatos
  - Aplicar diferentes estilos de gráfico y mapas de colores
Keywords: Matplotlib, pyplot, figure, axes, plot, scatter, histograma, gráfico de barras
Difficulty: Beginner-Intermediate
Programming Concepts: Visualización de datos, graficación, personalización
Datasets Used: None (datos sintéticos)
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

# Matplotlib

<Section number={1} title="¿Por qué Matplotlib?" eyebrow="INICIO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Visualizar es entender: un gráfico bien elegido revela patrones, outliers y relaciones invisibles en números crudos.",
    "Matplotlib es la librería de visualización fundamental en Python; Seaborn y Plotly se construyen sobre ella.",
    "En biotecnología muestra distribuciones de expresión génica, curvas de supervivencia y estructuras de proteínas.",
    "En SaaS muestra tendencias de ingresos, crecimiento de usuarios y resultados de tests A/B.",
    "La mayor parte del tiempo de un analista de ciencia de datos se va creando y ajustando visualizaciones.",
  ]}
/>

<ConceptCard variant="key-idea">
En la lección anterior aprendiste Pandas para manipulación de datos. Ahora visualizas esos datos con Matplotlib. La próxima lección sobre Seaborn se basa en Matplotlib para crear visualizaciones estadísticas con menos código; en los módulos de ML usarás Matplotlib a diario para entender modelos, evaluar rendimiento y presentar resultados.
</ConceptCard>

- La visualización revela lo que los números crudos ocultan.
- Matplotlib es interoperable con NumPy y Pandas.
- Dominarla hace que los demás tools de plotting (Seaborn, Plotly) se aprendan rápido.

</RevealSequence>
</Section>

<Section number={2} title="Arquitectura y Tipos de Gráficos" eyebrow="CONCEPTO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Matplotlib tiene tres capas: backend (render), artist (todo lo que ves) y pyplot (interfaz de conveniencia).",
    "La interfaz funcional de pyplot es rápida de escribir; la orientada a objetos es la preferida para gráficos complejos.",
    "Elegir bien el tipo de gráfico es una habilidad clínica/analítica, no solo estética.",
  ]}
/>

<ConceptCard variant="definition">
**Backend**: renderiza a pantalla/archivo (Agg, PDF, SVG). **Artist**: todo lo visible (líneas, texto, ejes). **pyplot**: interfaz de conveniencia estilo MATLAB.
</ConceptCard>

**Dos interfaces**

Interfaz pyplot (funcional):

```python
import matplotlib.pyplot as plt
plt.plot(x, y)
plt.show()
```

Interfaz orientada a objetos (OO):

```python
fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()
```

La interfaz OO es preferida para gráficos complejos.

**Tipos de gráficos básicos**

```python
plt.plot(x, y)              # Gráfico de líneas
plt.scatter(x, y)           # Gráfico de dispersión
plt.bar(x, height)          # Gráfico de barras
plt.hist(data, bins=10)     # Histograma
plt.boxplot(data)           # Diagrama de caja
plt.pie(sizes)              # Gráfico circular
plt.imshow(image)           # Visualización de imagen
```

**Personalización**

```python
plt.title("Título")
plt.xlabel("Etiqueta X")
plt.ylabel("Etiqueta Y")
plt.legend()
plt.grid(True)
plt.xlim(0, 10)
plt.ylim(0, 100)
plt.colorbar()
```

**Figure y Axes**

```python
fig, axes = plt.subplots(2, 3, figsize=(12, 8))
axes[0, 0].plot(x, y)
axes[0, 1].scatter(x, y)
```

**Guardando Figuras**

```python
plt.savefig("grafico.png", dpi=300, bbox_inches="tight")
plt.savefig("grafico.pdf")
plt.savefig("grafico.svg")
```

**Estructura de una figura** (candidato a player visual):

```text
Estructura de una Figura de Matplotlib

┌─────────────────────────────────────────────────┐
│ Figure (la ventana completa)                     │
│  ┌─────────────────────────────────────────────┐│
│  │ Axes (el área de gráfico real)               ││
│  │  ┌───────────────────────────────────────┐   ││
│  │  │ Título                               │   ││
│  │  │ ────────────────────────────────────  │   ││
│  │  │ │                                    │   ││
│  │  │ │        Área del Gráfico            │   ││
│  │  │ │                                    │   ││
│  │  │ ────────────────────────────────────  │   ││
│  │  │ Etiqueta X                           │   ││
│  │  └───────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────┘│
│  Leyenda                                         │
└─────────────────────────────────────────────────┘
```

</RevealSequence>
</Section>

<Section number={3} title="Implementación en Python" eyebrow="IMPLEMENTACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "De la teoría a la práctica: líneas, dispersión, barras, histogramas y multi-panel.",
    "Cada bloque es independiente; ejecútalo y observa cómo cambia la figura.",
    "El primer gráfico que hagas siempre debería tener título, ejes etiquetados y leyenda.",
  ]}
/>

**Gráfico de líneas**

```python
import matplotlib.pyplot as plt
import numpy as np

# Gráfico de líneas
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label="sen(x)", color="blue", linewidth=2)
plt.plot(x, np.cos(x), label="cos(x)", color="red", linestyle="--")
plt.title("Funciones Seno y Coseno")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

**Gráfico de dispersión**

```python
# Gráfico de dispersión
np.random.seed(42)
x = np.random.randn(100)
y = 2 * x + np.random.randn(100) * 0.5

plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6, c="steelblue", edgecolors="white", linewidth=0.5)
plt.title("Gráfico de Dispersión con Relación Lineal")
plt.xlabel("Característica X")
plt.ylabel("Objetivo Y")
plt.grid(True, alpha=0.3)
plt.show()
```

**Gráfico de barras**

```python
# Gráfico de barras
categories = ["BRCA1", "TP53", "EGFR", "MYC", "KRAS"]
values = [2.5, -1.2, 3.8, 0.9, -2.1]
colors = ["green" if v > 0 else "red" for v in values]

plt.figure(figsize=(8, 6))
plt.bar(categories, values, color=colors, alpha=0.7)
plt.title("Cambios Relativos de Expresión Génica")
plt.xlabel("Gen")
plt.ylabel("Fold Change")
plt.axhline(y=0, color="black", linewidth=0.5)
plt.show()
```

**Histograma**

```python
# Histograma
data = np.random.randn(1000)

plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, edgecolor="white", alpha=0.7, density=True)
plt.title("Distribución de Valores (Histograma)")
plt.xlabel("Valor")
plt.ylabel("Densidad")
plt.grid(True, alpha=0.3)
plt.show()
```

**Múltiples subplots**

```python
# Múltiples subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

x = np.linspace(0, 10, 100)
data = np.random.randn(500)

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title("Seno")

axes[0, 1].plot(x, np.cos(x), color="red")
axes[0, 1].set_title("Coseno")

axes[1, 0].scatter(np.random.randn(50), np.random.randn(50), alpha=0.6)
axes[1, 0].set_title("Dispersión")

axes[1, 1].hist(data, bins=20, edgecolor="white")
axes[1, 1].set_title("Histograma")

plt.tight_layout()
plt.show()
```

</RevealSequence>
</Section>

<Section number={4} title="Aplicaciones Prácticas" eyebrow="APLICACIÓN">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Dos casos end to end: expresión génica por condición y dashboard de métricas SaaS.",
    "Ambos usan la interfaz OO con subplots y barras agrupadas.",
    "Observa cómo fig, axes se convierten en el lienzo donde pintas cada panel.",
  ]}
/>

**Escenario biotecnología** — visualizando datos de expresión génica en diferentes condiciones:

```python
import matplotlib.pyplot as plt
import numpy as np

# Simular datos de expresión génica (4 genes, 3 condiciones)
np.random.seed(42)
conditions = ["Control", "Treatment_A", "Treatment_B"]
genes = ["BRCA1", "TP53", "EGFR", "MYC"]
expression = np.random.randn(4, 3) * 1.5 + 2

# Gráfico de barras agrupadas
fig, ax = plt.subplots(figsize=(10, 6))
x = np.arange(len(genes))
width = 0.25
colors = ["steelblue", "coral", "seagreen"]

for i, (cond, color) in enumerate(zip(conditions, colors)):
    offset = (i - 1) * width
    ax.bar(x + offset, expression[:, i], width, label=cond, color=color, alpha=0.8)

ax.set_xlabel("Gen")
ax.set_ylabel("Nivel de Expresión")
ax.set_title("Expresión Génica por Condición")
ax.set_xticks(x)
ax.set_xticklabels(genes)
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

**Escenario SaaS** — visualizando un dashboard de métricas SaaS:

```python
import matplotlib.pyplot as plt
import numpy as np

# Métricas mensuales
months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
revenue = np.array([50, 55, 62, 68, 75, 82])
users = np.array([1000, 1100, 1250, 1400, 1550, 1700])
churn = np.array([5.2, 4.8, 4.5, 4.2, 3.9, 3.5])

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Tendencia de ingresos
axes[0].plot(months, revenue, marker="o", linewidth=2, color="steelblue")
axes[0].set_title("Ingresos Mensuales ($K)")
axes[0].set_xlabel("Mes")
axes[0].grid(True, alpha=0.3)

# Crecimiento de usuarios
axes[1].bar(months, users, color="seagreen", alpha=0.7)
axes[1].set_title("Usuarios Activos")
axes[1].set_xlabel("Mes")
axes[1].grid(True, alpha=0.3)

# Tasa de churn
axes[2].plot(months, churn, marker="s", linewidth=2, color="coral")
axes[2].set_title("Tasa de Churn (%)")
axes[2].set_xlabel("Mes")
axes[2].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()
```

</RevealSequence>
</Section>

<Section number={5} title="Errores Comunes y Buenas Prácticas" eyebrow="CRÍTICO">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Los errores de Matplotlib son casi siempre de forma: ejes no etiquetados, leyendas faltantes, figuras cortadas.",
    "La interfaz OO te salva cuando el gráfico crece beyond pyplot.",
    "Prioriza claridad sobre decoración: un gráfico simple y bien etiquetado gana a uno vistoso.",
  ]}
/>

**Errores comunes**

- **Graficar listas sin conversión**: Matplotlib puede graficar listas, pero los arrays NumPy son más rápidos
- **No llamar `plt.show()`**: en scripts, los gráficos no aparecen sin esto
- **Demasiados elementos en el gráfico**: gráficos recargados confunden en lugar de informar
- **Formas incompatibles**: x e y deben tener el mismo largo
- **Olvidar `tight_layout()`**: las etiquetas pueden cortarse
- **Usar colores/estilos por defecto**: personaliza para gráficos con aspecto profesional

**Buenas prácticas**

- Usa la interfaz OO (`fig, ax = plt.subplots()`) para gráficos complejos
- Siempre etiqueta los ejes e incluye unidades
- Usa esquemas de colores aptos para daltonismo
- Establece tamaños de figura apropiados con `figsize`
- Usa `alpha` para elementos superpuestos
- Guarda como SVG para publicaciones (formato vectorial)
- Agrega líneas de cuadrícula con alpha bajo para legibilidad
- Usa `tight_layout()` para evitar que se corten las etiquetas

</RevealSequence>
</Section>

<Section number={6} title="Resumen y Conceptos Clave" eyebrow="CIERRE">
<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Matplotlib es el motor de visualización de Python: figure, axes, pyplot y subplots son tu vocabulario.",
    "Si etiquetas ejes, leyendas y unidades, tu gráfico ya está por encima del promedio.",
    "Seaborn te dará atajos estadísticos, pero sobre el mismo motor.",
  ]}
/>

<ConceptCard variant="key-idea">
Matplotlib es el motor de visualización de Python: figure, axes, pyplot y subplots permiten crear, personalizar y exportar cualquier gráfico científico con control total.
</ConceptCard>

<FeatureButtonList
  features={[
    { id: "pyplot", label: "pyplot", detail: "Provee gráficos estilo MATLAB a través de pyplot." },
    { id: "interfaces", label: "Interfaces", detail: "Dos interfaces: pyplot (simple) y OO (flexible)." },
    { id: "graficos-basicos", label: "Gráficos básicos", detail: "Líneas, dispersión, barras e histograma." },
    { id: "personalizacion", label: "Personalización", detail: "Personaliza con títulos, etiquetas, leyendas y colores." },
    { id: "subplots", label: "Subplots", detail: "Permiten figuras multi-panel en una sola figure." },
    { id: "guardado", label: "Guardado", detail: "Guarda en formatos PNG, PDF y SVG." },
    { id: "buenas-practicas", label: "Buenas prácticas", detail: "Siempre etiqueta los ejes e incluye leyendas." },
  ]}
/>

<FeatureButtonList
  features={[
    { id: "figure", label: "Figure", detail: "El contenedor de nivel superior (ventana completa)." },
    { id: "axes", label: "Axes", detail: "El área de graficación real (una figura puede tener varios)." },
    { id: "pyplot-g", label: "pyplot", detail: "Interfaz tipo MATLAB para graficación rápida." },
    { id: "subplot", label: "Subplot", detail: "Múltiples gráficos en una sola figura." },
    { id: "leyenda", label: "Leyenda", detail: "Etiquetas que identifican elementos del gráfico." },
    { id: "tight-layout", label: "Tight layout", detail: "Ajuste automático de espaciado." },
    { id: "vectorial", label: "Formato vectorial", detail: "SVG/PDF — escalable sin pérdida de calidad." },
    { id: "raster", label: "Formato raster", detail: "PNG — basado en píxeles, calidad depende del DPI." },
  ]}
/>

<ChoiceQuestion
  question="¿Por qué conviene guardar figuras en formato vectorial (SVG/PDF) para publicaciones?"
  moduleSlug="python"
  lessonSlug="lesson15_matplotlib"
  blockId="choice-python-l15-resumen-1"
  allowContinueOnIncorrect
  explanation="Los formatos vectoriales escalan sin pérdida de calidad y son los preferidos en revistas científicas."
  options={[
    { id: "a", label: "Escalan sin pérdida de calidad", correct: true, feedback: "¡Exacto! SVG/PDF son infinitamente escalables." },
    { id: "b", label: "Ocupan menos bytes que PNG", correct: false, feedback: "No siempre: depende de la complejidad de la figura." },
    { id: "c", label: "Permiten animaciones nativas", correct: false, feedback: "La animación no es la razón principal del formato vectorial." },
    { id: "d", label: "Generan archivos editables solo en Photoshop", correct: false, feedback: "Son editables en varios editores vectoriales, no solo Photoshop." },
  ]}
/>

<MascotMessage mood="celebrating">
¡Gráficos listos! Seaborn te dará atajos estadísticos sobre el mismo motor — la próxima lección.
</MascotMessage>

</RevealSequence>
</Section>

<Section number={7} title="Evaluación" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

**Ejercicios**

Nivel 1 — Básico:
1. ¿Cuál es la diferencia entre `plt.plot()` y `plt.scatter()`?
2. ¿Cómo guardas una figura como archivo PNG?
3. ¿Qué crea `fig, ax = plt.subplots(2, 3)`?

Nivel 2 — Implementación:
4. Grafica la función f(x) = x² de -10 a 10 con ejes etiquetados y un título.
5. Crea un gráfico de barras mostrando las 5 palabras más frecuentes en un texto dado.

Nivel 3 — Pensamiento Crítico:
6. ¿Cuándo elegirías un gráfico de líneas sobre uno de dispersión, y viceversa?
7. ¿Por qué es importante guardar figuras en formato vectorial (SVG/PDF) para publicaciones?

**Desafío de Código**

Crea un **reporte de datos integral** con los siguientes gráficos:
1. **Gráfico de líneas**: grafica 4 funciones matemáticas diferentes (sen, cos, sen², cos²) en los mismos ejes con diferentes estilos y una leyenda
2. **Gráfico de dispersión**: genera 200 puntos (x, y) aleatorios con una tendencia lineal clara, agrega una línea de regresión
3. **Gráfico de barras**: muestra la distribución de letras en una secuencia de ADN (conteo de A, C, G, T)
4. **Histograma**: grafica la distribución de 10.000 valores aleatorios y superpon una curva de distribución normal
5. **Figura multi-panel**: crea un subplot 2×2 combinando lo anterior en una sola figura
6. **Estilo**: usa un estilo profesional, incluye líneas de cuadrícula y guarda como PDF

</RevealSequence>
</Section>

<Section number={99} title="Checkpoint de conceptos" eyebrow="EVALUACIÓN">
<RevealSequence mode="appear">

<ChoiceQuestion
  question="¿Qué crea `fig, ax = plt.subplots(2, 3)`?"
  moduleSlug="python"
  lessonSlug="lesson15_matplotlib"
  blockId="choice-python-l15-tema-1"
  allowContinueOnIncorrect
  explanation="`subplots(2, 3)` crea una figura con una cuadrícula de 2 filas y 3 columnas de axes."
  options={[
    { id: "a", label: "Una figura con 2 subplots", correct: false, feedback: "Crea 2×3 = 6 axes, no 2." },
    { id: "b", label: "Una figura con 6 axes (2 filas × 3 columnas)", correct: true, feedback: "¡Correcto!" },
    { id: "c", label: "Un único gráfico con 3 series", correct: false, feedback: "No: son axes separados." },
    { id: "d", label: "Error de sintaxis", correct: false, feedback: "La llamada es válida." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuál es la diferencia entre las interfaces pyplot y OO de Matplotlib?"
  moduleSlug="python"
  lessonSlug="lesson15_matplotlib"
  blockId="choice-python-l15-tema-2"
  allowContinueOnIncorrect
  explanation="pyplot ofrece funciones de nivel superior estilo MATLAB; OO expone fig/ax para control fino en gráficos complejos."
  options={[
    { id: "a", label: "pyplot es más flexible para gráficos complejos", correct: false, feedback: "Es al revés: OO es más flexible." },
    { id: "b", label: "pyplot es simple/rápido; OO da control fino", correct: true, feedback: "¡Correcto!" },
    { id: "c", label: "Solo pyplot puede guardar figuras", correct: false, feedback: "Ambas pueden guardar." },
    { id: "d", label: "No hay diferencia real", correct: false, feedback: "Hay diferencias de control y estilo de código." },
  ]}
/>

</RevealSequence>
</Section>