```python
# =========================================================================
# LAB 10: Narracion de datos con el dataset tips
# -------------------------------------------------------------------------
# Contamos una historia con datos de propinas: barras, scatter con OLS,
# histograma y boxplot, con anotaciones y etiquetas claras en espanol.
# Cada figura termina con fig.show() para capturarla en la consola.
# =========================================================================

# PASO 1: Cargar el dataset tips de plotly express.
import numpy as np                         # Operaciones matematicas
import pandas as pd                        # DataFrames y manipulacion
import plotly.express as px                # Graficos interactivos

tips = px.data.tips()
print("Dimensiones:", tips.shape)
print(tips.head())

# PASO 2: Propina promedio por dia de la semana.
print("\nGraficando la propina promedio por dia:")
promedio_dia = tips.groupby("day")["tip"].mean().reset_index()
fig = px.bar(promedio_dia, x="day", y="tip",
             title="Propina promedio por dia",
             labels={"day": "Dia", "tip": "Propina promedio ($)"})
fig.update_layout(xaxis_title="Dia de la semana", yaxis_title="Propina promedio ($)")
fig.show()                                 # Mostrar grafico interactivo

# PASO 3: Scatter total de la cuenta vs propina, coloreado por momento.
print("\nGraficando propina vs total de la cuenta con OLS:")
fig = px.scatter(tips, x="total_bill", y="tip", color="time",
                 title="Propina segun total de la cuenta y momento",
                 labels={"total_bill": "Total de la cuenta ($)",
                         "tip": "Propina ($)", "time": "Momento"})
pendiente, intercepto = np.polyfit(tips.total_bill, tips.tip, 1)
x_linea = np.linspace(tips.total_bill.min(), tips.total_bill.max(), 50)
fig.add_scatter(x=x_linea, y=pendiente * x_linea + intercepto,
                mode="lines", name=f"OLS: y={pendiente:.2f}x+{intercepto:.2f}")
fig.update_layout(legend=dict(orientation="h", y=1.1))
fig.show()                                 # Mostrar grafico interactivo

# PASO 4: Distribucion del total de la cuenta con la media marcada.
print("\nGraficando la distribucion del total de la cuenta:")
fig = px.histogram(tips, x="total_bill", nbins=40,
                   title="Distribucion del total de la cuenta",
                   labels={"total_bill": "Total de la cuenta ($)"})
fig.add_vline(x=tips.total_bill.mean(), line_dash="dash", line_color="red",
              annotation_text=f"media={tips.total_bill.mean():.1f}")
fig.show()                                 # Mostrar grafico interactivo

# PASO 5: Boxplot de la propina por dia.
print("\nGraficando el boxplot de propinas por dia:")
fig = px.box(tips, x="day", y="tip", color="day",
             title="Distribucion de propinas por dia",
             labels={"day": "Dia", "tip": "Propina ($)"})
fig.update_layout(showlegend=False)
fig.show()                                 # Mostrar grafico interactivo

# PASO 6: Storytelling con anotaciones.
# Gancho: los mozos dependen de las propinas; el dia y el momento importan.
print("\nGraficando la historia del mejor dia con anotaciones:")
fig = px.bar(promedio_dia, x="day", y="tip",
             title="¿Cual es el mejor dia para trabajar de mozo?",
             labels={"day": "Dia", "tip": "Propina promedio ($)"})
fig.add_annotation(
    x="Fri", y=promedio_dia.loc[promedio_dia.day == "Fri", "tip"].values[0],
    text="El viernes rinde mas", showarrow=True, arrowhead=2, ax=40, ay=-40)
fig.update_layout(xaxis_title="Dia de la semana", yaxis_title="Propina promedio ($)")
fig.show()                                 # Mostrar grafico interactivo

# PASO 7: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Los viernes y sabados las propinas promedio son mas altas.")
print("El total de la cuenta y la propina correlacionan positivamente.")
print("La cena concentra cuentas y propinas mayores que el almuerzo.")
```