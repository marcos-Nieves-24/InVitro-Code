# Feature: landing-ui-perfiles

Objetivo: 5 cambios de UI/UX en landing + fix de perfiles. Branch: feat/landing-ui-perfiles
Forecast: ~350 líneas · Estrategia: single-pr · Runner: npm run type-check + npm run build

## Specs

S1 — Secciones ocupan el div del header: La hero y secciones siguientes deben ocupar el área bajo el header sin gap blanco. El header es `fixed` transparente sobre hero (`bg-[#111439]`), por lo que el contenido no debe dejar banda blanca arriba. Criterio: `Header` fixed overlay, hero con padding top que respete altura del header (h-16/py-4), sin doble separación, y secciones con contenedor `max-w-[1280px]` alineado al header.

S2 — Nombre del usuario en el landing header: Cuando el usuario está autenticado (Clerk `auth()`/`currentUser()`), el header del landing (`src/components/landing/Header.tsx`) debe mostrar su nombre/avatar o UserButton en lugar de solo "Comenzar". Hoy muestra solo links + botón Comenzar sin distinguir sesión. Criterio: header lee sesión del servidor y renderiza estado autenticado (nombre + avatar/UserButton + link Dashboard) vs. no autenticado (Comenzar).

S3 — Footer violeta + logo como header en landing: `src/components/landing/Footer.tsx` hoy es `bg-ink` (oscuro). Debe pasar a violeta (usar token/brand violeta coherente con header) y mantener el logo igual al del header (`/logo-negativo.svg` + texto InVitro-Code). Criterio: footer bg violeta y logo/branding idéntico al header.

S4 — Carrusel en automático: `src/components/landing/OrbitalModules.tsx` hoy es manual (prev/next/dots/keyboard) sin autoplay. Debe avanzar automáticamente (ej. cada 4-5s), pausar en hover/focus/reduced-motion, y respetar interacción manual. Criterio: autoplay con intervalo, pausa en hover/focus, respeta `useReducedMotion`, no rompe navegación manual.

S5 — Perfiles no guardan: `src/app/(dashboard)/perfil/page.tsx` usa `ProfileForm` con `onSave` server action que hace `admin.from("profiles").update(...)` sin verificar `error`. Si falla, el usuario ve "Guardado" sin persistir. Debe propagar error, validar, y revalidar. Criterio: update verifica `error`, lanza excepción con mensaje, y el formulario muestra error; guardado exitoso persiste y revalida `/perfil` y `/dashboard`.

S6 — Landing Footer: eliminar "Biotecnologia + IA": El subtítulo bajo InVitro-Code en `Footer.tsx` debe eliminarse. Criterio: footer solo muestra "InVitro-Code" sin segunda línea.

S7 — Footer version encadenada a release real: "InVitro-Code v0.1.0" debe leer `package.json` version y linkear a `https://github.com/marcos-Nieves-24/InVitro-Code/releases/tag/v{version}` (o a /releases si no hay tag). Criterio: href dinámico con versión real, target _blank.

S8 — Landing header usuario sincronizado con perfiles: El nombre mostrado en `Header` del landing debe venir de `profiles.username` (Supabase) no solo de Clerk. Hoy usa `currentUser().username/firstName` y no refleja cambios en `/perfil`. Criterio: `src/app/page.tsx` hace `auth()` + `createAdminClient().from("profiles").select("username")` y prioriza `profiles.username` > clerk.

S9 — Dashboard: eliminar expandible Secciones y ocupar header: `InVitroShell` hoy tiene `SectionsDropdown` (expandible). Debe eliminarse y las secciones pasar a ocupar el div del header como nav horizontal, con indicación de sección activa. Criterio: header flex con logo | nav secciones (max 8) ocupando espacio central, sin dropdown, con efecto activo (underline/bg).

S10 — Dashboard efecto sección activa: El nav de secciones debe resaltar la sección actual según `pathname` (usePathname). Criterio: link activo con `bg-surface-raised`/`text-ink` + subrayado o border-b-2 brand.

