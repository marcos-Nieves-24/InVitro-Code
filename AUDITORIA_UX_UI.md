# Auditoría UX/UI y Accesibilidad — InVitro-Code

**Worktree:** `/home/biohacker24/proyectos/invitro-code-worktrees/presentation-reemplazo-directo`
**HEAD inspeccionado:** `ff0af93` (docs(odd): auditoria UX de Expediciones y plan de slices/migración)
**Rol:** auditor externo (subagente) — modo **solo lectura**: sin tocar git, sin commits, sin `npm install`, sin dev server, sin modificar código.
**Única entrega:** este archivo.
**Alcance:** tokens y cumplimiento de `DESIGN.md`, accesibilidad concreta por código, evidencia positiva, doc-drift / dead code, inconsistencias de rutas, fallas silenciosas de contenido y precisión pedagógica.
**Idioma del artefacto:** español (artefacto técnico, registro neutro).

---

## 0. Método y reglas de honestidad

1. **Verificación antes de afirmar.** Cada hallazgo marcado `NO_CUMPLE`, `PARCIAL` o `CUMPLE` fue confirmado leyendo el archivo citado. Si no se pudo confirmar por lectura estática, queda marcado **`SOSPECHA`** o **`NO_AUDITADO`** con el método propuesto.
2. **Contraste:** los ratios de este documento son **cálculo WCAG 2.1 sobre los hex del código** (fórmula de luminancia relativa), no medición instrumental en navegador. Sirven para detectar fallos de orden de magnitud; la validación vinculante requiere `axe-core` / Colour Contrast Analyser sobre el render real. Esos casos quedan `NO_AUDITADO` en §8.
3. **Fuentes de contraste usadas:** `--color-storm #677381`, `--color-surface #FFFFFF`, `--color-surface-raised #e8ecf0` (`src/app/globals.css:14-27`), `#0a0a0a` del terminal (`src/components/landing/InteractiveTerminal.tsx`), `#00b2b2` y `bg-white/95` (`src/components/auth/AuthCard.tsx:25`).
4. **No se inventan problemas visuales.** Todo lo puramente visual (render, contraste medido, teclado real) está en §8 como `NO_AUDITADO`.

**Resumen de estados:** 4 `NO_CUMPLE` en tokens, 7 `NO_CUMPLE` en accesibilidad, 8 `CUMPLE` (evidencia positiva), 4 `NO_CUMPLE` en doc-drift/dead code, 3 `NO_CUMPLE` en rutas, 4 `NO_CUMPLE`/`PARCIAL` en fallas silenciosas, 3 en contenido pedagógico, 4 `NO_AUDITADO` visuales.

---

## 1. Violaciones de DESIGN.md

### UX-TOK-01 | tokens | NO_CUMPLE | P2
- **Descripción:** el hero de la landing usa un hex hardcodeado `bg-[#111439]` en lugar del token que `DESIGN.md` §4.1 mandaba para esa ventana (`ink #000000`).
- **Evidencia:** `src/app/page.tsx:23` — `<section className="relative overflow-hidden bg-[#111439] …">`; norma contradicha: `DESIGN.md:548` (`HERO (fondo ink #000000)`) y regla de uso de tokens en `DESIGN.md:46`. El resto de la página sí usa tokens (`src/app/page.tsx:18` `bg-surface text-ink`).
- **Impacto en aprendizaje/navegación:** ninguno funcional; el fondo es más claro que el specificado, sigue siendo oscuro y legible. Es deuda de sistema de diseño: cualquier retoque de paleta no se propaga al hero.
- **Solución:** decidir si `#111439` es intencional (entonces documentarlo como token o excepción en `DESIGN.md` §1.1/§1.6) o reemplazar por `bg-ink`. No dejar hex "vivo" sin norma.
- **Archivos:** `src/app/page.tsx`, `DESIGN.md`.
- **Criterio de aceptación:** el hero no contiene hex arbitrario: usa token documentado, o el hex aparece declarado en la paleta de `DESIGN.md` con su justificación.
- **Prueba:** `grep -n "bg-\[#" src/app/page.tsx` devuelve 0 coincidencias (o el hex está en la tabla de tokens).

### UX-TOK-02 | tokens | NO_CUMPLE | P2
- **Descripción:** `AuthForm.tsx` hardcodea hexes de marca en lugar de usar los tokens del sistema.
- **Evidencia:** `src/components/auth/AuthForm.tsx:387,400,409,422,439,443,450,463,475,484,499,516,524,547` — valores `#E2E8F0`, `#111439`, `#00b2b2`, `#009f9f`, `#5A7A8A`. Confirmado por lectura: **14 líneas**, no solo las 4 citadas inicialmente. El contenedor tampoco es token: `src/components/auth/AuthCard.tsx:25` usa `bg-white/95`, `border-[#00b2b2]/20`, `shadow-[#00b2b2]/10`.
- **Impacto en aprendizaje/navegación:** el flujo de registro es la puerta de entrada a la plataforma; si la paleta cambia, auth queda visualmente desacoplada del resto. Sin impacto directo en usabilidad.
- **Solución:** mapear cada hex a token: `#111439` → `text-ink` (o declararlo), `#E2E8F0` → `border-surface-raised`, `#5A7A8A` → `text-storm` (verificando contraste, ver UX-A11Y-01), `#00b2b2` → `text-mint`.
- **Archivos:** `src/components/auth/AuthForm.tsx`, `src/components/auth/AuthCard.tsx`.
- **Criterio de aceptación:** `grep -c "#[0-9A-Fa-f]\{6\}" src/components/auth/AuthForm.tsx` = 0.
- **Prueba:** mismo grep + `npm run type-check`.

### UX-TOK-03 | tokens | NO_CUMPLE | P3
- **Descripción:** `lab-progress.tsx` pinta sus pozos con `bg-teal-500` / `bg-blue-600`, fuera de la paleta. **Es una violación que el propio `DESIGN.md` admite.**
- **Evidencia:** `src/components/lesson/lab-progress.tsx:15` (`bg-teal-500`), `:17` (`bg-blue-600`), `:26` (`bg-teal-500` para el conector); `DESIGN.md:266-268` — «`LabProgress` (…) pinta sus pozos con Tailwind hardcodeado (`bg-teal-500`, `bg-blue-600`), no con tokens de §1.1».
- **Impacto:** en aprendizaje, los pozos son el indicador de avance del lab; usar `blue-600` para el "actual" y `teal-500` para "completado" no distingue por forma ni por texto, solo por color (ver UX-A11Y-06).
- **Solución:** usar `bg-success` (completado) y `bg-brand-500` (actual) más un diferenciador no cromático.
- **Archivos:** `src/components/lesson/lab-progress.tsx`.
- **Criterio de aceptación:** el componente solo usa tokens de `DESIGN.md` §1.1 y el estado "actual" es distinguible sin color.
- **Prueba:** lectura + inspección a escala de grises.

### UX-TOK-04 | tokens / contraste | PARCIAL | P2
- **Descripción:** texto de bajada con `text-storm` sobre superficie clara en el índice de módulos. Viola la regla de uso de `DESIGN.md` («`storm` para texto de soporte, nunca para texto principal») pero **no viola el umbral de contraste AA**.
- **Evidencia:** `src/app/learn/page.tsx:35` — `<p className="mt-1 text-storm">Cada módulo es una expedición…`; regla en `DESIGN.md:49`. Cálculo sobre hex: `#677381` sobre `#FFFFFF` = **4.83:1** → pasa AA (4.5:1) por margen estrecho, falla AAA. **Pero** sobre `--color-surface-raised #e8ecf0` da **4.07:1** → falla AA. El contenedor hereda `bg-dot-grid` (`src/app/globals.css:288-291`), que es un patrón de puntos sobre blanco, no una superficie sólida: el cálculo exacto requiere medición instrumental → ver `UX-VIS-02`.
- **Impacto:** la bajada es la primera frase que orienta al estudiante en `/learn`; a 4.83:1 con 14-16px es legible pero al límite para baja visión.
- **Solución:** usar `text-ink`/70 o `text-graphite` para la bajada, y reservar `storm` para metadata (eyebrow, contador). Si se mantiene `storm`, fijar la superficie en blanco sólido y documentarlo.
- **Archivos:** `src/app/learn/page.tsx`.
- **Criterio de aceptación:** contraste ≥ 4.5:1 medido en navegador sobre la superficie real de render.
- **Prueba:** Playwright + `getComputedStyle`, o Colour Contrast Analyser sobre captura.

