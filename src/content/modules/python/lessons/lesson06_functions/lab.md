```python
# =========================================================================
# LAB 6: Escribir funciones
# -------------------------------------------------------------------------
# Practicamos la definicion de funciones, parametros, valores por defecto,
# valores de retorno, lambdas y el scope (alcance) de las variables.
# =========================================================================

# PASO 1: Funcion basica.
# Definimos una funcion con def, un parametro (c) y un retorno.
def celsius_to_fahrenheit(c):
    """Convierte grados Celsius a Fahrenheit: F = C * 9/5 + 32."""
    return c * 9 / 5 + 32

print(f"0°C = {celsius_to_fahrenheit(0)}°F")
print(f"37°C = {celsius_to_fahrenheit(37)}°F")
print(f"100°C = {celsius_to_fahrenheit(100)}°F")

# PASO 2: Multiples parametros y multiples valores de retorno.
# La funcion devuelve una tupla con el BMI y su categoria.
def bmi_category(weight, height):
    """Calcula el indice de masa corporal y devuelve (bmi, categoria)."""
    bmi = weight / (height ** 2)
    if bmi < 18.5:
        category = "underweight"
    elif bmi < 25:
        category = "normal"
    elif bmi < 30:
        category = "overweight"
    else:
        category = "obese"
    return bmi, category

bmi, cat = bmi_category(70, 1.75)
print(f"\nBMI: {bmi:.1f}, Categoria: {cat}")

# PASO 3: Parametros por defecto.
# Si el argumento no se pasa, se usa el valor por defecto definido en la
# firma de la funcion.
def create_report(patient_name, age, blood_type="Unknown"):
    """Genera una linea de reporte para un paciente."""
    return f"Patient: {patient_name}, Age: {age}, Blood Type: {blood_type}"

print(f"\n{create_report('Alice', 30, 'A+')}")
print(create_report("Bob", 25))  # usa el valor por defecto

# PASO 4: Practica con lambdas.
# Una lambda es una funcion anonima de una sola expresion.
numbers = [5, 2, 8, 1, 9, 3]
sorted_desc = sorted(numbers, key=lambda x: -x)
print(f"\nOrden descendente: {sorted_desc}")

evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"Pares: {evens}")

squares = list(map(lambda x: x ** 2, numbers))
print(f"Cuadrados: {squares}")

# PASO 5: Experimento de scope (alcance).
# Una variable definida dentro de la funcion NO modifica la global.
x = "global"

def test_scope():
    x = "local"
    print(f"Dentro de la funcion: {x}")

test_scope()
print(f"Fuera de la funcion: {x}")

# Con la palabra clave global podemos modificar la variable global.
def modify_global():
    global x
    x = "modified"

modify_global()
print(f"Despues de modificar: {x}")

# PASO 6: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Definimos funciones con def y docstrings explicativos.")
print("Devolvimos multiples valores (bmi, categoria) en una tupla.")
print("Usamos parametros por defecto, lambdas y la palabra global.")
```