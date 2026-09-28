# dashboard-gaming-hud Specification

## Purpose

Header gaming persistente integrado en `InVitroShell`: anillo de nivel mini, llama de racha y gema de XP. Provee contexto lúdico constante sin suscripciones realtime y sin acoplar datos de progreso al shell.

## Requirements

### Requirement: Slot HUD opcional en InVitroShell

El sistema MUST añadir a `src/components/layout/InVitroShell.tsx` una prop opcional `hud?: ReactNode` que renderice un header gaming sticky sobre el contenido. Cuando `hud` es `undefined`, el shell MUST ser visualmente idéntico al estado previo (sin regresión de layout). El slot MUST aceptar cualquier `ReactNode` pero el contrato por defecto es el HUD gaming.

#### Scenario: Shell sin HUD no cambia

- GIVEN `InVitroShell` se renderiza sin prop `hud`
- WHEN se inspecciona el DOM
- THEN no existe contenedor HUD y el layout coincide con el snapshot previo a la refactorización

#### Scenario: Shell con HUD renderiza header sticky

- GIVEN `DashboardContainer` pasa un nodo HUD válido a `InVitroShell hud={...}`
- WHEN el shell monta
- THEN el HUD aparece como barra superior sticky (`position: sticky`, `top: 0`, `z-index` sobre el contenido)
- AND permanece visible al hacer scroll dentro del dashboard

#### Scenario: Tipo opcional no rompe otras páginas

- GIVEN una página fuera de `/dashboard` importa `InVitroShell` sin `hud`
- WHEN hace `type-check`
- THEN el build pasa sin requerir la prop

### Requirement: Contenido gaming mínimo del HUD

El HUD por defecto MUST mostrar tres elementos cuando recibe props de servidor: (1) mini anillo de nivel derivado de `levelInfo` (`calcLevel(totalXp)`), (2) llama de racha con contador de `streaks`, (3) gema/contador de XP total (`totalXp`). Cada elemento MUST usar tokens `--color-hud-*` y `--color-comic-*` sin hex hardcodeado. Los valores numéricos MUST reflejar los calculados en servidor (`DashboardContainer`) y no recalcularse en cliente de forma divergente.

#### Scenario: Datos de nivel, racha y XP visibles

- GIVEN `totalXp=240`, `levelInfo={level:3, progress:40}`, `streak=5` provistos por el servidor
- WHEN el HUD renderiza
- THEN el anillo muestra nivel 3, la llama muestra "5" y la gema muestra "240 XP"
- AND los tres valores son idénticos a los calculados por `getTotalXp` / `calcLevel` en servidor

#### Scenario: Estado vacío sin racha

- GIVEN `streak=0` o `streak=null` (usuario nuevo)
- WHEN el HUD renderiza
- THEN la llama aparece atenuada o con "0 días" pero no lanza error ni oculta el resto del HUD

#### Scenario: Tokens en lugar de hex

- GIVEN se inspecciona el CSS del HUD
- WHEN se buscan colores
- THEN no hay hex literales en los componentes HUD y los valores provienen de `var(--color-hud-bg)`, `var(--color-hud-border)`, etc.

### Requirement: Origen de datos server-prop sin suscripción realtime

El HUD MUST recibir `totalXp`, `levelInfo` y `streak` como props serializables desde el Server Component `DashboardContainer`. El HUD no MUST suscribirse a `supabase_realtime` en v1. Si el progreso muta durante la sesión, el HUD MAY quedarse con el valor del render inicial hasta el próximo refresco de servidor; no SHALL causar hydration mismatch recalculando en cliente con datos distintos.

#### Scenario: Props de servidor son fuente única

- GIVEN el servidor calcula `totalXp` y `levelInfo` y los pasa al HUD
- WHEN el cliente hidrata
- THEN el HUD renderiza exactamente esos valores sin refetch inmediato
- AND no hay warning de hydration mismatch

#### Scenario: Mutación de progreso no rompe HUD

- GIVEN el usuario completa una lección y `progress` inserta 25 XP en Supabase durante la sesión
- WHEN el HUD sigue montado sin recarga
- THEN el HUD MAY seguir mostrando el XP previo hasta la próxima navegación o `router.refresh()`
- AND la app no lanza error por inconsistencia

### Requirement: Micro-interacciones y respeto a movimiento reducido

Las micro-interacciones del HUD (hover, aparición, pulso suave) MAY usar `framer-motion` pero MUST respetar `prefers-reduced-motion: reduce` y `useReducedMotion()`: si el usuario prefiere movimiento reducido, el HUD MUST omitir pulsos/loops y mostrar estado final estático. El HUD no MUST animar la misma propiedad CSS que GSAP en el mismo nodo y mismo frame.

#### Scenario: Movimiento reducido desactiva pulso

- GIVEN `prefers-reduced-motion: reduce` activo
- WHEN el HUD monta con animación de pulso en la llama
- THEN la llama aparece estática sin loop ni pulso
- AND el resto del contenido es completamente legible

#### Scenario: Sin conflicto GSAP y Framer en el mismo nodo

- GIVEN el HUD y el hero coexisten en la misma página
- WHEN ambos animan
- THEN no existe un nodo que sea objetivo simultáneo de `gsap.to` y `motion.div` sobre la misma propiedad (`transform`/`opacity`) en el mismo frame

### Requirement: Accesibilidad del HUD

El HUD MUST ser navegable por teclado y anunciar su propósito. El anillo de nivel MUST tener `aria-label` con texto en español neutro ("Nivel 3"), la racha MUST tener etiqueta accesible ("Racha: 5 días") y la XP MUST ser texto legible, no solo icono. Los iconos decorativos MUST tener `aria-hidden="true"`.

#### Scenario: Lector de pantalla anuncia nivel y racha

- GIVEN un lector de pantalla recorre el HUD
- WHEN enfoca el anillo de nivel y la llama
- THEN escucha "Nivel 3" y "Racha: 5 días" respectivamente
- AND los SVG decorativos no son anunciados

#### Scenario: Navegación por teclado

- GIVEN el HUD contiene elementos interactivos (si los hay, ej: tooltip o link a perfil)
- WHEN el usuario navega con Tab
- THEN el orden de foco es lógico y visible
- AND si el HUD es no-interactivo, no crea trampas de foco