---

## 2. Accesibilidad concreta

### UX-A11Y-01 | contraste | NO_CUMPLE | P0/P1
- **Descripción:** los enlaces de consentimiento y el botón "Reenviar código" del formulario de auth usan `#00b2b2` como **color de texto** sobre la tarjeta blanca. Cálculo WCAG: `#00b2b2` sobre `#FFFFFF` = **2.62:1**, muy por debajo del mínimo AA 4.5:1 para texto normal.
- **Evidencia:** `src/components/auth/AuthForm.tsx:450` y `:463` (`className="font-medium text-[#00b2b2] underline …"` sobre la política de privacidad y el aviso legal), `:524` (botón "Reenviar código"); superficie: `src/components/auth/AuthCard.tsx:25` (`bg-white/95`, sobre `#fdfdfd` da 2.58:1).
- **Impacto en aprendizaje/navegación:** **Alto.** Son los enlaces del consentimiento legal (Ley 1581) que el estudiante debe leer para registrarse, y el botón para recuperar el código de verificación por email. Un usuario con baja visión no puede leerlos; el subrayado mitiga la identificación pero no la legibilidad. Bloquea parcialmente la tarea esencial "crear cuenta".
- **Solución:** usar un tono oscuro del mismo tono para texto: p. ej. `#00808f`-ish (≥4.5:1) o el token `text-brand-800 #00388C`. Mantener `#00b2b2` solo para bordes/acentos gráficos (donde el umbral es 3:1 y 2.62:1 igual falla para componentes de UI → usar `#00a2a2`+ o `border-mint` con contraste verificado).
- **Archivos:** `src/components/auth/AuthForm.tsx`, `src/components/auth/AuthCard.tsx`.
- **Criterio de aceptación:** todo texto `#00b2b2` reemplazado por un color con ≥4.5:1 sobre `bg-white/95`; `axe-core` sin violación `color-contrast` en `/sign-in` y `/sign-up`.
- **Prueba:** Playwright con axe-core en ambas rutas + captura anotada.

### UX-A11Y-02 | foco visible | NO_CUMPLE | P1
- **Descripción:** input de búsqueda con `focus:outline-none` y **sin reemplazo de foco**. Se elimina el indicador de foco del navegador y no se aporta otro.
- **Evidencia:** `src/components/search/CommandPalette.tsx:180` — `className="… focus:outline-none"`. Es la paleta **viva** (usada por `/learn` y `/dashboard` vía `CommandPaletteProvider`, `src/app/learn/layout.tsx:3`, `src/app/(dashboard)/layout.tsx:2`). Nota atenuante: el input es `role="combobox"` con `aria-activedescendant` y el resultado activo se resalta en el listbox (`:170-172`), así que el usuario de teclado **sí** tiene señal de posición; lo que desaparece es el anillo sobre el input mismo.
- **Impacto:** quien tabula ve el cursor en el input pero sin contorno; en una página con fondo claro y borde inexistente el foco es difícil de ubicar.
- **Solución:** `focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2` (patrón ya usado en `ModuleCard`/`LessonCard`), conservando `aria-activedescendant`.
- **Archivos:** `src/components/search/CommandPalette.tsx`.
- **Criterio de aceptación:** con Tab, el input muestra un anillo de foco perceptible (≥3:1 contra el fondo adyacente) y el listbox sigue resaltando la opción activa.
- **Prueba:** recorrido de tabulación con Playwright, captura del estado enfocado.

### UX-A11Y-03 | foco visible | NO_CUMPLE | P3 (componente muerto)
- **Descripción:** misma práctica (`outline-none` sin reemplazo) en la segunda CommandPalette, que **no tiene referencias en el código**.
- **Evidencia:** `src/components/layout/CommandPalette.tsx:119` — `className="… outline-none"`. Sin referencias: `grep -rn "layout/CommandPalette" src` = 0 coincidencias.
- **Impacto:** ninguno en producción (no se renderiza). Se documenta para no reintroducirlo al resucitar el componente.
- **Solución:** eliminar el archivo (ver UX-DRIFT-02) o, si se va a usar, aplicar el mismo anillo que UX-A11Y-02.
- **Archivos:** `src/components/layout/CommandPalette.tsx`.
- **Criterio de aceptación:** el archivo se elimina o cumple 2.4.7.
- **Prueba:** grep de referencias.

### UX-A11Y-04 | foco visible / controles | NO_CUMPLE | P2
- **Descripción:** los sliders de los trainers usan `accent-brand focus:outline-none`: se colorea el control pero **se elimina el indicador de foco del teclado**. `accent-*` es color de relleno, no indicador de foco.
- **Evidencia:** `src/components/lesson/knn-trainer.tsx:880`, `src/components/lesson/overfitting-trainer.tsx:625`, `src/components/lesson/perceptron-trainer.tsx:632`, `src/components/lesson/regression-trainer.tsx:456` y `:477` — todas con `className="w-full accent-brand focus:outline-none"`. **Inconsistencia interna:** los botones de esos mismos archivos sí usan patrón correcto, p. ej. `knn-trainer.tsx:734,737` (`focus:ring-2 focus:ring-mint/40`), `overfitting-trainer.tsx:528,531`, `perceptron-trainer.tsx:483,486`, `regression-trainer.tsx:333,336` y `:518`.
- **Impacto:** los sliders ajustan parámetros del modelo (k de KNN, grado del polinomio, learning rate). Un usuario que navega por teclado no puede ver qué slider tiene el foco y ajustar a ciegas.
- **Solución:** añadir `focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2` al input range; alternativamente `focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint`.
- **Archivos:** los 4 trainers.
- **Criterio de aceptación:** cada slider muestra anillo al recibir foco por teclado; `axe-core`/inspección manual confirma foco visible en los 5 controles.
- **Prueba:** Playwright, `page.focus()` sobre cada `input[type=range]` + captura.

### UX-A11Y-05 | ARIA / navegación | NO_CUMPLE | P2
- **Descripción:** `SectionsDropdown` y `SectionsDrawer` no exponen roles ni atributos ARIA: el botón disparador no tiene `aria-expanded`/`aria-haspopup`/`aria-controls`, el panel no tiene `role="menu"`/`role="dialog"`, no hay gestión de foco ni cierre con Escape.
- **Evidencia:** `src/components/layout/SectionsDropdown.tsx` — lectura completa (108 líneas): el `<button>` de `:49-56` no lleva ningún `aria-*`; el panel `:61-68` es un `motion.div` sin rol; el cierre es solo por clic externo (`:34-42`) o `onMouseLeave` (`:67`). `src/components/layout/SectionsDrawer.tsx` (142 líneas): `grep -n "role=\|aria-"` = **0 coincidencias**.
- **Impacto:** con lector de pantalla, el usuario no sabe que el botón abre un menú, ni que el menú se abrió, y no puede cerrarlo con teclado. Además el cierre por `onMouseLeave` puede descartar el panel mientras el usuario lo lee.
- **Solución:** `aria-expanded`, `aria-haspopup="true"`, `aria-controls="sections-menu"`, `role="menu"` + `role="menuitem"` en los ítems, cierre con Escape, devolución del foco al disparador y focus trap simple; quitar `onMouseLeave` como mecanismo de cierre.
- **Archivos:** `src/components/layout/SectionsDropdown.tsx`, `src/components/layout/SectionsDrawer.tsx`.
- **Criterio de aceptación:** con teclado se abre, navega con flechas, se cierra con Escape y el foco vuelve al disparador; lector de pantalla anuncia «menú, contraído/expandido».
- **Prueba:** recorrido de teclado con Playwright + verificación manual con NVDA/VoiceOver.

