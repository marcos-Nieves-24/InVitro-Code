# Lab: Visualización estadística con Seaborn

## Objetivo

Practicar la creación de visualizaciones de Seaborn: box plots, violin plots, pairplots, heatmaps y gráficos de distribución.

## Duración

60 minutos

## Requisitos previos

Lección 15: Matplotlib

## Instrucciones

### Parte 1: Para empezar

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Load tips dataset
tips = sns.load_dataset("tips")
print(tips.head())
```

### Parte 2: Box plot

```python
# Box plot of total_bill by day
plt.figure(figsize=(10, 6))
sns.boxplot(data=tips, x="day", y="total_bill", hue="sex")
plt.title("Bill Distribution by Day and Sex")
plt.show()
```

### Parte 3: Violin plot

```python
# Violin plot (shows distribution shape)
plt.figure(figsize=(10, 6))
sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", split=True)
plt.title("Bill Distribution (Violin)")
plt.show()
```

### Parte 4: Pairplot

```python
# Pairplot of numerical columns
sns.pairplot(data=tips, hue="sex", diag_kind="kde")
plt.suptitle("Pairplot of Tips Data", y=1.02)
plt.show()
```

### Parte 5: Heatmap

```python
# Correlation heatmap
numeric = tips.select_dtypes(include=[np.number])
corr = numeric.corr()

plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, square=True)
plt.title("Correlation Heatmap")
plt.show()
```

### Parte 6: Personalización

```python
# Apply theme and customize
sns.set_theme(style="whitegrid")
sns.set_palette("husl")

plt.figure(figsize=(10, 6))
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time", size="size", sizes=(20, 200))
plt.title("Tips Analysis with Custom Theme")
plt.show()
```

## Entregables

Notebook de Jupyter `seaborn_lab.ipynb` con todos los gráficos.
