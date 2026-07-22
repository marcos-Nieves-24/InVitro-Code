---
Module: 3
Lesson Number: 4
Lesson Title: Distribuciones Estadísticas
Estimated Duration: 75 minutos
Prerequisites: Lección 3 (Fundamentos de Probabilidad)
Learning Objectives:
  - Describir las distribuciones Bernoulli, Binomial, Poisson y Normal
  - Calcular probabilidades usando PMF, PDF y CDF con scipy.stats
  - Estandarizar una distribución normal a puntajes Z
  - Elegir la distribución adecuada para un escenario de datos dado
Keywords: Bernoulli, Binomial, Poisson, Normal, Gaussiana, puntaje Z, estandarización, scipy.stats, PMF, PDF, CDF
Difficulty: Intermedio
Programming Concepts: scipy.stats, numpy, matplotlib
Mathematical Concepts: PMF, PDF, CDF, estandarización, teorema central del límite
Machine Learning Concepts: normalización de features, supuestos de distribución
Datasets Used: Datos sintéticos, dataset iris
Notebook: 04_statistical_distributions.ipynb
Assignment: statistical_distributions_assignment.md
Quiz: statistical_distributions_quiz.md
---

# Lección 4: Distribuciones Estadísticas

## Motivación

Todo proceso generador de datos en la naturaleza y los negocios sigue alguna distribución de probabilidad. La expresión génica sigue una distribución log-normal. Las llegadas de clientes siguen una distribución de Poisson. Los resultados binarios como enfermedad/no-enfermedad siguen una distribución de Bernoulli. Entender estas distribuciones con nombre te permite modelar datos de forma realista, hacer predicciones probabilísticas y elegir tests estadísticos adecuados.

En la Lección 3, aprendiste el lenguaje general de la probabilidad. Ahora conocerás las distribuciones específicas que aparecen con más frecuencia en machine learning y ciencia de datos.

## Panorama General

Esta lección puentea la teoría de probabilidad (Lección 3) con el análisis práctico de datos. Aprenderás a trabajar con cuatro distribuciones esenciales usando scipy.stats. Estas distribuciones aparecen a lo largo del resto del curso — en EDA (Lección 6), evaluación de modelos (Lección 9), y todo el Módulo 4 (Machine Learning).

## Teoría

### Distribución Bernoulli

Modela un único resultado binario (éxito/fracaso, 1/0).

- Parámetro: \(p\) (probabilidad de éxito)
- PMF: \(P(X = 1) = p\), \(P(X = 0) = 1 - p\)
- Media: \(E[X] = p\)
- Varianza: \(\text{Var}(X) = p(1-p)\)

Intuición: Un solo lanzamiento de moneda. Cada paciente responde al tratamiento o no.

### Distribución Binomial

Modela la cantidad de éxitos en \(n\) ensayos Bernoulli independientes.

- Parámetros: \(n\) (ensayos), \(p\) (probabilidad de éxito)
- PMF: \(P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}\)
- Media: \(E[X] = np\)
- Varianza: \(\text{Var}(X) = np(1-p)\)

Intuición: Lanzar una moneda \(n\) veces y contar las caras. Cantidad de pacientes que responden al tratamiento de 100.

### Distribución Poisson

Modela la cantidad de eventos que ocurren en un intervalo fijo de tiempo o espacio.

- Parámetro: \(\lambda\) (tasa promedio)
- PMF: \(P(X = k) = \frac{e^{-\lambda} \lambda^k}{k!}\)
- Media: \(E[X] = \lambda\)
- Varianza: \(\text{Var}(X) = \lambda\)

Intuición: Llegadas de clientes por hora. Cantidad de mutaciones en una secuencia de ADN de longitud fija.

### Distribución Normal (Gaussiana)

La distribución más importante en estadística. Modela muchos fenómenos naturales.

- Parámetros: \(\mu\) (media), \(\sigma^2\) (varianza)
- PDF: \(f(x) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)\)
- Media: \(\mu\)
- Varianza: \(\sigma^2\)

**Distribución Normal Estándar**: \(Z = \frac{X - \mu}{\sigma}\) transforma cualquier normal a \(N(0, 1)\).

**Regla 68-95-99.7**: Aproximadamente el 68% de los datos dentro de 1σ, 95% dentro de 2σ, 99.7% dentro de 3σ.

Intuición: Alturas, errores de medición, puntajes de examen. Muchos algoritmos de machine learning asumen que las features están distribuidas normalmente.

### Teorema Central del Límite

La suma (o promedio) de \(n\) variables aleatorias independientes converge a una distribución normal a medida que \(n\) aumenta, sin importar la distribución original.

Intuición: Incluso si los puntos de datos individuales no son normales, el promedio de muchas muestras será aproximadamente normal. Por eso la distribución normal es tan ubicua.

