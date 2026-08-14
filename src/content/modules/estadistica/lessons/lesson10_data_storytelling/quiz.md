# Quiz: Narración de datos

## Opción múltiple (5 preguntas)

**1. El ratio data-ink mide:**

a) Cuánta tinta usa una impresora
b) La proporción de tinta dedicada a los datos vs la decoración
c) La cantidad de colores en una visualización
d) El tamaño del dataset

**2. ¿Qué combinación de colores debería evitarse por accesibilidad?**

a) Azul y naranja
b) Rojo y verde
c) Púrpura y amarillo
d) Negro y blanco

**3. Según Tufte, el "lie factor" (factor de mentira) es:**

a) El ratio entre el tamaño del efecto visual y el tamaño del efecto en los datos
b) Una medida de cuántas mentiras contiene un gráfico
c) La cantidad de decimales en los datos
d) El tamaño de fuente usado en las etiquetas

**4. ¿Qué tipo de gráfico es mejor para mostrar una tendencia a lo largo del tiempo?**

a) Gráfico de torta
b) Gráfico de barras
c) Gráfico de líneas
d) Scatter plot

**5. En el diseño de tableros, la información más importante debe ubicarse:**

a) Abajo a la derecha
b) Arriba a la izquierda
c) En el centro
d) Abajo a la izquierda

## Respuesta corta (2 preguntas)

**6.** ¿Qué es el chartjunk? Da dos ejemplos.

**7.** Explicá por qué los gráficos 3D se desaconsejan generalmente en la visualización de datos.

## Pregunta de código (1 pregunta)

**8.** Escribí código en Python que cree un gráfico de barras simple con:
- Categorías: ['Q1', 'Q2', 'Q3', 'Q4']
- Valores: [25, 40, 35, 50]
- Un título claro, etiqueta x, etiqueta y
- Valores anotados encima de cada barra
- Un solo color consistente para todas las barras

---

# Clave de respuestas

1. b) La proporción de tinta dedicada a los datos vs la decoración
2. b) Rojo y verde
3. a) El ratio entre el tamaño del efecto visual y el tamaño del efecto en los datos
4. c) Gráfico de líneas
5. b) Arriba a la izquierda

6. El chartjunk se refiere a los elementos visuales innecesarios que distraen de los datos. Ejemplos: cuadrículas pesadas, efectos 3D, colores excesivos, imágenes irrelevantes, patrones decorativos en las barras.

7. Los gráficos 3D distorsionan la percepción: el efecto de perspectiva dificulta comparar valores con precisión. Las barras "más cercanas" parecen más grandes aunque no lo sean. También agregan desorden visual sin aportar información. Casi siempre, una versión 2D es más clara.

8. 
```python
import matplotlib.pyplot as plt
categories = ['Q1', 'Q2', 'Q3', 'Q4']
values = [25, 40, 35, 50]
plt.figure(figsize=(8, 4))
bars = plt.bar(categories, values, color='steelblue')
plt.title('Quarterly Revenue')
plt.xlabel('Quarter')
plt.ylabel('Revenue ($K)')
for bar, val in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             str(val), ha='center')
plt.tight_layout()
plt.show()
```
