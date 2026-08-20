# Assignment: Análisis de datos de comercio electrónico con Pandas

## Objetivos

- Cargar y explorar datos con Pandas
- Realizar limpieza y transformación de datos
- Usar groupby para agregación y análisis
- Fusionar múltiples DataFrames
- Generar un informe resumido

## Instrucciones

Creá un script de Python `ecommerce_analysis.py` que:

1. **Cree datos sintéticos** (o los cargue desde CSV): generá tres DataFrames:
   - `customers`: customer_id, name, age, city, signup_date
   - `orders`: order_id, customer_id, order_date, amount, product_category
   - `products`: product_id, product_name, category, price, stock

2. **Limpieza de datos**:
   - Revisá los valores nulos y manejalos
   - Eliminá los pedidos duplicados
   - Convertí las columnas de fecha a datetime
   - Eliminá los pedidos con amount ≤ 0

3. **Análisis**:
   - Ingresos totales por categoría de producto
   - Tendencia de ingresos mensual
   - Top 10 de clientes por gasto total
   - Valor promedio de pedido por ciudad
   - Segmentación de clientes (nuevo/regular/vip según la cantidad de pedidos)

4. **Fusión**: uní los clientes con los pedidos para crear una vista completa

5. **Informe**: imprimí un resumen formateado de todos los hallazgos

## Código inicial

```python
import pandas as pd
import numpy as np

# Generate synthetic data
np.random.seed(42)
```

