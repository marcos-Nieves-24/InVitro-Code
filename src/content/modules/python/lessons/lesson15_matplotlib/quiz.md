# Quiz: Matplotlib

## Opción múltiple (5 preguntas)

**Q1:** ¿Cuál es el contenedor de nivel superior en Matplotlib?
- A) Axes
- B) Figure
- C) Plot
- D) Canvas

**Q2:** ¿Cómo creás una figura con 2 filas y 3 columnas de subplots?
- A) `plt.subplot(2, 3)`
- B) `plt.subplots(2, 3)`
- C) `plt.figure(2, 3)`
- D) `plt.create(2, 3)`

**Q3:** ¿Qué función guarda una figura en un archivo?
- A) `plt.save()`
- B) `plt.export()`
- C) `plt.savefig()`
- D) `plt.write()`

**Q4:** ¿Qué hace `plt.tight_layout()`?
- A) Ajusta el espacio entre subplots
- B) Cambia el tamaño de la figura
- C) Ajusta el gráfico a los datos
- D) Comprime la imagen

**Q5:** ¿Qué parámetro controla la transparencia de los marcadores en un scatter plot?
- A) `transparent`
- B) `alpha`
- C) `opacity`
- D) `visible`

## Respuesta corta (2 preguntas)

**Q6:** Explicá la diferencia entre la interfaz de pyplot y la interfaz orientada a objetos en Matplotlib.

**Q7:** ¿Por qué deberías guardar las figuras como SVG para publicaciones en lugar de JPG?

## Pregunta de código

**Q8:** Escribí código para crear un line plot simple de y = x² para x de 0 a 10, con ejes etiquetados y un título.

## Clave de respuestas

**Q1:** B) Figure

**Q2:** B) `plt.subplots(2, 3)`

**Q3:** C) `plt.savefig()`

**Q4:** A) Ajusta el espacio entre subplots

**Q5:** B) `alpha`

**Q6:** La interfaz de pyplot (`plt.plot()`, `plt.title()`) es una interfaz basada en estado que hace seguimiento de la figura y los ejes "actuales". Es conveniente para gráficos rápidos. La interfaz orientada a objetos (`fig, ax = plt.subplots()` seguido de `ax.plot()`, `ax.set_title()`) crea explícitamente objetos de figura y ejes, lo que da más control y la hace mejor para figuras complejas con múltiples paneles.

**Q7:** SVG es un formato vectorial que escala infinitamente sin perder calidad, lo que lo hace ideal para publicaciones donde las figuras pueden redimensionarse. JPG es un formato de mapa de bits que pierde calidad al escalarse y usa compresión con pérdida. SVG además permite editar en software de gráficos vectoriales y produce archivos más pequeños para gráficos simples.

**Q8:**
```python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = x ** 2

plt.plot(x, y)
plt.xlabel("x")
plt.ylabel("x²")
plt.title("Plot of y = x²")
plt.grid(True)
plt.show()
```
