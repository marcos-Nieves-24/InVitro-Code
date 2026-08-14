# Assignment: Agregación de datos con diccionarios

## Objetivos

- Usar diccionarios para la organización de datos y la búsqueda
- Implementar dictionary comprehensions
- Usar defaultdict y Counter para tareas especializadas
- Anidar diccionarios para datos estructurados

## Instrucciones

Creá un script de Python `sales_analyzer.py` que:

1. **Datos de ventas**: Creá un diccionario con los nombres de los productos como claves y una lista de ventas mensuales como valores.

2. **Funciones de análisis**:
   - `total_sales(sales_data)` — devuelve un dict de producto → ventas totales
   - `average_sales(sales_data)` — devuelve un dict de producto → promedio de ventas mensuales
   - `top_product(sales_data)` — devuelve el nombre del producto con mayores ventas totales
   - `monthly_totals(sales_data)` — devuelve una lista de ventas totales por mes
   - `products_above_threshold(sales_data, threshold)` — devuelve una lista de productos por encima del umbral

3. **Informe**: Generá un informe formateado con todas las estadísticas.

## Datos iniciales

```python
sales_data = {
    "WidgetA": [1200, 1350, 1100, 1400, 1250, 1300, 1150, 1420, 1280, 1350, 1400, 1380],
    "WidgetB": [800, 750, 900, 850, 780, 820, 790, 860, 840, 810, 830, 870],
    "WidgetC": [1500, 1600, 1450, 1550, 1480, 1520, 1490, 1580, 1510, 1570, 1530, 1560],
    "WidgetD": [500, 520, 480, 550, 510, 530, 490, 540, 505, 525, 515, 535],
}
```

## Entregables

- `sales_analyzer.py`
- Salida formateada de todos los resultados del análisis

## Rúbrica de evaluación

| Criterio | Excelente (4 pts) | Bueno (3 pts) | Necesita mejorar (1-2 pts) |
|----------|-------------------|--------------|-----------------------------|
| Uso de diccionarios | Uso eficaz y apropiado | Mayormente apropiado | Uso deficiente |
| Funciones | Todas las funciones correctas, reutilizables | La mayoría correctas | Faltan funciones |
| Comprehensions | Usadas donde corresponde | Usadas pero innecesarias | No usadas |
| Salida | Informe claro y formateado | Adecuada | Difícil de leer |
| Calidad del código | PEP 8, comentado, limpio | Aceptable | Mala |

## Tiempo estimado

60 minutos
