# Quiz: Relaciones entre variables

## Opción múltiple (5 preguntas)

**1. La correlación de Pearson mide:**

a) La pendiente de la línea de regresión
b) La fuerza de una relación lineal
c) El efecto causal de X sobre Y
d) La diferencia entre las medias

**2. La correlación de Spearman se basa en:**

a) Los valores brutos de los datos
b) Los rangos de los valores de los datos
c) Los puntajes Z
d) Las desviaciones estándar

**3. Una correlación de -0.8 indica:**

a) Relación lineal positiva fuerte
b) Relación lineal negativa fuerte
c) Relación lineal negativa débil
d) No hay relación

**4. ¿Qué correlación es más robusta a los valores atípicos?**

a) Pearson
b) Spearman
c) Ambas son igualmente robustas
d) Ninguna

**5. Una matriz de correlación con todos los valores cercanos a 1 sugiere:**

a) Que los features son independientes
b) Que los features son multicolineales
c) Que los features tienen varianza cero
d) Que los datos se distribuyen normalmente

## Respuesta corta (2 preguntas)

**6.** Explicá la diferencia entre una relación lineal y una monótona. Da un ejemplo de cada una.

**7.** ¿Por qué es importante verificar la multicolinealidad antes de construir un modelo de regresión lineal?

## Pregunta de código (1 pregunta)

**8.** Escribí código en Python que:
- Cree dos arrays: x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] y y = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
- Calcule las correlaciones de Pearson y Spearman
- Explique por qué difieren

---

# Clave de respuestas

1. b) La fuerza de una relación lineal
2. b) Los rangos de los valores de los datos
3. b) Relación lineal negativa fuerte
4. b) Spearman
5. b) Que los features son multicolineales

6. Una relación lineal sigue una línea recta (Y = a + bX). Una relación monótona aumenta o disminuye de forma consistente pero no necesariamente en línea recta (por ejemplo, Y = X² para X > 0). El crecimiento cuadrático es monótono (para X > 0, a medida que X aumenta, Y aumenta) pero no lineal.

7. La multicolinealidad infla la varianza de las estimaciones de los coeficientes, volviéndolos inestables e ininterpretables. Se vuelve difícil determinar qué feature está impulsando realmente la predicción.

8. 
```python
from scipy.stats import pearsonr, spearmanr
x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
y = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
print(f"Pearson: {pearsonr(x, y)[0]:.3f}")
print(f"Spearman: {spearmanr(x, y)[0]:.3f}")
# Pearson is 0.97 (high but not 1 because the relationship is quadratic, not linear)
# Spearman is 1.0 (perfect monotonic relationship)
```