### UX-A11Y-06 | uso del color | NO_CUMPLE | P2
- **Descripción:** el indicador de avance del lab distingue «completado» / «actual» / «pendiente» **solo por color**, y el color del estado completado no alcanza el umbral de contraste para componentes de UI.
- **Evidencia:** `src/components/lesson/lab-progress.tsx:13-19` — `bg-teal-500` (completado), `bg-blue-600` + sombra (actual), `border-2 border-gray-300 bg-transparent` (pendiente). Cálculo: `#14b8a6` sobre `#FFFFFF` = **2.49:1**, por debajo del 3:1 que WCAG 1.4.11 exige para objetos gráficos. Además, sin texto alternativo, un lector de pantalla no recibe ninguna información de progreso.
- **Impacto:** un estudiante daltónico o con baja visión no puede distinguir «ya hecho» de «estoy acá»; el carrusel sí anota «Diapositiva N de M», pero el avance del lab queda mudo.
- **Solución:** añadir diferenciador de forma (relleno/ anillo / check en el pozo actual) y un texto `sr-only` tipo «Paso 2 de 4»; subir el contraste del color completado a ≥3:1.
- **Archivos:** `src/components/lesson/lab-progress.tsx`.
- **Criterio de aceptación:** los tres estados se distinguen en escala de grises y existe anuncio textual del progreso.
- **Prueba:** captura en escala de grises + lectura con lector de pantalla.

### UX-A11Y-07 | semántica HTML | PARCIAL | P2
- **Descripción:** `<h1>` anidado dentro de una lección que ya tiene su propio `<h1>`, lo que rompe la jerarquía de encabezados.
- **Evidencia:** `src/components/lesson/threshold-lab.tsx:197` — `<h1 className="text-2xl font-bold text-gray-900">Experimento de umbral de clasificación</h1>`, renderizado dentro de la lección cuyo título es `<h1>` (`src/app/learn/[module]/[slug]/page.tsx:84`, según `legal/accessibility-audit.md:110`). Además usa `text-gray-900` en lugar de `text-ink` (deriva de token, ver UX-TOK-02).
- **Impacto:** la navegación por encabezados con lector de pantalla presenta dos `<h1>` y un salto de nivel incorrecto; quien navega por headings para orientarse en la lección se confunde.
- **Solución:** degradar a `<h2>` (o `<h3>` si ya hay `<h2>` de sección) y usar `text-ink`.
- **Archivos:** `src/components/lesson/threshold-lab.tsx`.
- **Criterio de aceptación:** `axe-core` regla `heading-order` sin violaciones en la ruta de lección.
- **Prueba:** axe-core sobre `/learn/<mod>/<slug>`.

### UX-A11Y-08 | foco visible | PARCIAL | P2
- **Descripción:** enlaces de navegación de la landing y del footer sin indicador de foco explícito. Queda pendiente de medición instrumental (hereda el outline del navegador, que existe pero no está diseñado).
- **Evidencia:** `grep -n "focus-visible\|focus:ring\|focus:outline" src/components/landing/Header.tsx` = **0 coincidencias**; `src/components/landing/Footer.tsx` = **0 coincidencias**. Contraste con el patrón correcto ya aplicado en `src/components/modules/ModuleCard.tsx:23` y `src/components/modules/LessonCard.tsx:61` (`focus-visible:ring-2 focus-visible:ring-mint`).
- **Impacto:** la landing es la puerta pública; si el outline heredado se suprime por reset global o por `outline-none` en un ancestro, la navegación por teclado queda sin señal.
- **Solución:** aplicar `focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2` a los enlaces del header y a los iconos sociales del footer.
- **Archivos:** `src/components/landing/Header.tsx`, `src/components/landing/Footer.tsx`.
- **Criterio de aceptación:** todo enlace de la landing muestra anillo al tabular, verificado en navegador.
- **Prueba:** recorrido de tabulación con Playwright sobre `/`.

---

## 3. Lo que SÍ cumple (evidencia positiva)

### UX-A11Y-09 | imágenes | CUMPLE
- **Descripción:** los 14 `<img>` de `src/` tienen atributo `alt`. Los decorativos usan `alt=""` (correcto) y los informativos describen contenido.
- **Evidencia:** `src/app/(legal)/layout.tsx` (`alt="InVitro-Code"`), `src/components/labs/LabCardArt.tsx:32-34` (`alt={theme.label}`), `src/components/landing/Header.tsx:33-36`, `src/components/landing/Footer.tsx:28-31`, `src/components/landing/MissionDendrogram.tsx` (`alt=""`-decorativo verificado), `src/components/layout/InVitroShell.tsx`, `src/components/layout/AppSidebar.tsx:155`, `src/components/learn/Sidebar.tsx:133`, `src/components/auth/AuthShell.tsx:28`, `src/components/profile/ProfileCard.tsx:37` (`alt={displayName}`), `src/components/profile/AvatarUpload.tsx:57,63`, `src/components/dashboard/DashboardContainer.tsx` (`alt=""` para favicon decorativo), `src/components/dashboard/ScientistFigure.tsx:38` (`alt={alt}`).
- **Impacto:** positivo — cumple WCAG 1.1.1.
- **Solución:** mantener. Refinamiento menor pendiente de decisión de producto (`LabCardArt` con `alt={theme.label}` genérico).
- **Archivos:** los citados.
- **Criterio de aceptación:** `grep -rn "<img" src --include="*.tsx" | grep -v "alt="` sigue devolviendo 0.
- **Prueba:** ese grep.
### UX-A11Y-10 | ARIA / carrusel | CUMPLE
- **Descripción:** el carrusel de lección anuncia el cambio de diapositiva y etiqueta la zona de slides.
- **Evidencia:** `src/components/lesson/lesson-carousel.tsx:204-211` (región con `aria-live="polite"` y texto «Diapositiva N de M»), `:222` (`role="group"` + `aria-label={`Diapositiva ${current + 1} de ${total}`}`), `:257` (`aria-label="Diapositiva anterior"`), `:321-322` (live region `sr-only` con `aria-live="polite" aria-atomic="true"`).
- **Impacto:** positivo — un usuario ciego sabe en qué diapositiva está y que el contenido cambió.
- **Solución:** mantener; reutilizar este patrón como referencia para los trainers (UX-A11Y-04) y `lab-progress` (UX-A11Y-06).
- **Archivos:** `src/components/lesson/lesson-carousel.tsx`.
- **Criterio de aceptación:** el anuncio sigue presente tras cualquier refactor del carrusel.
- **Prueba:** lectura + verificación con lector de pantalla.

### UX-A11Y-11 | ARIA / diálogo | CUMPLE
- **Descripción:** `DialogueBox` expone la burbuja de diálogo como región anunciable y los avatares como imágenes etiquetadas.
- **Evidencia:** `src/components/lesson/presentation/DialogueBox.tsx:236-238` (`role="region"`, `aria-live="polite"`, `aria-label={`Diálogo de ${resolvedSpeaker}`}`), `:17-18` y `:54-55` (`role="img"` + `aria-label` para Coni y Dra. Coni), `:253` y `:278` (`aria-hidden="true"` en decoración).
- **Impacto:** positivo — el diálogo pedagógico es navegable y anunciado.
- **Solución:** mantener.
- **Archivos:** `src/components/lesson/presentation/DialogueBox.tsx`.
- **Criterio de aceptación:** sin cambios regresivos en esos atributos.
- **Prueba:** lectura.

### UX-A11Y-12 | ARIA / pregunta | CUMPLE
- **Descripción:** `ChoiceQuestion` implementa radiogroup etiquetado con la pregunta y regiones de estado para el feedback.
- **Evidencia:** `src/components/lesson/presentation/ChoiceQuestion.tsx:166-167` (`role="radiogroup"`, `aria-label={question}`), `:184` (`aria-live="polite"` en la pista), `:190` (`role="alert"` en el error), `:202-203` y `:227-228` (`role="status"` / `role="note"` con `aria-live`).
- **Impacto:** positivo — la interacción de evaluación es operable y anunciable.
- **Solución:** mantener.
- **Archivos:** `src/components/lesson/presentation/ChoiceQuestion.tsx`.
- **Criterio de aceptación:** sin cambios regresivos.
- **Prueba:** lectura.

