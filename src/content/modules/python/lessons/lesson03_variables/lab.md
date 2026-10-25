```python
# =========================================================================
# LAB 3: Trabajando con variables
# -------------------------------------------------------------------------
# Practicamos asignacion de variables, convenciones de nombres, tipado
# dinamico, entrada/salida basica, intercambio de variables y el calculo
# de contenido GC de una secuencia de ADN.
# =========================================================================

# PASO 1: Asignacion basica de variables.
# Elegimos nombres descriptivos en snake_case (convencion de Python).
species = "Homo sapiens"        # texto (string)
chromosome_count = 46           # entero (int)
genome_size = 3.1               # flotante (float) en miles de millones de pb
print("Especie:", species)
print("Cromosomas:", chromosome_count)
print("Tamano del genoma (miles de millones de pb):", genome_size)

# PASO 2: Tipado dinamico.
# Una misma variable puede cambiar de tipo en cualquier momento: Python
# infiere el tipo automaticamente segun el valor asignado.
value = 100
print("\nvalue = 100 ->", type(value).__name__)
value = 100.0
print("value = 100.0 ->", type(value).__name__)
value = "one hundred"
print('value = "one hundred" ->', type(value).__name__)

# PASO 3: Entrada del usuario (simulada).
# En un script normal usaríamos input() para pedir datos al usuario:
#   name = input("Enter your name: ")
#   year = int(input("Enter birth year: "))
#   age = 2026 - year
#   print(f"Hello {name}, you are about {age} years old.")
# Pyodide no tiene consola interactiva, por eso usamos valores fijos que
# representan las respuestas tipicas de un usuario.
name = "Maria"
birth_year = 2002
current_year = 2026
age = current_year - birth_year
print(f"\nHola {name}, tienes alrededor de {age} anos.")

# PASO 4: Intercambio de variables (tuple unpacking).
# Python permite intercambiar dos variables sin variable auxiliar.
x = 5
y = 10
x, y = y, x
print(f"\nDespues del intercambio: x={x}, y={y}")

# PASO 5: Contexto de biotecnologia - contenido GC del ADN.
# El contenido GC es la proporcion de bases G (guanina) y C (citosina)
# en una secuencia de ADN. Es un indicador clave de la estabilidad del ADN.
sequence_id = "SEQ001"
sequence = "AGCTTCGATCG"
gc_count = sequence.count("G") + sequence.count("C")
gc_percent = (gc_count / len(sequence)) * 100
print(f"\n{sequence_id}: longitud={len(sequence)} pb, GC content = {gc_percent:.1f}%")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Variables asignadas con nombres descriptivos en snake_case.")
print("Tipado dinamico demostrado: la variable 'value' cambio de tipo 3 veces.")
print("Contenido GC calculado con count() y operaciones aritmeticas.")
```