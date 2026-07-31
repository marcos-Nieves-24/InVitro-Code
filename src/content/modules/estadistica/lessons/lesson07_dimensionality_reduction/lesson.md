---
Module: 3
Lesson Number: 7
Lesson Title: Reducción de Dimensionalidad (PCA)
Estimated Duration: 90 minutos
Prerequisites: Lección 5 (Relaciones)
Learning Objectives:
  - Explicar la intuición detrás del Análisis de Componentes Principales
  - Interpretar las proporciones de varianza explicada
  - Aplicar PCA usando sklearn.decomposition.PCA
  - Visualizar datos de alta dimensionalidad en 2D usando PCA
  - Determinar el número óptimo de componentes principales
Keywords: PCA, reducción de dimensionalidad, varianza explicada, autovectores, gráfico de sedimentación, reducción de features
Difficulty: Intermedio
Programming Concepts: sklearn.decomposition.PCA, numpy, matplotlib
Mathematical Concepts: matriz de covarianza, autovalores, autovectores, transformación ortogonal
Machine Learning Concepts: reducción de dimensionalidad, extracción de features, preservación de varianza
Datasets Used: iris, wine, digits
Notebook: 07_dimensionality_reduction.ipynb
Assignment: pca_assignment.md
Quiz: pca_quiz.md
---

<Section number={1} title="Cuando hay demasiadas dimensiones" eyebrow="INICIO">

<MascotMessage mood="curious">
¿Qué pasa cuándo tenés 10,000 genes pero sólo 50 pacientes? La maldición de la dimensionalidad: demasiadas variables para tan pocas muestras. PCA (Análisis de Componentes Principales) es la herramienta para reducir dimensiones sin perder la información esencial.
</MascotMessage>

En biotecnología, los datasets de expresión génica tienen miles de genes (features) pero pocas muestras. En SaaS, cientos de métricas de comportamiento de usuario. PCA encuentra las direcciones de máxima varianza y proyecta los datos a un espacio de menor dimensión.

</Section>

<Section number={2} title="La intuición de PCA" eyebrow="CONCEPTO">

<ConceptCard variant="key-idea">
Imaginá una nube de puntos en 3D. PCA encuentra la dirección dónde los puntos están más "estirados" (máxima varianza) — ese es el primer componente principal. Luego busca la siguiente dirección más estirada perpendicular a la primera, y así sucesivamente.
</ConceptCard>

<ConceptCard variant="definition">
**PCA** = transformación lineal qué rota los ejes de los datos para alinearlos con las direcciones de máxima varianza (autovectores de la matriz de covarianza).

- **Componentes Principales**: nuevas variables, combinaciones lineales de las originales
- **Varianza Explicada**: cuánta información captura cada componente
- Los primeros componentes capturan la mayor parte de la varianza
</ConceptCard>

</Section>

<Section number={3} title="¿Cuántos componentes? Elbow y scree plot" eyebrow="CONCEPTO">

<ConceptCard variant="definition">
El **gráfico de sedimentación (scree plot)** muestra la varianza explicada por cada componente. El "codo" dónde la curva se aplana indica el número óptimo.

Criterios para elegir k:
- Varianza acumulada > 80-90%
- Componentes con autovalor > 1 (criterio de Kaiser)
- El codo del scree plot
</ConceptCard>

<CalloutInfo>
En genómica, es común qué los primeros 2-3 componentes capturen >50% de la varianza total — eso significa qué cientos de genes se pueden reducir a un puñado de componentes para visualización y clustering.
</CalloutInfo>

</Section>

<Section number={4} title="PCA en acción: dataset Iris" eyebrow="INTERACTIVA">

```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import seaborn as sns

iris = sns.load_dataset('iris')
X = iris.drop('species', axis=1)
y = iris['species']

# Estandarizar (PCA es sensible a la escala)
X_scaled = StandardScaler().fit_transform(X)

# Aplicar PCA
pca = PCA()
X_pca = pca.fit_transform(X_scaled)

# Varianza explicada
print("Varianza explicada por componente:")
for i, var in enumerate(pca.explained_variance_ratio_):
    print(f"  PC{i+1}: {var:.3f} ({var*100:.1f}%)")

print(f"\nTotal acumulado 2 PCs: {pca.explained_variance_ratio_[:2].sum():.3f}")

# Visualizar en 2D
plt.figure(figsize=(8,6))
scatter = plt.scatter(X_pca[:,0], X_pca[:,1], c=pd.Categorical(y).codes, cmap='viridis')
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.colorbar(scatter, label='Especie')
plt.title('Iris dataset — PCA (2 componentes)')
plt.show()
```

