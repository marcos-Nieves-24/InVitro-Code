```python
# =========================================================================
# LAB 9: Trabajando con listas
# -------------------------------------------------------------------------
# Practicamos la creacion de listas, el acceso por indices y rebanadas,
# los metodos de listas, las listas por comprension, matrices 2D y la
# combinacion de zip() con enumerate().
# =========================================================================

# PASO 1: Operaciones basicas con listas.
# Acceso por indice (0 = primero, -1 = ultimo) y rebanadas [inicio:fin:paso].
numbers = [3, 7, 1, 9, 4, 6, 8, 2, 5, 0]
print(f"Original: {numbers}")
print(f"Primero: {numbers[0]}, Ultimo: {numbers[-1]}")
print(f"Primeros 5: {numbers[:5]}")
print(f"Cada dos elementos: {numbers[::2]}")
print(f"Reversa: {numbers[::-1]}")

numbers.sort()
print(f"Ordenada: {numbers}")

# PASO 2: Metodos de listas.
# append() agrega al final, insert() en una posicion, pop() extrae el
# ultimo y index() busca la posicion de un elemento.
tasks = []
tasks.append("Aprender Python")
tasks.append("Practicar listas")
tasks.append("Construir un proyecto")
tasks.insert(0, "Instalar Python")
print(f"\nTareas: {tasks}")

completed = tasks.pop()
print(f"Completada: {completed}")
print(f"Pendientes: {tasks}")
print(f"Indice de 'Aprender Python': {tasks.index('Aprender Python')}")

# PASO 3: Listas por comprension.
# Una forma compacta de construir listas aplicando una transformacion.
celsius = [0, 10, 20, 30, 40]
fahrenheit = [(c * 9 / 5) + 32 for c in celsius]
print(f"\nC: {celsius}")
print(f"F: {fahrenheit}")

# Tambien podemos filtrar con un condicional dentro de la comprension.
values = list(range(-5, 6))
positive = [n for n in values if n > 0]
negative = [n for n in values if n < 0]
print(f"Positivos: {positive}")
print(f"Negativos: {negative}")

# PASO 4: Operaciones con matrices.
# Una matriz es una lista de listas. La construimos con comprensiones.
matrix = [[i * 3 + j + 1 for j in range(3)] for i in range(3)]
print("\nMatriz 3x3:")
for row in matrix:
    print(row)

# Sumamos cada columna recorriendo los indices de las columnas.
cols = [sum(matrix[i][j] for i in range(3)) for j in range(3)]
print(f"Sumas por columna: {cols}")

# PASO 5: Zip y enumerate en un contexto biologico.
# zip() combina varias listas en pares; enumerate() agrega un indice.
genes = ["BRCA1", "TP53", "EGFR"]
expressions = [2.5, 1.8, 3.2]
p_values = [0.001, 0.08, 0.003]

for i, (gene, expr, p) in enumerate(zip(genes, expressions, p_values)):
    status = "significativo" if p < 0.05 else "no significativo"
    print(f"{i}. {gene}: expr={expr}, p={p} ({status})")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Accedimos con indices y rebanadas, ordenamos y usamos metodos.")
print("Construimos listas con comprensiones y filtros.")
print("Combinamos zip(), enumerate() y condicionales en contexto real.")
```