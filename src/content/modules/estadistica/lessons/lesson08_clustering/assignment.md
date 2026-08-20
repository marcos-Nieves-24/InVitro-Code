# Assignment: Segmentación de clientes con K-Means

## Objetivos

- Segmentar clientes usando clustering K-Means
- Determinar la cantidad óptima de segmentos
- Interpretar y perfilar cada segmento
- Proporcionar recomendaciones de negocio

## Instrucciones

1. Generá o cargá datos de clientes. Usá la función `make_blobs` para crear datos sintéticos de clientes con 5 segmentos basados en:
   - Ingreso anual
   - Puntaje de gasto
   - Cantidad de compras
   - Valor promedio de compra

2. **Preprocesamiento**:
   - Estandarizá todos los features
   - Explicá por qué la estandarización es necesaria

3. **Búsqueda del k óptimo**:
   - Probá k de 2 a 10
   - Graficá la curva del codo y los silhouette scores
   - Determiná el k óptimo y justificá tu elección

4. **Clustering**:
   - Aplicá K-Means con el k óptimo
   - Creá una visualización con PCA coloreada por cluster
   - Graficá los centroides

5. **Perfilado de segmentos**:
   - Calculá los valores medios de los features por cluster
   - Creá una tabla de perfil
   - Nombra cada segmento (por ejemplo, "High-Value Customers", "Bargain Shoppers")
   - Escribí una descripción de un párrafo para cada segmento

6. **Recomendaciones de negocio**:
   - Basándote en los perfiles de los segmentos, sugerí 3 estrategias de marketing
   - Explicá cómo cada estrategia apunta a segmentos específicos

