# Spec: real-data-replace-mocks

> Cambio: `real-data-replace-mocks`. Todas las capacidades son NUEVAS (no existe `openspec/specs/` previo). Principio rector: **honestidad > completitud** [D1]. Contenido de UI en español. Sin seed demo en ningún estado.

## 1. achievements [D1]

### REQ-ACH-01 — Schema de logros
La migración MUST crear `achievements` (id, slug UNIQUE, title, description, icon, category, xp_reward, condition_type, condition_value) y `user_achievements` (user_id TEXT, achievement_id FK, unlocked_at, PK compuesta user_id+achievement_id). El nivel de detalle de columnas es el mínimo verificable; la implementación MAY ajustar tipos.

- **Escenario: tablas creadas**
  - GIVEN una migración aplicada al proyecto Supabase
  - WHEN se inspecciona el schema `public`
  - THEN existen `achievements` y `user_achievements`
  - AND `user_achievements.user_id` es de tipo TEXT

- **Escenario: unicidad por usuario**
  - GIVEN `user_achievements` creada
  - WHEN se intenta insertar dos veces el par (user_id, achievement_id) para el mismo usuario
  - THEN la segunda inserción es rechazada por la PK compuesta

### REQ-ACH-02 — RLS con identidad Clerk
`achievements` MUST ser legible por cualquier usuario autenticado; `user_achievements` MUST tener RLS que compare `user_id` contra `auth.jwt() ->> 'sub'` (nunca `auth.uid()`).

- **Escenario: usuario lee sus logros**
  - GIVEN un usuario autenticado con Clerk cuyo `sub` coincide con su `user_id`
  - WHEN consulta sus filas de `user_achievements`
  - THEN recibe solo sus propios desbloqueos

- **Escenario: filas ajenas ocultas**
  - GIVEN un usuario autenticado
  - WHEN consulta `user_achievements`
  - THEN no ve filas de otros usuarios (no se filtra por `auth.uid()`)

### REQ-ACH-03 — Seed idempotente
La migración MUST sembrar entre 15 y 20 logros del catálogo con condiciones reales (1ª lección, streak, XP total, módulo completo) y MUST ser idempotente: re-ejecutar no duplica.

- **Escenario: ejecución repetida**
  - GIVEN la migración ejecutada una vez
  - WHEN se ejecuta de nuevo
  - THEN la cantidad de filas en `achievements` no cambia

### REQ-ACH-04 — Desbloqueo real
El desbloqueo MUST evaluarse contra datos reales (`progress`, `streaks`, XP acumulada) y MUST registrarse en `user_achievements` con `unlocked_at`. Un logro MUST NO desbloquearse con datos inventados. La evaluación MAY ejecutarse tras completar lección/reflexión o al consultar la API.

- **Escenario: primera lección completa**
  - GIVEN un usuario sin `user_achievements` y una fila `progress.completed = true`
  - WHEN se evalúan las condiciones
  - THEN el logro "primera lección" se inserta con `unlocked_at` no nulo

- **Escenario: condición no alcanzada**
  - GIVEN un usuario con 0 lecciones completadas y 0 streak
  - WHEN se evalúan las condiciones
  - THEN ninguna fila nueva aparece en `user_achievements`

- **Escenario: idempotencia de desbloqueo**
  - GIVEN un logro ya desbloqueado
  - WHEN se evalúa la condición de nuevo
  - THEN no se duplica la fila y `unlocked_at` no se reescribe a un valor posterior

### REQ-ACH-05 — Endpoint GET /api/achievements
El endpoint MUST devolver el catálogo completo con el estado por usuario (desbloqueado/unlocked_at, pendiente) y MUST exigir sesión Clerk (401 sin ella). Respuesta MUST usar `createAdminClient()` server-side.

- **Escenario: usuario autenticado**
  - GIVEN sesión Clerk activa y 2 logros desbloqueados
  - WHEN `GET /api/achievements`
  - THEN responde 200 con los 15-20 logros del catálogo
  - AND marca exactamente 2 como desbloqueados con su `unlocked_at`

- **Escenario: sin sesión**
  - GIVEN una petición sin sesión Clerk
  - WHEN `GET /api/achievements`
  - THEN responde 401 sin datos del catálogo

### REQ-ACH-06 — Página de logros desde la API
La página `/logros` MUST renderizar el catálogo y el estado desde la respuesta real de `/api/achievements` y MUST mostrar un gráfico de XP semanal real (suma de `progress.xp_earned` + `reflection_completions.xp_earned` de la semana, filtrando `completed_at` NULL).

