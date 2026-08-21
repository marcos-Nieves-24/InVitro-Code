# Assignment: Segmentación de clientes con K-Means

## Objetivos

- Segmentar clientes usando clustering K-Means
- Determinar la cantidad óptima de segmentos
- Interpretar y perfilar cada segmento
- Proporcionar recomendaciones de negocio

## Instrucciones

1. Genera o carga datos de clientes. Usa la función `make_blobs` para crear datos sintéticos de clientes con 5 segmentos basados en:
   - Ingreso anual
   - Puntaje de gasto
   - Cantidad de compras
   - Valor promedio de compra

2. **Preprocesamiento**:
   - Estandariza todos los features
   - Explica por qué la estandarización es necesaria

3. **Búsqueda del k óptimo**:
   - Prueba k de 2 a 10
   - Grafica la curva del codo y los silhouette scores
   - Determina el k óptimo y justifica tu elección

4. **Clustering**:
   - Aplica K-Means con el k óptimo
   - Crea una visualización con PCA coloreada por cluster
   - Grafica los centroides

5. **Perfilado de segmentos**:
   - Calcula los valores medios de los features por cluster
   - Crea una tabla de perfil
   - Nombra cada segmento (por ejemplo, "High-Value Customers", "Bargain Shoppers")
   - Escribe una descripción de un párrafo para cada segmento

6. **Recomendaciones de negocio**:
   - Basándote en los perfiles de los segmentos, sugiere 3 estrategias de marketing
   - Explica cómo cada estrategia apunta a segmentos específicos