S11 — Footer: logo negativo y fuente blanca: Footer ya usa `/logo-negativo.svg` pero textos/icons están en `text-storm` (gris). Deben ser blancos. Criterio: todos los textos del footer en `text-white` o `text-white/60/40` y bordes/icons en `white/20`.

## Tasks

- [x] T1 — S1: Ajustar header + hero/secciones para que ocupen div del header (layout fixed + padding) — `src/components/landing/Header.tsx`, `src/app/page.tsx` — DONE: hero pt-[72px]/md:pt-[88px] ocupa header fixed, containers unificados a max-w-[1280px]
- [x] T2 — S2: Mostrar usuario autenticado en header del landing — `src/components/landing/Header.tsx`, `src/app/page.tsx` (server wrapper) — DONE: page async con auth()/currentUser(), Header recibe prop user y muestra Dashboard + avatar/nombre
- [x] T3 — S3: Footer violeta + logo como header — `src/components/landing/Footer.tsx` — DONE: bg-ink -> bg-brand-950 (#22005A), logo sigue /logo-negativo.svg como header
- [x] T4 — S4: Carrusel automático — `src/components/landing/OrbitalModules.tsx` — DONE: autoplay 4.5s, pausa hover/focus, respeta reduced-motion
- [x] T5 — S5: Fix perfiles no guardan (manejo de error + revalidate) — `src/app/(dashboard)/perfil/page.tsx`, `src/components/profile/ProfileForm.tsx` — DONE: captura error de update, throw, revalidatePath, trim a null

- [x] T6 — S6: Eliminar "Biotecnologia + IA" del footer — `src/components/landing/Footer.tsx` — DONE: removido <p>Biotecnologia + IA</p>
- [x] T7 — S7: Version encadenada a release real — `src/components/landing/Footer.tsx`, `package.json` — DONE: APP_VERSION 1.0.0 + RELEASE_URL tag/v1.0.0, link externo con hover
- [x] T8 — S8: Header landing sincronizado con profiles.username — `src/app/page.tsx` — DONE: auth + createAdminClient profiles.username priorizado sobre Clerk, verificado header muestra "Marcos"
- [x] T9 — S9: Dashboard eliminar SectionsDropdown y ocupar header — `src/components/layout/InVitroShell.tsx` — DONE: eliminado SectionsDropdown, nav flex-1 center gap-1 lg:flex
- [x] T10 — S10: Efecto sección activa en dashboard header — `src/components/layout/InVitroShell.tsx` — DONE: usePathname isActive, bg-surface-raised + underline w-6 bg-brand-500
- [x] T11 — S11: Footer logo negativo y fuente blanca — `src/components/landing/Footer.tsx` — DONE: logo-negativo, icons/text-white, version text-white/80, footer bg brand-950

## Log

L1 — 2026-10-23 — Usuario: "Crea una rama para los siguientes cambios: 1. Que las secciones ocupen el div del header 2. Nombre del usuario para el landing. Hoy el landing no muestra que el usuario haya iniciado sesión. Coloca el usuario en el header. 3. Colocar color violeta en el footer del landing. Y manter el logo del footer como en el header en el landing. 4. coloca el Carrusel en automatico 5. revisa perfiles, no guardan" — Rama creada: feat/landing-ui-perfiles
L2 — 2026-10-23 — Usuario: "Landing: 1. Elimina Biotecnologia + IA del footer. 2. Conecta InVitro-Code v0.1.0 con la verdadera release de Github. 3. El usuario del header debe mostrar el nombre del usuario que ingresó. Revisa porque cambié el nombre en usuario y no está sincronizado en el landing. Dashboard: Elimina el expandible secciones y coloca las secciones para que ocupen el div del header con efecto sección actual. Footer: Usa el negativo del logo y fuente blanca."
L3 — 2026-10-23 — Usuario: "footer: 1. El logo debe verse, colocalo blanco, como en el header. 2. Crea la release 1 en github de InVitro-Code y conectarla con la pagina" — Fix: Footer logo brightness-0 invert-0 -> brightness-0 invert (blanco), release v1.0.0 creada en https://github.com/marcos-Nieves-24/InVitro-Code/releases/tag/v1.0.0
