```python
# =========================================================================
# LAB 11: Diccionarios en la practica
# -------------------------------------------------------------------------
# Practicamos la creacion, el acceso, la actualizacion de diccionarios,
# los diccionarios por comprension, el conteo de palabras y los
# diccionarios anidados.
# =========================================================================

# PASO 1: Creacion y acceso a diccionarios.
# Un diccionario asocia claves (keys) con valores (values). Aqui cada
# contacto es un diccionario anidado dentro de otro diccionario.
contacts = {
    "Alice": {"phone": "555-0101", "email": "alice@example.com"},
    "Bob": {"phone": "555-0102", "email": "bob@example.com"},
    "Charlie": {"phone": "555-0103", "email": "charlie@example.com"},
}

print(f"Email de Alice: {contacts['Alice']['email']}")
print(f"Telefono de Bob: {contacts['Bob'].get('phone', 'N/A')}")

# PASO 2: Agregar y actualizar.
# Se agrega una clave nueva por asignacion y se actualiza con [] o get().
contacts["Diana"] = {"phone": "555-0104", "email": "diana@example.com"}
contacts["Alice"]["phone"] = "555-0199"  # actualizacion

print("\nTodos los contactos:")
for name, info in contacts.items():
    print(f"  {name}: {info['phone']}, {info['email']}")

# PASO 3: Diccionario por comprension.
# Construimos un diccionario a partir de dos listas con zip() y luego lo
# filtramos con un condicional.
names = ["Alice", "Bob", "Charlie", "Diana"]
scores = [95, 87, 92, 98]
gradebook = {name: score for name, score in zip(names, scores)}
print(f"\nLibro de calificaciones: {gradebook}")

high_scorers = {name: score for name, score in gradebook.items() if score >= 90}
print(f"Mejores puntajes: {high_scorers}")

# PASO 4: Contar con diccionarios.
# El patron contador usa get(clave, 0) para inicializar el conteo en 0.
text = "the quick brown fox jumps over the lazy dog"
word_counts = {}
for word in text.split():
    word_counts[word] = word_counts.get(word, 0) + 1
print(f"\nConteo de palabras: {word_counts}")

# La alternativa elegante es defaultdict: inicializa solo con el int(0).
from collections import defaultdict
counts = defaultdict(int)
for word in text.split():
    counts[word] += 1
print(f"Con defaultdict: {dict(counts)}")

# PASO 5: Diccionarios anidados para datos de ventas.
# Sumamos las ventas de cada producto a traves de todos los trimestres.
sales = {
    "Q1": {"product_a": 1200, "product_b": 800, "product_c": 1500},
    "Q2": {"product_a": 1350, "product_b": 750, "product_c": 1600},
    "Q3": {"product_a": 1100, "product_b": 900, "product_c": 1450},
}

product_totals = defaultdict(int)
for quarter, products in sales.items():
    for product, amount in products.items():
        product_totals[product] += amount

print(f"\nVentas totales por producto: {dict(product_totals)}")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Creamos, accedimos y actualizamos diccionarios (incluidos anidados).")
print("Construimos diccionarios por comprension y contamos con get/defaultdict.")
```