---
Module: 4
Lesson Number: 6
Lesson Title: Clustering K-Means
Estimated Duration: 75 minutos
Prerequisites: L1 (Fundamentos de ML)
Learning Objectives:
  - Explicar el algoritmo K-Means y sus pasos
  - Determinar el número óptimo de clústeres usando el método del codo y el puntaje de silueta
  - Implementar clustering K-Means con scikit-learn
  - Interpretar centros de clúster y asignaciones
  - Distinguir entre aprendizaje supervisado y no supervisado
Keywords: K-Means, clustering, método del codo, puntaje de silueta, inercia, aprendizaje no supervisado
Difficulty: Intermedio
Programming Concepts: sklearn.cluster.KMeans, sklearn.metrics.silhouette_score
Mathematical Concepts: distancia euclidiana, inercia, suma de cuadrados intra-clúster
Machine Learning Concepts: aprendizaje no supervisado, clustering, centroide
Datasets Used: make_blobs, iris (no supervisado), segmentación de clientes sintético
Notebook: notebook.ipynb
Assignment: assignment.md
Quiz: quiz.md
---

<Section number={1} title="Descubrir grupos sin etiquetas" eyebrow="INICIO">

<MascotMessage mood="thinking">
Hasta ahora siempre tenías etiquetas: sabías qué era un tumor maligno, qué cliente abandonó. Pero, ¿y si no tenés etiquetas? K-Means encuentra estructura donde no hay respuestas correctas — pura exploración.
</MascotMessage>

Hasta acá todo fue **aprendizaje supervisado**: tenías features (X) y etiquetas (y), y el modelo aprendía a predecir. Ahora entramos al territorio del **no supervisado**: solo tenés X. No hay "respuesta correcta". El objetivo es descubrir patrones, grupos, estructura oculta.

<ConceptCard variant="key-idea">
K-Means responde: "Dame K grupos y te digo qué puntos van juntos." Es simple, rápido, y sorprendentemente efectivo para segmentación de clientes, descubrimiento de subtipos de enfermedades, y compresión de imágenes.
</ConceptCard>

</Section>

<Section number={2} title="El algoritmo en 4 pasos" eyebrow="CONCEPTO">

1. **Elegí K:** ¿Cuántos grupos querés encontrar?
2. **Inicializá:** Poné K centroides en posiciones aleatorias
3. **Asigná:** Cada punto va al centroide más cercano (distancia euclidiana)
4. **Actualizá:** Mové cada centroide al promedio de los puntos que le asignaste
5. **Repetí 3-4** hasta que los centroides dejen de moverse

<CalloutInfo>
K-Means garantiza convergencia (los centroides eventualmente se estabilizan), pero el resultado depende de dónde empezaron los centroides. Por eso sklearn corre el algoritmo varias veces con inicializaciones distintas (`n_init=10`) y se queda con la mejor.
</CalloutInfo>

$$d(\mathbf{x}, \boldsymbol{\mu}_k) = \sqrt{\sum_{j=1}^{p}(x_j - \mu_{kj})^2}$$

El algoritmo minimiza la **inercia** (suma de distancias al cuadrado dentro de cada clúster):

$$\text{Inercia} = \sum_{k=1}^{K}\sum_{i \in C_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|^2$$

</Section>

<Section number={3} title="¿Cuántos clústeres? El problema de elegir K" eyebrow="CONCEPTO">

<ComparisonTable
  rows={[
    { feature: "Método del codo", left: "Graficás inercia vs K. Donde la curva hace \"codo\" (la mejora marginal se aplana), ese es tu K. Fácil de explicar, pero a veces el codo no es claro." },
    { feature: "Puntaje de silueta", left: "Mide qué tan similar es cada punto a su propio clúster vs. el clúster más cercano. Varía de -1 a 1. Más alto = mejor separación. Más objetivo que el codo." },
  ]}
/>

$$s(i) = \frac{b(i) - a(i)}{\max\{a(i), b(i)\}}$$

- $a(i)$: distancia promedio a puntos del mismo clúster (querés que sea chica)
- $b(i)$: distancia promedio al clúster vecino más cercano (querés que sea grande)

<CalloutCheck>
Regla práctica: probá K desde 2 hasta ~10, calculá silueta para cada uno, y elegí el K que maximice el puntaje. Si silueta < 0.25, los clústeres probablemente no existen — tus datos no tienen estructura de grupos.
</CalloutCheck>

</Section>

<Section number={4} title="Visualizá K-Means en acción" eyebrow="INTERACTIVA">

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.6, random_state=0)

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
for i, k in enumerate([2, 4, 6]):
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    y_pred = km.fit_predict(X)
    axes[i].scatter(X[:, 0], X[:, 1], c=y_pred, cmap='viridis', s=20)
    axes[i].scatter(km.cluster_centers_[:, 0], km.cluster_centers_[:, 1],
                    c='red', marker='X', s=200, edgecolors='black')
    axes[i].set_title(f'K = {k}')

