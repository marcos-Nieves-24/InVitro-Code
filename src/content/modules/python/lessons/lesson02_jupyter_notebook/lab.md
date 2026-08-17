```python
# =========================================================================
# LAB 2: Primeros pasos con Jupyter Notebook
# -------------------------------------------------------------------------
# En el laboratorio original lanzabas Jupyter en tu terminal y creabas un
# notebook con celdas de codigo y de markdown. Aqui no hay Jupyter grafico,
# pero simulamos exactamente ese flujo: cada "celda" es una seccion de
# codigo con comentarios, y cada celda de codigo imprime su resultado en
# la consola, tal como lo haria en el notebook.
# =========================================================================

# PASO 1: "Lanzar Jupyter" (concepto).
# En tu terminal real el flujo era:
#   pip install jupyter
#   jupyter notebook
# Eso abría el navegador con el panel de Jupyter. Aqui continuamos directo
# con la simulacion de las celdas.

# PASO 2: Celda de codigo 1 - Primer mensaje.
# En un notebook esto seria una celda de tipo Codigo que ejecutas con
# Shift+Enter. El resultado aparece debajo de la celda.
print("Hello from Jupyter!")

# PASO 3: Celda de codigo 2 - Una operacion aritmetica.
# Otra celda de codigo. El notebook muestra el resultado de la ultima
# expresion evaluada, pero usamos print() para ser explicitos.
resultado = 15 * 37
print("15 * 37 =", resultado)

# PASO 4: Celda de codigo 3 - Una lista de numeros.
# Tercera celda: creamos una lista del 1 al 10 con range() y la mostramos.
numeros = list(range(1, 11))
print("Numeros del 1 al 10:", numeros)

# PASO 5: Celda de codigo 4 - Hacer la lista mas interesante.
# Podemos transformar los datos con una lista por comprension, por
# ejemplo elevando cada numero al cuadrado.
cuadrados = [n ** 2 for n in range(1, 11)]
print("Cuadrados:", cuadrados)

# PASO 6: Celda de markdown (documentacion).
# Las celdas de markdown no se ejecutan: formatean texto (encabezados,
# negritas, listas). Un ejemplo del texto que escribirías:
#   # My Jupyter Lab
#   ## Tu nombre
#   Aprendere Python aplicado a la biotecnologia.
print("\n[La celda de markdown seria texto formateado, no codigo ejecutable.]")

# PASO 7: Atajos de teclado de Jupyter (documentados en comentarios).
# Practica estos atajos cuando uses un notebook real:
#   Shift+Enter  -> ejecutar la celda y avanzar a la siguiente
#   A            -> insertar una celda arriba
#   B            -> insertar una celda abajo
#   DD           -> eliminar la celda seleccionada
#   M            -> cambiar la celda a markdown
#   Y            -> cambiar la celda a codigo
#   Ctrl+S       -> guardar el notebook
# Estos atajos son el corazon del flujo de trabajo en Jupyter.

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen del notebook simulado ---")
print("Celdas de codigo ejecutadas:", 4)
print("Celdas de markdown documentadas:", 1)
print("Atajos de teclado practicados: Shift+Enter, A, B, DD, M, Y, Ctrl+S")
print("En un notebook real exportarias el archivo con: File -> Download as -> HTML")
```