</Section>

<Section number={5} title="Biotecnología: PCA en genómica" eyebrow="INTERACTIVA">

```python
# Simular expresión génica: 1000 genes, 50 pacientes, 3 subtipos de cáncer
np.random.seed(42)
n_genes, n_patients = 1000, 50
X = np.random.randn(n_patients, n_genes)

# Aplicar PCA
pca = PCA(n_components=5)
X_pca = pca.fit_transform(StandardScaler().fit_transform(X))
print(f"Varianza explicada (5 PCs): {pca.explained_variance_ratio_.sum():.3f}")

# Scree plot
plt.figure(figsize=(10,4))
plt.subplot(1,2,1)
plt.plot(range(1,6), pca.explained_variance_ratio_, 'o-')
plt.xlabel('Componente Principal')
plt.ylabel('Varianza Explicada')
plt.title('Scree Plot')

plt.subplot(1,2,2)
plt.plot(range(1,6), np.cumsum(pca.explained_variance_ratio_), 'o-')
plt.axhline(y=0.8, color='r', linestyle='--', label='80%')
plt.xlabel('Componente Principal')
plt.ylabel('Varianza Acumulada')
plt.legend()
plt.tight_layout()
plt.show()
```

<ReflectionCheck
  blockId="reflection-l07-pca-genes"
  moduleSlug="estadistica"
  lessonSlug="lesson07_dimensionality_reduction"
  prompt="En genómica, 2 componentes de PCA pueden separar subtipos de cáncer. Pero los componentes son combinaciones de genes, no genes individuales. ¿Es esto una ventaja o una desventaja?"
  answer="Es ambas. Ventaja: captura patrones multivariados qué ningún gen individual muestra (perfiles de expresión). Desventaja: perdés interpretabilidad — PC1 = 0.3×genA + 0.1×genB − 0.5×genC... no es accionable para un biólogo qué quiere saber '¿qué gen causa esto?'. En la práctica, usamos PCA para visualización/clustering y luego volvemos a los genes originales para interpretación biológica."
/>

</Section>

<Section number={6} title="Checkpoint" eyebrow="EVALUACIÓN">

<AnswerReveal summary="Ver respuestas">
<p><strong>¿Por qué estandarizar antes de PCA?</strong> PCA se basa en la varianza. Si una variable está en metros (0-2) y otra en dólares (0-100000), la segunda domina completamente el primer componente sólo por su escala, no por qué sea más importante. Estandarizar (μ=0, σ=1) pone todas las variables en igualdad de condiciones.</p>
<p><strong>¿Cuándo NO usarías PCA?</strong> Cuándo necesitás interpretabilidad (cada feature debe ser explicable), cuándo las relaciones son no lineales (PCA asume linealidad), o cuándo tus features ya son independientes y pocas.</p>
</AnswerReveal>

</Section>

<Section number={7} title="Términos clave" eyebrow="CIERRE">

<InteractiveTable
  headers={["Término", "Definición"]}
  rows={[
    ["PCA", "Transformación qué rota ejes hacia direcciones de máxima varianza"],
    ["Componente Principal", "Combinación lineal de features originales; nuevo eje"],
    ["Varianza Explicada", "Proporción de información qué captura cada componente"],
    ["Scree Plot", "Gráfico de varianza explicada vs número de componente"],
    ["Autovector", "Dirección del componente principal"],
    ["Autovalor", "Cantidad de varianza capturada por el componente"],
    ["Estandarización", "Centrar a μ=0 y escalar a σ=1 — necesario antes de PCA"],
  ]}
  searchable={true}
  caption="Términos clave de PCA"
/>

</Section>

<Section number={8} title="Para la próxima lección" eyebrow="CIERRE">

<MascotMessage mood="celebrating">
¡PCA es magia matemática! De 1000 dimensiones a 2, manteniendo la esencia de los datos. Ahora qué sabés reducir dimensiones, estás listo para agrupar.
</MascotMessage>

**En la Lección 8** vamos a hacer **Clustering con K-Means**: encontrar grupos naturales en los datos sin etiquetas. Vas a usar el método del codo, el puntaje de silueta, y PCA para visualizar clusters. Aprendizaje no supervisado en acción.

</Section>