### UX-A11Y-13 | ARIA / banner | CUMPLE
- **Descripción:** el banner de consentimiento pendiente se anuncia como alerta.
- **Evidencia:** `src/components/layout/ConsentBanner.tsx:22` (`role="alert"`).
- **Impacto:** positivo — el usuario sabe que su cuenta requiere acción.
- **Solución:** mantener.
- **Archivos:** `src/components/layout/ConsentBanner.tsx`.
- **Criterio de aceptación:** sin cambios regresivos.
- **Prueba:** lectura.

### UX-A11Y-14 | foco visible / tarjetas | CUMPLE
- **Descripción:** patrón correcto de foco visible ya aplicado en las tarjetas de módulo y lección, y en otros controles.
- **Evidencia:** `src/components/modules/ModuleCard.tsx:23` y `src/components/modules/LessonCard.tsx:61` (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2`), `src/components/labs/LabHistoryCard.tsx:70`, `src/components/lesson/BookmarkButton.tsx:69`, `src/components/labs/workspace/LabCompletionBanner.tsx:70`.
- **Impacto:** positivo — es el patrón a propagar a Header/Footer (UX-A11Y-08) y sliders (UX-A11Y-04).
- **Solución:** extraer a una clase utilitaria compartida para evitar repetición.
- **Archivos:** los citados.
- **Criterio de aceptación:** una sola definición del anillo, aplicada en todos los controles interactivos.
- **Prueba:** grep de `focus-visible:ring-mint`.

### UX-A11Y-15 | formularios | CUMPLE (corrige hallazgo previo)
- **Descripción:** el textarea de reflexión **ya tiene** etiqueta programática. Esto corrige un gap listado en `legal/accessibility-audit.md` (§4 del checklist, ítem 4).
- **Evidencia:** `src/components/lesson/reflection-check.tsx:67-72` — `<label htmlFor={`reflection-${blockId}`} className="sr-only">Respuesta a: {prompt}</label>` + `aria-label={`Respuesta a: ${prompt}`}` en el `<textarea>` (`:70-71`).
- **Impacto:** positivo; la auditoría legal quedó desactualizada en este punto.
- **Solución:** mantener y actualizar `legal/accessibility-audit.md`.
- **Archivos:** `src/components/lesson/reflection-check.tsx`, `legal/accessibility-audit.md`.
- **Criterio de aceptación:** el documento legal refleja el estado actual del código.
- **Prueba:** lectura.

### UX-A11Y-16 | ARIA / shell | CUMPLE (corrige hallazgo previo)
- **Descripción:** el botón hamburguesa del shell **ya tiene** `aria-expanded`, `aria-controls` y `aria-label` dinámico, y el panel tiene `id="mobile-nav"`. También corrige el ítem 1 del checklist legal.
- **Evidencia:** `src/components/layout/InVitroShell.tsx:98-101` (`aria-expanded={mobileMenuOpen}`, `aria-controls="mobile-nav"`, `aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}`) y `:109` (`id="mobile-nav"`).
- **Impacto:** positivo; otro punto de doc-drift en la auditoría legal.
- **Solución:** mantener y actualizar `legal/accessibility-audit.md`.
- **Archivos:** `src/components/layout/InVitroShell.tsx`, `legal/accessibility-audit.md`.
- **Criterio de aceptación:** el documento legal refleja el estado actual.
- **Prueba:** lectura.

### UX-A11Y-17 | semántica HTML | CUMPLE (parcial)
- **Descripción:** la jerarquía de encabezados de la landing ya no duplica `<h1>`: `MissionDendrogram` usa `<h2>`.
- **Evidencia:** `src/components/landing/MissionDendrogram.tsx:216` (`<h2 className="mt-3 mb-4 font-display …">`). Pendiente solo el caso de `threshold-lab.tsx:197` (UX-A11Y-07).
- **Impacto:** positivo parcial.
- **Solución:** resolver UX-A11Y-07 para cerrar el ítem 7 del checklist legal.
- **Archivos:** `src/components/landing/MissionDendrogram.tsx`, `src/components/lesson/threshold-lab.tsx`.
- **Criterio de aceptación:** `axe-core` `heading-order` limpio en `/` y en rutas de lección.
- **Prueba:** axe-core.

---

## 4. Doc-drift y dead code

### UX-DRIFT-01 | doc-drift | NO_CUMPLE | P2
- **Descripción:** `DESIGN.md` documenta dos componentes de UI que **no existen** en el código.
- **Evidencia:** `DESIGN.md:180` — `PageShell` → `src/components/ui/PageShell.tsx`; `DESIGN.md:185` — `SiteHeader` → `src/components/ui/SiteHeader.tsx`. Verificación: `ls src/components/ui/` devuelve `Button.tsx`, `Callout.tsx`, `Card.tsx`, `EmptyState.tsx`, `index.ts`, `ScrollReveal.tsx`, `SlideArrowButton.tsx`, `TypingText.tsx`; `grep -rn "PageShell\|SiteHeader" src` = **0 coincidencias**.
- **Impacto:** quien implementa una pantalla nueva busca el contenedor canónico y no lo encuentra; se terminan creando wrappers ad-hoc (exactamente lo que pasó con `bg-dot-grid` en `/learn`).
- **Solución:** opción A — crear esos componentes como contenedor canónico; opción B — borrar las filas de `DESIGN.md` y documentar el contenedor real que se usa. **Recomiendo B** si no hay consumo.
- **Archivos:** `DESIGN.md`, `src/components/ui/`.
- **Criterio de aceptación:** cada fila de la tabla `DESIGN.md` §2.2 apunta a un archivo que existe, o está marcada como «planificada».
- **Prueba:** script que cruce las rutas de `DESIGN.md` §2.2 contra el filesystem.

### UX-DRIFT-02 | dead code | NO_CUMPLE | P2
- **Descripción:** **dos CommandPalette paralelas**. La de `layout/` (165 líneas) no tiene ninguna referencia; la viva es la de `search/` (255 líneas) consumida vía provider.
- **Evidencia:** `src/components/search/CommandPalette.tsx` (255 líneas) usada por `src/components/search/CommandPaletteProvider.tsx:3,10`, montada en `src/app/learn/layout.tsx:3,18` y `src/app/(dashboard)/layout.tsx:2,19`. `src/components/layout/CommandPalette.tsx` (165 líneas): `grep -rn "layout/CommandPalette" src` = **0 coincidencias**. Ambas con placeholder distinto (`"Buscar lecciones, módulos..."` vs `"Buscar módulos, cursos, configuración..."`), lo que delata que son de épocas distintas.
- **Impacto:** confusión de mantenimiento (dos paletas con comportamiento y accesibilidad distintas) y 165 líneas muertas. Paradoja: la copia muerta es la que tiene `outline-none` sin reemplazo (UX-A11Y-03), y la viva también (UX-A11Y-02).
- **Solución:** eliminar `src/components/layout/CommandPalette.tsx`; unificar en una sola implementación con los requisitos ARIA de combobox.
- **Archivos:** `src/components/layout/CommandPalette.tsx` (eliminar), `src/components/search/CommandPalette.tsx` (corregir foco).
- **Criterio de aceptación:** una sola implementación de CommandPalette, referenciada por los dos layouts, con foco visible.
- **Prueba:** grep de referencias + recorrido de teclado.

### UX-DRIFT-03 | dead code | NO_CUMPLE | P2
- **Descripción:** dead code confirmado por ausencia de referencias (con **dos correcciones** a la lista original).
- **Evidencia verificada una por una (`grep -rn "<Nombre>" src` excluyendo el propio archivo):**
  - `src/components/landing/DendrogramAnimation.tsx` → **0 referencias → MUERTO confirmado.**
  - `src/components/ui/ScrollReveal.tsx` → **0 referencias → MUERTO confirmado** (y no se exporta en `src/components/ui/index.ts`).
  - `src/components/ui/Card.tsx` → **0 imports → MUERTO confirmado** (el barrel `src/components/ui/index.ts` exporta `Button`, `Callout`, `EmptyState`, `SlideArrowButton`, `TypingText`; **no** exporta `Card`; las coincidencias de `\bCard\b` son comentarios y nombres como `AuthCard`/`ModuleCard`/`LabCard`, que son otros archivos).
  - **Corrección 1:** `dashboard/BioTechGrowthTube.tsx` **no existe con ese nombre**. El archivo real es `src/components/dashboard/BiotechGrowthTube.tsx` (minúscula la «t») y **sí tiene referencias**: `src/components/dashboard/DashboardContainer.tsx:22,194,198` y `src/components/modules/CardPrimitives.tsx:7,107`. → **NO es dead code.**
  - **Corrección 2:** `ui/Callout.tsx` **sí se usa**: se exporta en `src/components/ui/index.ts:2` y lo consumen `src/components/lesson/callout-info.tsx:1`, `src/components/lesson/callout-check.tsx:1` y (vía barrel) `src/components/lesson/reflection-check.tsx`. → **NO es dead code.**
- **Impacto:** 3 archivos muertos reales que inflan el árbol y confunden la tabla de componentes de `DESIGN.md` (§2.2 sigue listando `Card` como si existiera y se usara).
- **Solución:** eliminar `DendrogramAnimation.tsx`, `ScrollReveal.tsx`, `ui/Card.tsx`; **quitar la fila `Card` de `DESIGN.md` §2.2** (o revivir el componente si hay consumo previsto). No tocar `BiotechGrowthTube` ni `Callout`.
- **Archivos:** los tres archivos muertos + `DESIGN.md`.
- **Criterio de aceptación:** los tres archivos eliminados y `DESIGN.md` §2.2 sin filas apuntando a archivos inexistentes o no usados.
- **Prueba:** `npx tsc --noEmit` (o `npm run type-check`) tras el borrado confirma que nada se rompe.

### UX-DRIFT-04 | doc-drift | NO_CUMPLE | P3
- **Descripción:** `DESIGN.md` lista como componente vigente uno que está muerto.
- **Evidencia:** `DESIGN.md:182` — fila `Card` → `src/components/ui/Card.tsx`, archivo sin imports (ver UX-DRIFT-03).
- **Impacto:** menor; refuerza la impresión de que el documento describe un sistema que no coincide con el código.
- **Solución:** eliminar la fila junto con UX-DRIFT-03.
- **Archivos:** `DESIGN.md`.
- **Criterio de aceptación:** §2.2 describe solo componentes existentes y usados.
- **Prueba:** cruce doc ↔ filesystem.

---

## 5. Inconsistencias de rutas

### UX-ROUTE-01 | rutas | NO_CUMPLE | P1
- **Descripción:** `/preview/cards` es pública y muestra **progreso mock**: el primer módulo aparece 60% completado sin que exista usuario ni datos reales. El mock está declarado en el código y en el encabezado de la página, pero un visitante anónimo ve una barra de progreso que no corresponde a nada.
- **Evidencia:** `src/app/preview/cards/page.tsx:1-3` (comentario «Sin auth. (…) progreso mock para demostrar el diseño»), `:19-20` (`// Progreso mock (primer módulo 60%, resto 0) para mostrar ProgressFooter` y `const completed = mod.slug === modules[0]?.slug ? Math.floor(labCount * 0.6) : 0;`), `:64` (texto visible «Progreso mock.»). Ruta pública confirmada en `src/middleware.ts:17` (`"/preview/cards"` dentro de `publicRoutes`).
- **Impacto en aprendizaje/navegación:** un visitante que llega por un enlace compartido concluye que ya tiene 60% del curso hecho. Es engañoso aunque esté declarado en letra chica. Además, los enlaces de esas tarjetas apuntan a `/learn/...`, que **sí requiere auth** (UX-ROUTE-03) → el público termina en un redirect a sign-in.
- **Solución:** si la ruta debe existir, sustituir el progreso mock por `null` (estado «sin progreso», que `ModuleCard` ya soporta: `completed: null, total: null` como hace `/learn`) o marcarlo con un badge visible e inequívoco tipo «datos de demostración» en cada tarjeta, no solo en el encabezado.
- **Archivos:** `src/app/preview/cards/page.tsx`, `src/middleware.ts`.
- **Criterio de aceptación:** ninguna superficie pública muestra progreso inventado; o toda tarjeta con datos ficticios lleva un badge visible por tarjeta.
- **Prueba:** visita anónima a `/preview/cards` (Playwright) y verificación de que no hay barra de progreso con valores falsos.

