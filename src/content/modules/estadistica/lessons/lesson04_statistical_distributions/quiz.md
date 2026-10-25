# Quiz: Distribuciones estadísticas

## Opción múltiple (5 preguntas)

**1. ¿Qué distribución modela la cantidad de éxitos en n ensayos independientes?**

a) Bernoulli
b) Binomial
c) Poisson
d) Normal

**2. La distribución de Poisson asume:**

a) Media = Varianza
b) Media > Varianza
c) Media < Varianza
d) Varianza = 0

**3. ¿Cuál es el puntaje Z de un valor X = 75 de una distribución normal con μ = 50 y σ = 10?**

a) 1.5
b) 2.0
c) 2.5
d) 0.5

**4. Según la regla 68-95-99.7, ¿aproximadamente qué porcentaje de los datos cae dentro de 2 desviaciones estándar de la media?**

a) 68%
b) 95%
c) 99.7%
d) 50%

**5. El teorema central del límite establece que:**

a) Las observaciones individuales se distribuyen normalmente
b) La media muestral se aproxima a la normalidad a medida que aumenta el tamaño de la muestra
c) Todas las distribuciones tienen la misma media
d) La varianza es igual a la media para todas las distribuciones

## Respuesta corta (2 preguntas)

**6.** Un call center recibe un promedio de 20 llamadas por hora. ¿Qué distribución modela esto? ¿Cuál es la probabilidad de recibir exactamente 15 llamadas en la próxima hora?

**7.** ¿Qué es la estandarización y por qué es importante en machine learning?

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python usando scipy.stats para:
- Crear una distribución binomial con n=15, p=0.4
- Calcular P(X = 7)
- Calcular P(X ≤ 5)
- Generar 100 muestras aleatorias

---

# Clave de respuestas

1. b) Binomial
2. a) Media = Varianza
3. c) 2.5
4. b) 95%
5. b) La media muestral se aproxima a la normalidad a medida que aumenta el tamaño de la muestra

6. Distribución de Poisson (λ = 20). P(X=15) = e^(-20) × 20^15 / 15!. Usando Python: `stats.poisson(20).pmf(15)` ≈ 0.052.

7. La estandarización transforma los datos para que tengan media = 0 y desviación estándar = 1 usando Z = (X - μ)/σ. Es importante porque muchos algoritmos de ML (SVM, K-Means, PCA, regresión logística) asumen que los features están en la misma escala; de lo contrario, los features con mayores magnitudes dominan.

8. 
```python
from scipy import stats
binom = stats.binom(15, 0.4)
print(f"P(X=7) = {binom.pmf(7):.4f}")
print(f"P(X<=5) = {binom.cdf(5):.4f}")
samples = binom.rvs(100, random_state=42)
print(samples[:10])
```
