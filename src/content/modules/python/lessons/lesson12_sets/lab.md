```python
# =========================================================================
# LAB 12: Conjuntos y operaciones de conjuntos
# -------------------------------------------------------------------------
# Practicamos la creacion de conjuntos (sets), las operaciones de algebra
# de conjuntos, la eliminacion de duplicados, la prueba de pertenencia y
# las relaciones entre conjuntos.
# =========================================================================

# PASO 1: Creacion de conjuntos.
# Un conjunto es una coleccion SIN elementos duplicados y SIN orden.
# Se crea con set() o con llaves {} (pero {} vacio es un diccionario).
empty = set()
from_list = set([1, 2, 2, 3, 3, 4])
from_string = set("hello world")
literal = {5, 6, 7, 8, 9}

print(f"Vacio: {empty}")
print(f"Desde lista (duplicados eliminados): {from_list}")
print(f"Desde texto: {from_string}")
print(f"Literal: {literal}")

# PASO 2: Operaciones de conjuntos.
# Union (|), interseccion (&), diferencia (-) y diferencia simetrica (^).
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(f"\nA: {a}")
print(f"B: {b}")
print(f"Union (A | B): {a | b}")
print(f"Interseccion (A & B): {a & b}")
print(f"Diferencia (A - B): {a - b}")
print(f"Diferencia (B - A): {b - a}")
print(f"Diferencia simetrica (A ^ B): {a ^ b}")

# PASO 3: Eliminacion de duplicados.
# Uso practico: limpiar una lista de IDs de usuarios repetidos.
user_ids = [101, 102, 103, 101, 104, 105, 102, 106]
unique_users = set(user_ids)
print(f"\nOriginal: {user_ids}")
print(f"Unicos: {unique_users}")

# Si necesitamos el orden, convertimos a lista y ordenamos.
unique_list = sorted(unique_users)
print(f"Unicos (ordenados): {unique_list}")

# PASO 4: Prueba de pertenencia.
# El operador in es MUY rapido en conjuntos (busqueda en O(1)).
valid_codes = {"A01", "B02", "C03", "D04", "E05"}

test_codes = ["A01", "X99", "C03", "Z12"]
print("\nValidacion de codigos:")
for code in test_codes:
    if code in valid_codes:
        print(f"  {code}: VALIDO")
    else:
        print(f"  {code}: INVALIDO")

# PASO 5: Relaciones entre conjuntos.
# issubset, issuperset e isdisjoint definen como se relacionan dos sets.
a = {1, 2, 3, 4}
b = {1, 2}
c = {5, 6}

print(f"\nB es subconjunto de A: {b.issubset(a)}")
print(f"A es superconjunto de B: {a.issuperset(b)}")
print(f"A y C son disjuntos: {a.isdisjoint(c)}")

# PASO 6: Aplicacion biotecnologica - genes compartidos.
# Comparar dos conjuntos de genes expresados es tarea tipica en
# transcriptomica: los genes comunes son los co-expresados.
genes_cancer = {"TP53", "BRCA1", "EGFR", "MYC"}
genes_normal = {"BRCA1", "MYC", "ACTB", "GAPDH"}
print("\nGenes co-expresados:", genes_cancer & genes_normal)
print("Genes solo en cancer:", genes_cancer - genes_normal)

# PASO 7: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Los conjuntos eliminan duplicados y soportan algebra de conjuntos.")
print("La prueba de pertenencia con 'in' es O(1).")
print("issubset, issuperset e isdisjoint definen relaciones entre sets.")
```