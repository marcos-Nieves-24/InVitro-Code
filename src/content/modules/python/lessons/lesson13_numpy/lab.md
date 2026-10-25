```python
# =========================================================================
# LAB 13: Fundamentos de NumPy
# -------------------------------------------------------------------------
# Practicamos la creacion de arrays, el indexado y rebanado, las funciones
# universales (ufunc), el broadcasting y las operaciones estadisticas.
# =========================================================================

# PASO 1: Creacion de arrays.
# NumPy es la biblioteca fundamental del calculo cientifico en Python:
# sus arrays permiten operaciones vectorizadas (sin bucles explicitos).
import numpy as np

a = np.array([1, 2, 3, 4, 5])     # desde una lista
b = np.zeros((3, 4))              # matriz de ceros
c = np.ones((2, 5))               # matriz de unos
d = np.eye(4)                     # matriz identidad
e = np.arange(0, 20, 2)           # secuencia con paso
f = np.linspace(0, 1, 10)         # 10 puntos equiespaciados entre 0 y 1
g = np.random.randn(3, 3)         # numeros aleatorios con distribucion normal

print(f"arange(0, 20, 2): {e}")
print(f"linspace(0, 1, 10): {f}")
print(f"Matriz identidad:\n{d}")
print(f"Aleatorios normal (3x3), primeros valores: {g[0, :2].round(2)}")

# PASO 2: Indexado y rebanado (slicing).
# Los arrays soportan la misma notacion de rebanadas que las listas, pero
# en multiples dimensiones: arr[fila, columna].
matrix = np.arange(16).reshape(4, 4)
print(f"\nMatriz 4x4:\n{matrix}")
print(f"Elemento [2, 3]: {matrix[2, 3]}")
print(f"Primeras 2 filas, columnas 1-3:\n{matrix[:2, 1:4]}")
print(f"Cada dos elementos: {matrix[::2, ::2]}")
print(f"Ultima columna: {matrix[:, -1]}")

# PASO 3: Funciones universales (ufunc).
# Operan elemento a elemento sobre todo el array a la vez.
arr = np.array([1, 4, 9, 16, 25])
print(f"\nOriginal: {arr}")
print(f"sqrt: {np.sqrt(arr)}")
print(f"log: {np.log(arr)}")
print(f"abs(-arr): {np.abs(-arr)}")

angles = np.array([0, np.pi / 2, np.pi])
print(f"sin(angles): {np.sin(angles)}")

# PASO 4: Broadcasting.
# NumPy "estira" automaticamente el array mas pequeno para operar con el
# mas grande, sin copiar datos: esta es la clave de su velocidad.
matrix = np.ones((4, 3))
vector = np.array([1, 2, 3])
result = matrix + vector
print(f"\nMatriz (4x3) + vector (3):\n{result}")

# Tambien podemos escalar cada COLUMNA con un factor distinto.
factors = np.array([0.5, 1.5, 2.0])
scaled = matrix * factors
print(f"Matriz * factores por columna:\n{scaled}")

# PASO 5: Operaciones estadisticas.
# Calculamos estadisticas por columnas (axis=0) o por filas (axis=1).
data = np.random.randn(1000, 5)
print(f"\nForma del array: {data.shape}")
print(f"Media por columna: {data.mean(axis=0).round(3)}")
print(f"Desviacion estandar por columna: {data.std(axis=0).round(3)}")
print(f"Media global: {data.mean():.3f}")

# Centramos los datos restando la media de cada columna.
centered = data - data.mean(axis=0)
print(f"Media de los datos centrados (~0): {centered.mean(axis=0).round(12)}")

# PASO 6: Aplicacion biotecnologica - normalizacion de expresion genica.
# Normalizamos mediciones de expresion a z-scores: (x - media) / desviacion.
expr = np.array([2.5, 4.1, 3.3, 7.8, 5.0])
z = (expr - expr.mean()) / expr.std()
print(f"\nExpresion: {expr}")
print(f"Z-scores: {z.round(2)}")

# PASO 7: Resumen del laboratorio.
print("\n--- Resumen ---")
print("Creamos arrays con array, zeros, ones, eye, arange y linspace.")
print("Indexamos y rebanamos en multiples dimensiones.")
print("Las ufunc y el broadcasting operan sin bucles explicitos.")
```