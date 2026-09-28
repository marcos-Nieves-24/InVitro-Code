# profile-scientist-preference Specification

## Purpose

Preferencia de figura científica inclusiva: columna `profiles.gender` (f/m/x/null) canónica en Supabase, selector en perfil y sincronización vía webhook Clerk como espejo, con fallback seguro a `f`.

## Requirements

### Requirement: Esquema profiles.gender canónico en Supabase

El sistema MUST añadir a `supabase-migration.sql` un `ALTER TABLE profiles ADD COLUMN gender TEXT CHECK (gender IN ('f','m','x'))` idempotente (guardado con `DO $$ IF NOT EXISTS` o `ADD COLUMN IF NOT EXISTS`) que permita `NULL` para filas existentes. Supabase MUST ser la fuente canónica; Clerk `publicMetadata.gender` es espejo. La columna no MUST alterar RLS existente (`auth.jwt() ->> 'sub' = id` con comparación `TEXT`); no SHALL introducir `auth.uid()`.

#### Scenario: Migración idempotente

- GIVEN la migración se aplica dos veces sobre la misma base
- WHEN se ejecuta el SQL
- THEN la segunda ejecución no falla y `profiles.gender` sigue existiendo con el CHECK intacto

#### Scenario: Filas existentes permiten NULL y caen a fallback

- GIVEN una fila `profiles` creada antes de la migración sin `gender`
- WHEN se lee `gender`
- THEN el valor es `NULL` y la UI lo trata como `'f'` sin error

#### Scenario: CHECK rechaza valores inválidos

- GIVEN un intento de `UPDATE profiles SET gender='z'`
- WHEN Supabase evalúa el CHECK
- THEN la operación es rechazada

#### Scenario: RLS preservado como TEXT

- GIVEN una query autenticada sobre `profiles` con `gender` presente
- WHEN se evalúa RLS
- THEN la política sigue comparando `auth.jwt() ->> 'sub'` contra `id`/`user_id` como `TEXT`
- AND no aparece `auth.uid()` en ninguna política

### Requirement: Selector de género en perfil y persistencia directa

El sistema MUST añadir a `src/app/(dashboard)/perfil/page.tsx` y `src/components/profile/ProfileForm.tsx` un selector con opciones `f` (femenina), `m` (masculina), `x` (no binaria / placeholder) y una opción de no preferencia que persista `NULL`. El formulario MUST escribir directamente en Supabase (`profiles.gender`) usando el cliente con RLS del usuario autenticado vía Clerk `auth()`. Tras guardar, la UI MUST reflejar el valor persistido sin requerir recarga manual más allá del revalidate del Server Component.

#### Scenario: Guardar preferencia f/m/x

- GIVEN un usuario autenticado abre `/perfil` y elige `m`
- WHEN guarda el formulario
- THEN `profiles.gender` en Supabase es `'m'` para su `id`
- AND el hero del dashboard en la siguiente carga muestra variante `m`

#### Scenario: Opción sin preferencia guarda NULL

- GIVEN el usuario elige "Prefiero no decirlo" (o equivalente en español neutro)
- WHEN guarda
- THEN `profiles.gender` es `NULL`
- AND el hero usa fallback `f`

#### Scenario: Validación de entrada no acepta valores fuera de dominio

- GIVEN un payload manipulado intenta enviar `gender='unknown'`
- WHEN la Server Action valida
- THEN el sistema lo rechaza y no escribe en Supabase
- AND retorna error legible en español neutro

### Requirement: Webhook Clerk espejo bidireccional limitado

El sistema MUST extender `src/app/api/webhooks/clerk/route.ts` para manejar `user.created` y `user.updated`, leer `publicMetadata.gender` (si existe y es `'f'|'m'|'x'`) y hacer upsert en `profiles.gender`. Si `publicMetadata.gender` no existe o es inválido, el webhook no MUST sobrescribir el valor canónico de Supabase con `NULL` de forma destructiva; SHALL preservar el valor existente. La verificación de firma `CLERK_SIGNING_SECRET` (Svix) MUST mantenerse y el endpoint MUST responder 200 en camino feliz.

#### Scenario: user.created con género en metadata

- GIVEN Clerk envía `user.created` con `publicMetadata: { gender: 'm' }`
- WHEN el webhook procesa la petición verificada
- THEN se crea/actualiza `profiles` con `gender='m'`

#### Scenario: user.updated sincroniza género

- GIVEN un usuario existente con `profiles.gender='f'` y Clerk envía `user.updated` con `publicMetadata: { gender: 'x' }`
- WHEN el webhook procesa
- THEN `profiles.gender` pasa a `'x'`

#### Scenario: Metadata sin género no borra preferencia canónica

- GIVEN `profiles.gender='m'` y Clerk envía `user.updated` sin campo `gender` en `publicMetadata`
- WHEN el webhook procesa
- THEN `profiles.gender` permanece `'m'` (no se pisa con `NULL`)

#### Scenario: Firma inválida es rechazada

- GIVEN una petición al webhook sin firma Svix válida
- WHEN se valida `CLERK_SIGNING_SECRET`
- THEN el endpoint responde con error 401/400 y no escribe en Supabase

### Requirement: Helper getScientistVariant y tipado compartido

El sistema MUST exponer `ScientistVariant = 'f' | 'm' | 'x'` y `getScientistVariant(gender: string | null | undefined): ScientistVariant` en `src/lib/gamification/*` (o módulo equivalente), con fallback `null/undefined/'x' → 'f'` documentado hasta que el arte final `x` esté disponible. El tipo MUST usarse en `ScientistFigure` y `HeroBanner` para evitar strings mágicos.

#### Scenario: Tipado previene variantes inválidas

- GIVEN código intenta pasar `variant='z'` a `ScientistFigure`
- WHEN corre `type-check`
- THEN TypeScript falla

#### Scenario: Helper usado por hero

- GIVEN `profiles.gender` es `'m'`
- WHEN el dashboard renderiza
- THEN `getScientistVariant('m')` retorna `'m'` y el hero resuelve a `/dashboard/cientifico-440x511.svg`

### Requirement: Español neutro y accesibilidad del selector

Las etiquetas del selector de perfil MUST estar en español neutro y ser accesibles (`label` asociado, `aria-describedby` si hay ayuda, foco visible). El selector no MUST depender de color solo para transmitir la elección.

#### Scenario: Etiquetas en español neutro y accesibles

- GIVEN el formulario de perfil renderiza el selector
- WHEN se inspecciona con lector de pantalla
- THEN las opciones se anuncian en español neutro y cada `input` tiene `label` asociado
- AND el contraste del formulario cumple WCAG AA