### UX-ROUTE-02 | rutas | NO_CUMPLE | P2
- **Descripción:** `/preview/bioreactor` **no está** en `publicRoutes`, así que un visitante anónimo es redirigido a `/sign-in`: la demo es inalcanzable para quien no tiene cuenta.
- **Evidencia:** `src/middleware.ts:3-18` — `publicRoutes` contiene `/`, `/sign-in`, `/sign-up`, `/sso-callback`, los APIs, `/aviso`, `/privacidad`, `/cookies`, `/terminos`, `/ia`, `/preview/cards`; **no** contiene `/preview/bioreactor`. La rama `if (!isPublic)` de `:44-49` redirige a `signInUrl` con `redirect_url`. La página existe: `src/app/preview/bioreactor/page.tsx`.
- **Impacto:** si el propósito de la ruta es mostrar el componente (`Preview — BioreactorProgress`, `:20`), hoy no cumple ese propósito para nadie sin cuenta. Inconsistente con `/preview/cards`, que sí es pública.
- **Solución:** decidir el destino: (a) añadir `/preview/bioreactor` a `publicRoutes` si es una demo pública, o (b) eliminar la ruta si era un andamio de desarrollo. No dejarla a medio camino.
- **Archivos:** `src/middleware.ts`, `src/app/preview/bioreactor/page.tsx`.
- **Criterio de aceptación:** la ruta es pública y renderiza, o no existe.
- **Prueba:** `curl -I` / Playwright anónimo sobre `/preview/bioreactor` devuelve 200 (no 307 a sign-in).

### UX-ROUTE-03 | rutas / doc-drift | NO_CUMPLE | P1
- **Descripción:** `/learn` requiere autenticación, contradiciendo `DESIGN.md` §3.1, que la declara pública.
- **Evidencia:** `DESIGN.md:518` — `| /learn | src/app/learn/page.tsx | Índice de módulos (público) |` (sección 3.1 «Rutas Públicas»). En el código, `src/middleware.ts:3-18` **no** lista `/learn` en `publicRoutes`, y `:44-49` redirige al anónimo a `/sign-in?redirect_url=/learn`. Solo `/ia` quedó pública (`:16`).
- **Impacto en aprendizaje/navegación:** **Alto.** El índice de módulos es la pantalla de descubrimiento («Elige tu Expedición»). Un estudiante que llega desde la landing («Ver módulos») choca con un muro de login antes de ver qué puede estudiar. Contradice el documento de diseño y la promesa implícita de la landing pública.
- **Solución:** elegir una de las dos y alinearlas: (a) añadir `"/learn"` a `publicRoutes` (el índice no filtra datos de usuario: `src/app/learn/page.tsx:11-27` solo lee del filesystem y calcula XP, y `EXP-013` documenta que no muestra progreso real), o (b) corregir `DESIGN.md` §3.1 y quitar de la landing todo enlace que apunte a `/learn` sin pasar por auth. **Recomiendo (a)**: es contenido público, sin dato personal, y coincide con el diseño documentado.
- **Archivos:** `src/middleware.ts`, `DESIGN.md`, `src/app/learn/page.tsx`.
- **Criterio de aceptación:** visita anónima a `/learn` devuelve 200 con el grid de módulos, y `DESIGN.md` §3.1 coincide con `publicRoutes`.
- **Prueba:** Playwright anónimo sobre `/learn` + `curl -s -o /dev/null -w "%{http_code}"`.

