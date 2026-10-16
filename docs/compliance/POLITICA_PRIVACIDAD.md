# Política de Privacidad — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Vigente desde:** 2026-10-06
> **Responsable:** Persona natural en Colombia · NIT 700329113-7 · Corregimiento Altavista, Medellín · Contacto único: `invitro.code@gmail.com`
> **Marco:** Ley 1581 de 2012 · Decreto 1377 de 2013 (Decreto 1074 de 2015, Título 3) · Ley 527 de 1999 · Ley 1480 de 2011
> **Lectura:** 6 min · **Idioma:** Español (Titular LATAM, `lang="es"` `src/app/layout.tsx:39`)
> **Fuente técnica:** `legal/politica-privacidad.md` v1 + `legal/data-inventory.md` DEFINIDA v1 + `legal/retention-policy.md` v1 — esta es la versión publicable (`docs/compliance/`) del borrador legal ya auditado.

---

## Resumen claro

Tratamos solo lo necesario para enseñarte ciencia de datos aplicada a biotecnología. Nada de venta, nada de rastreo oculto. Tus datos viajan cifrados (TLS), viven en servidores en Estados Unidos con contratos de protección (DPA) y puedes pedirnos que los borremos en cualquier momento. Tus laboratorios de Python se ejecutan **en tu navegador** — tu código nunca sale de tu dispositivo.

---

## 1. Responsable y contacto

| Campo | Detalle |
|---|---|
| **Responsable del Tratamiento** | Persona natural en Colombia, NIT 700329113-7 |
| **Domicilio** | Corregimiento Altavista, Medellín, Colombia |
| **Canal único para consultas, reclamos, revocatorias y supresión** | `invitro.code@gmail.com` — respondemos en 10 días hábiles (consultas) y 15 días hábiles (reclamos), art. 14-15 Ley 1581 |
| **Actividad** | Plataforma educativa 100 % gratuita, sin venta de cursos ni suscripciones |
| **Público** | Mayores de 18 años. No dirigida a menores. |

## 2. Qué datos tratamos y para qué

| Punto | Datos | Para qué | Base Ley 1581 |
|---|---|---|---|
| **Registro** | Correo, identidad (`id` Clerk), género opcional (`f`/`m`/`x`), IP y User-Agent del consentimiento | Crear y verificar tu cuenta; conservar prueba de tu autorización (Ley 527) | Art. 9 previa + art. 26 transferencia EE. UU. + art. 6 reforzada si `x` |
| **Perfil** | Nombre de usuario (derivado de tu nombre o correo), biografía, género, `created_at` | Personalizar tu experiencia | Art. 9 / art. 6 si `x` |
| **Avatar** | Imagen `jpg`/`png`/`webp` hasta 2 MB | Tu foto de perfil | Art. 9 |
| **Preferencias** | Tema (`light`/`dark`/`system`), meta diaria de XP (`10..500`), ajuste de notificaciones | Recordar tus ajustes y rachas | Art. 9 |
| **Progreso** | Avance en lecciones, laboratorios, rachas, logros, reflexiones, guardados | Medir y acompañar tu aprendizaje | Art. 9 |
| **Laboratorios** | Estado del laboratorio, pestaña activa, posición de scroll y **código temporal** (`codeSnapshot` ≤8 KB) | Guardar dónde quedaste para que retomes | Art. 9 (minimizado — ver §6) |
| **Navegación local** | Memoria del navegador (`localStorage`/`sessionStorage`: pestañas, workspace, onboarding) | Evitar que repitas pasos | Art. 9 (técnico, solo en tu navegador) |
| **Evidencia de autorización** | Versión de esta política aceptada, hash del texto (SHA-256), finalidades aceptadas, IP, User-Agent, fecha | Probar que nos autorizaste de forma conservable | Ley 527 + art. 9 |

**No tratamos:** pagos, boletines, analítica ni publicidad, datos biométricos, financieros ni de salud. Si en el futuro incorporamos alguno, actualizaremos esta política y versionaremos el consentimiento.

