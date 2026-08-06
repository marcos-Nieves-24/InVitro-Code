# Proposal: Reemplazar mocks por datos reales de Supabase

> **Decisiones vinculantes** · [D1] vacíos motivadores, sin seed demo · [D2] certify flag OFF oculta la UI (cero certificaciones falsas) · [D3] comunidad recortada a datos reales · [D4] Proyecto/Misión Actual reales.

## Intent

La plataforma muestra datos inventados (XP, métricas R², leaderboards, logros, "En línea: 1,248", certificaciones) que rompen la confianza del estudiante. Eliminar TODOS los mocks y reemplazarlos por datos reales de Supabase. **Honestidad > completitud**: un vacío motivador vale más que un número falso.

## Scope

### In Scope
- **Schema** [D1]: `achievements` + `user_achievements` (seed 15-20; condiciones reales: 1ª lección, streak, XP total, módulo completo).
- **Endpoints**: `GET /api/achievements` (catálogo + estado), `GET /api/leaderboard` (top 50 XP real + posición).
- **Certify** [D2]: env `FEATURE_FLAG_CERTIFY` (off); OutputPanel oculta "Estoy listo"; ruta rechaza con flag off.
- **Dashboard** [D4]: "Proyecto Actual" = módulo en progreso con % real; "Misión Actual" = próxima lección incompleta con XP (`calcXpForLesson`); "Logros Recientes" desde `user_achievements`.
- **Logros** [D1]: desde `/api/achievements`; gráfico XP semanal real; % real; vacíos motivadores.
- **Comunidad** [D3]: solo leaderboard real + investigadores activos (streak > 0) [D1].
- **Laboratorios** [D4][D1]: breadcrumb con nivel real (`calcLevel`); "Progreso" real o vacío honesto.
- **Limpieza global**: sin `"dev-user"` en 6 páginas (auth() real o redirect a `/sign-in`); `userName` real en AppSidebar; quitar no-ops (campana, "Ver perfil completo", "Explorar Desafíos", "VER TODOS", "Sincronizar Feed", "CANJEAR PREMIOS", "ENTRENAR MODELO", "Carga tu Dataset"), countdown fijo y métricas fake de proyectos.

### Out of Scope
E2B real (solo flag) [D2] · `model_metrics` (métricas ocultas) [D1] · proyectos colaborativos / feed / foros / notificaciones.

## Capabilities

> Contrato con sdd-spec. No hay `openspec/specs/` previos → todas NUEVAS.

### New Capabilities
- `achievements` [D1]: schema + seed, desbloqueo real, endpoint, página logros + recientes.
- `leaderboard` [D3][D1]: endpoint, comunidad (ranking + activos), vacíos motivadores.
- `certification` [D2]: flag, botón oculto, endpoint no certifica.
- `user-progress` [D4][D1]: dashboard y laboratorios con datos reales.
- `user-identity`: userName real en sidebar; sin `"dev-user"`.

### Modified Capabilities
- None

## Approach

1. Reusar `profiles`/`progress`/`streaks`/`reflection_completions` para XP, nivel y leaderboard; query real en endpoint (vista materializada diferida).
2. Migración SQL: tablas + `unlocked_at` en user_achievements + seed idempotente; desbloqueo contra datos reales.
3. Endpoints server con `createAdminClient()`; páginas server; props a componentes client (flag, %).
4. Vacíos [D1]: "Completá tu primera lección para desbloquear logros", "Sé el primero en aparecer en el ranking". Cero seed demo.
5. Certify [D2]: flag leído en servidor; botón oculto con flag off; ruta rechaza (403/503) aunque la llamen directa.

## Affected Areas

| Área | Cambio |
|---|---|
| `supabase-migration.sql` | + tablas + seed + RLS |
| `src/app/api/achievements/route.ts` · `src/app/api/leaderboard/route.ts` | Nuevos |
| `src/app/api/certify/route.ts` · `src/components/editor/OutputPanel.tsx` | Flag [D2] |
| `src/app/(dashboard)/dashboard/page.tsx` | Real [D4], sin campana |
| `src/app/(dashboard)/logros/page.tsx` | API + XP semanal real [D1] |
| `src/app/(dashboard)/comunidad/page.tsx` | Recorte [D3] |
| `src/app/(dashboard)/proyectos/page.tsx` | Sin métricas/leaderboard/countdown/no-ops |
| `src/app/(dashboard)/laboratorios/page.tsx` + `LabMission.tsx` | Breadcrumb + % real [D4] |
| `AppSidebar.tsx` + `InVitroShell.tsx` + `niveles/page.tsx` | userName real, sin dev-user |
| `.env.local.example` | + `FEATURE_FLAG_CERTIFY` |

## Risks

| Riesgo | Prob. | Mitigación |
|---|---|---|
| Pantallas vacías para usuarios nuevos | Alta | Vacíos motivadores [D1] |
| Leaderboard/logros vacíos al inicio | Media | "Sé el primero"/"Completá tu 1ª lección" [D1] |
| Flag mal configurado → certificación falsa | Baja | Enforce server-side [D2] |
| `completed_at` NULL en progress viejo | Media | Filtrar/coalescer en XP semanal |
| Build roto por props removidos | Media | Gate `npm run build` |

## Rollback Plan

- `git revert` del branch revierte la UI.
- Tablas aditivas: `DROP TABLE user_achievements, achievements` (script en la migración).
- Flag [D2] off default = sin cambio; ante fallo, se mantiene off y no hay botón.

## Dependencies

- Aplicar `supabase-migration.sql` en el SQL editor (manual).
- Env: `FEATURE_FLAG_CERTIFY` (default `false`). Sin dependencias externas nuevas (sin E2B).

## Success Criteria

- [ ] `npm run build` pasa.
- [ ] Cero `"dev-user"` en `src/`.
- [ ] Cero números fake (68%, +40 XP, R² 0.782, 1,248, 38%/24 de 64, 35%) en páginas dashboard.
- [ ] No-ops listados eliminados [D3].
- [ ] Flag off: sin botón de certificar; `/api/certify` rechaza [D2].
- [ ] Usuario nuevo ve vacíos motivadores, sin seed demo [D1].
- [ ] Misión Actual = próxima lección real con XP de `calcXpForLesson` [D4].
