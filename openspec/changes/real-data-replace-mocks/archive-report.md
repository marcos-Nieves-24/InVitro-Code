# Archive Report: real-data-replace-mocks

> **schema**: gentle-ai.archive-report/v1
> **change**: real-data-replace-mocks
> **archived**: 2026-08-14
> **artifactStore**: openspec
> **status**: success

## Final State

The change is COMPLETE. All mock data was removed and replaced with real Supabase-backed data. Verification: `grep` for `dev-user` / `1,248` / "En línea" returns zero matches in `src/`. Principle honored: **honestidad > completitud** — motivating empty states instead of fake numbers.

### What shipped

- Schema: `achievements` + `user_achievements` (no seed demo)
- Endpoints: `GET /api/achievements`, `GET /api/leaderboard`
- Certify: `FEATURE_FLAG_CERTIFY` flag (off by default), UI hides certification when off, route rejects 503 when off
- Dashboard: real "Proyecto Actual" (module in progress with %), "Misión Actual" (next incomplete lesson + XP), "Logros Recientes"
- Logros page from `/api/achievements`; weekly XP chart real; honest empty states
- Comunidad: real leaderboard + active researchers (streak > 0)
- Laboratorios: breadcrumb with real level; real progress or honest empty
- Cleanup: no `"dev-user"` anywhere; real userName in sidebar; fake/no-op UI controls removed

## Source-of-truth sync

The delta spec covers multiple new capabilities — copied as a single capability record to `openspec/specs/`:

| Domain | Action | Path |
|--------|--------|------|
| real-data-replace-mocks | Created | `openspec/specs/real-data-replace-mocks/spec.md` |

No destructive merge; warning not triggered.

## Archive Disposition — Project Convention

Following the repo precedent, the change directory stays as the record; this `archive-report.md` is the terminal record.

## Gates

- **Native Review Receipt Gate**: not applicable (no review artifacts).
- **Task Completion Gate**: mock removal verified (grep clean); UI verified in live app.
- **Action Context Guard**: all work inside repo root.

## Verification Summary

No verify-report persisted for this change. Mock removal confirmed by grep; live UI verified (dashboard/logros/comunidad show real data or honest empty states).

## Delivery Decision

Already delivered. No further git action for this change.

## Artifacts

Created:
- `openspec/specs/real-data-replace-mocks/spec.md`
- `openspec/changes/real-data-replace-mocks/archive-report.md`
