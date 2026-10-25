# Quiz: Estadística descriptiva

## Opción múltiple (5 preguntas)

**1. ¿Qué medida de tendencia central se ve más afectada por los valores atípicos?**

a) Mediana
b) Moda
c) Media
d) Rango intercuartílico

**2. El rango intercuartílico (RIQ) representa:**

a) El rango entre los valores mínimo y máximo
b) El 50% central de los datos
c) La distancia promedio desde la media
d) El valor más frecuente

**3. Un dataset tiene los valores: 10, 12, 14, 15, 18, 100. ¿Cuál es la mediana?**

a) 14
b) 14.5
c) 15
d) 28.17

**4. Si la desviación estándar de un dataset es 0, ¿qué podemos concluir?**

a) Todos los valores son iguales
b) La media es 0
c) Los datos son simétricos
d) No hay valores atípicos

**5. Según la regla del RIQ, un dato es un valor atípico si está:**

a) Por debajo de Q1 o por encima de Q3
b) Por debajo de Q1 - 1.5×RIQ o por encima de Q3 + 1.5×RIQ
c) A más de 2 desviaciones estándar de la media
d) Por debajo de la media menos el rango

## Respuesta corta (2 preguntas)

**6.** Explica por qué se prefiere la mediana a la media para informar el ingreso familiar en un país con alta desigualdad de ingresos.

**7.** Una investigadora de biotecnología mide la concentración de proteína en 100 muestras. La media es 45 mg/dL con una desviación estándar de 3 mg/dL. Interpreta estos valores en lenguaje simple.

## Pregunta de código (1 pregunta)

**8.** Escribe código en Python usando numpy para:
- Crear un array `data = np.array([2, 4, 6, 8, 10, 100])`
- Calcular la media, la mediana, la varianza, la desviación estándar y el RIQ
- Identificar todos los valores atípicos usando el método del RIQ

---

# Clave de respuestas

1. c) Media
2. b) El 50% central de los datos
3. b) 14.5
4. a) Todos los valores son iguales
5. b) Por debajo de Q1 - 1.5×RIQ o por encima de Q3 + 1.5×RIQ

6. Las distribuciones de ingresos están fuertemente sesgadas a la derecha (pocos ingresos muy altos). La media se ve empujada hacia arriba por esos valores altos y no representa a la persona típica. La mediana es robusta a los valores atípicos y refleja el ingreso de la persona del medio.

7. La concentración típica de proteína es 45 mg/dL, y las muestras individuales típicamente se desvían de ese promedio en unos 3 mg/dL. La mayoría de las muestras (aproximadamente el 68%) caen entre 42 y 48 mg/dL.

8. 
```python
import numpy as np
data = np.array([2, 4, 6, 8, 10, 100])
mean = np.mean(data)
median = np.median(data)
variance = np.var(data, ddof=0)
std = np.std(data, ddof=0)
q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
outliers = data[(data < lower) | (data > upper)]
print(f"Outliers: {outliers}")
```
