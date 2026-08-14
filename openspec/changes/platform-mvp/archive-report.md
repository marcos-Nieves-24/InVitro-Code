# Archive Report: platform-mvp

> **schema**: gentle-ai.archive-report/v1
> **change**: platform-mvp
> **archived**: 2026-08-14
> **artifactStore**: openspec
> **status**: success

## Final State

The change is COMPLETE. The platform MVP (auth, lesson reader, code editor with Pyodide execution, progress tracking, gamification, Supabase integration) shipped in earlier commits and is live. The delta specs are synced to `openspec/specs/` (see below).

### What shipped

- Next.js App Router + TypeScript + Tailwind scaffold (platform-setup)
- Clerk auth with middleware gating (`src/proxy.ts`, user-auth)
- Supabase integration for profiles/progress/gamification (progress-tracking)
- MDX lesson reader via next-mdx-remote with `<Section>` carousel (lesson-reader)
- Monaco editor + Pyodide Web Worker execution (code-execution)
- Exercise validation client-side + optional E2B certification flag (exercise-validation)

## Source-of-truth sync

All 6 delta specs are NEW capabilities (no prior `openspec/specs/<capability>/` existed) — direct copy, verified:

| Domain | Action | Path | Notes |
|--------|--------|------|-------|
| platform-setup | Created | `openspec/specs/platform-setup/spec.md` | |
| user-auth | Created | `openspec/specs/user-auth/spec.md` | |
| lesson-reader | Created | `openspec/specs/lesson-reader/spec.md` | |
| code-execution | Created | `openspec/specs/code-execution/spec.md` | |
| exercise-validation | Created | `openspec/specs/exercise-validation/spec.md` | |
| progress-tracking | Created | `openspec/specs/progress-tracking/spec.md` | |

No destructive merge; `rules.archive` warning not triggered.

## Archive Disposition — Project Convention

Following the repo precedent (content-table-component, overfitting-trainer), the change directory stays as the record; this `archive-report.md` is the terminal record.

## Gates

- **Native Review Receipt Gate**: not applicable (change predates the review facade; no review artifacts).
- **Task Completion Gate**: implementation is in `main`; tasks.md was the planning record, no persisted checkbox conflicts.
- **Action Context Guard**: all work inside repo root.

## Verification Summary

No verify-report persisted for this change (predates the verify phase convention). Functionality is live in production; `npm run build` is deferred to Vercel per user instruction (local machine OOM-kills the Turbopack prod build).

## Delivery Decision

Already delivered (platform is live on Vercel). No further git action for this change.

## Artifacts

Created:
- `openspec/specs/{platform-setup,user-auth,lesson-reader,code-execution,exercise-validation,progress-tracking}/spec.md`
- `openspec/changes/platform-mvp/archive-report.md`
