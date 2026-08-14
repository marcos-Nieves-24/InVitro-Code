# Quiz: Bosque Aleatorio

## Opción múltiple (5 preguntas)

**Q1.** ¿Qué es el bagging?

a) Construir árboles sobre bootstrap samples y promediarlos
b) Usar todos los datos para entrenar un único árbol profundo
c) Reducir las features antes de entrenar
d) Un tipo de red neuronal

<details><summary>Respuesta</summary>a) Construir árboles sobre bootstrap samples (muestras con reemplazo) y promediar sus predicciones</details>

**Q2.** En un bosque aleatorio, ¿por qué solo se consideran subconjuntos aleatorios de features en cada split?

a) Para acelerar el entrenamiento
b) Para descorrelacionar los árboles, haciendo que el conjunto sea más efectivo
c) Para reducir el uso de memoria
d) Para prevenir el sobreajuste de los árboles individuales

<details><summary>Respuesta</summary>b) Para descorrelacionar los árboles. Si todos los árboles usaran el mismo mejor split, estarían altamente correlacionados y promediar no ayudaría mucho.</details>

**Q3.** El out-of-bag (OOB) score se calcula usando:

a) Los datos de entrenamiento
b) Los datos de prueba
c) Las muestras no incluidas en cada bootstrap sample (~37%)
d) Un set de validación separado

<details><summary>Respuesta</summary>c) Las muestras no incluidas en cada bootstrap sample (en promedio se dejan fuera ~37%)</details>

**Q4.** ¿Cuál de las siguientes afirmaciones es VERDADERA sobre el bosque aleatorio?

a) Aumentar n_estimators siempre aumenta el tiempo de entrenamiento de forma lineal
b) Más árboles siempre garantizan un mejor rendimiento
c) El bosque aleatorio solo puede usarse para clasificación
d) La importancia de características no está disponible

<details><summary>Respuesta</summary>a) Aumentar n_estimators siempre aumenta el tiempo de entrenamiento de forma lineal. (b es falsa — los rendimientos decrecen; c es falsa — existe RandomForestRegressor; d es falsa — la importancia de características es un resultado clave)</details>

**Q5.** Un bosque aleatorio normalmente tiene _____ sesgo y _____ varianza comparado con un único árbol de decisión.

a) Mayor, menor
b) Menor, menor
c) Similar, menor
d) Menor, mayor

<details><summary>Respuesta</summary>c) Sesgo similar, varianza menor. El bosque aleatorio mantiene el bajo sesgo de los árboles y reduce la varianza a través del promediado.</details>

## Respuesta corta (2 preguntas)

**Q6.** Explicá la relación entre el número de árboles (n_estimators) y el rendimiento del bosque aleatorio. ¿Por qué los rendimientos decrecen?

<details><summary>Respuesta</summary>A medida que n_estimators aumenta, el rendimiento mejora rápido al principio y luego se estabiliza. Cada árbol es un estimador insesgado con alta varianza. El promediado reduce la varianza aproximadamente en 1/B donde B es el número de árboles. Sin embargo, los árboles están correlacionados (ρ > 0), así que incluso con infinitos árboles, la varianza se aproxima a ρσ². Regla empírica: empezá con 100 árboles y aumentá hasta que el OOB score se estabilice.</details>

**Q7.** ¿Cuándo usarías la importancia por permutación en lugar de la importancia de características basada en impureza en un bosque aleatorio?

<details><summary>Respuesta</summary>La importancia basada en impureza puede estar sesgada hacia features de alta cardinalidad (aquellas con muchos valores únicos) y puede ser engañosa cuando las features están en escalas diferentes. La importancia por permutación mide directamente la caída en el rendimiento cuando se barajan los valores de una feature, lo que la hace más confiable. Usá la importancia por permutación para la selección final de features y la importancia por impureza para una visión rápida.</details>

## Pregunta de código (1 pregunta)

**Q8.** Escribí una función en Python `oob_vs_n_estimators(X, y, max_n=500)` que entrene bosques aleatorios con n_estimators desde 1 hasta max_n (en pasos de 10) y devuelva una lista de OOB scores. Después graficá el OOB score vs. n_estimators.

<details><summary>Respuesta</summary>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier

def oob_vs_n_estimators(X, y, max_n=500):
    n_values = np.arange(1, max_n + 1, 10)
    oob_scores = []
    for n in n_values:
        rf = RandomForestClassifier(n_estimators=n, oob_score=True, random_state=42, n_jobs=-1)
        rf.fit(X, y)
        oob_scores.append(rf.oob_score_)
    return n_values, oob_scores

from sklearn.datasets import load_breast_cancer
data = load_breast_cancer()
n_vals, oobs = oob_vs_n_estimators(data.data, data.target, max_n=300)

plt.figure(figsize=(8, 5))
plt.plot(n_vals, oobs, 'b-')
plt.xlabel('Number of Trees')
plt.ylabel('OOB Score')
plt.title('OOB Score vs. n_estimators')
plt.grid(True)
plt.show()
```
</details>
