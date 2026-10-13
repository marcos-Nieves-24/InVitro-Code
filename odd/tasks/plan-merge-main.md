# Plan de merge — `feat/expediciones-ux-completo` → `main`

**Worktree:** `/home/biohacker24/proyectos/invitro-code-worktrees/expediciones-ux`
**Repositorio remoto:** `github.com/marcos-Nieves-24/InVitro-Code`
**Fecha:** 2026-10-13 · **HEAD local:** `f458bc9` (5 commits sobre `30dbb50`)

---

## 1. Estado verificado (no supuesto)

| Hecho | Cómo se comprobó | Resultado |
|---|---|---|
| La rama está **19 commits detrás** de `origin/main` | `git rev-list --count HEAD..origin/main` | 19 |
| `origin/main` avanzó hasta `1f5dbe8` (merge de PR #74) | `git log origin/main -1` | ayer 21:04 |
| **El merge no tiene conflictos** | `git merge-tree --write-tree HEAD origin/main` | exit 0 |
| **El resultado mergeado compila** | worktree desechable sobre el árbol del merge, mismo symlink de `node_modules` que el real | `type-check` ✓ · `build` ✓ |
| La rama **no tiene upstream remoto** | `git rev-parse @{u}` | sin upstream — un `git push` simple **no puede** caer en `main` |
| Puertas del repo en verde | `npm run type-check` / `npm run test` | 0 errores / **199 tests pasan** |
| No hay CI | `ls .github/workflows` | vacío — la puerta es local |
| `audit-visual/` está ignorado | `.gitignore:54` | las 80 capturas no entran al PR |
| `/preview/cards` fue **borrado** en main | `c62fb6a` | la ruta de auditoría de tarjetas ya no existe |
| `/preview/lesson` sigue en main | `git ls-tree origin/main` | la auditoría de lecciones sigue pública |

**PR #70 quedó obsoleto para este plan: ya está mergeado** (`1bc1afa`). Lo que traía main desde
entonces es trabajo de otro hilo (hero SVG, curador de assets) y **no toca** los componentes de
lección ni Expediciones: por eso el merge sale limpio.

---

## 2. Lo que va en el PR

```
5 commits · 22 archivos · +1593 / −270

f458bc9  docs(odd)      diagnostico con la linea base corregida      ~200 lineas
8c7078a  fix(lesson)    token unico de boton + posicion unica        109
fcc2bd2  fix(lesson)    vacio vertical + avance duplicado           401
4f811de  fix(lesson)    6 tablas -> visuales; 4 demos rotas        1048
74db245  fix(expediciones)  13 defectos medidos del carrusel        321
```

Los tres primeros son composición de la lección. El cuarto es contenido y animaciones. El quinto es
la landing. **No comparten archivos con las correcciones del hero de main.**

---

## 3. Decisión real: ¿cuántos PR?

El tamaño total (1863 líneas cambiadas) excede el presupuesto de ~400 líneas por PR que usa el
orquestador. **Pero `openspec/config.yaml` no fija esa regla**: exige `type-check`, `build`
(`verify:`), español en el contenido y los patrones MDX. No hay tampoco CI que aplique nada.

De modo que hay dos caminos honestos, con costo distinto.

### Opción A — Un solo PR

```
rebase sobre origin/main → push -u → PR con 22 archivos
```

- **A favor:** una sola revisión, un solo punto de mergeo, sin cadenas que mantener.
- **En contra:** el revisor (vos) recibe 1800+ líneas de una vez, con dos componentes nuevos de 590
  y 260 líneas. Si algo falla después, se vuelve atrás todo junto.

### Opción B — Cadena corta de 3 PR (recomendada)

Rebase primero, y a partir de ahí abrir cada PR sobre `main` en orden (`stacked-to-main`):

| PR | Contenido | Líneas | Por qué junto |
|---|---|---|---|
| **1** | `74db245` — Expediciones | 321 | Es landing pura; se puede revisar con capturas sin abrir código |
| **2** | `4f811de` — tablas → visuales + demos rotas | 1048 | Es el bloque de contenido; independiente del shell |
| **3** | `fcc2bd2` + `8c7078a` + `f458bc9` — composición + docs | ~710 | Los dos de composición comparten `lesson-carousel.tsx` y `RevealSequence.tsx`; separarlos obliga a un PR a medio hacer |

- **A favor:** cada PR se revisa con un solo ojo. El 1 se revisa mirando capturas, no leyendo diff.
- **En contra:** tres PRs y tres revisiones. Si quien revisa sos vos, eso es tres paradas.

**Los PR 2 y 3 siguen grandes.** Partirlos más (p. ej. cada animación en su PR) bajaría el tamaño
pero obligaría a commits intermedios que hoy no tienen sentido funcional por sí solos.

---

## 4. Secuencia de ejecución (para cualquiera de las dos)

```bash
# 1 — traer main y rebasear encima. La rama NO tiene upstream, asi que no hace falta --force.
cd /home/biohacker24/proyectos/invitro-code-worktrees/expediciones-ux
git fetch origin
git rebase origin/main

# 2 — volver a correr las puertas sobre el resultado REBASADO (un rebase limpio puede
#     seguir dando un arbol distinto al del merge-tree, asi que no se hereda el visto bueno).
npm run type-check
npm run test
npm run build

# 3 — publicar. Con -u explicito, nunca a secas.
git push -u origin feat/expediciones-ux-completo

# 4 — abrir PR
gh pr create --base main --title "..." --body "..."
```

**Punto crítico del paso 2:** el `build` que dió por bueno fue del árbol del *merge*. Un rebase
reproduce los 5 commits sobre `origin/main` y su árbol puede diferir. La verificación hay que
repetirla, no asumirla.

---

## 5. Riesgos y cómo se cubren

| Riesgo | Probabilidad | Cobertura |
|---|---|---|
| Otro agente sigue trabajando en el checkout principal `/home/biohacker24/proyectos/invitro-code` | alta | El plan trabaja **solo** en el worktree aislado. Nunca en el checkout compartido |
| El rebase ensucia el árbol al reescribir commits | nula | La rama no está pusheada; no hay nadie mirando esos SHAs |
| `ModuleCard` y `CardPrimitives` cambian sin verificación visual | cierta | `/preview/cards` fue borrado en main. **El landing los renderiza igual** (`OrbitalModules.tsx` importa `ModuleCard`), así que el contraste sigue siendo auditable en `localhost:3001/` |
| `/learn`, `/proyectos`, `/laboratorios` quedan sin verificar | cierta | Siguen detrás del login de Clerk. El plan no lo resuelve; **queda anotado**, no se afirma verificado |
| MDX que `npm run build` no compila (ruta dinámica) | media | Se verificó con `@mdx-js/mdx` + `gray-matter` y por request en `/preview/lesson` |

---

## 6. Después del merge

1. Borrar el worktree con `git worktree remove`, no con `rm -rf`, para que Git suelte la
   referencia.
2. `odd/tasks/diagnostico-slices-ia.md` queda como registro de la línea base; conviene que el
   siguiente trabajo de slices (hallazgo B, P2-1) arranque de ahí.
3. Quedan dos cosas abiertas de esta rama, ya documentadas y **sin mergear**:
   - hallazgo B (jerarquía tipográfica, 11px en 46 bloques);
   - dos pantallas de `lesson03` con el iframe recortado por abajo.