## Implementación en Python

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Bernoulli
p = 0.3
bernoulli = stats.bernoulli(p)
print(f"Bernoulli - P(X=1): {bernoulli.pmf(1):.2f}, P(X=0): {bernoulli.pmf(0):.2f}")

# Binomial
n, p = 10, 0.3
binomial = stats.binom(n, p)
k = np.arange(0, n+1)
print(f"Binomial - P(X=3): {binomial.pmf(3):.3f}")
print(f"Media (np): {binomial.mean():.2f}, Varianza (np(1-p)): {binomial.var():.2f}")

# Poisson
lam = 3.0
poisson = stats.poisson(lam)
k = np.arange(0, 10)
print(f"Poisson - P(X=2): {poisson.pmf(2):.3f}")
print(f"Media: {poisson.mean():.2f}, Varianza: {poisson.var():.2f}")

# Normal
mu, sigma = 50, 10
normal = stats.norm(mu, sigma)
print(f"Normal - P(X < 60) (CDF): {normal.cdf(60):.3f}")
print(f"P(40 < X < 60): {normal.cdf(60) - normal.cdf(40):.3f}")
```

### Visualización

```python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Bernoulli
x = [0, 1]
axes[0, 0].bar(x, stats.bernoulli(0.3).pmf(x), width=0.4, color='steelblue')
axes[0, 0].set_title('Bernoulli (p=0.3)')
axes[0, 0].set_xticks([0, 1])

# Binomial
n, p = 10, 0.3
k = np.arange(0, n+1)
axes[0, 1].bar(k, stats.binom(n, p).pmf(k), width=0.8, color='coral')
axes[0, 1].set_title(f'Binomial (n={n}, p={p})')

# Poisson
lam = 3
k = np.arange(0, 12)
axes[1, 0].bar(k, stats.poisson(lam).pmf(k), width=0.8, color='seagreen')
axes[1, 0].set_title(f'Poisson ($\lambda$={lam})')

# Normal
x = np.linspace(mu-4*sigma, mu+4*sigma, 200)
axes[1, 1].plot(x, stats.norm(mu, sigma).pdf(x), color='purple', linewidth=2)
axes[1, 1].set_title(f'Normal ($\mu$={mu}, $\sigma$={sigma})')

plt.tight_layout()
plt.show()

# Demostración de estandarización
data = np.random.normal(loc=100, scale=15, size=1000)
z_scores = (data - np.mean(data)) / np.std(data, ddof=0)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(data, bins=30, edgecolor='black')
axes[0].set_title('Datos Originales')
axes[1].hist(z_scores, bins=30, edgecolor='black')
axes[1].set_title('Estandarizados (Puntajes Z)')
plt.tight_layout()
plt.show()
```

## Ejemplo Guiado

Una empresa biotecnológica mide la cantidad de colonias bacterianas en 100 placas de Petri. El promedio es de 15 colonias por placa.

```python
lam = 15
k = np.arange(0, 30)
probs = stats.poisson(lam).pmf(k)

plt.figure(figsize=(10, 4))
plt.bar(k, probs, width=0.8, color='steelblue')
plt.axvline(lam, color='red', linestyle='--', label=f'Media = {lam}')
plt.title('Distribución Poisson: Colonias Bacterianas por Placa')
plt.xlabel('Cantidad de Colonias')
plt.ylabel('Probabilidad')
plt.legend()
plt.show()

# Probabilidad de observar exactamente 12 colonias
print(f"P(X=12): {stats.poisson(lam).pmf(12):.3f}")
# Probabilidad de observar 20 o más colonias
print(f"P(X >= 20): {1 - stats.poisson(lam).cdf(19):.3f}")
```

Interpretación: El modelo Poisson ayuda a predecir cuántas colonias esperamos ver y si una placa con 25 colonias es inusualmente alta.

## Ejemplo de Biotecnología

Los cambios de expresión génica (fold changes) suelen ser aproximadamente log-normales. Después de una transformación logarítmica, siguen una distribución normal.

```python
# Simular cambios de expresión
np.random.seed(42)
fold_changes = np.random.lognormal(mean=0, sigma=0.5, size=1000)

log_fc = np.log2(fold_changes)
z_scores = (log_fc - np.mean(log_fc)) / np.std(log_fc, ddof=0)

# ¿Qué genes se expresan diferencialmente (|Z| > 2)?
de_genes = np.abs(z_scores) > 2
print(f"Cantidad de genes expresados diferencialmente: {de_genes.sum()}")
print(f"Porcentaje: {de_genes.mean() * 100:.1f}%")
```

## Ejemplo SaaS

Los registros diarios de usuarios siguen un proceso de Poisson.

```python
lam_signups = 25  # 25 registros por día en promedio
daily_signups = stats.poisson(lam_signups).rvs(365, random_state=42)

