# Módulo 1: Introducción a la Inteligencia Artificial

## Objetivo de Aprendizaje

Introducir la Inteligencia Artificial desde cero, usando como hilo narrativo la clasificación de conidias de *Aspergillus* y *Penicillium* en el laboratorio de microbiología. Sin asumir conocimientos previos de programación, estadística ni matemática.

## Lecciones

1. **¿Qué es la IA?** — Features, patrones visuales, reglas fijas vs aprendizaje automático
2. **¿Cómo aprende la IA?** — Frontera de decisión, KNN, regresión lineal, subajuste y sobreajuste
3. **IA en la Biotecnología** — Visualización 3D de proteínas, pipeline completo de ML
4. **Casos Reales en la Investigación** — AlphaFold (Nobel 2024), Rentosertib (Nature Medicine 2025), Evo

## Demos interactivos (11)

| # | Demo | Tema |
|---|---|---|
| 1 | features | Visualización de características de conidias (scatter biplot) |
| 2 | patterns | Reconocimiento visual de patrones (heatmaps 5×5) |
| 3 | rules | Reglas fijas vs IA (clasificador por umbrales) |
| 4 | boundary | Frontera de decisión lineal (perceptrón) |
| 5 | knn | KNN interactivo (k ajustable + vecinos) |
| 6 | regression | Regresión lineal (concentración vs efecto) |
| 6b | **overfitting** | Subajuste y sobreajuste (curvas train/test con slider de complejidad) |
| 7 | protein_3d | Visualizador 3D de proteínas (5 PDBs reales) |
| 8 | alphafold | Timeline AlphaFold + comparación de estructuras |
| 9 | rentosertib | Timeline de Insilico Medicine + drug discovery |
| 10 | pipeline | Pipeline completo de clasificación con ML |

Cada demo incluye: pregunta predictiva, interactivo Plotly.js, etiqueta de tipo (educativa/real), y checkpoint MCQ con feedback.

## Datasets

Los datasets sintéticos son generados por los scripts en el repositorio raíz. Los PDB reales se sirven desde URLs externas dentro de los demos.

## Stack

- **Plataforma**: Next.js + Prisma + PostgreSQL (deploy Vercel)
- **Demos interactivos**: HTML + JavaScript vanilla + Plotly.js 3.0.0 (local)
- **Contenido**: Markdown con frontmatter + HTML incrustado

## Prerrequisitos

Ninguno. Este es el módulo inicial del curso. Diseñado para estudiantes de biotecnología sin experiencia en programación, estadística ni IA.

## Alcance

Ver [`_archive/notes/alcance_v2.md`](./_archive/notes/alcance_v2.md) para el detalle de contenido diferido a futuras iteraciones.

## Referencias

Ver [`_archive/references/fuentes_investigacion.md`](./_archive/references/fuentes_investigacion.md) para las fuentes bibliográficas completas.
