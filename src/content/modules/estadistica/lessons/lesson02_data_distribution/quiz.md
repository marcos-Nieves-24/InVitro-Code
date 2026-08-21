# Quiz: Distribución de datos

## Opción múltiple (5 preguntas)

**1. Una distribución con asimetría (skewness) = -1.5 es:**

a) Simétrica
b) Sesgada a la derecha
c) Sesgada a la izquierda
d) Bimodal

**2. Una curtosis excesiva de 0 indica:**

a) Colas pesadas
b) Colas ligeras
c) Peso de cola de la distribución normal
d) Bimodalidad

**3. En una distribución sesgada a la derecha, ¿cuál es verdadera?**

a) Media < Mediana
b) Media > Mediana
c) Media = Mediana
d) Moda > Mediana

**4. La regla de Freedman-Diaconis determina:**

a) La cantidad de bins para un histograma
b) El ancho de banda para el KDE
c) Si los datos se distribuyen normalmente
d) El nivel de significancia

**5. Una distribución leptocúrtica (curtosis > 0) tiene:**

a) Menos valores atípicos que la normal
b) Más valores atípicos que la normal
c) Ningún valor atípico
d) La misma cantidad de valores atípicos que la normal

## Respuesta corta (2 preguntas)

**6.** Explica por qué la transformación logarítmica de datos de expresión génica sesgados a la derecha los hace aproximadamente normales. ¿Cuál es el beneficio práctico?

**7.** Graficas un histograma y ves dos picos distintos. ¿Qué sugiere esto sobre los datos? ¿Qué deberías investigar a continuación?

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python que:
- Genere 1000 muestras de una distribución exponencial con scale=5
- Cree un histograma con KDE superpuesto
- Calcule e imprima la asimetría (skewness) y la curtosis

---

# Clave de respuestas

1. c) Sesgada a la izquierda
2. c) Peso de cola de la distribución normal
3. b) Media > Mediana
4. a) La cantidad de bins para un histograma
5. b) Más valores atípicos que la normal

6. La transformación logarítmica comprime la cola larga derecha y expande la cola izquierda, haciendo la distribución más simétrica. El beneficio práctico es que muchos métodos estadísticos (pruebas t, modelos lineales, PCA) asumen normalidad, así que los datos transformados cumplen mejor estos supuestos.

7. Dos picos (distribución bimodal) sugieren que los datos contienen dos subgrupos distintos. Esto podría indicar diferentes especies, grupos de tratamiento vs. control, o diferentes segmentos de clientes. Investiga coloreando el histograma por una variable categórica.

8. 
```python
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis

data = np.random.exponential(scale=5, size=1000)
sns.histplot(data, bins=30, kde=True)
plt.show()
print(f"Skewness: {skew(data):.3f}")
print(f"Kurtosis: {kurtosis(data):.3f}")
```