plt.figure(figsize=(10, 4))
plt.hist(daily_signups, bins=20, edgecolor='black', color='coral')
plt.axvline(lam_signups, color='red', linestyle='--', label=f'Media = {lam_signups}')
plt.title('Registros Diarios (Distribución Poisson)')
plt.xlabel('Registros')
plt.ylabel('Frecuencia')
plt.legend()
plt.show()

# Cantidad esperada de días con más de 30 registros
p_more_than_30 = 1 - stats.poisson(lam_signups).cdf(30)
expected_days = p_more_than_30 * 365
print(f"Días esperados con >30 registros: {expected_days:.1f}")
```

## Errores Comunes

1. **Usar Binomial cuando los ensayos no son independientes**: La Binomial asume independencia. En realidad, pacientes del mismo hospital pueden tener resultados correlacionados.
2. **Usar Poisson cuando la varianza ≠ media**: La Poisson asume que varianza = media. Si la varianza es mucho mayor (sobredispersión), usá Binomial Negativa en su lugar.
3. **Asumir que los datos son normales sin verificar**: Visualizá y testéá la normalidad siempre antes de usar métodos que la asumen.
4. **Interpretar el TCL demasiado ampliamente**: El TCL aplica a la media muestral, no a observaciones individuales.

## Mejores Prácticas

- Visualizá tus datos antes de elegir una distribución
- Usá gráficos Q-Q para verificar normalidad
- Estandarizá las features (puntajes Z) cuando uses algoritmos de ML basados en distancia
- Recordá la regla 68-95-99.7 para aproximaciones normales rápidas
- Usá scipy.stats para todos los cálculos de distribuciones

## Resumen

- **Bernoulli**: Único resultado binario (p)
- **Binomial**: Conteo de éxitos en n ensayos (n, p)
- **Poisson**: Conteo de eventos en tiempo/espacio (λ)
- **Normal**: Distribución continua con forma de campana (μ, σ)
- **Estandarización**: Z = (X - μ) / σ crea la normal estándar
- Teorema Central del Límite: las medias muestrales se aproximan a la normal a medida que el tamaño de muestra crece

## Términos Clave

| Término | Definición |
|---------|------------|
| Distribución Bernoulli | Modela un único resultado binario |
| Distribución Binomial | Modela la cantidad de éxitos en n ensayos |
| Distribución Poisson | Modela conteos de eventos en tiempo/espacio |
| Distribución Normal | Distribución simétrica con forma de campana |
| Puntaje Z | Valor estandarizado: (X - μ) / σ |
| Estandarización | Transformar a media 0, desviación estándar 1 |
| Teorema Central del Límite | Las medias muestrales se aproximan a la normal con n grande |
| PMF | Función de probabilidad (discreta) |
| PDF | Función de densidad de probabilidad (continua) |
| CDF | Función de distribución acumulada |

## Ejercicios

**Nivel 1: Comprensión Básica**

1. ¿Cuáles son la media y la varianza de una distribución Bernoulli con p = 0.5?
2. La cantidad de tickets de soporte recibidos por hora promedia 12. ¿Qué distribución modela esto? ¿Cuál es la probabilidad de recibir exactamente 10 tickets en una hora?

**Nivel 2: Implementación**

3. Usando scipy.stats, generá y trazá la PMF de una distribución Binomial con n=20, p=0.7. ¿Cuál es la probabilidad de obtener al menos 15 éxitos?
4. Generá 1000 muestras de N(100, 20), estandarizalas y verificá que los puntajes Z resultantes tengan media ≈ 0 y desviación estándar ≈ 1.

**Nivel 3: Pensamiento Crítico**

5. En datos de RNA-seq, los conteos de genes suelen modelarse con una Binomial Negativa en lugar de Poisson. ¿Por qué? ¿Qué propiedad de los datos de RNA-seq viola el supuesto de Poisson?
6. Los ingresos diarios de una empresa SaaS tienen asimetría a la derecha. ¿Por qué el Teorema Central del Límite podría aún permitirles usar intervalos de confianza basados en la normal para el ingreso mensual promedio?

## Desafío de Programación

Escribí un script en Python que:
1. Genere datos de 4 distribuciones diferentes (Bernoulli, Binomial, Poisson, Normal)
2. Para cada distribución, calcule e imprima la media y la varianza
3. Cree un subplot de 2×2 con la PMF o PDF de cada distribución
4. Para la distribución normal, superponga líneas verticales en ±1σ, ±2σ, ±3σ desde la media con anotaciones que muestren el porcentaje de datos dentro de cada rango
