```python
# =========================================================================
# LAB 4: Distribuciones estadisticas con scipy.stats
# -------------------------------------------------------------------------
# Trabajamos con norm, t, chi2, expon y binom: calculamos probabilidades,
# graficamos pdf/pmf teoricas y las comparamos con muestras empiricas.
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Calculo de probabilidades con distribuciones conocidas.
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from scipy import stats

# 1) Binomial: la droga funciona en el 70%; probabilidad de que 20 de 30 respondan.
p_binom = stats.binom.pmf(20, 30, 0.7)
print(f"P(exactamente 20 de 30) = {p_binom:.4f}")

# 2) Poisson: llegan 5 muestras por hora; probabilidad de recibir exactamente 3.
p_pois = stats.poisson.pmf(3, 5)
print(f"P(exactamente 3 muestras) = {p_pois:.4f}")

# 3) Normal: glucosa ~ N(100, 15) mg/dL; porcentaje con glucosa > 140.
p_norm = stats.norm.sf(140, 100, 15)
print(f"P(glucosa > 140) = {p_norm:.4f}")

# PASO 2: PDF de la distribucion normal estandar.
print("\nGraficando la PDF de la normal estandar:")
x = np.linspace(-4, 4, 200)
fig = px.line(x=x, y=stats.norm.pdf(x, 0, 1),
              title="PDF de la distribucion normal estandar",
              labels={"x": "x", "y": "Densidad"})
fig.show()

# PASO 3: Comparar la PDF de la normal vs la t de Student.
print("\nGraficando normal estandar vs t de Student:")
fig = px.line(x=x, y=stats.norm.pdf(x),
              title="Densidades: normal estandar vs t de Student",
              labels={"x": "x", "y": "Densidad"})
fig.add_scatter(x=x, y=stats.t.pdf(x, df=4), name="t con 4 gl")
fig.show()

# PASO 4: PDF de la chi2 con 4 grados de libertad.
print("\nGraficando la PDF de la chi2:")
x2 = np.linspace(0, 20, 200)
fig = px.line(x=x2, y=stats.chi2.pdf(x2, df=4),
              title="PDF de la chi2 con 4 grados de libertad",
              labels={"x": "x", "y": "Densidad"})
fig.show()

# PASO 5: Muestreo exponencial: empirico vs teorico.
print("\nComparando muestras exponenciales con su PDF teorica:")
muestras = np.random.exponential(2.0, 5000)
x_exp = np.linspace(0, 15, 200)
fig = px.histogram(muestras, nbins=50, title="Muestras exponenciales (scale=2)")
fig.add_scatter(x=x_exp, y=stats.expon.pdf(x_exp, scale=2.0),
                mode="lines", name="PDF teorica")
fig.show()

# PASO 6: PMF de la binomial: teorica vs empirica.
print("\nComparando la PMF binomial teorica vs la empirica:")
n, p = 30, 0.7
k = np.arange(0, n + 1)
empirica = np.bincount(np.random.binomial(n, p, 50000), minlength=n + 1) / 50000
fig = px.bar(x=k, y=stats.binom.pmf(k, n, p), title="PMF binomial teorica")
fig.add_scatter(x=k, y=empirica, mode="markers+lines", name="Empirica")
fig.show()

# PASO 7: Cuantiles utiles para construir intervalos de confianza.
print(f"\nCuantil 0.975 de la normal: {stats.norm.ppf(0.975):.3f}")
print(f"Cuantil 0.975 de t(4): {stats.t.ppf(0.975, df=4):.3f}")

# PASO 8: Teorema central del limite con medias muestrales exponenciales.
# Las medias de una exponencial (sesgada) se vuelven normales al crecer n.
medias = [np.mean(np.random.exponential(2.0, 1000)) for _ in range(1000)]
print(f"\nMedia de las medias muestrales: {np.mean(medias):.3f} (esperado 2.0)")
fig = px.histogram(medias, nbins=40, title="Medias muestrales (Teorema central del limite)")
fig.show()

# PASO 9: Resumen del laboratorio.
print("\n--- Resumen ---")
print("scipy.stats calcula pdf/pmf, cuantiles y probabilidades exactas.")
print("Las muestras empiricas convergen a las distribuciones teoricas.")
```