## 3. Bases legales

- **Autorización previa, expresa e informada (art. 9):** Al crear tu cuenta aceptás esta política mediante un **checkbox no pre-marcado** (`src/components/auth/AuthForm.tsx:57` `acceptBase`). Sin esa aceptación no se crea la cuenta.
- **Dato sensible `género x` (art. 6):** Requiere un **segundo checkbox separado** (`AuthForm.tsx:57` `acceptGenderX`). Sin él, el género `x` no se guarda (`src/app/api/webhooks/clerk/route.ts:60` gate).
- **Mensaje de datos conservable (Ley 527):** Guardamos tu autorización con fecha, versión, hash, IP y User-Agent en `consent_logs` (`supabase-migration.sql:408`), prueba íntegra y auditable.
- **Transferencia internacional (art. 26):** Informada expresamente en el texto de aceptación ("proveedores tecnológicos ubicados en Estados Unidos — Clerk, Supabase y Vercel"). Ver §5.

## 4. Tus derechos (art. 8) y cómo ejercerlos

Podés en cualquier momento:

- **Conocer, actualizar y rectificar** tus datos (perfil y preferencias en la app).
- **Pedir prueba** de tu autorización (`invitro.code@gmail.com`).
- **Revocar** tu autorización y **pedir la supresión** de tus datos.
- **Presentar quejas** ante la Superintendencia de Industria y Comercio (SIC).

**Canales:**

| Acción | Cómo | Plazo nuestro |
|---|---|---|
| **Supresión self-service** | `Configuración → Eliminar cuenta` (`DELETE /api/account` `src/app/api/account/route.ts:11`) — borrado en cascada de 7 tablas + avatares + identidad Clerk | Inmediato (best-effort) + 15 días hábiles para cierre completo art. 8 |
| **Supresión / revocatoria / reclamo** | `invitro.code@gmail.com` | 15 días hábiles (art. 15), prorrogables 8 más con aviso |
| **Consulta** | `invitro.code@gmail.com` | 10 días hábiles (art. 14), prorrogables 5 más con aviso |

**Efecto de la supresión:** Borramos tu perfil, progreso, laboratorios, rachas, logros, reflexiones, guardados, evidencia de consentimiento y avatares, y eliminamos tu identidad en Clerk. Conservamos `consent_logs` **6 meses** tras la supresión para atender reclamaciones (ver §6), luego se purga o anonimiza. Las copias de seguridad (PITR Supabase 7/30 d) rotan automáticamente.

## 5. Encargados y transferencias internacionales

Tus datos residen en **Supabase (Postgres + Storage, sobre AWS, EE. UU.)** y tu identidad en **Clerk (EE. UU.)**; todo el tráfico transita por **Vercel (EE. UU.)**. Los tres son **Encargados del Tratamiento** en Estados Unidos (art. 26) con contratos DPA y cláusulas contractuales estándar.

| Encargado | País | Qué hace | DPA |
|---|---|---|---|
| **Clerk Inc.** | EE. UU. | Registro, login, sesión, SSO, webhooks | `https://clerk.com/legal/dpa` |
| **Supabase Inc. (AWS)** | EE. UU. | Base de datos, almacenamiento de avatares | `https://supabase.com/legal/dpa` |
| **Vercel Inc.** | EE. UU. | Hosting, red de distribución, logs, TLS, DNS | `https://vercel.com/legal/dpa` |

**Terceros técnicos sin datos personales (solo descarga de software, observan tu IP como dato de tráfico):**

| Tercero | Qué hace | País |
|---|---|---|
| **jsDelivr (`cdn.jsdelivr.net`)** | Descarga del runtime Pyodide 0.25.0 y librerías científicas | Anycast global |
| **PyPI (`files.pythonhosted.org` vía Fastly)** | Wheels `seaborn`/`plotly` para laboratorios | Anycast global (origen EE. UU.) |