- **Escenario: render real**
  - GIVEN la API devuelve 17 logros con 3 desbloqueados
  - WHEN se carga `/logros`
  - THEN se muestran 17 logros y 3 marcados como desbloqueados

- **Escenario: XP semanal con NULLs**
  - GIVEN filas de progress con `completed_at` NULL y otras con fecha en la semana
  - WHEN se calcula la XP semanal
  - THEN las filas NULL se excluyen y el total solo suma fechas válidas

### REQ-ACH-07 — Vacíos motivadores [D1]
Sin logros desbloqueados, la página MUST mostrar un vacío motivador (p. ej. "Completá tu primera lección para desbloquear logros") y MUST NO mostrar logros demo ni progreso falso.

- **Escenario: usuario nuevo**
  - GIVEN un usuario sin `user_achievements`
  - WHEN carga `/logros`
  - THEN ve el mensaje motivador y ningún logro "pre-desbloqueado"

### REQ-ACH-08 — Logros Recientes en dashboard
El dashboard MUST mostrar "Logros Recientes" desde `user_achievements` reales (últimos desbloqueados), y MUST mostrar un vacío honesto si no hay ninguno.

- **Escenario: sin logros**
  - GIVEN un usuario sin desbloqueos
  - WHEN carga el dashboard
  - THEN la sección muestra vacío motivador en vez de logros inventados

## 2. leaderboard [D3][D1]

### REQ-LB-01 — Endpoint GET /api/leaderboard
El endpoint MUST calcular XP total real por usuario agregando `progress.xp_earned` + `reflection_completions.xp_earned`, agrupando por `user_id`, haciendo join a `profiles` y devolviendo el top 50 ordenado por XP desc. MUST exigir sesión Clerk (401).

- **Escenario: ranking real**
  - GIVEN 3 usuarios con XP en progress/reflection_completions
  - WHEN `GET /api/leaderboard`
  - THEN responde 200 con hasta 50 entradas ordenadas por XP desc
  - AND cada entrada incluye username y XP total

- **Escenario: XP cero no falso**
  - GIVEN un usuario con filas pero 0 XP y otro con 0 filas
  - WHEN se arma el ranking
  - THEN ambos aparecen con XP total 0 (sin inventar XP)

### REQ-LB-02 — Posición del usuario actual
La respuesta MUST incluir la posición del usuario autenticado en el ranking completo, incluso si no está dentro del top 50.

- **Escenario: usuario fuera del top**
  - GIVEN un usuario en la posición 120
  - WHEN `GET /api/leaderboard`
  - THEN la respuesta incluye su posición (120) aunque no figure en las 50 primeras entradas

### REQ-LB-03 — Manejo de usuarios sin XP
Usuarios sin XP o con `completed_at` NULL MUST sumar 0 (COALESCE/filtrado), sin excluirse ni recibir XP inventada.

- **Escenario: NULLs en XP**
  - GIVEN filas de progress con `completed_at` NULL
  - WHEN se agrega la XP
  - THEN se descartan y no inflan el total del usuario

### REQ-LB-04 — Comunidad recortada [D3]
La página `/comunidad` MUST mostrar SOLO datos reales: ranking real + "investigadores activos" (usuarios con `streaks.current_streak > 0`). MUST NOT mostrar proyectos fake, "En línea: 1,248", feed, "Sincronizar Feed" ni botones no-op.

- **Escenario: comunidad honesta**
  - GIVEN datos reales de profiles/streaks
  - WHEN carga `/comunidad`
  - THEN solo se ven el ranking real y los activos con streak > 0

- **Escenario: activos sin datos**
  - GIVEN ningún usuario con streak > 0
  - WHEN carga `/comunidad`
  - THEN la sección de activos muestra vacío motivador sin falsos

### REQ-LB-05 — Vacíos motivadores [D1]
Con 0 usuarios en el ranking, la página MUST mostrar "Sé el primero en aparecer en el ranking" y MUST NO sembrar usuarios demo.

- **Escenario: ranking vacío**
  - GIVEN ningún usuario con XP
  - WHEN carga `/comunidad`
  - THEN se muestra el vacío motivador y ninguna fila inventada

### REQ-LB-06 — Rendimiento
La query del leaderboard SHOULD ejecutar en tiempo razonable para cientos de usuarios (índices o agregación server-side); una vista materializada MAY usarse si supera ~100 usuarios activos.

- **Escenario: volumen alto (SHOULD)**
  - GIVEN 200 usuarios con filas de XP
  - WHEN se consulta `/api/leaderboard`
  - THEN responde sin timeout ni degradación del resto de la app

