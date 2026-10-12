---
name: mdx-lesson-authoring
description: "Contrato de autoría de lecciones MDX para InVitro-Code — frontmatter literal, split por <Section>, filtro Resumen, renumeración, registro de componentes, LaTeX y orden por dirname. Use when: creando o editando lesson.md, agregando un componente MDX, o cambiando el render de lecciones."
metadata:
  scope: project
  version: "1.0.0"
---

# MDX Lesson Authoring

Contrato del sistema de lecciones. Romper cualquiera de estas reglas rompe el render en silencio.

## Ubicación y estructura

```
src/content/modules/{module}/lessons/{lessonNN_slug}/
  lesson.md      # MDX + YAML frontmatter (obligatorio)
  quiz.md        # opcional
  lab.md         # opcional
  assignment.md  # opcional
  notebook.ipynb # opcional
  references.bib # opcional
  slides.md      # opcional
```

`module.json` define el `name` visible y el `order` del módulo.

## Orden de lecciones: por dirname, NO por frontmatter

Las lecciones se ordenan por el nombre del directorio (`lessonNN_...`). El prefijo `lessonNN_` es obligatorio; renombrar un dir reordena el módulo. `getNextLessonHref` y el listado usan `.sort()` sobre los nombres de directorio.

## Frontmatter — claves LITERALES

Se leen tal cual (case-sensitive). Usar exactamente estas claves:

```yaml
---
Module: 1
Lesson Number: 1
Lesson Title: ¿Qué es la Inteligencia Artificial?
Estimated Duration: 60 minutos
Prerequisites: Ninguno
Learning Objectives:
  - Objetivo uno
  - Objetivo dos
Difficulty: Principiante
---
```

`page.tsx` lee: `data["Lesson Title"]`, `data["Lesson Number"]`, `data.Module`, `data["Learning Objectives"]`, `data["Estimated Duration"]`, `data.Prerequisites`, `data.Difficulty`. Cualquier otra clave (Keywords, etc.) es metadata extra permitida pero no renderizada por el header.

## Reglas del render en `src/app/learn/[module]/[slug]/page.tsx`

1. **H1 se elimina**: `content.replace(/^# .+\n?/, "")` quita el primer H1. No poner el título como H1 dentro del cuerpo.
2. **Split por `<Section`**: `bodyContent.split(/(?=<Section )/)` — cada bloque debe EMPEZAR con `<Section ` (espacio incluido). Bloques que no arrancan con `<Section` se descartan.
3. **Filtro `Resumen`**: se elimina cualquier bloque `title="Resumen"`. Nunca nombrar una slide "Resumen" si se quiere mostrar.
4. **Renumeración**: `number={n}` se reescribe a `number={i+1}` según el orden final. El `number` del autor es decorativo.

Cada `<Section>` se compila por separado con `compileMDX` y entra al `LessonCarousel`. Sin `<Section>`, cae al fallback `MDXRemote` con todo el cuerpo.

## Registro obligatorio de componentes MDX

Para usar un componente en `lesson.md` hay DOS pasos:

1. Exportarlo desde `src/components/lesson/index.ts`.
2. Mapearlo en el objeto `components` de `page.tsx`.

Si falta cualquiera de los dos, el componente no renderiza. Los nombres en MDX son las keys del map (p. ej. `<ThresholdLab>`, `<CodeEditor>`, `<BrainVsChip>`).

## LaTeX — preservar `$...$`

El pipeline usa `remark-math` + `rehype-katex`. **Preservar `$...$` (inline) y `$$...$$` (bloque)** — no escapar el `$` ni romper el MathNode. Los estilos de KaTeX se asumen cargados.

## Path alias

`@/*` → `src/*`. Usar imports con alias dentro de componentes; en MDX se referencian por nombre de componente, no por import.

## Checklist antes de cerrar una lección

- [ ] Dir con prefijo `lessonNN_`.
- [ ] Frontmatter con claves literales exactas.
- [ ] Cada bloque empieza con `<Section ` y tiene `number`/`title`/`eyebrow`.
- [ ] Componentes nuevos exportados en `index.ts` Y mapeados en `page.tsx`.
- [ ] `$...$` intacto; sin `<Section>` con `title="Resumen"` salvo que se quiera ocultar.
- [ ] `npm run type-check` verde.
