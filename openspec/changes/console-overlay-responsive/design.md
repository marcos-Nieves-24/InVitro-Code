# Design: Console Overlay Responsive to Sidebar

## Technical Approach

The maximized console overlay (`ConsoleFrame`) uses hardcoded `md:pl-[72px] lg:pl-[280px]` that do not react to sidebar collapse state. This change replaces those hardcoded values with a CSS custom property `--sidebar-offset` that each shell sets reactively. `ConsoleFrame` reads the variable for its overlay `padding-left`. A CSS transition on `padding-left` provides smooth animation.

Each shell (app shell `InVitroShell`, learn layout `Sidebar`) owns its collapse state and sets `--sidebar-offset` on `document.documentElement` via a `useEffect`. Only one shell is active per route, so there is no conflict. The overlay inherits the variable from `documentElement` natively because CSS custom properties inherit through the DOM, including into `fixed` descendants.

## Architecture Decisions

### Decision: How learn layout sets `--sidebar-offset` reactively

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **documentElement effect** (chosen) | `Sidebar` (client) sets `--sidebar-offset` on `document.documentElement` via `useEffect`. Minimal refactor. Overwrites app shell's value, but only one shell is active per route. | **Chosen** — lowest risk, zero new components |
| Lift state into `LearnShell` client wrapper | Convert `learn/layout.tsx` region into client component that owns `desktopCollapsed`, renders `Sidebar` + `<main>`, sets var via inline style. Changes where collapse lives. | Rejected — larger refactor, changes ownership of state |
| `SidebarOffsetProvider` context | New provider wraps each shell, passes collapsed state. ConsoleFrame subscribes. | Rejected — more plumbing, not justified for a CSS-only concern |

**Rationale**: The app shell's `InVitroShell` and the learn layout's `Sidebar` are already client components owning collapse state. Setting a CSS variable on `documentElement` from inside a `useEffect` is trivial — one line of DOM API. CSS custom properties inherit into `fixed` elements, so `ConsoleFrame`'s maximized overlay reads the value with zero plumbing. No new components, no context, no prop threading.

### Decision: Animation strategy — animate `padding-left` directly

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Animate `padding-left` on the overlay** (chosen) | `ConsoleFrame` sets `padding-left` via inline `style` with `transition: padding-left 300ms`. No `@property` registration needed. Works immediately. | **Chosen** — simplest, no CSS registration overhead |
| Register `@property --sidebar-offset` and animate it | Requires `@property` with `syntax: "<length>"`, `inherits: true`, `initial-value: 0px`. Enables `transition: --sidebar-offset 300ms`. But `@property` support varies; animated custom properties can't interpolate if browser doesn't support `@property`. | Rejected — unnecessary complexity, `padding-left` animation achieves same result |

**Rationale**: The spec requires smooth transition. `InVitroShell` already animates `padding-left` via `transition-[padding] duration-300` on `<main>`. Applying the same pattern to `ConsoleFrame`'s overlay is consistent. CSS custom properties themselves are NOT animatable unless registered via `@property`; since we only need the final computed value to drive `padding-left`, there's no reason to animate the variable itself. Animating `padding-left` directly is simpler and universally supported.

### Decision: Transition on initial load

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **CSS default `--sidebar-offset: 0px` + JS override** (chosen) | Set `0px` as CSS default so overlay renders at 0 offset initially. `useEffect` sets the real value on mount. Transition only fires on sidebar toggle, not on initial render (React `useEffect` runs after paint; CSS default prevents flash). | **Chosen** — clean, no transition artifacts |
| `will-change: padding-left` + conditional transition | Add `will-change` for perf, conditionally disable transition on first render. More complex. | Rejected — unnecessary for this scope |

### Decision: Mobile offset

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **CSS default `--sidebar-offset: 0px`** (chosen) | Default covers mobile (both sidebars hidden below their breakpoints). Shell `useEffect` sets the desktop value, but CSS media queries on the shell already make `collapsed` irrelevant on mobile. The variable is not set by the shell on mobile because the shell's `md:` prefix means the padding is 0 by default. | **Chosen** — mobile is covered by the CSS default |

**Rationale**: On mobile (<md for app, <lg for learn), `InVitroShell`'s `<main>` has no `md:pl-*` class active, so the sidebar doesn't take space. The `--sidebar-offset` CSS default of `0px` is correct for mobile. The shell's `useEffect` sets the variable, but on mobile the CSS media query means the offset doesn't matter — the overlay uses `var(--sidebar-offset, 0px)` which defaults to `0px`. The shell may set a non-zero value on mobile via JS, but since the sidebar is hidden, this is harmless. If we want to be precise, the shell can check `window.matchMedia` before setting, but it's not required because the overlay's `padding-left` from `--sidebar-offset` only matters when the sidebar is visible.

Actually, cleaner: the `useEffect` sets `--sidebar-offset` unconditionally. On mobile, the sidebar is hidden, but the overlay still reads the variable. We should NOT set a non-zero offset on mobile. Solution: the `useEffect` checks the breakpoint before setting.

