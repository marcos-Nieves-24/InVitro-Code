---
name: executing-plans
description: "Ejecución del plan por batches con verificación por task — subagentes, checks, commits atómicos. Use when: plan firmado y listo para implementar."
metadata:
  scope: project
  version: "1.0.0"
---

# Executing Plans — Ejecutar por batches, verificar por task

El plan ya está firmado. Ahora se ejecuta sin reabrir el diseño ni saltarse checks. `odd/tasks/<feature>.md` es la **fuente de verdad**: leé el archivo y su espejo en Engram antes de tocar código.

## Cuándo cargarla

- Un plan de `writing-plans` está firmado y listo.
- Tenés un `odd/tasks/<feature>.md` con checklist de tasks.

## Bucle de ejecución

1. **Leer la task** — objetivo, archivos, checks. Si falta contexto, delegá una exploración acotada, no preguntes en el aire.
2. **Ejecutar el batch** — un conjunto coherente de tasks relacionadas (no una task suelta a la vez si están acopladas).
3. **Verificar por task** — corré el check declarado (test/type-check/grep) y observá el resultado REAL. No marques sin output.
4. **Commit work-unit** — un commit por unidad de trabajo revisable, incluyendo sus tests y docs.
5. **Actualizar la task** — marcá `[x]` solo con evidencia; actualizá `odd/tasks/<feature>.md` y su espejo en Engram. Preservá lo ya completado.

## Batches y delegación

- **Batch = grupo coherente de work units.** No mezcles refactors no relacionados.
- **Delegá cuando:** entender requiere ≥4 archivos, o la implementación toca ≥2 archivos no triviales.
- **No delegues:** un fix mecánico de un solo archivo ya entendido.
- Un writer por batch. No corras dos writers en el mismo worktree (ver `subagent-driven-development`).

## Cheats — commits

- Convención: Conventional Commits (`feat(scope):`, `fix(db):`, `chore(harness):`).
- Nunca agregar `Co-Authored-By` ni atribución de IA.
- Un commit por work unit; el mensaje dice qué cambia y por qué.
- No commitear con checks en rojo.

## Verificación mínima (InVitro)

- `npm run type-check` — gate estático confiable.
- `npm run test` — Vitest (si la task lo toca).
- `npm run lint` NO (roto por diseño). `npm run build` para gates de entrega.

## Manejo de fallos

- Check en rojo → arreglá la causa, no el test; reintentá.
- Dos veces el mismo error → actualizá `AGENTS.md` (living doc) y registralo.
- Bloqueo real → frená, reportá qué falta (evidencia + decisión necesaria), no inventes.

## Cierre

Cuando todas las tasks estén `[x]` con evidencia: corré los gates finales, actualizá la sección de Evidencia del task file, y reportá qué quedó verde, qué falló y el siguiente paso.

## Referencias

- Orquestación multi-agente → **`subagent-driven-development`**.
- Slices grandes → **`chained-pr`** y **`work-unit-commits`**.
