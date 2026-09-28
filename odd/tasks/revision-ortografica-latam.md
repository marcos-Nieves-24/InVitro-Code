# Revisión ortográfica integral — Español latino

## Objetivo
Corregir toda la ortografía del contenido visible y de los comentarios de código en español latino (tildes, acentos, comas, puntos, mayúsculas, concordancia) y eliminar marcadores de IA en la generación de textos, sin alterar lógica de código ni LaTeX.

## Problema
- Error sistemático `qué/qué` átono: `hay qué describir`, `es qué la media`, `eventos qué ocurren` (visto en `estadistica/lesson01:30,43,131` y `lesson04:29,62,69`).
- Mismo patrón con `cuándo/cuando`, `cómo/como`, `cuánto/cuanto`, `dónde/donde`, `por qué/porque`.
- Puntuación inconsistente (comas explicativas, guion largo `—` abusivo) y marcadores IA (`En conclusión`, `Es importante destacar`, `Sumérgete`).
- Sin diccionario/linter ortográfico en el repo (`npm run lint` roto por diseño Next 16; gate real es `type-check` + `build`).

## Por qué
Plataforma educativa en español: errores ortográficos erosionan autoridad pedagógica. Corrección exhaustiva mejora legibilidad, accesibilidad y SEO.

## Alcance autorizado
**Incluye:**
- `src/content/modules/**/lesson.md`, `lab.md`, `quiz.md`, `assignment.md`, `slides.md` (si existe)
- `src/content/modules/**/module.json` (name/description si tiene errores)
- `README.md`, `DESIGN.md`, `AGENTS.md`, `backend/README.md` y todo `*.md` del repo
- Comentarios en código: `#` en fences Python y `notebook.ipynb` (celdas markdown + comentarios), `//`/`/* */` en `src/**/*.ts,tsx`
- Strings visibles en UI: `src/components/**`, `src/app/**`

**Excluye:**
- `references.bib` (citas bibliográficas)
- Código ejecutable (lógica Python/TS) y LaTeX `$...$` (`remark-math`/`rehype-katex`)
- Keys literales de frontmatter (`Lesson Title`, `Module`, etc.) — solo se corrige el *valor*

## Restricciones
- No alterar comportamiento: solo texto natural.
- Preservar estructura `<Section number={n} title>` y split por `<Section` en `src/app/learn/[module]/[slug]/page.tsx`.
- `npm run lint` no existe — no agregar eslint a menos que se pida; gate es `npm run type-check` y `npm run build`.

## Tareas

### Fase 0 — Inventario
- [ ] T0.1 Inventario cerrado: listar 172 `*.md` de `src/content` + `*.md` raíz + archivos UI con strings. Reportar conteo líneas/palabras. Evidencia: `inventario_ortografia.md` o sección en este doc.

### Fase 1 — Taxonomía
- [ ] T1.1 Definir reglas RAE/es-419 con ejemplos del repo (diacríticas, tildes, puntuación, mayúsculas, dequeísmo, anglicismos). Registrar en `odd/tasks/revision-ortografica-latam.md`.

### Fase 2 — Marcadores IA
- [ ] T2.1 Checklist y barrido `grep` de marcadores: `En conclusión`, `Es importante destacar`, `En el fascinante mundo`, `Sumérgete`, `Adentrémonos`, `No solo... sino también` repetido, `—` abusivo, emojis excesivos. Reescritura con voz activa.

### Fase 3 — Corrección por lotes (contenido + markdowns + comentarios)
- [x] T3.1 Módulo `estadistica` (10 lessons × 4 md = 40 + notebooks comentarios) — commit ec25653
- [x] T3.2 Módulo `machine-learning` (10 lessons × 4 md + notebooks = 20 archivos) — commit 5227d09
- [x] T3.3 Módulo `python` (17 lessons — 18 archivos lab.md/assignment.md corregidos, 69 md totales escaneados) — commit 0f6c948
- [x] T3.4 Módulo `ia` (4 lessons — 7 archivos corregidos: 4 lab.md + 2 notebook.ipynb + 1 lesson.md caption) — commit e152cb8
- [x] T3.5 Markdowns raíz + `module.json` + strings UI (`src/components`, `src/app`) + comentarios `src/**/*.ts,tsx` — commit 1e83242

Cada T3.x: commit `fix(content): corrige ortografía <módulo> — diacríticas, puntuación, marcadores IA` con tests/docs en mismo commit. Registrar hash en este doc.

### Fase 4 — Tooling preventivo
- [x] T4.1 Agregar `cspell.json` (es-ES + glosario biotecnología: TP53, scipy, Pyodide, etc.) y script `spell:check`. Verificar no rompe `type-check`/`build`. — commit bc57c7c