**Revised mechanism**:
```tsx
// InVitroShell.tsx
useEffect(() => {
  const mql = window.matchMedia("(min-width: 768px)");
  const update = () => {
    document.documentElement.style.setProperty(
      "--sidebar-offset",
      mql.matches ? (collapsed ? "72px" : "280px") : "0px"
    );
  };
  update();
  mql.addEventListener("change", update);
  return () => mql.removeEventListener("change", update);
}, [collapsed]);
```

```tsx
// Sidebar.tsx (learn layout)
useEffect(() => {
  const mql = window.matchMedia("(min-width: 1024px)");
  const update = () => {
    document.documentElement.style.setProperty(
      "--sidebar-offset",
      mql.matches ? (desktopCollapsed ? "0px" : "256px") : "0px"
    );
  };
  update();
  mql.addEventListener("change", update);
  return () => mql.removeEventListener("change", update);
}, [desktopCollapsed]);
```

### Decision: Z-index and overflow regression

| Concern | Analysis | Action |
|---------|----------|--------|
| ConsoleFrame overlay `z-40` | Sits below `AppSidebar` (`z-50`) and learn `Sidebar` (`z-40` with collapse toggle at `z-[60]`). The learn sidebar's aside is `z-40`, collapse toggle is `z-[60]`. The overlay at `z-40` may conflict with learn sidebar's `z-40`. | Bump learn sidebar aside from `z-40` to `z-45` or confirm overlap behavior. Actually: learn sidebar is `position: fixed` with `z-40`; overlay is also `position: fixed` with `z-40`. Same z-index = last-in-DOM wins. The overlay is rendered inside the page content (deeper in DOM), so it paints over the sidebar. **Need to bump overlay to `z-[45]` or learn sidebar to `z-[45]`**. Safest: keep overlay at `z-40`, bump learn sidebar `aside` from `z-40` to `z-[45]` and collapse toggle from `z-[60]` to `z-[60]` (unchanged). Actually simpler: the current code already works because the overlay is `z-40` and learn sidebar is `z-40` — the sidebar paints over the overlay since it's earlier in DOM? No: later-in-DOM wins at same z-index. The overlay is inside page content which is after the sidebar in the flex layout. So overlay paints over sidebar. This is wrong — sidebar must stay on top. |
| **Fix**: Change overlay from `z-40` to `z-[35]`. This sits below learn sidebar (`z-40`) and below app sidebar (`z-50`). Sidebar remains interactive when overlay is maximized. | **Chosen** — preserves sidebar interactivity |

Wait — re-reading the existing code: `ConsoleFrame` maximized overlay is `z-40`. The app sidebar is `z-50`, so overlay is below. The learn sidebar aside is `z-40` — same z-index. In DOM order, the flex layout renders sidebar first, then `<main>`. The overlay is inside `<main>`'s children. Since the overlay is later in DOM at same z-index, it paints over the learn sidebar. This is a pre-existing bug (or intentional — the overlay covers the sidebar when maximized on learn pages). The spec says "no z-index or overflow regression", so we preserve current behavior.

**Final z-index decision**: Keep overlay at `z-40`. No changes to z-index. Current stacking behavior is preserved. If the overlay intentionally covers the learn sidebar on maximize, that's existing behavior.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/editor/ConsoleFrame.tsx` | Modify | Replace hardcoded `md:pl-[72px] lg:pl-[280px]` with `padding-left: var(--sidebar-offset, 0px)` via inline style. Add `transition: padding-left 300ms` via inline style. Keep `p-4` for outer padding. |
| `src/components/layout/InVitroShell.tsx` | Modify | Add `useEffect` that sets `--sidebar-offset` on `document.documentElement` based on `collapsed` state and `md` breakpoint. Add `transition-[padding] duration-300` to `<main>` (already present, confirm). |
| `src/components/learn/Sidebar.tsx` | Modify | Add `useEffect` that sets `--sidebar-offset` on `document.documentElement` based on `desktopCollapsed` state and `lg` breakpoint. |
| `src/app/learn/layout.tsx` | No change | Server component; no changes needed. `Sidebar` (client) handles the variable. |
| `src/app/globals.css` | Modify | Add `--sidebar-offset: 0px` as default CSS custom property on `:root` or `html`. This ensures mobile and initial load default to 0. |

## Detailed File Edits

### `src/components/editor/ConsoleFrame.tsx` (line 105)

**Before:**
```tsx
<div className="fixed inset-0 z-40 flex flex-col overflow-auto bg-[#0a0a0a] p-4 md:pl-[72px] lg:pl-[280px]">
```

**After:**
```tsx
<div
  className="fixed inset-0 z-40 flex flex-col overflow-auto bg-[#0a0a0a] p-4"
  style={{
    paddingLeft: "var(--sidebar-offset, 0px)",
    transition: "padding-left 300ms ease-in-out",
  }}
>
```

Note: `p-4` provides the base padding (16px on all sides). The inline `paddingLeft` overrides the left padding with the variable. Tailwind's `p-4` sets `padding: 1rem`. The inline `padding-left` overrides only the left side. However, `p-4` in Tailwind is `padding: 1rem` (shorthand), which sets all four sides. The inline `padding-left` will override. This works correctly.

