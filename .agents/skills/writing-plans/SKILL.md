---
name: writing-plans
description: "Plan de implementación que un junior sin contexto pueda seguir — YAGNI, TDD red→green, pasos atómicos. Use when: spec firmado, necesitas plan antes de codear."
metadata:
  scope: project
  version: "1.0.0"
---

# Writing Plans — El plano antes de construir

Un plan no es un resumen del objetivo: es la secuencia de pasos que OTRO agente (sin tu contexto) puede ejecutar sin adivinar. Si un junior no lo puede seguir, el plan está incompleto.

## Cuándo cargarla

- El spec de `brainstorming` ya está firmado.
- Necesitás el plan antes de tocar código.
- La feature toca ≥2 archivos no triviales o tiene riesgo arquitectónico.

## Principios

- **DRY** — no dupliques pasos ni lógica; si un paso ya existe, referencialo.
- **YAGNI** — no planees abstracciones "por si acaso". Lo mínimo que resuelve el problema.
- **TDD real** — cuando haya un runner determinístico (Vitest), el paso 1 es un test que falla (RED), luego la implementación mínima (GREEN), luego refactor.
- **Pasos atómicos** — cada paso deja el repo consistente y verificable.

## Contrato TDD (InVitro)

- Runner: `npm run test` (Vitest, `environment: node`). Gate estático: `npm run type-check`.
- `strict_tdd: false` en este repo → si no hay test natural, `npm run type-check` es el gate mínimo.
- Si escribís test: RED (falla por la razón correcta) → GREEN (mínimo) → REFACTOR.
- Nunca inventes un "test" que pasa desde el inicio: no prueba nada.
- `npm run lint` está roto por diseño (Next 16) — no lo uses como gate.

## Estructura del plan

Cada task del plan lleva:

1. **ID y título** — `T1 — <qué>`, estable, para poder referenciarla desde commits.
2. **Archivos** — rutas exactas que toca (creados/modificados).
3. **Pasos** — numerados, atómicos, sin ambigüedad.
4. **Checks** — el comando exacto que prueba que terminó (test/type-check/grep).
5. **Evidencia** — qué se registra al cerrar (commit, output, captura).

## Presupuesto

- **~400 líneas autoras por task** (adición + borrado, sin contar generados). Es una heurística de planificación, no un cap rígido.
- Si el diseño correcto supera 400 líneas, explicá por qué y partí en tasks más chicas solo si eso mejora el review.
- Nunca borres espacios/comentarios para "ahorrar líneas"; nunca omitas tests para caer bajo el umbral.

## Dependencias entre skills

- Si la task toca lecciones MDX → referenciá **`mdx-lesson-authoring`** (frontmatter literal, `<Section>`, componentes, `$...$`).
- Si toca labs Python → referenciá **`pyodide-lab-contract`** (singleton worker, `requestId`, deps lazy).
- Si toca UI → considerá **`frontend-design`** / **`web-design-guidelines`**.
- Si el diff supera ~400 líneas → planificá slices con **`chained-pr`**.

## Research

No planees una fase de research separada salvo que haya una **incertidumbre nombrada**. Si existe, resolvela ANTES de escribir el plan; si no, el plan es ejecutable ya.

## Cierre

El plan vive en `odd/tasks/<feature>.md` (o el `tasks.md` del cambio SDD si es SDD). Ese archivo es la fuente de verdad. Con el plan firmado, pasá a `executing-plans`.