Al aceptar esta política autorizás expresamente estas transferencias. Podés revocar esa autorización escribiendo a `invitro.code@gmail.com` (implica el cierre de la cuenta, pues sin estos Encargados el servicio no puede prestarse).

## 6. Retención — cuánto guardamos cada dato

| Dato | Cuánto tiempo |
|---|---|
| **Perfil, progreso, laboratorios, rachas, logros, reflexiones, guardados, avatar** | **Vida de tu cuenta**. Al eliminar la cuenta, borrado en ≤15 días hábiles. |
| **Código temporal de laboratorio (`codeSnapshot`)** | **60 días** sin actividad o al completar el laboratorio — luego se vacía (`{}`) por minimización. Está limitado a 8 KB. |
| **Cuentas `pending` sin autorización completa** | **24 h** — se purgan automáticamente (`GET /api/cron/purge-pending` daily `0 3 * * *` `vercel.json:4`). |
| **Inactividad prolongada** | **24 meses** sin `last_active_at` → te avisamos (si tenés notificaciones por correo) y 15 días después anonimízamos tu perfil (conservamos el `id` para integridad). |
| **Evidencia de autorización (`consent_logs`)** | **Vida de la cuenta + 6 meses** tras la supresión (Ley 527). |
| **Memoria local del navegador** | Hasta que la limpies en tu navegador. No la controlamos desde el servidor. |
| **Logs de infraestructura (Vercel/Supabase/Clerk)** | Según el plan del proveedor (típicamente 30 días a 1 año; PITR Supabase 7 d free / 30 d Pro). |

Registraremos estas bases en el Registro Nacional de Bases de Datos (RNBD) de la SIC (Decreto 1074, Título 3).

## 7. Seguridad

- **Cifrado en tránsito** TLS (HTTPS) en Vercel, Clerk y Supabase.
- **Aislamiento por usuario (RLS)** en base de datos: cada fila solo es visible para su titular (`auth.jwt()->>sub = id/user_id` `supabase-migration.sql:52-460`).
- **Escritura solo en servidor** con clave `service-role` nunca expuesta al navegador (`src/lib/supabase/admin.ts:11` guard `typeof window`).
- **Validación de avatares** con lista blanca de formatos, límite 2 MB, coherencia extensión/MIME y verificación de firma binaria (magic bytes JPEG/PNG/WebP) (`src/lib/profile/validateAvatar.ts`).
- **Límite de uso** (rate limiting) 100 solicitudes por 15 min en progreso, laboratorios y guardados.
- **Sesiones** gestionadas por Clerk con cookies seguras `__session`/`__clerk_*`.

Ninguna medida es infalible. Si detectás un uso extraño, escribinos de inmediato a `invitro.code@gmail.com`.

## 8. Cookies y almacenamiento local

No usamos analítica ni publicidad. Solo:

| Tipo | Nombre / Clave | Para qué | Duración |
|---|---|---|---|
| **Cookies técnicas** | `__session`, `__clerk_*` (Clerk, EE. UU.) | Mantener tu sesión iniciada | Sesión |
| **Memoria local** | Pestaña activa, workspace, onboarding completado | Recordar dónde quedaste | Hasta que la limpies |
| **Memoria de sesión** | Consola maximizada | Recordar tamaño de la consola | Sesión del navegador |

Detalle completo en `/cookies`.

## 9. Cambios a esta política

Versionamos cada cambio (esta es `2026-10-06-v1`). Si cambian las finalidades, los Encargados o el país de transferencia, te pediremos una nueva autorización con la versión actualizada (`CURRENT_POLICY_VERSION` `src/domain/consent.ts:21`). Los cambios menores (redacción, corrección) se publican aquí con nueva fecha.

---

*Última actualización: 2026-10-16 · Versión 2026-10-06-v1 · Contacto: `invitro.code@gmail.com` · Jurisdicción: Colombia, Ley 1581 de 2012.*
