```python
# =========================================================================
# LAB 10: Trabajando con tuplas
# -------------------------------------------------------------------------
# Practicamos la creacion de tuplas, el desempaquetado, la inmutabilidad,
# el uso de tuplas como claves de diccionarios y la devolucion de
# multiples valores desde una funcion.
# =========================================================================

# PASO 1: Creacion y acceso a tuplas.
# Las tuplas son secuencias INMUTABLES. Se crean con parentesis, o incluso
# sin ellos. Para una tupla de un solo elemento el parentesis no basta:
# hace falta la coma.
empty = ()
single = (42,)
pair = (10, 20)
triple = 1, 2, 3  # los parentesis son opcionales
nested = ((1, 2), (3, 4))

print(f"Vacia: {empty}, tipo: {type(empty).__name__}")
print(f"Un elemento: {single}, tipo: {type(single).__name__}")
print(f"Par: {pair}")
print(f"Triple: {triple}")
print(f"Anidada: {nested}")

# PASO 2: Desempaquetado de tuplas.
# Podemos asignar cada elemento a una variable en una sola linea.
point = (3, 7)
x, y = point
print(f"\nx={x}, y={y}")

# Desempaquetado para intercambiar valores.
a, b = 10, 20
a, b = b, a
print(f"Despues del intercambio: a={a}, b={b}")

# Desempaquetado extendido: *middle captura los elementos del medio.
first, *middle, last = (1, 2, 3, 4, 5)
print(f"first={first}, middle={middle}, last={last}")

# PASO 3: Demostracion de la inmutabilidad.
# Las tuplas NO se pueden modificar despues de crearse. Descomenta la
# siguiente linea para ver el error (TypeError):
# t[0] = 99  # TypeError: 'tuple' object does not support item assignment
# Para "cambiar" una tupla creamos una NUEVA tupla combinando partes.
t = (1, 2, 3)
print(f"\nTupla original: {t}")
t2 = (99,) + t[1:]
print(f"Nueva tupla (se crea, no se modifica): {t2}")

# PASO 4: Tuplas como claves de diccionarios.
# Como son inmutables (hashables), las tuplas pueden ser claves de un
# diccionario. Perfecto para datos geoespaciales.
locations = {
    (40.7128, -74.0060): "New York",
    (34.0522, -118.2437): "Los Angeles",
    (41.8781, -87.6298): "Chicago",
}

coords = (40.7128, -74.0060)
print(f"\nCoordenadas {coords} -> {locations[coords]}")

for coords, city in locations.items():
    print(f"{city}: {coords}")

# PASO 5: Multiples valores de retorno.
# Las funciones devuelven varios valores como una tupla; luego la
# desempaquetamos.
def analyze(numbers):
    """Devuelve estadisticas basicas como una tupla."""
    return (
        min(numbers),
        max(numbers),
        sum(numbers) / len(numbers),
        len(numbers)
    )

data = [3, 1, 7, 2, 9, 4]
minimum, maximum, mean, count = analyze(data)
print(f"\nDatos: {data}")
print(f"Min: {minimum}, Max: {maximum}, Media: {mean:.2f}, Total: {count}")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Las tuplas son inmutables: no se modifican, se recrean.")
print("Se desempaquetan en variables y sirven como claves de diccionarios.")
print("Las funciones devuelven multiples valores como tuplas.")
```