```python
# =========================================================================
# LAB 3: Fundamentos de probabilidad
# -------------------------------------------------------------------------
# Simulamos monedas, dados, el problema de Monty Hall y la ley de los
# grandes numeros; verificamos Bayes y la binomial con numpy.
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Simulacion de lanzamientos de una moneda justa.
import numpy as np                         # Operaciones matematicas
import plotly.express as px                # Graficos interactivos

np.random.seed(7)
n = 100000
monedas = np.random.choice(["cara", "cruz"], size=n, p=[0.5, 0.5])
freq_cara = np.mean(monedas == "cara")
print(f"Frecuencia de cara en {n} lanzamientos: {freq_cara:.4f} (esperado 0.5)")

# PASO 2: Ley de los grandes numeros.
# La frecuencia relativa converge a la probabilidad teorica (0.5) al crecer n.
print("\nGraficando la convergencia de la frecuencia acumulada:")
acumulado = np.cumsum(monedas == "cara") / np.arange(1, n + 1)
fig = px.line(x=np.arange(1, n + 1), y=acumulado,
              title="Ley de los grandes numeros: frecuencia de cara",
              labels={"x": "Lanzamientos", "y": "Frecuencia acumulada"})
fig.add_hline(y=0.5, line_dash="dash", line_color="red")
fig.show()                                 # Mostrar grafico interactivo

# PASO 3: Variable aleatoria X = suma de dos dados.
# PMF teorica: hay 36 combinaciones equiprobables (2..12).
sumas = np.arange(2, 13)
pmf_teorica = np.array([min(i - 1, 13 - i) for i in sumas]) / 36
print("\nPMF teorica de la suma de dos dados:")
for s, p in zip(sumas, pmf_teorica):
    print(f"  P(X={s}) = {p:.4f}")

d1 = np.random.randint(1, 7, size=50000)
d2 = np.random.randint(1, 7, size=50000)
suma_obs = d1 + d2
freq_obs = np.bincount(suma_obs, minlength=13)[2:13] / 50000
print(f"\nE[X] empirica: {suma_obs.mean():.3f} (teorica: 7)")
print(f"Var(X) empirica: {suma_obs.var():.3f} (teorica: {35/6:.3f})")

# PASO 4: Comparar la PMF teorica vs la empirica de los dados.
print("\nGraficando la PMF teorica vs la empirica:")
fig = px.bar(x=sumas, y=pmf_teorica, title="PMF teorica de la suma de dos dados")
fig.add_scatter(x=sumas, y=freq_obs, mode="markers+lines", name="Empirica")
fig.show()                                 # Mostrar grafico interactivo

# PASO 5: Simulacion de Monty Hall.
# Cambiar de puerta gana en 2/3 de los casos; mantener solo en 1/3.
def jugar_monty(cambiar, n=20000):
    ganadas = 0
    for _ in range(n):
        premio = np.random.randint(0, 3)
        eleccion = np.random.randint(0, 3)
        puertas = [0, 1, 2]
        abierta = [p for p in puertas if p != premio and p != eleccion][0]
        if cambiar:
            final = [p for p in puertas if p != eleccion and p != abierta][0]
        else:
            final = eleccion
        ganadas += int(final == premio)
    return ganadas / n

print(f"\nMonty Hall sin cambiar:  {jugar_monty(False):.4f}")
print(f"Monty Hall cambiando:    {jugar_monty(True):.4f}")

# PASO 6: Teorema de Bayes verificado por simulacion.
# Test con prevalencia 3%, sensibilidad 92% y especificidad 88%.
prevalencia = 0.03
sensibilidad = 0.92
especificidad = 0.88
n = 100000
enfermos = np.random.rand(n) < prevalencia
positivo = np.where(enfermos,
                    np.random.rand(n) < sensibilidad,
                    np.random.rand(n) < (1 - especificidad))
print(f"\nP(positivo) = {np.mean(positivo):.4f}")
print(f"P(enfermedad | positivo) = {np.mean(enfermos[positivo]):.4f}")

# PASO 7: Distribucion binomial con numpy.
# 30 pacientes, probabilidad de exito 0.7: cuantos responden exactamente 20.
exitos = np.random.binomial(30, 0.7, size=100000)
print(f"\nP(X=20) empirica: {np.mean(exitos == 20):.4f}")
fig = px.histogram(exitos, nbins=31, title="Distribucion binomial(n=30, p=0.7)")
fig.show()                                 # Mostrar grafico interactivo

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("La simulacion verifica las probabilidades teoricas (LLN, dados, Bayes).")
print("En Monty Hall conviene cambiar de puerta: gana en 2/3 de las veces.")
```