# Proposal: Platform MVP

## Intent

Build the foundational platform — auth, lesson viewer, code editor with Python execution, progress tracking, and gamification — plus one working "Hola Mundo" lesson. This validates the full learning loop end-to-end before investing in 4-module content.

## Scope

### In Scope
- Next.js 15 scaffold with App Router, TypeScript, Tailwind, shadcn/ui
- Clerk auth (mandatory login, no anonymous access)
- Supabase integration (PostgreSQL for users, progress, gamification)
- MDX lesson reader via next-mdx-remote
- Monaco editor + Pyodide Web Worker for Python execution
- Exercise validation: client-side feedback + optional E2B certification
- Full gamification: XP, levels, streaks, module progress bars
- One example lesson: "Hola Mundo" en Python
- Vercel + Supabase Free deployment

### Out of Scope
- Full 4-module educational content (post-MVP)
- CMS or admin panel (content stays in repo MDX)
- Real-time collaboration or multiplayer
- Mobile app or PWA
- E2B as primary execution (Pyodide is primary, E2B is fallback)
- Unit/integration test infrastructure (deferred to post-MVP)

## Capabilities

### New Capabilities
- **platform-setup**: project scaffold, dependencies, deployment config
- **user-auth**: Clerk registration, login, session, middleware guards
- **lesson-reader**: MDX rendering with progress-aware navigation
- **code-execution**: Monaco editor + Pyodide Web Worker runner
- **exercise-validation**: client-side checks + optional server-side cert
- **progress-tracking**: XP, levels, streaks, module progress (Supabase)

### Modified Capabilities
None

## Approach

Six sequential phases: scaffold → auth → lessons → editor → progress → integration. Each phase produces independently testable output. Pyodide runs in a Web Worker to avoid blocking the UI thread. Exercise validation uses client-side Pyodide for instant feedback and optional E2B for server-side certification on "ready" submission.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/` | New | App Router pages, layouts, API routes |
| `components/` | New | UI, editor, gamification components |
| `content/modules/` | New | MDX lesson files |
| `lib/` | New | Pyodide worker, Supabase, gamification logic |
| `middleware.ts` | New | Clerk auth middleware |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Pyodide WASM ~12MB slow initial load | Medium | Lazy-load worker, show skeleton, cache in SW |
| Clerk free tier rate limits | Low | Stay within limits; cache sessions client-side |
| Solo dev + no tests = tech debt | High | Establish patterns early; add tests post-MVP |
| Supabase 500MB row limit | Low | Minimal schema; monitor first month |

## Rollback Plan

Redeploy previous Vercel deployment. Supabase schema is additive-only (no destructive migrations in MVP). Clerk config is reversible via dashboard. If Pyodide breaks, feature-flag fallback to E2B sandbox.

## Dependencies

Clerk, Supabase, Next.js 15, Pyodide, Monaco, shadcn/ui, Tailwind CSS

## Success Criteria

- [ ] User can register, login, and see the dashboard
- [ ] "Hola Mundo" lesson renders MDX with code example
- [ ] User edits and runs Python code in Monaco via Pyodide
- [ ] Completing the exercise awards XP and updates progress bar
- [ ] Daily streak tracks consecutive login days
- [ ] Full platform deploys successfully to Vercel
