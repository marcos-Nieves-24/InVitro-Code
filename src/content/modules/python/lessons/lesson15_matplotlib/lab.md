# Lab: Visualización de datos con Matplotlib

## Objetivo

Practicar la creación de varios tipos de gráficos, la personalización de figuras y el uso de subplots.

## Duración

75 minutos

## Requisitos previos

Lección 14: Pandas

## Instrucciones

### Parte 1: Gráfico de líneas (line plot)

```python
import matplotlib.pyplot as plt
import numpy as np

# Create a line plot with multiple lines
x = np.linspace(0, 4 * np.pi, 100)
y1 = np.sin(x)
y2 = np.sin(x + np.pi / 2)

plt.figure(figsize=(10, 6))
plt.plot(x, y1, label="sin(x)", color="blue")
plt.plot(x, y2, label="sin(x + π/2)", color="red", linestyle="--")
plt.title("Sine Waves")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
```

### Parte 2: Gráfico de dispersión (scatter plot)

```python
np.random.seed(42)
x = np.random.randn(100)
y = 2 * x + np.random.randn(100) * 0.5

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=y, cmap="viridis", alpha=0.7, s=50)
plt.colorbar(label="Y value")
plt.title("Scatter with Color Mapping")
plt.xlabel("X")
plt.ylabel("Y")
plt.grid(True, alpha=0.3)
plt.show()
```

### Parte 3: Gráfico de barras

```python
categories = ["A", "B", "C", "D", "E"]
values = [23, 45, 12, 67, 34]
colors = plt.cm.viridis(np.linspace(0.2, 0.8, len(categories)))

plt.figure(figsize=(8, 6))
bars = plt.bar(categories, values, color=colors)
plt.title("Bar Chart with Custom Colors")
plt.xlabel("Category")
plt.ylabel("Value")
plt.show()
```

### Parte 4: Histograma

```python
data = np.random.randn(1000)

plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, density=True, alpha=0.7, edgecolor="white")
plt.title("Distribution (Histogram)")
plt.xlabel("Value")
plt.ylabel("Density")
plt.grid(True, alpha=0.3)
plt.show()
```

### Parte 5: Subplots

```python
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

x = np.linspace(0, 10, 100)
axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title("Sine")

axes[0, 1].bar(["A", "B", "C"], [10, 20, 15])
axes[0, 1].set_title("Bar")

axes[1, 0].scatter(np.random.randn(50), np.random.randn(50))
axes[1, 0].set_title("Scatter")

axes[1, 1].hist(np.random.randn(500), bins=20)
axes[1, 1].set_title("Histogram")

plt.tight_layout()
plt.show()
```

## Entregables

Notebook de Jupyter `matplotlib_lab.ipynb` con todos los gráficos visibles.
