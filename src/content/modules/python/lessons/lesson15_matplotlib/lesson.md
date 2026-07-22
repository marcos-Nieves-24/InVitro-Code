---
Module: 2
Lesson Number: 15
Lesson Title: Matplotlib
Estimated Duration: 75 minutos
Prerequisites: L14 — Pandas
Learning Objectives:
  - Crear gráficos básicos usando pyplot: líneas, dispersión, barras, histogramas
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

## Motivación

La visualización es esencial para entender los datos. Un gráfico bien elegido revela patrones, outliers y relaciones que son invisibles en números crudos. Matplotlib es la librería de visualización fundamental en Python, y la mayoría de las otras herramientas de visualización (Seaborn, Plotly) están construidas sobre ella. En biotecnología, las visualizaciones muestran distribuciones de expresión génica, curvas de supervivencia de pacientes y análisis de estructuras de proteínas. En SaaS, muestran tendencias de ingresos, crecimiento de usuarios y resultados de tests A/B.

## Panorama General

En la lección anterior aprendiste Pandas para manipulación de datos. Ahora vas a aprender a visualizar esos datos con Matplotlib. La próxima lección sobre Seaborn se basa en Matplotlib para crear visualizaciones estadísticas con menos código. A lo largo de los módulos de ML, vas a usar Matplotlib a diario para entender modelos, evaluar rendimiento y presentar resultados.

## Teoría

### Arquitectura de Matplotlib

Matplotlib tiene tres capas:
1. **Backend**: Renderiza a pantalla/archivo (ej. Agg, PDF, SVG)
2. **Artist**: Todo lo que ves en el gráfico (líneas, texto, ejes)
3. **pyplot**: Interfaz de conveniencia (lo que más vas a usar)

### Dos Interfaces

**Interfaz pyplot (funcional):**
```python
import matplotlib.pyplot as plt
plt.plot(x, y)
plt.show()
```

**Interfaz orientada a objetos (OO):**
```python
fig, ax = plt.subplots()
ax.plot(x, y)
plt.show()
```

La interfaz OO es preferida para gráficos complejos.

### Tipos de Gráficos Básicos

```python
plt.plot(x, y)              # Gráfico de líneas
plt.scatter(x, y)           # Gráfico de dispersión
plt.bar(x, height)          # Gráfico de barras
plt.hist(data, bins=10)     # Histograma
plt.boxplot(data)           # Diagrama de caja
plt.pie(sizes)              # Gráfico circular
plt.imshow(image)           # Visualización de imagen
```

### Personalización

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

### Figure y Axes

```python
fig, axes = plt.subplots(2, 3, figsize=(12, 8))
axes[0, 0].plot(x, y)
axes[0, 1].scatter(x, y)
```

### Guardando Figuras

```python
plt.savefig("grafico.png", dpi=300, bbox_inches="tight")
plt.savefig("grafico.pdf")
plt.savefig("grafico.svg")
```

## Explicación Visual

```
Estructura de una Figura de Matplotlib

┌─────────────────────────────────────────────────┐
│ Figure (la ventana completa)                     │
│  ┌─────────────────────────────────────────────┐│
│  │ Axes (el área de gráfico real)               ││
│  │  ┌───────────────────────────────────────┐   ││
│  │  │ Título                               │   ││
│  │  │ ──────────────────────────────────── │   ││
│  │  │ │                                    │   ││
│  │  │ │        Área del Gráfico            │   ││
│  │  │ │                                    │   ││
│  │  │ ──────────────────────────────────── │   ││
│  │  │ Etiqueta X                           │   ││
│  │  └───────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────┘│
│  Leyenda                                         │
└─────────────────────────────────────────────────┘
```

## Implementación en Python

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

## Ejemplo de Biotecnología

**Escenario**: Visualizando datos de expresión génica en diferentes condiciones.

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

## Ejemplo SaaS

**Escenario**: Visualizando un dashboard de métricas SaaS.

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

## Errores Comunes

1. **Graficar listas sin conversión**: Matplotlib puede graficar listas, pero los arrays NumPy son más rápidos
2. **No llamar `plt.show()`**: En scripts, los gráficos no aparecen sin esto
3. **Demasiados elementos en el gráfico**: Gráficos recargados confunden en lugar de informar
4. **Formas incompatibles**: x e y deben tener el mismo largo
5. **Olvidar `tight_layout()`**: Las etiquetas pueden cortarse
6. **Usar colores/estilos por defecto**: Personalizá para gráficos con aspecto profesional

## Buenas Prácticas

- Usá la interfaz OO (`fig, ax = plt.subplots()`) para gráficos complejos
- Siempre etiquetá los ejes e incluí unidades
- Usá esquemas de colores aptos para daltonismo
- Establecé tamaños de figura apropiados con `figsize`
- Usá `alpha` para elementos superpuestos
- Guardá como SVG para publicaciones (formato vectorial)
- Agregá líneas de cuadrícula con alpha bajo para legibilidad
- Usá `tight_layout()` para evitar que se corten las etiquetas

## Resumen

- El pyplot de Matplotlib proporciona gráficos estilo MATLAB
- Dos interfaces: pyplot (simple) y OO (flexible)
- Gráficos básicos: líneas, dispersión, barras, histograma
- Personalizá con títulos, etiquetas, leyendas, colores
- Subplots permiten figuras multi-panel
- Guardá en formatos PNG, PDF, SVG
- Siempre etiquetá los ejes e incluí leyendas

## Términos Clave

- **Figure**: El contenedor de nivel superior (ventana completa)
- **Axes**: El área de graficación real (una figura puede tener varios)
- **pyplot**: Interfaz tipo MATLAB para graficación rápida
- **Subplot**: Múltiples gráficos en una sola figura
- **Leyenda**: Etiquetas que identifican elementos del gráfico
- **Tight layout**: Ajuste automático de espaciado
- **Formato vectorial**: SVG/PDF — escalable sin pérdida de calidad
- **Formato raster**: PNG — basado en píxeles, calidad depende del DPI

## Ejercicios

### Nivel 1: Básico

1. ¿Cuál es la diferencia entre `plt.plot()` y `plt.scatter()`?
2. ¿Cómo guardás una figura como archivo PNG?
3. ¿Qué crea `fig, ax = plt.subplots(2, 3)`?

### Nivel 2: Implementación

4. Graficá la función f(x) = x² de -10 a 10 con ejes etiquetados y un título.
5. Creá un gráfico de barras mostrando las 5 palabras más frecuentes en un texto dado.

### Nivel 3: Pensamiento Crítico

6. ¿Cuándo elegirías un gráfico de líneas sobre uno de dispersión, y viceversa?
7. ¿Por qué es importante guardar figuras en formato vectorial (SVG/PDF) para publicaciones?

## Desafío de Código

Creá un **reporte de datos integral** con los siguientes gráficos:

1. **Gráfico de líneas**: Graficá 4 funciones matemáticas diferentes (sen, cos, sen², cos²) en los mismos ejes con diferentes estilos y una leyenda
2. **Gráfico de dispersión**: Generá 200 puntos (x, y) aleatorios con una tendencia lineal clara, agregá una línea de regresión
3. **Gráfico de barras**: Mostrá la distribución de letras en una secuencia de ADN (conteo de A, C, G, T)
4. **Histograma**: Graficá la distribución de 10.000 valores aleatorios y superponé una curva de distribución normal
5. **Figura multi-panel**: Creá un subplot 2×2 combinando lo anterior en una sola figura
6. Estilo: Usá un estilo profesional (`plt.style.use("seaborn-v0_8")` o similar), incluí líneas de cuadrícula y guardá como PDF
