# Consentimiento — Trámite con estados (Ley 1581)

## Objetivo
Unificar consentimiento como trámite con estados (pending→verified), ventanilla única que guarda log + cambia cartel, y bloque en /perfil para salir de pending sin correo.

## Problema
Firma guardada en consent_logs pero cartel profiles.consent_status sigue pending. Banner linka a /perfil sin ventanilla. Webhook race.

## Arquitectura
- Domain: `src/domain/consent.ts` máquina de estados + buildConsentModel (puro)
- Application: `src/application/use-cases/completeConsent.ts` caso de uso que guarda log + update profiles atomico
- Infrastructure: `src/lib/supabase/consent.ts` implementa, `src/app/api/consent/route.ts` delega al caso de uso
- Presentation: `src/components/consent/ConsentPendingCard.tsx` + integración /perfil

## Tasks
- [x] T1 — Dominio: estados + transiciones + build model (puro, testeable) — route: delegated
- [x] T2 — Caso de uso + infra: completeConsent service-role update profiles + consent_logs — route: delegated
- [x] T3 — API delega a caso de uso + perfil bloque pending — route: delegated
- [ ] T4 — Tests + verificación type-check build — route: delegated

## Criterios
- [ ] POST /api/consent con F-01+transfer:EEUU deja consent_status verified, pending_since null, version CURRENT
- [ ] /perfil pending muestra bloque con checkbox + botón Completar, al click banner desaparece
- [ ] Webhook sigue idempotente, no regression pending TTL 24h
- [ ] type-check + build + 174 tests verdes

## Branch
feat/consent-arquitectura desde main@e23ceb1

## Siguiente
T1
