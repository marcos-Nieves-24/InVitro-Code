# Assignment: Procesamiento de datos con bucles

## Objetivos

- Aplicar bucles for y while a datos del mundo real
- Usar break y continue para el control de flujo
- Implementar bucles anidados para procesamiento multidimensional
- Usar enumerate() y zip() para iteración pitónica

## Instrucciones

Crea un script de Python `data_processor.py` que:

1. **Análisis de expresión génica**: Dada una lista de valores de expresión génica y un umbral, cuenta cuántos están por encima del umbral usando un bucle for.

2. **Filtrado de calidad**: Dada una lista de secuencias de ADN, filtra las que sean más cortas que una longitud mínima. Registra cuántas fueron filtradas.

3. **Promedio acumulado**: Usando un bucle while, calcula el promedio acumulado de una lista de números hasta que aparezca un número negativo (después detén con break).

4. **Operaciones con matrices**: Dada una matriz de 3×3 (lista de listas), calcula la suma de cada fila y cada columna usando bucles anidados.

5. **Métricas acumulativas**: Dados los ingresos mensuales, calcula los ingresos acumulados y las tasas de crecimiento mes a mes.

## Datos iniciales

```python
gene_expression = [2.5, 0.8, 3.2, 1.1, 4.0, 0.3, 2.1, 1.8]
dna_sequences = ["ATCG", "GCTA", "T", "GGCC", "A", "CGATCG", "TT"]
running_data = [10, 15, 20, 25, 30, -1, 40, 50]
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
monthly_revenue = [12000, 13500, 12800, 14200, 15100, 14800]
```

