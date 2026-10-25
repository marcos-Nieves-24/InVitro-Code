
Module: 3
Lesson Number: 8
Lesson Title: Clustering (K Means)
Estimated Duration: 90 minutos
Prerequisites: Lección 1 (Estadística Descriptiva), Lección 5 (Relaciones)
Learning Objectives:
  Explicar el algoritmo de clustering K Means y su intuición
  Determinar el número óptimo de clusters usando el método del codo y el puntaje de silueta
  Implementar clustering K Means usando sklearn.cluster.KMeans
  Visualizar resultados de clustering con PCA
  Interpretar las características de los clusters
Keywords: K Means, clustering, método del codo, puntaje de silueta, aprendizaje no supervisado, centroide
Difficulty: Intermedio
Programming Concepts: sklearn.cluster.KMeans, numpy, pandas, matplotlib
Mathematical Concepts: distancia euclídea, inercia, suma de cuadrados intra cluster
Machine Learning Concepts: aprendizaje no supervisado, clustering, segmentación
Datasets Used: iris, pingüinos, clientes de centro comercial (sintético)
Notebook: 08_clustering.ipynb
Assignment: clustering_assignment.md
Quiz: clustering_quiz.md


<Section number={1} title="Agrupar sin etiquetas" eyebrow="INICIO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Hasta ahora trabajamos con datos etiquetados, pero la mayoría del mundo real no los tiene.",
    "Clustering agrupa puntos similares sin conocer las categorías de antemano.",
    "En biotecnología agrupa pacientes por perfiles de expresión; en SaaS, segmenta usuarios.",
    "K Means es el algoritmo de aprendizaje no supervisado más popular porque es simple y rápido.",
  ]}
/>

<MascotMessage mood="thinking">
Hasta ahora trabajamos con datos etiquetados. Pero en el mundo real, la mayoría de los datos no tienen etiquetas. ¿Cómo encuentras grupos naturales? K Means clustering: el algoritmo de aprendizaje no supervisado más popular.
</MascotMessage>

Clustering agrupa puntos similares sin conocer las categorías de antemano. En biotecnología, agrupa pacientes por perfiles de expresión génica. En SaaS, segmenta usuarios por comportamiento. En marketing, encuentra grupos de clientes con patrones de compra similares.

</RevealSequence>

</Section>

<Section number={2} title="Cómo funciona K Means" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "K Means pone k imanes (centroides) en los datos y cada punto se adhiere al imán más cercano.",
    "Luego cada imán se mueve al promedio de los puntos que atrajo.",
    "Se repite hasta que nada cambia: los centroides convergen a los centros reales de grupo.",
    "El algoritmo minimiza la inercia: distancia cuadrada intra cluster.",
  ]}
/>

<ConceptCard variant="definition">
**Algoritmo K Means**:

1. Elegir k (cantidad de clusters)
2. Inicializar k centroides aleatoriamente
3. Asignar cada punto al centroide más cercano
4. Recalcular centroides cómo la media de sus puntos asignados
5. Repetir pasos 3 a 4 hasta convergencia
</ConceptCard>

<ConceptCard variant="key idea">
K Means minimiza la **inercia**: suma de distancias al cuadrado de cada punto a su centroide. Es cómo poner k "imanes" en los datos qué atraen a los puntos más cercanos, y luego mover los imanes al centro de los puntos qué atrajeron.
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="¿Cuántos clusters? Elbow + Silhouette" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El método del codo mira la inercia: cada k adicional reduce la distancia intra cluster.",
    "La silueta mide cohesión y separación simultáneamente; mayor es mejor.",
    "Usar ambos juntos te da confianza: si coinciden en k, esa es tu respuesta.",
    "Si difieren, mirá los clusters proyectados con PCA antes de decidir.",
  ]}
/>

<ConceptCard variant="key idea">
Método del codo vs Puntaje de silueta:
- **Qué mide**: codo → inercia (distancia intra cluster); silueta → cohesión + separación de clusters
- **Rango**: codo siempre decrece con k; silueta va de [-1, 1], >0.5 = buen clustering
- **Cómo elegir k**: codo busca el aplanamiento; silueta elige el k con mayor score
- **Ventaja**: codo simple e intuitivo; silueta considera cohesión y separación
- **Limitación**: codo sin codo claro; silueta costosa computacionalmente con muchos datos
</ConceptCard>

<CalloutInfo>
Siempre usa **ambos métodos juntos**. Si el codo y la silueta coinciden en k, tienes alta confianza. Si difieren, explora visualmente los clusters con PCA para decidir.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={4} title="K Means en código" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "El código recorre varios k, calcula inercia y silueta para cada uno.",
    "Los gráficos lado a lado hacen visible el codo y el máximo de silueta.",
    "El mejor k se elige donde silueta es máxima, con el codo como confirmación.",
    "Siempre estandarizar primero y fijar random_state para reproducibilidad.",
  ]}