---

## 6. Fallas silenciosas

### UX-CONT-01 | contenido | NO_CUMPLE | P1
- **Descripción:** `InteractiveFrame` con `src` roto muestra un iframe en blanco **sin ningún mensaje de error**: el usuario ve un rectángulo vacío. No hay `onError`, ni fallback, ni validación en build.
- **Evidencia:** `src/components/lesson/interactive-frame.tsx:7-30` — el componente es un `<iframe src={src} title={caption ?? src}>` (`:15-21`) sin manejo de error; solo renderiza el `caption` debajo (`:23-27`). Contrato documentado en `DESIGN.md:435-437` («Si no existe, el iframe queda en blanco: no se ve un 404, porque el `<iframe>` responde con su propio documento de error. Un `src` mal escrito falla en silencio.»).
- **Impacto en aprendizaje:** el estudiante lee «¿Qué muestra exactamente?» y debajo no hay nada. Interpreta que la página está rota o que su conexión falló; no hay forma de distinguirlo de un error real.
- **Solución:** en build, un chequeo que cruce cada `src="/interactives/..."` del contenido contra `public/interactives/` y falle el build si no existe (script npm `verify:interactives`). En runtime, `onError` + fallback visible («Este interactivo no está disponible temporalmente») y, si se conoce, un enlace al nombre correcto.
- **Archivos:** `src/components/lesson/interactive-frame.tsx`, script de verificación nuevo.
- **Criterio de aceptación:** `npm run verify:interactives` falla si algún `src` no existe en disco; el componente renderiza fallback ante error.
- **Prueba:** ejecutar el script (hoy debe fallar con los 2 casos de abajo) + test del componente con src inválido.

### UX-CONT-02 | contenido | NO_CUMPLE | P1
- **Descripción:** dos referencias a interactivos inexistentes en lecciones del módulo IA. Se verificó cruzando el contenido contra el disco.
- **Evidencia:**
  - `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md:187` → `src="/interactives/demo_10_pipeline_ml.html"`. En disco existe `public/interactives/demo_10_pipeline.html` («Demo 10: Pipeline Completo de Clasificación con ML») pero **no** `demo_10_pipeline_ml.html`. El nombre correcto es casi con seguridad `demo_10_pipeline.html`.
  - `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md:280` → `src="/interactives/demo_06b_overfitting.html"`. **No existe** y tampoco hay candidato equivalente en disco. Ya estaba documentado como mismatch: `DESIGN.md:438-440`.
  - Barrido completo del contenido: solo 3 `InteractiveFrame` usan `/interactives/`; los otros dos están rotos y el tercero (`demo_07_protein_3d.html`) sí existe.
- **Impacto:** dos lecciones del módulo IA (el que usa la capa de presentación) entregan una zona vacía justo donde el contenido promete explicar el pipeline de ML y el sobreajuste. Son los dos conceptos centrales del módulo.
- **Solución:** corregir `lesson03:187` a `demo_10_pipeline.html`; para `lesson02:280`, o construir el interactivo de sobreajuste o reemplazar la referencia por una explicación textual más el trainer existente (`overfitting-trainer.tsx` ya cubre el tema).
- **Archivos:** las dos `lesson.md`, `public/interactives/`.
- **Criterio de aceptación:** `verify:interactives` en verde; las dos lecciones renderizan interactivo real.
- **Prueba:** el script + carga de ambas lecciones.

### UX-CONT-03 | contenido | PARCIAL | P2
- **Descripción:** el 85% de los interactivos publicados no los referencia ninguna lección.
- **Evidencia:** en `public/interactives/` hay 7 archivos; el contenido referencia 3 distintos (2 de ellos roto), y **6 quedan huérfanos**: `demo_01_features` («Características de conidias»), `demo_02_patterns` («Demo 02: Reconocimiento visual de patrones»), `demo_03_rules` («Demo 03: Reglas fijas vs IA»), `demo_08_alphafold` («Demo 08: AlphaFold — Línea de Tiempo y Comparación»), `demo_09_rentosertib` («Demo 09: Rentosertib — IA en Descubrimiento de Fármacos»), `demo_10_pipeline` («Demo 10: Pipeline Completo de Clasificación con ML», el que **debería** usar `lesson03:187`).
- **Impacto:** trabajo ya hecho y no aprovechado. En particular `demo_08_alphafold`, `demo_09_rentosertib` y `demo_10_pipeline` encajan temáticamente con `ia/lesson03` (habla de AlphaFold, de pipeline de ML y de casos reales); y `demo_02_patterns`/`demo_03_rules` encajan con `ia/lesson02`.
- **Solución:** inventariar los 7 interactivos, mapear cada uno a la lección que le corresponde y referenciarlos desde el contenido (o borrarlos si quedan obsoletos). `demo_01_features` encaja con el módulo IA de introducción.
- **Archivos:** `public/interactives/*`, `src/content/modules/**/lesson.md`.
- **Criterio de aceptación:** cada interactivo en disco tiene al menos una referencia, o se elimina; cada lección que promete un demo lo tiene.
- **Prueba:** el mismo cruce contenido ↔ disco, en ambos sentidos.

### UX-CONT-04 | contenido pedagógico | PARCIAL | P2
- **Descripción:** la capa de presentación (diálogos, reveals, animaciones) solo se usa en 1 de los 4 módulos; 37 de 41 lecciones no tienen ninguna animación.
- **Evidencia:** `grep` de `RevealSequence|DialogueBox|ChoiceQuestion|SlideInPanel|AnimatedCounter` sobre las 41 `lesson.md` da **4 coincidencias, todas en `ia/`**: `lesson01_what_is_ai` (6 `RevealSequence`, 1 `DialogueBox`, 7 `ChoiceQuestion`), `lesson02_how_ai_learns` (1 `RevealSequence`, 13 `ChoiceQuestion`), `lesson03_ai_in_biotech` (1 `RevealSequence`, 11 `ChoiceQuestion`), `lesson04_real_cases` (1 `RevealSequence`, 12 `ChoiceQuestion`). **Corrección a la afirmación original:** no es «solo lesson01»; las 4 lecciones de IA usan la capa, pero **solo `lesson01` usa `DialogueBox`** y solo ella tiene reveals densos (6 vs 1). Las 37 lecciones de `python` (17), `machine-learning` (10) y `estadistica` (10) no usan ningún componente de la capa.
- **Impacto en aprendizaje:** el módulo IA se siente como un curso interactivo narrativo; los otros tres se leen como documentación estática. Un estudiante que pasa de IA a Python percibe un cambio de plataforma, no de tema. Además, al concentrarse el uso en 4 lecciones, la capa tiene pocos consumidores reales que la estabilicen.
- **Solución:** decisión de producto, no un bug: (a) si la capa es el diferenciador, priorizar `python/lesson01` y `machine-learning/lesson01` como pioneras; (b) si no, documentar en `DESIGN.md` §2.5 que la capa es opt-in por lección. Evitar el punto medio actual (capa «canónica» en el doc, usada en el 10% del contenido).
- **Archivos:** `src/content/modules/**/lesson.md`, `DESIGN.md` §2.5.
- **Criterio de aceptación:** el documento de diseño declara el alcance real de la capa, o el contenido nuevo la adopta con un plan por módulo.
- **Prueba:** el grep anterior, ejecutado tras cada lección nueva.

---

## 7. Contenido pedagógico

### UX-PED-01 | contenido | CUMPLE
- **Descripción:** los 4 módulos tienen 41 lecciones y **todas** están completas con los 6 artefactos canónicos.
- **Evidencia:** `src/content/modules/` → `python` (17), `machine-learning` (10), `estadistica` (10), `ia` (4) = **41 lecciones**. Verificación por lección de `lesson.md`, `quiz.md`, `lab.md`, `assignment.md`, `notebook.ipynb`, `references.bib`: **41/41 completas**, 0 incompletas. (Nota: `machine-learning` tiene además 4 directorios `subunits/` con solo `README.md`, que no son lecciones; y las lecciones de `machine-learning`/`estadistica` incluyen un `lab.R` extra, coherente con el enfoque estadístico.)
- **Impacto:** positivo — no hay lecciones a medias que dejen al estudiante en un callejón sin salida.
- **Solución:** mantener; añadir el chequeo de completitud al CI.
- **Archivos:** `src/content/modules/**`.
- **Criterio de aceptación:** 41/41 tras cualquier lección nueva.
- **Prueba:** script de conteo por lección.