plt.suptitle('K-Means con distintos valores de K')
plt.tight_layout()
plt.show()
```

<CalloutInfo>
Las X rojas son los centroides. Con K=2, el algoritmo fuerza 2 grupos donde hay 4. Con K=6, divide grupos naturales innecesariamente. K=4 captura la estructura real. El arte está en elegir el K correcto.
</CalloutInfo>

</Section>

<Section number={5} title="El método del codo en código" eyebrow="CÓDIGO">

```python
from sklearn.metrics import silhouette_score

inertias = []
silhouettes = []
K_range = range(2, 11)

for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    km.fit(X)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X, km.labels_))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
ax1.plot(K_range, inertias, 'bo-')
ax1.set_xlabel('K'); ax1.set_ylabel('Inercia')
ax1.set_title('Método del Codo')

ax2.plot(K_range, silhouettes, 'ro-')
ax2.set_xlabel('K'); ax2.set_ylabel('Silueta')
ax2.set_title('Puntaje de Silueta')
plt.tight_layout(); plt.show()
```

</Section>

<Section number={6} title="Aplicaciones" eyebrow="APLICACIÓN">

<ConceptCard variant="key-idea">
**Biotecnología:** Agrupá pacientes por perfiles de expresión génica para descubrir subtipos de cáncer que responden distinto a tratamientos.

**SaaS:** Segmentá usuarios por comportamiento (frecuencia de uso, features usadas, gasto) para campañas de marketing personalizadas.

**Genómica:** Agrupá genes por patrones de co-expresión para inferir funciones biológicas compartidas.
</ConceptCard>

<CalloutCheck>
La gran ventaja del no supervisado: no necesitás datos etiquetados. En biotecnología, etiquetar muestras requiere ensayos de laboratorio caros. K-Means te deja explorar los datos crudos y generar hipótesis antes de gastar en experimentos.
</CalloutCheck>

</Section>

<Section number={7} title="Resumen y glosario" eyebrow="RESUMEN">

<ConceptCard variant="key-idea">
K-Means agrupa puntos por proximidad a centroides que se actualizan iterativamente. El método del codo y la silueta ayudan a elegir K. Es el algoritmo de clustering más usado por su simplicidad y velocidad. No necesita etiquetas — descubre estructura por sí mismo.
</ConceptCard>

<InteractiveTable
  columns={[{ key: "term", label: "Término" }, { key: "def", label: "Definición" }]}
  rows={[
    { term: "Centroide", def: "Punto central de un clúster — promedio de todos sus miembros" },
    { term: "Inercia", def: "Suma de distancias al cuadrado dentro de cada clúster. Menos = mejor" },
    { term: "Silueta", def: "Puntaje de -1 a 1 que mide calidad de agrupamiento" },
    { term: "No supervisado", def: "Aprendizaje sin etiquetas — solo características (X)" },
  ]}
/>

</Section>

<Section number={8} title="Ejercicios" eyebrow="EJERCICIOS">

<ReflectionCheck
  blockId="reflection-l06-elbow-vs-silhouette"
  moduleSlug="machine-learning"
  lessonSlug="lesson06_kmeans"
  prompt="El método del codo sugiere K=3, pero la silueta es más alta para K=5. ¿Cuál elegís y por qué?"
  answer="Depende del contexto. Si el objetivo es exploratorio (descubrir estructura), elegiría K=5 porque la silueta más alta indica clústeres mejor definidos. Si el objetivo es comunicación (explicar los grupos a stakeholders), K=3 puede ser preferible por simplicidad aunque la calidad sea menor. En la práctica, inspeccioná ambos: a veces K=5 revela un grupo pequeño pero biológicamente relevante que K=3 esconde."
/>

<ConceptCard variant="key-idea">
**Desafío:** Encontrá el K óptimo para un dataset sintético usando inercia y silueta.
</ConceptCard>

<CodeEditor
  defaultValue={`import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.6, random_state=0)

# Explorá K de 2 a 10
K_range = range(2, 11)
inertias = []
silhouettes = []

for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X, labels))

# Resultados
for i, k in enumerate(K_range):
    print(f"K={k}: inercia={inertias[i]:.1f}, silueta={silhouettes[i]:.3f}")

best_k = K_range[silhouettes.index(max(silhouettes))]
print(f"\\nMejor K según silueta: {best_k} (silueta={max(silhouettes):.3f})")
`}
  height="350px"
/>

</Section>