/>

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

</RevealSequence>

</Section>

<Section number={5} title="Visualizando clusters con PCA" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Cuando hay más de 3 features, PCA proyecta los clusters a 2D.",
    "Los centroides rojos marcan los centros descubiertos por el algoritmo.",
    "La proyección resume la estructura, pero puede ocultar solapamientos en otras dimensiones.",
    "Por eso siempre complementamos con silueta y el perfil por cluster.",
  ]}
/>

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
plt.title('K Means Clusters (PCA 2D)')
plt.legend(); plt.show()
```

<ChoiceQuestion
  question="¿Por qué visualizamos clusters en 2D con PCA en vez de usar 2 features originales? ¿Qué podríamos perder?"
  moduleSlug="estadistica"
  lessonSlug="lesson08_clustering"
  blockId="reflection l08 kmeans pca"
  allowContinueOnIncorrect
  explanation="PCA proyecta más de 3 features a 2D preservando la máxima varianza; puede ocultar solapamientos entre clusters en otras dimensiones, por eso se complementa con silhouette score y el perfil por cluster."
  options={[
    { id: "a", label: "Porque con más de 3 features no se grafica directo y PCA conserva máxima varianza, pero puede ocultar solapamientos; se complementa con silhouette y perfil por cluster", correct: true, feedback: "¡Exacto! La proyección resume la estructura, pero no reemplaza al análisis completo." },
    { id: "b", label: "Porque PCA elimina por completo la pérdida de información al pasar a 2D", correct: false, feedback: "PCA reduce dimensionalidad: siempre hay alguna pérdida, aunque sea mínima." },
    { id: "c", label: "Porque 2 features originales siempre separan mejor los clusters que PCA", correct: false, feedback: "Las features originales pueden no concentrar la varianza explicativa; PCA elige la dirección de máxima varianza." },
    { id: "d", label: "Porque una visualización 2D reemplaza al silhouette score", correct: false, feedback: "La visualización es exploratoria; silhouette cuantifica la calidad de clustering." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={6} title="Biotecnología: subtipos de cáncer" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "K Means puede descubrir subtipos de cáncer sin etiquetas previas.",
    "Simulamos tres subtipos con perfiles de expresión diferenciados.",
    "El silueta score evalúa la calidad del agrupamiento resultante.",
    "En la práctica, este enfoque llevó al descubrimiento de subtipos moleculares.",
  ]}
/>

K Means puede descubrir subtipos de cáncer a partir de perfiles de expresión génica sin conocerlos de antemano:

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

</RevealSequence>

</Section>

<Section number={7} title="Limitaciones de K Means" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "K Means asume clusters esféricos y de tamaño similar.",
    "También necesitas especificar k por adelantado.",
    "Es sensible a la inicialización, aunque K Means++ lo mitiga.",
    "Y siempre hay que estandarizar: la escala distorsiona las distancias.",
  ]}
/>

<ConceptCard variant="warning">
**K Means asume:**
- Clusters **esféricos** (misma varianza en todas direcciones)
- Clusters de **tamaño similar**
- **Necesitas especificar k** (no lo descubre solo)
- **Sensible a la inicialización** (K Means++ mitiga esto)
- **SIEMPRE estandarizar** antes (sensible a la escala)
</ConceptCard>

<CalloutInfo>
Si tus clusters no son esféricos (ej. forma de medialuna), K Means falla. Ahí necesitas DBSCAN o clustering jerárquico. Pero K Means es rápido, simple, y sorprendentemente efectivo para la mayoría de casos.
</CalloutInfo>

</RevealSequence>

</Section>

<Section number={8} title="Checkpoint" eyebrow="EVALUACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Antes de seguir, asegurate de entender dos decisiones: cuántos clusters y cuándo K Means no sirve.",
    "El codo y la silueta miden cosas distintas, por eso conviene cruzarlos.",
    "Y K Means asume clusters esféricos: si tus grupos tienen forma de medialuna, los parte.",
    "Reconocer ese límite es lo que separa a quien usa la herramienta de quien la entiende.",
  ]}
/>

<ChoiceQuestion
  question="El método del codo marca k=2 y el puntaje de silueta marca k=5. ¿Qué hacés?"
  moduleSlug="estadistica"
  lessonSlug="lesson08_clustering"
  blockId="choice estadistica l08 rev 1"
  allowContinueOnIncorrect
  explanation="El codo mira la inercia, que siempre decrece, así que tiende a marcar pocos clusters. La silueta premia la separación, y con muchos grupos pequeños también da scores altos. Cuando discrepan no hay respuesta automática: hay que proyectar los clusters con PCA y mirarlos."
  options={[
    { id: "a", label: "Proyectar los clusters con PCA y mirarlos: con k=5 la silueta probablemente está fragmentando grupos reales", correct: true, feedback: "Exacto. Ninguno de los dos métodos gana por defecto; la decisión se toma mirando la estructura." },
    { id: "b", label: "Quedarse con k=2 porque el codo es más simple de calcular", correct: false, feedback: "Que sea más barato de calcular no lo hace más correcto: el codo marca el aplanamiento, no la calidad del agrupamiento." },
    { id: "c", label: "Quedarse con k=5 porque la silueta siempre gana", correct: false, feedback: "La silueta también engaña: con muchos clusters tiny, la separación parece alta aunque los grupos sean fragmentos de uno real." },
    { id: "d", label: "Promediar los dos valores y redondear a k=3", correct: false, feedback: "El número de clusters no se promedia: es una decisión estructural sobre los datos." },
  ]}
/>

<ChoiceQuestion
  question="Tus datos forman dos grupos con forma de medialuna, bien separados entre sí. ¿Qué hace K Means?"
  moduleSlug="estadistica"
  lessonSlug="lesson08_clustering"
  blockId="choice estadistica l08 rev 2"
  allowContinueOnIncorrect
  explanation="K Means asigna cada punto al centroide más cercano y minimiza la inercia dentro de grupos esféricos. Una medialuna no es esférica: el algoritmo termina partiéndola en trozos, y los centroides caen en la zona vacía entre las dos medias lunas. Para esas formas hacen falta DBSCAN o clustering jerárquico."
  options={[
    { id: "a", label: "Parte cada medialuna en trozos, porque asume clusters esféricos; para esas formas hay que usar DBSCAN o jerárquico", correct: true, feedback: "Correcto. Reconocer el supuesto esférico es la clave: el fallo no es del código sino del modelo." },
    { id: "b", label: "Los separa perfectamente, porque minimizar la inercia siempre encuentra la estructura real", correct: false, feedback: "Minimizar la inercia es correcto solo dentro de la familia esférica. Fuera de ella, el óptimo es un óptimo equivocado." },
    { id: "c", label: "Hay que subir k hasta que cada medialuna quede en un solo cluster", correct: false, feedback: "Subir k parte más, no menos: nunca reconstruye una medialuna que ya está partida." },
    { id: "d", label: "Estandarizar las variables lo arregla", correct: false, feedback: "Estandarizar es obligatorio, pero no cambia la forma de los datos: el problema es geométrico, no de escala." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={9} title="Términos clave" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Cerramos la lección con el vocabulario esencial del clustering.",
    "K Means, centroide e inercia son el núcleo del algoritmo.",
    "El codo y la silueta son las dos herramientas para elegir k.",
    "El aprendizaje no supervisado descubre estructura sin etiquetas.",
  ]}
/>

<ConceptCard variant="key idea">
Términos clave:
- **K Means**: Algoritmo qué agrupa puntos en k clusters alrededor de centroides
- **Centroide**: Punto central de un cluster (media de sus miembros)
- **Inercia**: Suma de distancias² intra cluster   K Means la minimiza
- **Método del Codo**: Técnica para elegir k: buscar aplanamiento de inercia
- **Silhouette Score**: Métrica de calidad: cohesión + separación [-1,1]
- **K Means++**: Inicialización inteligente qué dispersa centroides iniciales
- **No Supervisado**: Aprendizaje sin etiquetas   el algoritmo descubre la estructura
</ConceptCard>

</RevealSequence>

</Section>

<Section number={10} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Primer algoritmo no supervisado cubierto: simple pero poderoso.",
    "PCA para visualizar y silueta para validar son tu toolkit de clustering.",
    "La próxima lección cierra el módulo con evaluación de modelos.",
    "Crear modelos es fácil; saber si son buenos es lo difícil.",
  ]}
/>

<MascotMessage mood="celebrating">
Primer algoritmo de ML no supervisado cubierto. K Means es simple pero poderoso. Con PCA para visualizar y una métrica de silueta para validar, dispones de un toolkit completo de clustering.
</MascotMessage>

**En la Lección 9** cerramos el módulo con **Evaluación de Modelos**: train/test split, validación cruzada, y todas las métricas (MAE, MSE, RMSE, R²). Porque crear modelos es fácil   saber si son buenos es lo difícil.

</RevealSequence>

</Section>
