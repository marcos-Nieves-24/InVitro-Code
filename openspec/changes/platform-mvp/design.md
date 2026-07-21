# Design: Platform MVP

## Technical Approach

Greenfield Next.js 15 App Router project with Clerk auth, Supabase storage, and client-side Python execution via Pyodide in a Web Worker. Server-rendered MDX lessons with Monaco editor islands. Gamification (XP, levels, streaks) driven by Supabase rows. Deploy to Vercel + Supabase Free — no monorepo tooling, no CMS, no test infra in MVP.

## Architecture Decisions

### Clerk ↔ Supabase Sync via Webhook
**Choice**: Clerk webhook (`user.created`) → `app/api/webhooks/clerk/route.ts` → upsert Supabase `profiles` row
**Alternatives**: Clerk SDK direct-write (exposes service key), polling Clerk API (rate limits/lag)
**Rationale**: Webhooks are secure (signed payloads), instant, and keep the service role key server-side.

### Pyodide in a Dedicated Web Worker
**Choice**: Worker created on first editor visit, communicates via postMessage, lazy-loads Pyodide WASM
**Alternatives**: Main-thread Pyodide (blocks UI for ~12MB load), E2B-only (~500ms network round-trip per run)
**Rationale**: Worker keeps UI interactive during execution. Worker survives page navigation (cached).

### MDX in Repo, Parsed at Runtime
**Choice**: `.mdx` files under `content/modules/`, parsed by `next-mdx-remote` per request
**Alternatives**: CMS (operational overhead), compile-time MDX (no per-file flexibility)
**Rationale**: Content lives in git alongside code. Zero infra. Dynamic imports via `next-mdx-remote`.

### REST API for Progress Writes, RLS for Reads
**Choice**: `POST /api/progress` for mutations; dashboard reads via Supabase RLS
**Alternatives**: Direct Supabase client for writes (no XP validation), GraphQL (overengineered for 3 tables)
**Rationale**: Server validates XP/streak math. RLS reads are fast, no extra round-trip for dashboard.

### Single Next.js App (No Monorepo)
**Choice**: Flat structure — `app/`, `components/`, `lib/`, `content/`
**Alternatives**: Turborepo with packages (Premature — only 1 consumer in MVP)
**Rationale**: Extract packages when a second consumer exists.

## Data Flow

```
User → /learn/[module]/[slug]
        │
        ├── Server: read MDX, render prose
        ├── Client island: Monaco editor + Pyodide Worker
        │       │
        │       ├── User writes code → clicks Run
        │       │   └── postMessage → Worker → Pyodide => stdout
        │       │       └── OutputPanel renders result
        │       │
        │       └── Clicks "Complete" → POST /api/progress
        │           └── upsert progress row, update streaks
        │
        └── Dashboard reads via Supabase RLS (anon key)
```

```
Supabase tables: profiles ──→ progress ──→ streaks
                         1:N          1:N
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.env.local.example` | Create | Project scaffold and config |
| `middleware.ts` | Create | Clerk auth guard for `/learn/*`, `/dashboard` |
| `app/layout.tsx` | Create | Root layout — ClerkProvider, fonts, theme |
| `app/page.tsx` | Create | Landing, redirect to dashboard if authed |
| `app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Create | Clerk sign-in page |
| `app/(dashboard)/dashboard/page.tsx` | Create | Progress, streak, XP overview |
| `app/learn/layout.tsx` | Create | Module context, back nav |
| `app/learn/[module]/[slug]/page.tsx` | Create | Lesson: server MDX + client editor |
| `app/api/webhooks/clerk/route.ts` | Create | `user.created` → create profile |
| `app/api/progress/route.ts` | Create | Upsert progress, update streaks |
| `components/ui/` | Create | shadcn/ui primitives |
| `components/editor/CodeEditor.tsx` | Create | Monaco wrapper (client component) |
| `components/editor/PyodideRunner.tsx` | Create | Worker lifecycle manager |
| `components/editor/OutputPanel.tsx` | Create | stdout/stderr display |
| `components/gamification/XPBar.tsx` | Create | XP progress |
| `components/gamification/StreakBadge.tsx` | Create | Streak counter |
| `components/gamification/LevelBadge.tsx` | Create | Level badge |
| `components/gamification/ModuleProgress.tsx` | Create | Module indicator |
| `content/modules/example/hola-mundo.mdx` | Create | First lesson |
| `lib/pyodide/worker.ts` | Create | Worker: load Pyodide, exec, return |
| `lib/supabase/client.ts` | Create | Browser client (anon key) |
| `lib/supabase/admin.ts` | Create | Service client (webhooks/progress) |
| `lib/gamification/utils.ts` | Create | XP math, level calc, streak logic |

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Manual | Pyodide exec | Open lesson, run `print("hola")`, verify output |
| Manual | Auth flow | Register, sign in, check middleware redirect |
| Manual | Progress | Complete lesson, verify XP + streak in dashboard |
| Post-MVP | Worker comms | Mock postMessage, test execute/response |
| Post-MVP | API routes | Integration tests with local Supabase |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

None — greenfield project. No existing data or users.

## Open Questions

- [ ] Pyodide CDN path — confirm unpkg/jspm URL works for 0.25+
- [ ] Clerk JWT claims — exact Supabase RLS mapping needs testing in Clerk JWT template
- [ ] Monaco loader — `@monaco-editor/react` vs raw Monaco for tree-shaking?
- [ ] E2B fallback — stub for future or include basic integration at MVP launch?