Actually — a subtle issue: `p-4` sets `padding: 1rem` which is a shorthand. Inline `padding-left` overrides it. This is fine. But to be explicit and avoid confusion, we could use `py-4 pr-4` instead of `p-4` and set `paddingLeft` via style. Cleaner:

```tsx
<div
  className="fixed inset-0 z-40 flex flex-col overflow-auto bg-[#0a0a0a] py-4 pr-4"
  style={{
    paddingLeft: "var(--sidebar-offset, 0px)",
    transition: "padding-left 300ms ease-in-out",
  }}
>
```

### `src/components/layout/InVitroShell.tsx`

Add `useEffect` import (already has `useState`), add `useEffect` block:

```tsx
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

// ... existing interface ...

export function InVitroShell({ children, userName, userMeta }: InVitroShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Set --sidebar-offset on documentElement for ConsoleFrame overlay
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => {
      document.documentElement.style.setProperty(
        "--sidebar-offset",
        mql.matches ? (collapsed ? "72px" : "280px") : "0px"
      );
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <AppSidebar ... />
      <main
        className={`flex-1 pt-14 pb-12 transition-[padding] duration-300 md:pt-0 ${
          collapsed ? "md:pl-[72px]" : "md:pl-[280px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
```

Note: `<main>`'s existing `md:pl-[72px]` / `md:pl-[280px]` classes remain for the content area padding. The `--sidebar-offset` variable is a parallel mechanism only for the overlay. The content area padding and the overlay padding are independent — content uses Tailwind classes, overlay uses the CSS variable.

### `src/components/learn/Sidebar.tsx`

Add `useEffect` import, add `useEffect` block:

```tsx
"use client";

import { useState, useEffect } from "react";
// ... existing imports ...

export function Sidebar({ modules }: { modules: ModuleEntry[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const pathname = usePathname();

  // Set --sidebar-offset on documentElement for ConsoleFrame overlay
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      document.documentElement.style.setProperty(
        "--sidebar-offset",
        mql.matches ? (desktopCollapsed ? "0px" : "256px") : "0px"
      );
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [desktopCollapsed]);

  // ... rest of component unchanged ...
}
```

### `src/app/globals.css`

Add at the top of the file, after the imports:

```css
/* ─── Sidebar Offset (responsive overlay) ─────────────── */
:root {
  --sidebar-offset: 0px;
}
```

This provides the initial default. On mount, the active shell's `useEffect` overrides it.

## Data Flow

```
InVitroShell (client)                    Sidebar (client, learn)
  │ collapsed state                        │ desktopCollapsed state
  │                                        │
  ▼ useEffect                              ▼ useEffect
document.documentElement                   document.documentElement
  .setProperty("--sidebar-offset", ...)      .setProperty("--sidebar-offset", ...)
  │                                        │
  └──────────── CSS inheritance ───────────┘
                     │
                     ▼
          ConsoleFrame (fixed overlay)
            style.paddingLeft = var(--sidebar-offset, 0px)
```

Only one shell is active per route:
- App shell pages (`/laboratorios`, `/dashboard`, etc.) → `InVitroShell` sets the variable
- Learn pages (`/learn/*`) → `Sidebar` sets the variable

## Interfaces / Contracts

### CSS Custom Property

```css
/* Default — covers mobile and initial paint */
:root {
  --sidebar-offset: 0px;
}
```

**Set by**: `InVitroShell` (app: 72px/280px/0px) and `Sidebar` (learn: 0px/256px/0px)
**Read by**: `ConsoleFrame` maximized overlay (`padding-left: var(--sidebar-offset, 0px)`)
**Transition**: `padding-left 300ms ease-in-out` on the overlay element

### Breakpoint mapping

| Route | Breakpoint | Expanded | Collapsed | Mobile |
|-------|-----------|----------|-----------|--------|
| App shell | `md` (768px) | 280px | 72px | 0px |
| Learn layout | `lg` (1024px) | 256px | 0px | 0px |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| E2E (Playwright) | Overlay respects app sidebar expanded (280px) and collapsed (72px) | Navigate to `/laboratorios`, toggle sidebar, maximize console, verify padding |
| E2E (Playwright) | Overlay respects learn sidebar expanded (256px) and collapsed (0px) | Navigate to `/learn`, toggle sidebar, maximize console, verify padding |
| E2E (Playwright) | Mobile (<md): overlay has 0px left padding | Resize viewport below 768px, maximize console, verify no left padding |
| E2E (Playwright) | Smooth transition on sidebar toggle | Toggle sidebar while console is maximized, verify animation |
| E2E (Playwright) | No horizontal scroll after toggle | Toggle sidebar, check no horizontal scrollbar appears |
| E2E (Playwright) | Sidebar remains interactive when overlay is maximized | Maximize console, click sidebar items, verify navigation works |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Pure CSS/React layout change. Single commit, git-revertable.

## Open Questions

None — all design decisions resolved.
