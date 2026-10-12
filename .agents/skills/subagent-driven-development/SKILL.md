---
name: subagent-driven-development
description: "Orquestación multi-agente — orchestrator fino + workers acotados, max_threads=4, worktrees aislados. Use when: feature multi-file, necesitas paralelismo sin pisar contexto."
metadata:
  scope: project
  version: "1.0.0"
---

# Subagent-Driven Development — Orchestrator fino + workers acotados

Trabajo multi-file sin inflar el contexto del orquestador ni pisar archivos entre agentes. El orquestador decide y sintetiza; los workers ejecutan unidades acotadas.

## Cuándo cargarla

- La feature toca múltiples archivos o módulos.
- Necesitás paralelismo real (varios slices independientes).
- Querés mantener el contexto del orquestador liviano para poder coordinar.

## Topología

- **1 orchestrator** — explora, decide ruta, delega, verifica, integra, reporta. No codea el grueso.
- **N workers acotados** — cada uno recibe un scope explícito (archivos permitidos + checks + evidencia esperada).
- **`max_threads = 4`**, **`max_depth = 2`** (configurado en `~/.codex/config.toml`). No anides más de un nivel de delegación.
- Un solo **writer** por worktree. Nunca dos agentes editando el mismo árbol.

## Regla de oro

Delegá para **comprimir contexto**, no para parecer productivo. Si la unidad es un fix mecánico de un archivo ya entendido, hacelo inline.

## Worktrees aislados (solo si hay paralelismo real)

- Worktree bajo `~/proyectos/<repo>-worktrees/<nombre>` — **nunca** `/tmp`, `/var/tmp` ni `$HOME`.
- Cada worktree necesita su **propio `.codegraph/`**. Nunca copies ni symlinkees el índice de otro checkout (roots y bytes difieren).
- Inicializá con `gentle-ai codegraph init --cwd <worktree>` si falta.
- Slices independientes → worktrees distintos. Slices acoplados → un solo worktree, un solo writer.

## Contrato de delegación

El prompt al worker incluye:

1. **Objetivo** — una frase, con el "por qué".
2. **Scope** — rutas exactas permitidas; lo que NO se toca.
3. **Skills a cargar** — paths exactos del registry (`react-best-practices`, `mdx-lesson-authoring`, `pyodide-lab-contract`, según aplique).
4. **TDD** — modo resuelto (`strict_tdd`) + runner exacto.
5. **Checks** — comandos exactos a correr y reportar como `<command>: <result>`.
6. **Evidencia esperada** — archivos tocados, output de checks, commit.

## Verificación del trabajo delegado

- El **writer reporta** los checks que corrió (registro de verdad). Recién ahí el orquestador hace **spot-check** re-corriendo un comando reportado.
- RDD encendido → el writer corre los checks en foreground; el review nativo es el check independiente.
- RDD apagado/unknown → el orquestador evalúa el diff y decide verificación según riesgo. Un assessment fallido nunca baja el tier.
- Resultado vacío, malformado o incompleto del worker → no es éxito; reintentá o escalá, no lo tomes como válido.

## Anti-patrones

- Mil subagentes para un cambio de 3 archivos → overhead sin retorno.
- Dos writers en el mismo worktree → conflictos y diffs corruptos.
- Workers sin checks declarados → no hay forma de saber si terminaron bien.
- Delegar y olvidar → siempre esperá el resultado antes de integrar o preguntar al usuario.

## Referencias

- Ejecución por batches → **`executing-plans`**.
- Slices de PR → **`chained-pr`**.
