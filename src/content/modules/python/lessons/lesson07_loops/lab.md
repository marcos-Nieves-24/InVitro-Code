```python
# =========================================================================
# LAB 7: Bucles e iteracion
# -------------------------------------------------------------------------
# Practicamos bucles for, bucles while, range(), break/continue, bucles
# anidados y la clausula else asociada a un bucle.
# =========================================================================

# PASO 1: Bucle for basico.
# Recorremos una lista e imprimimos un mensaje por cada elemento.
fruits = ["apple", "banana", "cherry", "date"]
for fruit in fruits:
    print(f"Me gusta {fruit}s")

# PASO 2: Practica con range().
# range(inicio, fin, paso) genera secuencias de numeros.
print("\nPares del 2 al 20:")
for i in range(2, 21, 2):
    print(i, end=" ")
print()

print("Cuenta regresiva del 10 al 1:")
for i in range(10, 0, -1):
    print(i, end=" ")
print("Liftoff!")

# PASO 3: Bucle while.
# Repite mientras la condicion sea verdadera. OJO: hay que actualizar la
# variable de control para no crear un bucle infinito.
count = 10
while count > 0:
    print(count, end=" ")
    count -= 1
print("Blast off!")

# PASO 4: break y continue.
# break corta el bucle por completo; continue salta a la siguiente
# iteracion sin ejecutar el resto del cuerpo.
print("\nPrimer numero divisible por 7 y por 3:")
for i in range(1, 100):
    if i % 7 == 0 and i % 3 == 0:
        print(f"Encontrado: {i}")
        break

print("Numeros del 1 al 20 que NO son multiplos de 3:")
for i in range(1, 20):
    if i % 3 == 0:
        continue
    print(i, end=" ")
print()

# PASO 5: Bucles anidados.
# Un bucle dentro de otro genera combinaciones, por ejemplo una grilla de
# coordenadas.
print("\nGrilla de coordenadas (3x4):")
for x in range(3):
    for y in range(4):
        print(f"({x},{y})", end=" ")
    print()

# PASO 6: Bucle con clausula else.
# El else se ejecuta solo si el bucle termina SIN encontrar un break.
search_for = 7
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
for num in numbers:
    if num == search_for:
        print(f"\nEncontrado {search_for}!")
        break
else:
    print(f"\n{search_for} no encontrado")

# PASO 7: Aplicacion biotecnologica con enumerate.
# enumerate() entrega (indice, valor) en cada iteracion: ideal para
# etiquetar posiciones de una secuencia.
dna = "AGCTAG"
print("\nPosiciones de una secuencia de ADN:")
for i, base in enumerate(dna):
    print(f"  posicion {i}: {base}")

# PASO 8: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Repasamos for, while, range, break, continue y bucles anidados.")
print("El else de un bucle corre solo cuando NO se ejecuta break.")
```