## 3. certification [D2]

### REQ-CER-01 — Flag FEATURE_FLAG_CERTIFY
La app MUST leer la env `FEATURE_FLAG_CERTIFY` con valor default `false` (off) y documentarla en `.env.local.example`. Con off, la certificación MUST estar deshabilitada.

- **Escenario: flag ausente**
  - GIVEN la env no está definida
  - WHEN se evalúa el flag
  - THEN se interpreta como `false`

### REQ-CER-02 — UI oculta el botón [D2]
Con flag off, `OutputPanel` MUST NO mostrar el botón "Estoy listo"/certificar.

- **Escenario: flag off**
  - GIVEN `FEATURE_FLAG_CERTIFY=false`
  - WHEN se renderiza OutputPanel en un lab
  - THEN no hay botón de certificación visible

- **Escenario: flag on**
  - GIVEN `FEATURE_FLAG_CERTIFY=true`
  - WHEN se renderiza OutputPanel
  - THEN el botón puede aparecer (comportamiento previo)

### REQ-CER-03 — Endpoint rechaza [D2]
Con flag off, `POST /api/certify` MUST responder error (403 o 503) incluso si se llama directa. MUST NOT devolver `certified: true`.

- **Escenario: llamada directa con flag off**
  - GIVEN `FEATURE_FLAG_CERTIFY=false`
  - WHEN `POST /api/certify` con sesión válida
  - THEN responde 403/503 y `certified` NO es `true`

- **Escenario: sin sesión**
  - GIVEN petición sin sesión Clerk
  - WHEN `POST /api/certify`
  - THEN responde 401

### REQ-CER-04 — Prop server→client
OutputPanel (client component) MUST recibir el valor del flag como prop desde la página server; MUST NOT leer `process.env` en el client.

- **Escenario: flag propagado**
  - GIVEN una página server que lee el flag
  - WHEN renderiza OutputPanel
  - THEN pasa `certifyEnabled` como prop y el client no accede a `process.env`

### REQ-CER-05 — Cero certificaciones falsas
El sistema MUST NOT emitir ninguna certificación sin ejecución real de validación (E2B u otra) con flag on; mientras E2B no esté integrado, el flag MUST permanecer off en producción.

- **Escenario: sin E2B**
  - GIVEN E2B no integrado
  - WHEN se revisa la config de producción
  - THEN el flag está en off y ninguna certificación se emite

## 4. user-progress [D4][D1]

### REQ-UP-01 — Proyecto Actual con % real
El dashboard MUST calcular "Proyecto Actual" como el módulo en progreso con porcentaje real = (lecciones completadas del módulo / total de lecciones del módulo) × 100, desde `progress` y la metadata real de módulos. MUST NOT mostrar 68% fijo.

- **Escenario: módulo en progreso**
  - GIVEN un módulo de 10 lecciones con 4 completadas
  - WHEN carga el dashboard
  - THEN "Proyecto Actual" muestra ese módulo al 40%

- **Escenario: usuario sin progreso**
  - GIVEN ningún `progress` registrado
  - WHEN carga el dashboard
  - THEN la sección muestra vacío motivador honesto, sin porcentaje inventado

### REQ-UP-02 — Misión Actual real [D4]
El dashboard MUST mostrar "Misión Actual" = próxima lección incompleta real (según orden de lecciones del módulo) con XP de `calcXpForLesson(moduleSlug, lessonSlug)`. MUST NOT mostrar "+40 XP" fijo.

- **Escenario: próxima lección**
  - GIVEN un usuario que completó las primeras 3 lecciones de un módulo
  - WHEN carga el dashboard
  - THEN la Misión es la lección 4 incompleta y su XP = `calcXpForLesson`

- **Escenario: módulo terminado**
  - GIVEN todas las lecciones del módulo completadas
  - WHEN carga el dashboard
  - THEN no se inventa una misión inexistente; se muestra estado de completitud

### REQ-UP-03 — Breadcrumb de nivel real
La página `/laboratorios` y `LabMission` MUST mostrar el nivel real del usuario vía `calcLevel(totalXpReal)`, no el breadcrumb fijo "Nivel 1 · Novato · Misión 2".

- **Escenario: nivel derivado**
  - GIVEN un usuario con XP real de progress/reflection_completions
  - WHEN carga `/laboratorios`
  - THEN el breadcrumb muestra nivel, progreso y misión derivados de esos datos

### REQ-UP-04 — Progreso de laboratorio real o vacío honesto
`LabMission` MUST mostrar el progreso real de lecciones de ese lab si existe, y un vacío honesto ("sin progreso") si no; MUST NOT mostrar progreso inventado.

