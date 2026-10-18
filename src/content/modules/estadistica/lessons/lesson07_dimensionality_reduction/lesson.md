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

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En genómica, un ensayo de expresión mide miles de genes por paciente, pero solo hay cincuenta muestras.",
    "Con pocas muestras y miles de variables, el modelo se vuelve inestable y difícil de interpretar.",
    "PCA encuentra las direcciones donde los datos más varían y las conserva; el resto se descarta.",
    "Es como comprimir una radiografía sin perder la lesión que realmente importa.",
  ]}
/>

<MascotMessage mood="thinking">
¿Qué pasa cuándo tienes 10,000 genes pero solo 50 pacientes? La maldición de la dimensionalidad: demasiadas variables para tan pocas muestras. PCA (Análisis de Componentes Principales) es la herramienta para reducir dimensiones sin perder la información esencial.
</MascotMessage>

En biotecnología, los datasets de expresión génica tienen miles de genes (features) pero pocas muestras. En SaaS, cientos de métricas de comportamiento de usuario. PCA encuentra las direcciones de máxima varianza y proyecta los datos a un espacio de menor dimensión.

</RevealSequence>

</Section>

<Section number={2} title="La intuición de PCA" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "PCA rota los ejes para alinearlos con la dirección de mayor varianza.",
    "El primer componente principal es donde la nube de puntos está más estirada.",
    "Los siguientes componentes buscan direcciones perpendiculares que aún capturen varianza.",
    "Son combinaciones lineales de genes, no genes sueltos: patrones, no variables individuales.",
  ]}
/>

<ConceptCard variant="key-idea">
Imagina una nube de puntos en 3D. PCA encuentra la dirección dónde los puntos están más "estirados" (máxima varianza) — ese es el primer componente principal. Luego busca la siguiente dirección más estirada perpendicular a la primera, y así sucesivamente.
</ConceptCard>

<ConceptCard variant="definition">
**PCA** = transformación lineal qué rota los ejes de los datos para alinearlos con las direcciones de máxima varianza (autovectores de la matriz de covarianza).

- **Componentes Principales**: nuevas variables, combinaciones lineales de las originales
- **Varianza Explicada**: cuánta información captura cada componente
- Los primeros componentes capturan la mayor parte de la varianza
</ConceptCard>

</RevealSequence>

</Section>

<Section number={3} title="¿Cuántos componentes? Elbow y scree plot" eyebrow="CONCEPTO">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "¿Cuántos componentes conservar? El scree plot muestra el codo de la varianza.",
    "Buscamos el punto donde agregar otro componente aporta poco.",
    "El criterio de Kaiser ayuda: componentes con autovalor mayor que uno.",
    "Y la varianza acumulada: entre 80 y 90 % suele ser suficiente.",
  ]}
/>

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

</RevealSequence>

</Section>

<Section number={4} title="PCA en acción: dataset Iris" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "En Iris, 4 mediciones se reducen a 2 componentes que separan las especies.",
    "Estandarizar antes del PCA es condición necesaria, no opcional.",
    "Sino, la variable de mayor escala acapara el primer componente principal.",
    "El scatter de PC1 vs PC2 muestra los grupos naturales a simple vista.",
  ]}
/>

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

</RevealSequence>

</Section>

<Section number={5} title="Biotecnología: PCA en genómica" eyebrow="INTERACTIVA">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Miles de genes por paciente se comprimen a 5 componentes principales.",
    "La varianza explicada total nos dice cuánto de la señal conservamos.",
    "Pero los componentes son mezclas: más poder estadístico, menos interpretabilidad.",
    "PCA sirve para visualizar y agrupar; luego volvemos a genes para actuar.",
  ]}
/>

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

