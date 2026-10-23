# Feature: landing-ui-perfiles

Objetivo: 5 cambios de UI/UX en landing + fix de perfiles. Branch: feat/landing-ui-perfiles
Forecast: ~350 líneas · Estrategia: single-pr · Runner: npm run type-check + npm run build

## Specs

S1 — Secciones ocupan el div del header: La hero y secciones siguientes deben ocupar el área bajo el header sin gap blanco. El header es `fixed` transparente sobre hero (`bg-[#111439]`), por lo que el contenido no debe dejar banda blanca arriba. Criterio: `Header` fixed overlay, hero con padding top que respete altura del header (h-16/py-4), sin doble separación, y secciones con contenedor `max-w-[1280px]` alineado al header.

S2 — Nombre del usuario en el landing header: Cuando el usuario está autenticado (Clerk `auth()`/`currentUser()`), el header del landing (`src/components/landing/Header.tsx`) debe mostrar su nombre/avatar o UserButton en lugar de solo "Comenzar". Hoy muestra solo links + botón Comenzar sin distinguir sesión. Criterio: header lee sesión del servidor y renderiza estado autenticado (nombre + avatar/UserButton + link Dashboard) vs. no autenticado (Comenzar).

S3 — Footer violeta + logo como header en landing: `src/components/landing/Footer.tsx` hoy es `bg-ink` (oscuro). Debe pasar a violeta (usar token/brand violeta coherente con header) y mantener el logo igual al del header (`/logo-negativo.svg` + texto InVitro-Code). Criterio: footer bg violeta y logo/branding idéntico al header.

S4 — Carrusel en automático: `src/components/landing/OrbitalModules.tsx` hoy es manual (prev/next/dots/keyboard) sin autoplay. Debe avanzar automáticamente (ej. cada 4-5s), pausar en hover/focus/reduced-motion, y respetar interacción manual. Criterio: autoplay con intervalo, pausa en hover/focus, respeta `useReducedMotion`, no rompe navegación manual.

S5 — Perfiles no guardan: `src/app/(dashboard)/perfil/page.tsx` usa `ProfileForm` con `onSave` server action que hace `admin.from("profiles").update(...)` sin verificar `error`. Si falla, el usuario ve "Guardado" sin persistir. Debe propagar error, validar, y revalidar. Criterio: update verifica `error`, lanza excepción con mensaje, y el formulario muestra error; guardado exitoso persiste y revalida `/perfil` y `/dashboard`.

## Tasks

- [x] T1 — S1: Ajustar header + hero/secciones para que ocupen div del header (layout fixed + padding) — `src/components/landing/Header.tsx`, `src/app/page.tsx` — DONE: hero pt-[72px]/md:pt-[88px] ocupa header fixed, containers unificados a max-w-[1280px]
- [x] T2 — S2: Mostrar usuario autenticado en header del landing — `src/components/landing/Header.tsx`, `src/app/page.tsx` (server wrapper) — DONE: page async con auth()/currentUser(), Header recibe prop user y muestra Dashboard + avatar/nombre
- [x] T3 — S3: Footer violeta + logo como header — `src/components/landing/Footer.tsx` — DONE: bg-ink -> bg-brand-950 (#22005A), logo sigue /logo-negativo.svg como header
- [x] T4 — S4: Carrusel automático — `src/components/landing/OrbitalModules.tsx` — DONE: autoplay 4.5s, pausa hover/focus, respeta reduced-motion
- [x] T5 — S5: Fix perfiles no guardan (manejo de error + revalidate) — `src/app/(dashboard)/perfil/page.tsx`, `src/components/profile/ProfileForm.tsx` — DONE: captura error de update, throw, revalidatePath, trim a null

## Log

L1 — 2026-10-23 — Usuario: "Crea una rama para los siguientes cambios: 1. Que las secciones ocupen el div del header 2. Nombre del usuario para el landing. Hoy el landing no muestra que el usuario haya iniciado sesión. Coloca el usuario en el header. 3. Colocar color violeta en el footer del landing. Y manter el logo del footer como en el header en el landing. 4. coloca el Carrusel en automatico 5. revisa perfiles, no guardan" — Rama creada: feat/landing-ui-perfiles
