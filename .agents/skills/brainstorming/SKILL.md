---
name: brainstorming
description: "Exploración creativa y discovery antes de codear — saca el spec en chunks legibles, 1 pregunta a la vez. Use when: starting a feature, ambiguous requirements, or before writing any code."
metadata:
  scope: project
  version: "1.0.0"
---

# Brainstorming — Discovery antes de codear

No se codea sin entender el problema. Esta skill frena el impulso de saltar a `Edit` y obliga a sacar el spec antes de escribir una sola línea.

> Adaptado de `obra/superpowers:brainstorming`, curado para InVitro-Code (dev-only, stack Next 16 + MDX + Pyodide, contenido en español).

## Cuándo cargarla

- Arranca una feature nueva o un fix no trivial.
- El requerimiento es ambiguo o tiene más de una interpretación razonable.
- Antes de escribir código que toque ≥2 archivos o cualquier superficie arquitectónica.

## Regla de oro

**No se escribe código en esta fase.** La salida es un spec, no un commit. Aunque creas que ya tenés el spec en la cabeza, igual lo escribís y lo validás contra el usuario.

## Proceso

1. **Entender el pedido** — parafraseá el objetivo en una frase y el "por qué". Si no podés, preguntá.
2. **Explorar antes de proponer** — usá CodeGraph (`codegraph_explore`) ANTES de `grep`/`Read` masivo. Mapeá los archivos y símbolos que toca la feature.
3. **Sacar el spec en chunks** — no vuelques un plan de 100 líneas. Partí el problema en secciones y confirmá de a una.
4. **Una pregunta a la vez** — preguntá lo más importante primero; **STOP y esperá la respuesta.** No sigas con suposiciones.
5. **Distinguí hechos de asunciones** — marcá explícito lo VERIFICADO (lo viste en código/docs) vs lo ASUMIDO (lo inferiste).
6. **Assumption challenge (solo si aplica)** — si hay una premisa NO probada de alta consecuencia, hacé UN challenge read-only: "¿y si esta premisa es falsa?". Nameá premisa, evidencia y consecuencia. No abras un debate largo.

## Chunking del spec

Cada chunk debe ser digerible de un vistazo:

- **Objetivo** — qué cambia y por qué.
- **Alcance** — archivos/superficies autorizadas.
- **Fuera de alcance** — lo que explícitamente NO se toca.
- **Criterios de aceptación** — cómo se sabe que terminó.
- **Riesgos** — qué puede romper, qué queda asumido.

## Restricciones de InVitro

- Contenido/lecciones: respetá `mdx-lesson-authoring` (frontmatter literal, `<Section>`, `$...$`).
- Labs: respetá `pyodide-lab-contract` (singleton worker, correlación por `requestId`).
- No tocar secrets, deps major ni lógica de negocio sin autorización explícita.
- Escribí el spec en `odd/tasks/<feature>.md` cuando el trabajo sea sustancial (≥2 pasos coordinados).

## Siguiente paso

Con el spec acordado, pasá a `writing-plans`. No saltes directo a `executing-plans` en features multi-archivo.

## Anti-patrones

- Preguntar 5 cosas juntas → el usuario responde la mitad.
- Asumir y seguir → el spec sale mal y el plan arrastra el error.
- Explorar con `grep` a ciegas en vez de CodeGraph.
- "Ya sé lo que quiere" → el spec existe igual.
