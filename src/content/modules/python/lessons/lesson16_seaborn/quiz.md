# Quiz: Seaborn

## Opción múltiple (5 preguntas)

**Q1:** ¿Sobre qué biblioteca está construido Seaborn?
- A) NumPy
- B) Pandas
- C) Matplotlib
- D) Plotly

**Q2:** ¿Qué muestra `sns.pairplot()`?
- A) Un solo scatter plot
- B) Una matriz de scatter plots para todos los pares de variables
- C) Un heatmap de correlaciones
- D) Un box plot para cada variable

**Q3:** ¿Qué parámetro agrega codificación por color para variables categóricas?
- A) `color`
- B) `hue`
- C) `palette`
- D) `cmap`

**Q4:** ¿Qué tipo de gráfico combina un box plot con una estimación de densidad de kernel?
- A) Boxen plot
- B) Violin plot
- C) Swarm plot
- D) Strip plot

**Q5:** ¿Cómo aplicas el tema predeterminado de Seaborn?
- A) `sns.default_theme()`
- B) `sns.set_theme()`
- C) `sns.apply_theme()`
- D) `sns.theme()`

## Respuesta corta (2 preguntas)

**Q6:** ¿Qué es un heatmap y cuándo lo usarías?

**Q7:** ¿En qué se diferencia Seaborn de Matplotlib en cuanto a la filosofía de diseño predeterminada?

## Pregunta de código

**Q8:** Escribe código para crear un box plot con Seaborn que muestre la distribución de `total_bill` por `day` del dataset tips.

## Clave de respuestas

**Q1:** C) Matplotlib

**Q2:** B) Una matriz de scatter plots para todos los pares de variables

**Q3:** B) `hue`

**Q4:** B) Violin plot

**Q5:** B) `sns.set_theme()`

**Q6:** Un heatmap es una representación de matriz codificada por colores donde los valores se representan con colores. Se usa comúnmente para visualizar matrices de correlación, matrices de confusión o cualquier cuadrícula de valores donde quieras identificar patrones, agrupaciones y valores altos/bajos rápidamente.

**Q7:** Matplotlib prioriza el control y la personalización, con un estilo predeterminado básico. Seaborn prioriza el análisis estadístico y los valores predeterminados atractivos, y requiere menos código para crear gráficos de calidad de publicación. Seaborn ofrece agregaciones estadísticas integradas, mientras que Matplotlib requiere el cálculo manual.

**Q8:**
```python
import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")
sns.boxplot(data=tips, x="day", y="total_bill")
plt.title("Bill Distribution by Day")
plt.show()
```
