# UX Wireframes — InVitro-Code

Wireframes hand-drawn en formato `.excalidraw`, clonando el contrato visual de `~/Descargas/UX-design.excalidraw`.

## Contrato visual (no editar sin sincronizar)

- `strokeColor: #1e1e1e`, `backgroundColor: transparent`, `fillStyle: solid`
- `strokeWidth: 4` contenedores / `2` detalles, `roughness: 1`, `opacity: 100`
- `roundness: type 3` rectangles, `type 2` lines
- `fontFamily: 5` (Virgil/Excalifont), `fontSize: 36/28/20/16`
- Fuente: `~/Descargas/UX-design.excalidraw` (796 elements, 78 groups)

## Estructura

```
docs/ux/excalidraw/
  _template.excalidraw   # template canónico (appState + tokens)
  _tokens.json           # tokens para generadores
  00-index.excalidraw    # mapa de navegación
  01-landing.excalidraw
  02-learn-index.excalidraw
  03-learn-lesson.excalidraw
  04-dashboard.excalidraw
  05-perfil.excalidraw
  06-comunidad.excalidraw
  07-laboratorios-index.excalidraw
  08-laboratorios-module.excalidraw
  09-laboratorios-lesson.excalidraw
  10-proyectos-index.excalidraw
  11-proyectos-module.excalidraw
  12-proyectos-lesson.excalidraw
  13-logros.excalidraw
  14-niveles.excalidraw
  15-configuracion.excalidraw
  16-bookmarks.excalidraw
  17-admin.excalidraw
  18-sign-in.excalidraw
  19-sign-up.excalidraw
  20-sso-callback.excalidraw
  21-terminos.excalidraw
  22-privacidad.excalidraw
  23-aviso.excalidraw
  24-cookies.excalidraw
  25-ia.excalidraw
  26-preview-lesson.excalidraw
  27-preview-bioreactor.excalidraw
```

## Cómo editar

1. **Abrir:** arrastrá el `.excalidraw` a https://excalidraw.com o `npx -y mcp-excalidraw-server import docs/ux/excalidraw/01-landing.excalidraw --replace`
2. **Editar:** mantené el contrato (no cambies stroke/roughness/fontFamily). Nuevas cards = nuevo `groupId` (como la referencia).
3. **Exportar:** `npx -y mcp-excalidraw-server export --out docs/ux/excalidraw/01-landing.excalidraw`
4. **Validar:** `python3 -m json.tool docs/ux/excalidraw/01-landing.excalidraw > /dev/null` y que abra en excalidraw.com sin errores.

## Inventario por pantalla

| # | Ruta | Componentes clave | Estados |
|---|------|-------------------|---------|
| 01 | `/` | Header, Hero dark + InteractiveTerminal, MissionDendrogram, Modules, Team, Contact, Footer | anon/authed |
| 02 | `/learn` | ModuleGrid, Compass | grid |
| 03 | `/learn/[module]/[slug]` | Sidebar, Section carousel (filtra Resumen), QuizRunner, LabRunner, AssignmentViewer, ReflectionPrompt, CompleteLessonButton | reading/quiz/lab |
| 04 | `/dashboard` | BioreactorProgress, GamingHUD, ProgressCharts, HeroBanner | streak, xp |
| 05 | `/perfil` | ProfileCard, AvatarUpload, ProfileForm, ConsentPendingCard | pending/ok |
| 06 | `/comunidad` | User list + Conectar/Siguiendo | list, filtros |
| 07 | `/laboratorios` | LabHub, ModuleExplorerGrid | hub |
| 08 | `/laboratorios/[module]` | Lab cards por módulo | list |
| 09 | `/laboratorios/[module]/[lesson]` | LabWorkspace (tabs código→consola→viz), Pyodide consoles | run/error/success |
| 10 | `/proyectos` | Project hub | hub |
| 11 | `/proyectos/[module]` | Project module | list |
| 12 | `/proyectos/[module]/[lesson]` | Project lesson workspace | workspace |
| 13 | `/logros` | Achievements | locked/unlocked |
| 14 | `/niveles` | Levels/gamification | locked/unlocked |
| 15 | `/configuracion` | Daily goal, theme, etc. | form |
| 16 | `/bookmarks` | Bookmarks list | empty/list |
| 17 | `/admin` | AdminDashboard, UsersTable | table |
| 18 | `/sign-in` | Clerk sign-in | form |
| 19 | `/sign-up` | Clerk sign-up | form |
| 20 | `/sso-callback` | SSO callback | loading |
| 21-25 | `/(legal)/*` | terminos, privacidad, aviso, cookies, ia | static |
| 26 | `/preview/lesson/[module]/[slug]` | Preview lesson | preview |
| 27 | `/preview/bioreactor` | Preview bioreactor | preview |
| 00 | índice | Mapa navegación completo | — |

Generado con `odd/tasks/ux-excalidraw.md` — Fase 0 completa.