<ChoiceQuestion
  question="En genómica, 2 componentes de PCA pueden separar subtipos de cáncer. Pero los componentes son combinaciones de genes, no genes individuales. ¿Es esto una ventaja o una desventaja?"
  moduleSlug="estadistica"
  lessonSlug="lesson07_dimensionality_reduction"
  blockId="reflection-l07-pca-genes"
  allowContinueOnIncorrect
  explanation="Es ambas: ventaja (captura patrones multivariados/perfiles de expresión), desventaja (pierde interpretabilidad; PC1 no es accionable por gen). Uso: PCA para visualizar/clustering y luego genes originales para interpretación."
  options={[
    { id: "a", label: "Es ambas: ventaja (patrones multivariados/perfiles de expresión) y desventaja (pierde interpretabilidad por gen)", correct: true, feedback: "¡Exacto! Por eso PCA se usa para visualizar/clustering y luego se vuelve a genes originales." },
    { id: "b", label: "Sólo ventaja: las combinaciones son más interpretables que genes individuales", correct: false, feedback: "La combinación reduce interpretabilidad; un biólogo no puede actuar sobre un PC1 = 0.3genA − 0.5genC directamente." },
    { id: "c", label: "Sólo desventaja: PCA no captura nada que un gen individual no muestre", correct: false, feedback: "PCA captura patrones de coexpresión multivariados que ningún gen individual revela." },
    { id: "d", label: "Ni ventaja ni desventaja: en genómica siempre se debe usar t-SNE en vez de PCA", correct: false, feedback: "PCA sigue siendo útil para visualización/clustering; la elección depende del objetivo, no es t-SNE siempre." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={6} title="Checkpoint" eyebrow="EVALUACIÓN">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Antes de seguir, asegurate de entender por qué estandarizamos antes del PCA.",
    "PCA se basa en la varianza: escala desigual sesga el resultado.",
    "Los autovectores se calculan sobre la matriz de covarianza.",
    "Sin escala común, la variable de mayor magnitud domina el componente.",
  ]}
/>

<ChoiceQuestion
  question="¿Por qué estandarizar antes de PCA?"
  moduleSlug="estadistica"
  lessonSlug="lesson07_dimensionality_reduction"
  blockId="choice-estadistica-l07-rev-1"
  allowContinueOnIncorrect
  explanation="PCA se basa en la varianza: si una variable está en metros (0–2) y otra en dólares (0–100000), la segunda domina el primer componente sólo por escala. Estandarizar (μ=0, σ=1) pone todas en igualdad de condiciones."
  options={[
    { id: "a", label: "Para que ninguna variable domine el componente principal por su escala distinta", correct: true, feedback: "¡Exacto! Así el PCA captura patrones reales, no diferencias de unidades." },
    { id: "b", label: "Porque PCA matemáticamente requiere medias cero pero no varianza unitaria", correct: false, feedback: "Centrar sólo no basta; sin escalar, la variable de mayor magnitud sigue dominando." },
    { id: "c", label: "Porque los autovectores sólo se calculan sobre datos enteros", correct: false, feedback: "Los autovectores se calculan sobre la matriz de covarianza; el tipo de dato no es el problema, la escala sí." },
    { id: "d", label: "Para aumentar la varianza explicada del primer componente", correct: false, feedback: "Estandarizar no busca maximizar varianza explicada, sino evitar que una variable la acapare por escala." },
  ]}
/>

<ChoiceQuestion
  question="¿Cuándo NO usarías PCA?"
  moduleSlug="estadistica"
  lessonSlug="lesson07_dimensionality_reduction"
  blockId="choice-estadistica-l07-rev-2"
  allowContinueOnIncorrect
  explanation="No conviene cuando necesitás interpretabilidad por feature (las combinaciones de genes no son accionables), cuando las relaciones son no lineales (PCA es lineal) o cuando ya tenés pocos features independientes."
  options={[
    { id: "a", label: "Cuando necesitás interpretabilidad por feature individual, relaciones no lineales o pocos features ya independientes", correct: true, feedback: "¡Exacto! En esos casos PCA pierde más de lo que aporta." },
    { id: "b", label: "Nunca: PCA siempre reduce dimensionalidad sin perder información útil", correct: false, feedback: "PCA siempre descarta algo; perder interpretabilidad es real." },
    { id: "c", label: "Sólo cuando el dataset tiene menos de 10 muestras", correct: false, feedback: "El tamaño de muestra no es el criterio; la linealidad e interpretabilidad sí." },
    { id: "d", label: "Sólo con variables binarias (0/1)", correct: false, feedback: "PCA incluso soporta variables continuas; el problema es escala/no-linealidad, no la cardinalidad." },
  ]}
/>

</RevealSequence>

</Section>

<Section number={7} title="Términos clave" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "Antes de avanzar, fijamos el vocabulario de PCA.",
    "Estos términos aparecen en todo el módulo de Machine Learning.",
    "Autovector, autovalor y varianza explicada son el núcleo.",
    "Un scree plot sin estos conceptos es solo una curva bonita.",
  ]}
/>

<ConceptCard variant="key-idea">
Términos clave:
- **PCA**: Transformación qué rota ejes hacia direcciones de máxima varianza
- **Componente Principal**: Combinación lineal de features originales; nuevo eje
- **Varianza Explicada**: Proporción de información qué captura cada componente
- **Scree Plot**: Gráfico de varianza explicada vs número de componente
- **Autovector**: Dirección del componente principal
- **Autovalor**: Cantidad de varianza capturada por el componente
- **Estandarización**: Centrar a μ=0 y escalar a σ=1 — necesario antes de PCA
</ConceptCard>

</RevealSequence>

</Section>

<Section number={8} title="Para la próxima lección" eyebrow="CIERRE">

<RevealSequence mode="appear">

<DialogueBox
  speaker="Dra. Coni"
  variant="scientist"
  typing={true}
  lines={[
    "PCA es un paso previo al agrupamiento: visualizá primero, agrupá después.",
    "La próxima lección usa los mismos componentes resultados para ver clusters.",
    "La estadística y las relaciones que vimos feeds todo lo que viene.",
    "Reducir dimensiones es simplificar sin perder la señal esencial.",
  ]}
/>

<MascotMessage mood="celebrating">
PCA es una transformación matemática que reduce 1000 dimensiones a 2 manteniendo la estructura esencial de los datos. Saber reducir dimensiones es un paso previo al agrupamiento.
</MascotMessage>

**En la Lección 8** vamos a hacer **Clustering con K-Means**: encontrar grupos naturales en los datos sin etiquetas. Vas a usar el método del codo, el puntaje de silueta, y PCA para visualizar clusters. Aprendizaje no supervisado en acción.

</RevealSequence>

</Section>