### UX-PED-02 | contenido | CUMPLE
- **Descripción:** el frontmatter canónico está presente en las 41 lecciones.
- **Evidencia:** verificación de `Lesson Title` en el frontmatter de las 41 `lesson.md`: **41/41**. Las claves se leen literalmente en `src/app/learn/[module]/[slug]/page.tsx` (`Lesson Title`, `Lesson Number`, `Module`, `Learning Objectives`, `Estimated Duration`, `Prerequisites`, `Difficulty`, documentado en `DESIGN.md` §2.5 y en el contrato de la página de lección).
- **Impacto:** positivo — el título y los metadatos se renderizan en todas las lecciones.
- **Solución:** mantener; validar en CI que ninguna lección nueva rompa las claves.
- **Archivos:** `src/content/modules/**/lesson.md`.
- **Criterio de aceptación:** 41/41 (o 42/42, etc.) tras añadir lecciones.
- **Prueba:** script de frontmatter.

### UX-PED-03 | precisión científica | CUMPLE (con una salvedad)
- **Descripción:** revisión puntual de tres ejemplos con criterio científico; los tres son correctos. Se detectó una imprecisión menor en un cuarto.
- **Evidencia (verificada por lectura):**
  1. **Valor p** — `src/content/modules/estadistica/lessons/lesson03_probability/lesson.md:210`: «un valor p **NO** es la probabilidad de que la hipótesis nula sea verdadera». **Correcto.** Es exactamente el error de interpretación más común y la lección lo nombra como error.
  2. **RMSD / AlphaFold** — `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md:96-105`: «Es regresión: coordenadas continuas. El error se mide con RMSD, que es el ECM en 3D: distancia promedio entre átomos equivalentes» y los umbrales «RMSD < 1Å es excelente; >3Å es poco confiable». **Correcto** (analogía RMSD↔ECM válida; umbrales convencionales en biología estructural). Además `:118` («AlphaFold busca secuencias similares (…) perfil evolutivo») y `:127` (entrenado con «170,000 estructuras resueltas experimentalmente en el PDB`) son correctos en orden de magnitud, y el «problema de 50 años» de `:89` es una formulación aceptada (CASP desde 1994, paradoja de Levinthal 1969).
  3. **200 millones de estructuras** — `lesson03:~140`: «AlphaFold predijo 200 millones de estructuras». **Correcto** (AlphaFold DB, 2022).
  4. **Salvedad (SOSPECHA, P3):** `lesson03:128` — «**Paso 4 — Refinamiento iterativo**: el modelo predice la estructura, calcula la energía, y refina la predicción en múltiples ciclos». AlphaFold2 no usa una función de energía física para refinar: usa reciclado de representaciones y un módulo de estructura aprendido. La frase es plausible para un lego pero técnicamente imprecisa. **No verificable desde el repo** (no hay fuente interna que lo contradiga); requiere revisión por experto o cita.
- **Impacto en aprendizaje:** los tres puntos correctos son justamente los que más se mal enseñan (valor p, naturaleza de regresión del plegado, magnitudes). La salvedad es menor: no invalida la lección, pero perpetúa el mito «AlphaFold = física».
- **Solución:** ajustar `lesson03:128` a «refinamiento por reciclado de representaciones aprendidas, sin simular fuerzas físicas», o marcarlo como simplificación didáctica explícita.
- **Archivos:** `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md`, `src/content/modules/estadistica/lessons/lesson03_probability/lesson.md`.
- **Criterio de aceptación:** revisión por experto de contenido de IA; la frase de refinamiento es técnicamente correcta o está marcada como simplificación.
- **Prueba:** lectura con experto / contraste con la documentación de AlphaFold2.

---

## 8. NO_AUDITADO — lo puramente visual (requiere instrumentación)

> Estos ítems **no** se afirman como fallos ni como cumplimientos. Son los casos que el código no puede decidir y que exigen render real, medición en pantalla o prueba con tecnología asistiva. Se listan con método propuesto para que la próxima pasada sea ejecutable.

### UX-VIS-01 | render real | NO_AUDITADO
- **Descripción:** comportamiento visual por viewport (1440 / 768 / 390 px) de las tarjetas de Expediciones y de la landing completa. El código no permite afirmar cortes, truncamientos ni elipsis.
- **Método propuesto:** Playwright headless con capturas por viewport y `getBoundingClientRect` por tarjeta (procedimiento ya descrito en `odd/tasks/expediciones-ux-audit.md` §1, con evidencia en `/tmp/opencode/audit-expediciones/`).
- **Criterio de aceptación:** ninguna tarjeta renderizada queda recortada por `overflow-hidden`; sin elipsis en descripciones. Si falla: `src/components/landing/OrbitalModules.tsx`, `src/components/modules/ModuleCard.tsx`.

### UX-VIS-02 | contraste | NO_AUDITADO
- **Descripción:** los ratios de este documento son cálculo sobre hex (ver §0). El contraste **vinculante** debe medirse sobre el render real, porque el fondo efectivo puede no ser el hex nominal: `/learn` usa `bg-dot-grid` (`src/app/globals.css:288-291`, patrón de puntos `#d4d4d4` sobre blanco) y auth usa `bg-white/95` (`AuthCard.tsx:25`).
- **Método propuesto:** Playwright con `getComputedStyle` + axe-core regla `color-contrast` sobre `/`, `/learn`, `/sign-in`, `/sign-up` y una lección de cada módulo; o Colour Contrast Analyser sobre capturas.
- **Criterio de aceptación:** 0 violaciones AA en texto normal (4.5:1) y ≥3:1 en componentes de UI. Si falla: los archivos de `UX-A11Y-01`, `UX-TOK-04` y `src/components/landing/InteractiveTerminal.tsx:47,71,222,223` (cálculo propio: `white/40` sobre `#0a0a0a` ≈ 3.77:1 y `white/25` ≈ 2.13:1 → **SOSPECHA de fallo AA** en comentarios del terminal).

### UX-VIS-03 | teclado / lector de pantalla | NO_AUDITADO
- **Descripción:** recorrido real de tabulación, orden de foco, focus trap en modales y anuncios con lector de pantalla. La lectura estática puede confirmar atributos ARIA (hecho en §2 y §3) pero no el comportamiento efectivo.
- **Método propuesto:** Playwright con `page.keyboard` + verificación manual con NVDA (Windows) o VoiceOver (macOS) sobre: carrusel de lección, CommandPalette, `SectionsDropdown`/`SectionsDrawer` (`UX-A11Y-05`) y trainers (`UX-A11Y-04`).
- **Criterio de aceptación:** toda función alcanzable y operable por teclado; anuncios coherentes; sin trampas de foco.

### UX-VIS-04 | modo oscuro | NO_AUDITADO
- **Descripción:** el modo oscuro está implementado (`src/app/globals.css:103-112`, aplicado por `InVitroShell.tsx:31-40`) y **cambia las superficies pero no `text-storm`**. Cálculo propio: `#677381` sobre `#0f0f0f` = **3.97:1** → **SOSPECHA de fallo AA** en modo oscuro. No se puede afirmar sin medir, porque `.eyebrow` sí tiene variante oscura (`globals.css:282-284`) pero el uso directo de `text-storm` no.
- **Método propuesto:** forzar `.dark` en `<html>` vía Playwright y medir contraste de todos los `text-storm` renderizados.
- **Criterio de aceptación:** `text-storm` sobre superficie oscura ≥4.5:1, o usar la variante oscura del token. Si falla: `src/app/globals.css:103-112,282-284` y todo componente con `text-storm` (`src/app/learn/page.tsx:35`, `CardPrimitives.tsx`, trainers).

---

## 9. Reconciliación con auditorías previas

### Con `legal/accessibility-audit.md` (AA parcial, 6/10)
- **Estado declarado:** «A conforme · AA parcialmente conforme (no conformidad plena)», con **4 gaps** y «6/10 ítems en Cumple o Parcial alto»; metodología explícitamente estática, **sin axe ni Lighthouse** («por ausencia de tooling», §0 y metodología). Eso explica que sus hallazgos de contraste sean inferidos.
- **Coincidencias verificadas por mí:** contraste en hero/terminal (su ítem 3), foco visible incompleto (su ítem 2 — confirmado: `Header.tsx` y `Footer.tsx` con 0 `focus-visible`), `threshold-lab.tsx:197` con `<h1>` anidado (su ítem 7 — **sigue abierto**).
- **Correcciones que mi pasada aporta (la auditoría legal quedó desactualizada en 2 de sus 4 gaps):**
  - Su ítem 1 (hamburguesa sin `aria-expanded`) y su ítem 4 (textarea de reflexión sin etiqueta) **ya están corregidos** en el código actual: `InVitroShell.tsx:98-101,109` y `reflection-check.tsx:67-72`. Ver UX-A11Y-15 y UX-A11Y-16.
  - Su ítem 7 quedó **parcialmente** resuelto: `MissionDendrogram.tsx:216` ya usa `<h2>`; solo persiste `threshold-lab.tsx:197` (UX-A11Y-07).
- **Aportes nuevos míos frente a ese documento:** `UX-A11Y-01` (contraste real de `#00b2b2` = 2.62:1, que la auditoría legal no evaluó porque solo miró `text-[#111439]`), `UX-A11Y-04` (sliders de trainers), `UX-A11Y-05` (menús de secciones), `UX-A11Y-06` (uso del color en `lab-progress`), y las secciones de rutas, fallas silenciosas y doc-drift, fuera de su alcance.
- **Conclusión de reconciliación:** el «AA parcial 6/10» sigue siendo una estimación razonable, pero su lista de gaps debe actualizarse: de 4 gaps, **2 están cerrados, 1 parcialmente cerrado y 1 abierto** (foco visible en header/footer), y hay al menos 3 gaps nuevos que sumar.

### Con `odd/tasks/expediciones-ux-audit.md` (auditoría UX previa)
- **Estado declarado:** «PLAN PROPUESTO — ninguna corrección aplicada» (2026-10-11), 15 hallazgos `EXP-001`…`EXP-015`, con **evidencia runtime real** (Playwright + `probe2.json`/`probe3.json`, contraste WCAG calculado en el navegador). Es la fuente de contraste medido más sólida del repo.
- **Coincidencias verificadas por mí:** `EXP-004` (descripción de tarjeta `text-storm` **4.07–4.46:1 medido**, falla AA) — mi cálculo teórico da 4.83:1 sobre blanco y **4.07:1 sobre `surface-raised`**, coincidiendo con su medición en el rango bajo; `EXP-010` (`#668094` sobre `#F8FBFA` = 3.97:1, mi cálculo da 3.97:1 exactos — `Modules.tsx:72`); `EXP-012` (badge «N labs» que en realidad cuenta lecciones: `learn/page.tsx:20` y `OrbitalModules.tsx:136` pasan `labCount: mod.lessonCount`, y `CardPrimitives.tsx:90` renderiza `{count} labs`; `hasLab()` en `lib/content/modules.ts:261` tiene 0 call sites); `EXP-015` (paleta teal local sin documentar: `#0AAE9A`, `#668094`, `#101B3D`, `#DDF5EF`, `#DCEAE8`, `#F0F9F7`, `#F8FBFA` — confirmé al menos `#668094` y `#101B3D` en `Modules.tsx:72` y `MissionDendrogram.tsx:216`).
- **Aportes míos que esa auditoría no cubre (su alcance era solo Expediciones):** toda la sección de accesibilidad, rutas (`UX-ROUTE-*`), fallas silenciosas de interactivos (`UX-CONT-*`) y doc-drift (`UX-DRIFT-*`).
- **Riesgo de deriva detectado:** esa auditoría trabajó sobre `feat/presentation-reemplazo-directo @ dd95eae`; el HEAD actual es `ff0af93`. Antes de aplicar sus 15 correcciones hay que re-verificar cada una contra el árbol actual.

---

## 10. Plan priorizado (resumen para el orquestador)

| Prioridad | IDs | Qué resuelve |
|---|---|---|
| **P0/P1** | `UX-A11Y-01` | Contraste real 2.62:1 en enlaces de consentimiento y «Reenviar código» de auth |
| **P1** | `UX-ROUTE-01`, `UX-ROUTE-03` | `/learn` tras muro de login contraviniendo el diseño; progreso mock público |
| **P1** | `UX-CONT-01`, `UX-CONT-02` | Interactivos rotos en 2 lecciones de IA + ausencia de fallback |
| **P2** | `UX-A11Y-02`, `UX-A11Y-04`, `UX-A11Y-05`, `UX-A11Y-06`, `UX-A11Y-07`, `UX-A11Y-08` | Foco visible (combobox, sliders, header/footer), ARIA en menús, uso del color, jerarquía de headings |
| **P2** | `UX-TOK-01`, `UX-TOK-02`, `UX-TOK-04`, `UX-DRIFT-01`, `UX-DRIFT-02`, `UX-DRIFT-03`, `UX-ROUTE-02`, `UX-CONT-03`, `UX-CONT-04` | Deriva de tokens, dead code, docs que no existen, demo inalcanzable, interactivos huérfanos |
| **P3** | `UX-TOK-03`, `UX-DRIFT-04`, `UX-A11Y-03`, `UX-PED-03` (salvedad) | Violación ya admitida en `DESIGN.md`, componente muerto, imprecisión científica menor |
| **Medición pendiente** | `UX-VIS-01`…`UX-VIS-04` | Render real, contraste instrumental, teclado/lector de pantalla, modo oscuro |

**Secuencia sugerida:** ① `UX-A11Y-01` + `UX-CONT-01`/`UX-CONT-02` (bloquean tareas esenciales: registrarse y estudiar IA) → ② `UX-ROUTE-03` + `UX-ROUTE-01` + `UX-ROUTE-02` (una sola decisión de producto sobre qué es público) → ③ el paquete de foco visible/ARIA (`UX-A11Y-02/04/05/06`) → ④ limpieza de tokens y dead code, actualizando `DESIGN.md` §1.1/§2.2/§3.1 en el mismo cambio → ⑤ pasada instrumental de `UX-VIS-*` y actualización de `legal/accessibility-audit.md`.

---

## Apéndice — comandos de verificación usados

```bash
# Tokens / hexes
grep -n "bg-\[#" src/app/page.tsx
grep -c "#[0-9A-Fa-f]\{6\}" src/components/auth/AuthForm.tsx

# Foco y ARIA
grep -n "outline-none\|accent-" src/components/lesson/*-trainer.tsx
grep -n "role=\|aria-" src/components/layout/Sections{Desktop,Drawer}.tsx   # 0 coincidencias

# Dead code (excluyendo el propio archivo)
grep -rn "\bDendrogramAnimation\b\|\bScrollReveal\b\|\bCard\b\|\bCallout\b" src --include="*.tsx" --include="*.ts"
grep -rn "layout/CommandPalette" src     # 0 -> duplicado muerto
grep -rn "PageShell\|SiteHeader" src    # 0 -> doc-drift en DESIGN.md

# Rutas e interactivos (detectan UX-ROUTE-*, UX-CONT-02 y UX-CONT-03)
grep -n "publicRoutes" -A 20 src/middleware.ts
grep -rho 'src="/interactives/[^"]*"' src/content/modules --include="lesson.md" | sort -u
ls public/interactives/*.html

# Contenido pedagógico
find src/content/modules -mindepth 3 -maxdepth 3 -type d -name "lesson*" | wc -l                          # 41
grep -rl "RevealSequence\|DialogueBox\|ChoiceQuestion" src/content/modules --include="lesson.md" | wc -l   # 4
```

