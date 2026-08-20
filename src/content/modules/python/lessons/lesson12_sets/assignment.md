# Assignment: Análisis de conjuntos de genes

## Objetivos

- Usar conjuntos para el análisis de datos biológicos
- Implementar operaciones de conjuntos (unión, intersección, diferencia)
- Aplicar la similitud de Jaccard para comparar conjuntos
- Usar conjuntos para pruebas de pertenencia eficientes

## Instrucciones

Creá un script de Python `gene_set_analysis.py` que:

1. **Conjuntos de genes**: Creá al menos 5 conjuntos que representen genes expresados en distintos tejidos o experimentos.

2. **Funciones**:
   - `jaccard(set1, set2)` — calculá la similitud de Jaccard
   - `common_genes(*sets)` — encontrá los genes comunes a todos los conjuntos de entrada
   - `unique_genes(*sets)` — encontrá los genes exclusivos de cada conjunto (devolvé una lista de conjuntos)
   - `gene_recommendations(known_genes, all_sets, threshold=0.5)` — dado un conjunto de genes conocidos, encontrá qué otros conjuntos comparten al menos `threshold` de similitud de Jaccard

3. **Análisis**: Imprimí una matriz de similitud que muestre la similitud de Jaccard entre todos los pares.

## Datos iniciales

```python
brain = {"BRCA1", "TP53", "EGFR", "MYC", "ALK", "GATA2", "FOXA1"}
liver = {"TP53", "KRAS", "MYC", "FOXA1", "HNF4A", "ALB", "CYP3A4"}
heart = {"BRCA1", "MYC", "GATA2", "NKX2-5", "TBX5", "MYH6", "MYH7"}
kidney = {"TP53", "EGFR", "KRAS", "GATA2", "FOXA1", "HNF4A", "UMOD"}
lung = {"BRCA1", "TP53", "EGFR", "KRAS", "ALK", "MYC", "NKX2-1"}
```

