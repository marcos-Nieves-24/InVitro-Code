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
- [ ] T3.2 Módulo `machine-learning` (10 lessons)
- [ ] T3.3 Módulo `python` (17 lessons — lote más grande, dividir en 2 commits si >400 líneas)
- [ ] T3.4 Módulo `ia` (4 lessons)
- [ ] T3.5 Markdowns raíz + `module.json` + strings UI (`src/components`, `src/app`) + comentarios `src/**/*.ts,tsx`

Cada T3.x: commit `fix(content): corrige ortografía <módulo> — diacríticas, puntuación, marcadores IA` con tests/docs en mismo commit. Registrar hash en este doc.

### Fase 4 — Tooling preventivo
- [ ] T4.1 Agregar `cspell.json` (es-ES + glosario biotecnología: TP53, scipy, Pyodide, etc.) y script `spell:check`. Verificar no rompe `type-check`/`build`.

### Fase 5 — Verificación
- [ ] T5.1 `npm run type-check` + `npm run build` + `grep` de ` qué ` átono residual + `cspell` 0 errores en `src/content`. Muestreo 10% lectura en voz alta.

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

## Próximo paso
Ejecutar T0.1 (inventario) → T1.1 (taxonomía) → T2.1 → lotes T3.x en orden.

## Referencias
- `src/content/modules/estadistica/lessons/lesson01_descriptive_stats/lesson.md:30,43,131`
- `src/content/modules/estadistica/lessons/lesson04_statistical_distributions/lesson.md:29,62,69,146,167`
- `src/app/learn/[module]/[slug]/page.tsx` (split `<Section`, filtro `Resumen`)
- `AGENTS.md` (Node >=20.9, lint roto, gate `type-check`/`build`)