- **Escenario: lab sin progreso**
  - GIVEN un lab sin filas de `progress` del usuario
  - WHEN carga el lab
  - THEN se muestra vacío honesto, no una barra llena con datos falsos

### REQ-UP-05 — completed_at NULL
Cualquier cálculo de XP semanal o temporalidad MUST filtrar/coalescer filas con `completed_at` NULL (datos viejos), sin romper el cálculo ni inflar resultados.

- **Escenario: datos viejos**
  - GIVEN filas con `completed = true` y `completed_at` NULL
  - WHEN se calcula XP semanal o progreso temporal
  - THEN esas filas se excluyen/tratan como 0 y la app no falla

## 5. user-identity

### REQ-UI-01 — userName real en AppSidebar
`AppSidebar` MUST mostrar el `username` real desde `profiles` (vía `createAdminClient()` o Clerk) en lugar del default "Investigador InVitro-Code".

- **Escenario: perfil con username**
  - GIVEN un usuario con `profiles.username = 'mendel'`
  - WHEN se renderiza la sidebar
  - THEN se muestra "mendel", no el default

- **Escenario: perfil sin username**
  - GIVEN un usuario sin `username` en profiles
  - WHEN se renderiza la sidebar
  - THEN se muestra un fallback neutral derivado del usuario real, nunca "Investigador InVitro-Code"

### REQ-UI-02 — Cero "dev-user" [D1]
Las 6 páginas dashboard (dashboard, logros, comunidad, proyectos, laboratorios, niveles) MUST usar `auth()` real: sin sesión → redirect a `/sign-in`; con sesión → datos del usuario real. MUST NOT contener "dev-user" en `src/`.

- **Escenario: sin sesión**
  - GIVEN una visita a una página dashboard sin sesión Clerk
  - WHEN se resuelve la página
  - THEN se redirige a `/sign-in`, sin renderizar "dev-user"

- **Escenario: con sesión**
  - GIVEN sesión Clerk activa
  - WHEN se resuelve la página
  - THEN todos los datos derivan del userId real

### REQ-UI-03 — No-ops removidos [D3]
La UI MUST remover los controles no operativos: campana, "Ver perfil completo", "Explorar Desafíos", "VER TODOS", "Sincronizar Feed", "CANJEAR PREMIOS", "ENTRENAR MODELO", "Carga tu Dataset" y el countdown fijo.

- **Escenario: limpieza**
  - GIVEN las páginas dashboard
  - WHEN se audita su contenido
  - THEN no aparece ninguno de los no-ops listados

## 6. Requisitos no funcionales

### REQ-NFR-01 — Build
El cambio MUST pasar `npm run build` sin errores.

- **Escenario: gate de verificación**
  - GIVEN el código implementado
  - WHEN `npm run build`
  - THEN finaliza exitosamente

### REQ-NFR-02 — Idioma de UI
Todo texto visible al usuario en las pantallas modificadas MUST estar en español, con tono motivador y accesible para estudiantes de biotecnología.

- **Escenario: auditoría de texto**
  - GIVEN las pantallas modificadas
  - WHEN se revisan sus strings
  - THEN no hay textos en otro idioma ni jerga de programación innecesaria

### REQ-NFR-03 — Cero números fake
Las páginas dashboard MUST NOT mostrar ninguno de estos valores inventados: 68%, +40 XP, R² 0.782, MAE 0.42, 1,248, 38%, 24 de 64, 35%, ni el countdown fijo "2d 14h 32m". Cualquier métrica mostrada MUST derivar de datos reales o de un vacío honesto.

- **Escenario: auditoría de métricas**
  - GIVEN las páginas dashboard
  - WHEN se busca cada valor prohibido en el render
  - THEN ninguno aparece

## 7. Criterios de aceptación consolidados

1. `npm run build` pasa (REQ-NFR-01).
2. Cero `"dev-user"` en `src/` (REQ-UI-02).
3. Cero números fake y no-ops listados (REQ-NFR-03, REQ-UI-03).
4. Flag off: sin botón de certificar y `/api/certify` rechaza (REQ-CER-02/03).
5. Usuario nuevo ve vacíos motivadores en logros, comunidad y dashboard; sin seed demo (REQ-ACH-07, REQ-LB-05, REQ-UP-01).
6. Misión Actual = próxima lección real con XP de `calcXpForLesson` (REQ-UP-02).
7. `completed_at` NULL no rompe ni infla cálculos (REQ-ACH-06, REQ-LB-03, REQ-UP-05).