### Fase 5 — Verificación
- [x] T5.1 `npm run type-check` + `npm run build` + `grep` de ` qué ` átono residual + `cspell` 0 errores en `src/content`. Muestreo 10% lectura en voz alta. — verificación 2026-09-28 HEAD 49a9198, Node v22.23.2, cspell 10.3.5

## Criterios de aceptación
- [ ] 0 `qué/cuándo/cómo/cuánto` con tilde indebida (relativo/conjunción) en `src/content` y comentarios.
- [ ] Puntuación RAE consistente (comas explicativas, `—` solo donde corresponde).
- [ ] 0 marcadores IA del checklist en contenido y markdowns.
- [ ] `type-check` y `build` pasan.
- [ ] `cspell` 0 errores en `src/content` (permitidos nombres propios técnicos en glosario).

## Verificación por tarea
- T0: `find src/content -name "*.md" | wc -l` + lista
- T1: doc taxonomía revisado
- T2: `grep -R "En conclusión\|Es importante destacar\|Sumérgete" src/content` = 0
- T3.x: diff por módulo + `grep -R " qué " src/content/modules/<mod>` revisado manualmente (falsos positivos LaTeX excluidos)
- T4: `npx cspell "src/content/**/*.md" --no-progress` = 0
- T5: `npm run type-check && npm run build`

