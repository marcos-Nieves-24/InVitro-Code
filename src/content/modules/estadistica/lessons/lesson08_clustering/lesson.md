---
Module: 3
Lesson Number: 8
Lesson Title: Clustering (K-Means)
Estimated Duration: 90 minutos
Prerequisites: Lección 1 (Estadística Descriptiva), Lección 5 (Relaciones)
Learning Objectives:
  - Explicar el algoritmo de clustering K-Means y su intuición
  - Determinar el número óptimo de clusters usando el método del codo y el puntaje de silueta
  - Implementar clustering K-Means usando sklearn.cluster.KMeans
  - Visualizar resultados de clustering con PCA
  - Interpretar las características de los clusters
Keywords: K-Means, clustering, método del codo, puntaje de silueta, aprendizaje no supervisado, centroide
Difficulty: Intermedio
Programming Concepts: sklearn.cluster.KMeans, numpy, pandas, matplotlib
Mathematical Concepts: distancia euclídea, inercia, suma de cuadrados intra-cluster
Machine Learning Concepts: aprendizaje no supervisado, clustering, segmentación
Datasets Used: iris, pingüinos, clientes de centro comercial (sintético)
Notebook: 08_clustering.ipynb
Assignment: clustering_assignment.md
Quiz: clustering_quiz.md
---

<Section number={1} title="Agrupar sin etiquetas" eyebrow="INICIO">

<MascotMessage mood="thinking">
Hasta ahora trabajamos con datos etiquetados. Pero en el mundo real, la mayoría de los datos no tienen etiquetas. ¿Cómo encuentras grupos naturales? K-Means clustering: el algoritmo de aprendizaje no supervisado más popular.
</MascotMessage>

Clustering agrupa puntos similares sin conocer las categorías de antemano. En biotecnología, agrupa pacientes por perfiles de expresión génica. En SaaS, segmenta usuarios por comportamiento. En marketing, encuentra grupos de clientes con patrones de compra similares.

</Section>

<Section number={2} title="Cómo funciona K-Means" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
**Algoritmo K-Means**:

1. Elegir k (cantidad de clusters)
2. Inicializar k centroides aleatoriamente
3. Asignar cada punto al centroide más cercano
4. Recalcular centroides cómo la media de sus puntos asignados
5. Repetir pasos 3-4 hasta convergencia
</ConceptCard>

<ConceptCard variant="key-idea">
K-Means minimiza la **inercia**: suma de distancias al cuadrado de cada punto a su centroide. Es cómo poner k "imanes" en los datos qué atraen a los puntos más cercanos, y luego mover los imanes al centro de los puntos qué atrajeron.
</ConceptCard>

</Section>

<Section number={3} title="¿Cuántos clusters? Elbow + Silhouette" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Qué mide", left: "Inercia (distancia intra-cluster)", right: "Cohesión + separación de clusters" },
    { feature: "Rango", left: "Siempre decrece con k", right: "[-1, 1]; >0.5 = buen clustering" },
    { feature: "Cómo elegir k", left: "Buscar el 'codo' dónde la mejora se aplana", right: "Elegir k con mayor silhouette score" },
    { feature: "Ventaja", left: "Simple, intuitivo", right: "Considera tanto cohesión cómo separación" },
    { feature: "Limitación", left: "No siempre hay un codo claro", right: "Costoso computacionalmente con muchos datos" },
  ]}
/>

<CalloutInfo>
Siempre usa **ambos métodos juntos**. Si el codo y la silueta coinciden en k, tienes alta confianza. Si difieren, explora visualmente los clusters con PCA para decidir.
</CalloutInfo>

</Section>

<Section number={4} title="K-Means en código" eyebrow="INTERACTIVA">

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

iris = sns.load_dataset('iris')
X = StandardScaler().fit_transform(iris.drop('species', axis=1))

# Elbow method
inertias = []
silhouettes = []
K_range = range(2, 10)

for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X, labels))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12,4))
ax1.plot(K_range, inertias, 'o-')
ax1.set_xlabel('k'); ax1.set_ylabel('Inercia')
ax1.set_title('Método del Codo')
ax2.plot(K_range, silhouettes, 'o-')
ax2.set_xlabel('k'); ax2.set_ylabel('Silhouette Score')
ax2.set_title('Puntaje de Silueta')
plt.tight_layout(); plt.show()

# Mejor k
best_k = K_range[np.argmax(silhouettes)]
print(f"Mejor k según silueta: {best_k}")
```

</Section>

<Section number={5} title="Visualizando clusters con PCA" eyebrow="INTERACTIVA">

```python
from sklearn.decomposition import PCA

kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
labels = kmeans.fit_predict(X)

# Reducir a 2D para visualizar
X_pca = PCA(n_components=2).fit_transform(X)

plt.figure(figsize=(8,6))
scatter = plt.scatter(X_pca[:,0], X_pca[:,1], c=labels, cmap='viridis', s=50)
plt.scatter(kmeans.cluster_centers_[:,0], kmeans.cluster_centers_[:,1], 
            c='red', marker='X', s=200, label='Centroides')
plt.xlabel('PC1'); plt.ylabel('PC2')
plt.title('K-Means Clusters (PCA 2D)')
plt.legend(); plt.show()
```

<ReflectionCheck
  blockId="reflection-l08-kmeans-pca"
  moduleSlug="estadistica"
  lessonSlug="lesson08_clustering"
  prompt="¿Por qué visualizamos clusters en 2D con PCA en vez de usar 2 features originales? ¿Qué podríamos perder?"
  answer="Porque con >3 features no podemos graficar directamente. PCA proyecta a 2D preservando la máxima varianza, mostrando la estructura de clusters en un sólo gráfico. Pero perdemos información: clusters qué se ven separados en 2D PCA podrían solaparse en otras dimensiones. Por eso siempre complementamos con silhouette score y el perfil de cada cluster (media de cada feature por cluster)."
/>

</Section>

<Section number={6} title="Biotecnología: subtipos de cáncer" eyebrow="INTERACTIVA">

K-Means puede descubrir subtipos de cáncer a partir de perfiles de expresión génica sin conocerlos de antemano:

```python
# Simular 3 subtipos de cáncer con 50 genes cada uno
np.random.seed(42)
subtype_A = np.random.normal(loc=[5]*20+[2]*30, scale=1, size=(30,50))
subtype_B = np.random.normal(loc=[2]*20+[5]*20+[2]*10, scale=1, size=(30,50))
subtype_C = np.random.normal(loc=[2]*40+[5]*10, scale=1, size=(30,50))
X_cancer = np.vstack([subtype_A, subtype_B, subtype_C])

kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
labels = kmeans.fit_predict(StandardScaler().fit_transform(X_cancer))
print(f"Silhouette score: {silhouette_score(X_cancer, labels):.3f}")
```

<CalloutInfo>
En la práctica, clustering de expresión génica ha llevado al descubrimiento de subtipos moleculares de cáncer (cómo los subtipos Luminal A/B, HER2, Basal en cáncer de mama) qué hoy guían decisiones terapéuticas.
</CalloutInfo>

</Section>

<Section number={7} title="Limitaciones de K-Means" eyebrow="CONCEPTO">

<ConceptCard variant="warning">
**K-Means asume:**
- Clusters **esféricos** (misma varianza en todas direcciones)
- Clusters de **tamaño similar**
- **Necesitas especificar k** (no lo descubre solo)
- **Sensible a la inicialización** (K-Means++ mitiga esto)
- **SIEMPRE estandarizar** antes (sensible a la escala)
</ConceptCard>

<CalloutInfo>
Si tus clusters no son esféricos (ej. forma de medialuna), K-Means falla. Ahí necesitas DBSCAN o clustering jerárquico. Pero K-Means es rápido, simple, y sorprendentemente efectivo para la mayoría de casos.
</CalloutInfo>

</Section>

<Section number={8} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["K-Means", "Algoritmo qué agrupa puntos en k clusters alrededor de centroides"],
    ["Centroide", "Punto central de un cluster (media de sus miembros)"],
    ["Inercia", "Suma de distancias² intra-cluster — K-Means la minimiza"],
    ["Método del Codo", "Técnica para elegir k: buscar aplanamiento de inercia"],
    ["Silhouette Score", "Métrica de calidad: cohesión + separación [-1,1]"],
    ["K-Means++", "Inicialización inteligente qué dispersa centroides iniciales"],
    ["No Supervisado", "Aprendizaje sin etiquetas — el algoritmo descubre la estructura"],
  ]}
  searchable={true}
  caption="Términos clave de clustering"
/>

</Section>

<Section number={9} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡Primer algoritmo de ML no supervisado dominado! K-Means es simple pero poderoso. Con PCA para visualizar y silhouette para validar, tienes un toolkit completo de clustering.
</MascotMessage>

**En la Lección 9** cerramos el módulo con **Evaluación de Modelos**: train/test split, validación cruzada, y todas las métricas (MAE, MSE, RMSE, R²). Porque crear modelos es fácil — saber si son buenos es lo difícil.

</Section>
