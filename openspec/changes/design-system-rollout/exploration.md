# Exploration — DESIGN.md Implementation Rollout

**Change**: `design-system-rollout`
**Date**: 2026-08-27
**Mode**: auto | Artifacts: both (openspec + engram) | PR: ask-on-risk | Budget: 800 lines

## 1. Source of Truth

`DESIGN.md` (root) defines the target design system "Laboratorio Digital":
- **Palette**: ink #000000, graphite #2a272a, slate #4b4a54, storm #677381, fog #82a0aa, mint #a3cfcd, surface #f4f6f8, surface-card #ffffff, surface-raised #e8ecf0
- **Fonts**: Display=Space Grotesk, Body=Inter, Mono=JetBrains Mono
- **Type scale, spacing, radius, shadows, animations** all specified
- **Components**: UI, gamification, lesson, labs, editor, layout shells
- **Routes**: public + dashboard windows with wireframes (§4.1–4.12)
- **Animations**: reduced-motion, transitions 200-300ms, page fade-in, terminal typing, scroll reveals, skeleton loading

## 2. Current State (HEAD + uncommitted diff on `projects-colab-5-duration`)

11 tracked files modified (+430/-93). This is a PARTIAL, INCONSISTENT prior attempt:

| File | Status | Gap vs DESIGN.md |
|------|--------|------------------|
| `globals.css` | +157 lines | Hero tokens + neural-net animations ADDED; Material 3 palette (`--color-primary:#3525cd`, etc.) NOT replaced. DESIGN.md wants full palette swap + new shadow/spacing tokens. |
| `layout.tsx` | DM_Sans(body)+Space_Grotesk(display) | WRONG: DESIGN.md wants **Inter** body. Display correct. |
| `page.tsx` | 312-line landing rewrite | Contains `.hero-neural-*` (red neuronal) that DESIGN.md §4.1 says REMOVE. Needs §4.1 compliant hero (dark + terminal typing, no neural net). |
| `InVitroTopBar.tsx` | exists, 4 lines changed | Uses OLD tokens (`bg-primary-fixed`, `text-primary`, `text-error`). Needs mint/fog/ink palette. |
| `AppSidebar.tsx` | +5 lines | Partial; needs graphite bg, mint active states. |
| `InVitroShell.tsx` | +1 line | Needs surface bg, integrate InVitroTopBar. |
| `dashboard/page.tsx` | +4 lines | Uses old `bg-primary` etc. throughout; needs full restyle. |
| `SiteHeader.tsx`, `learn/Sidebar.tsx`, `lesson/interactive-table.tsx` | minor | Need new palette. |
| All UI/gamification/lesson/labs/editor components | UNTOUCHED | Still use Material 3 tokens (`primary`, `tertiary`, `surface-container`, etc.). Must migrate to DESIGN.md tokens. |

## 3. Risks & Decisions

- **Palette replacement is the foundation** — everything depends on it.
- **Font body is wrong** (DM_Sans) — must fix to Inter per DESIGN.md.
- **Neural-net hero must be removed** — conflicts with DESIGN.md simplicity.
- Existing uncommitted work treated as scaffold; SDD corrects + completes it.
- **Verification**: Playwright (no local build); Vercel builds on push.
- **Push**: only with temporary token (user-authorized), work-unit commits.

## 4. Component Inventory (target files)

UI (6+1): Button, Card, Callout, EmptyState, SiteHeader, PageShell, Skeleton(new)
Layout (3): AppSidebar, InVitroShell, InVitroTopBar
Gamification (5): XPBar, StreakBadge, LevelBadge, ModuleProgress, AchievementCard
Lesson (~25): code-block, concept-card, callout-info, callout-check, mascot-message, lesson-carousel, section, answer-reveal, badge, celebration-overlay, comparison-table, interactive-table, markdown-table, lab-progress, reflection-check + trainers
Labs (12): LabHub, LabCard, LabTabs, LabRunner, LabCodeBlock, LabHeader, LabCallout, QuizRunner, ReflectionPrompt, AssignmentViewer, NotebookActions
Editor (5): CodeEditor, ConsoleFrame, OutputPanel, PyodideRunner, VisualizationPanel
Routes (12+): /, /sign-in, /learn, /learn/[module]/[slug], dashboard/* (6), laboratorios/*, proyectos/*, niveles, logros, comunidad

## 5. Out of Scope

- Auth (Clerk) logic unchanged
- Supabase schema unchanged
- Pyodide worker logic unchanged (only styling)
- Content (Spanish MDX) unchanged
- Docker/docs/frontend/ untracked files untouched