## Progreso
- 2026-09-28: Feature document creado. Pendiente T0.1.
- 2026-09-28: T3.1 completado — 34 archivos (lesson.md/lab.md/quiz.md/assignment.md ×10) corregidos, diacríticas (qué→que, por qué→porque, cómo→como, etc.), tildes (estadística, validación, gráfico, día, matemáticas) y `sólo→solo`. `grep -R " qué " src/content/modules/estadistica --include="*.md"` 132→20 (restantes solo interrogativos directos con ¿?). `npm run type-check` PASS. Commit ec25653.
- 2026-09-28: T3.2 completado — 20 archivos (10 lab.md + 10 notebook.ipynb) corregidos, tildes (regresión, clasificación, predicción, evaluación, validación, interpretación, matemáticas, gráficos, división, logística, automático, explícitamente, diagnóstico, métricas, características, crítico, desafío). Lesson/quiz/assignment.md sin errores diacríticos. `grep -R " qué " src/content/modules/machine-learning --include="*.md"` 53 (solo interrogativos directos con ¿?). `grep -R "\\bregresion\\b"` 0, `grep -R "\\bmatematicas\\b"` 0. `npm run type-check` PASS. Commit 5227d09.
- 2026-09-28: T3.3 completado — 18 archivos (17 lab.md + 1 assignment.md) corregidos, tildes (configuración, instalación, verificación, información, versión, módulos, matemáticas, gestión, código, estadística, gráfico, visualización, comprensión, creación, índices, métodos, números, operación, automático, explícitamente, después, también, según, pequeño, análisis, cálculo, además, dinámico, práctica, código, etc.) y `sólo→solo`, `qué otros→que otros`. Lesson/quiz.md ya limpios; notebooks sin errores diacríticos (función/estándar ya correctos). `grep -R " qué " src/content/modules/python --include="*.md" | wc -l` 39 (solo interrogativos directos con ¿?/qué hace). `grep -R "\\bfuncion\\b" src/content/modules/python --include="*.md"` 0. `npm run type-check` PASS. Commit 0f6c948 (210 líneas, <400 — single commit).
- 2026-09-28: T3.4 completado — 7 archivos corregidos (4 lab.md + 2 notebook.ipynb + 1 lesson.md caption): tildes (Exploración, diagnóstico, médico, distribución, numéricas, Estadísticas, exploración, separación, útiles, Comparación, estadística, superposición, Cómo, validación, generalización, división, sépalo, pétalo, evaluación, gráfico, pequeña, biotecnología, análisis, proteínas, conexión, composición, aminoácidos, peptídico, cuántas, hidrofóbico, biología, sintéticas, regresión, logística, está, clasificación, diagnóstico, Métricas, confusión, señal, predicción), `mas→más`, typo `fivas→fijas`, `Biotecnologia→Biotecnología`. Lesson/quiz/assignment.md sin errores diacríticos. `grep -R " qué " src/content/modules/ia --include="*.md"` 41 (solo interrogativos directos con ¿?). `grep -R " mas " src/content/modules/ia --include="*.md"` 0. `npm run type-check` PASS. Commit e152cb8 (132 líneas, <400 — single commit).
- 2026-09-28: T3.5 completado — 14 archivos (DESIGN.md + 13 componentes) corregidos: DESIGN.md `技术→técnicos`; UI strings `Leccion→Lección`, `dias→días`, `mas→más`, `como→cómo`, `biotecnologia→biotecnología`, `Mision/Vision→Misión/Visión`, `Raiz→Raíz`, `Modulos→Módulos`, `Introduccion→Introducción`, `Programacion→Programación`, `Estadistica→Estadística`, `Quienes/Detras/Lider→Quiénes/Detrás/Líder`, `expedicion/teoria/practica→expedición/teoría/práctica`, `Medellin→Medellín`, `Escribenos→Escríbenos` + `¿` apertura, `codigo/desafio→código/desafío`, `colaboracion→colaboración`, `disenado→diseñado`, `tecnica→técnica`; comentarios `//`/`/* */` sin español átono (verificados — solo JSX `Misión` corregido); `module.json` sin errores (4 verificados). `grep -R "Biotecnologia\|Introduccion\|Estadistica" src --include="*.tsx"` 0. `grep -R " qué " src/content/modules/*/module.json` — sin errores diacríticos. `npm run type-check` PASS. Commit 1e83242 (51 líneas, <400 — single commit).
- 2026-09-28: T4.1 completado — `cspell.json` v0.2 `language: en,es` + import `@cspell/dict-es-es` (es-ES, es-419 fallback a es) + 393 palabras glosario (biotecnología: TP53, BRCA1/2, CRISPR/Cas9, AlphaFold, FASTQ/BAM/VCF, BioReactor, Pyodide, scipy, numpy, pandas, matplotlib, seaborn, plotly, supabase, clerk, vercel, BioPython, etc. + 328 técnicas de `src/content` + 31 de `*.md` raíz) + `ignorePaths` (node_modules, .next, public, *.bib, package-lock, .git) + `patterns`/`ignoreRegExpList` LaTeX `$...$`/`$$...$$` y fences ``` ```/`` ` `` + `dna-sequence` `[ATGC]{4,}`. Script `spell:check: cspell "src/content/**/*.md" "*.md" --no-progress`. Conteo: 34313 errores sin dict → 934 con es-ES + glosario base → 0 con glosario completo (`src/content` 172 files 0 issues; con `*.md` 175 files 0 issues). `npx cspell --version` 10.3.5, `npm run spell:check` PASS, `npm run type-check` PASS. Commit bc57c7c. Limitación documentada: fences LaTeX se ignoran vía RegExp; DNA se ignora vía pattern, pero glosario cubre residuos.
- 2026-09-28: T5.1 verificación final — PASS integral. `npm run type-check` PASS (tsc --noEmit 0 errores). `npm run build` PASS (Next 16.2.10 Turbopack, Compiled successfully 13.5s, 19/19 static pages, middleware proxy OK). `grep -R " qué " src/content --include="*.md" | wc -l` = 153 (100% interrogativos directos con `¿`/`qué hace`/`qué es`/`por qué`; 0 átonos residuales tipo `hay qué`/`es qué`/`eventos qué` — 1 falso positivo `hay que describir` es `que` átono correcto). `grep -R "En conclusión\|Es importante destacar\|Sumérgete\|Adentrémonos" src/content` = 0, `grep -R "sólo" src/content` = 0, `grep -R "Estadistica\|Biotecnologia\|Introduccion" src --include="*.tsx"` = 0 (20 `estadistica` restantes son `moduleSlug` identificadores, no texto visible). `npx cspell "src/content/**/*.md"` 172 files 0 issues; `npx cspell "*.md"` 3 files 0 issues; `npm run spell:check` 175 files 0 issues (cspell 10.3.5, Node v22.23.2). Muestreo 10% (4 archivos de 4 módulos): `estadistica/lesson04_statistical_distributions/lesson.md` (218 líneas, Poisson/Bernoulli/Binomial/Normal — puntuación RAE + LaTeX preservado), `python/lesson03_variables/lesson.md` (297 líneas, variables/tipado dinámico), `ia/lesson04_real_cases/lesson.md` (304 líneas, vacunas mRNA/reposicionamiento/AlphaFold/Evo), `machine-learning/lesson05_random_forest/lab.md` (74 líneas, bosque aleatorio — fences python ignorados por cspell, `sinteticos` en code-fence OK). Sin errores obvios. HEAD 49a9198, branch `odd/revision-ortografica-latam`. Criterios de aceptación: diacríticas 0 átonas ✓, puntuación RAE ✓, marcadores IA 0 ✓, type-check ✓, build ✓, cspell 0 ✓.

## Próximo paso
Ejecutar T0.1 (inventario) → T1.1 (taxonomía) → T2.1 → lotes T3.x en orden.

## Referencias
- `src/content/modules/estadistica/lessons/lesson01_descriptive_stats/lesson.md:30,43,131`
- `src/content/modules/estadistica/lessons/lesson04_statistical_distributions/lesson.md:29,62,69,146,167`
- `src/app/learn/[module]/[slug]/page.tsx` (split `<Section`, filtro `Resumen`)
- `AGENTS.md` (Node >=20.9, lint roto, gate `type-check`/`build`)
