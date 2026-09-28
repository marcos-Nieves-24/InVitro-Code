# AuthShell Specification

## Purpose

Defines the shared split-screen layout component (`AuthShell`) that wraps both sign-in and sign-up pages. It replaces the current bare card layout with a two-panel design: a brand identity panel on the left and a Clerk form panel on the right.

## Current State

Both auth pages (`src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` and `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`) are identical 19-line server components that render a `<PageShell width="marketing">` with a `<SiteHeader>`, a centered card (`rounded-card border-surface-raised bg-surface-card p-6 shadow-sm`), Spanish eyebrow/title copy, and a bare `<SignIn />` or `<SignUp />` component. There is no split-screen layout, no brand panel, and no ambient background.

## Requirements

### Requirement: Two-Panel Layout

The system SHALL render a split-screen layout with two equal-width panels side by side on viewports wider than 768px.

The layout SHALL use CSS Grid or Flexbox with `grid-template-columns: 1fr 1fr` (or equivalent) to create two equal columns. On viewports 768px and below, the layout SHALL stack vertically with the brand panel on top and the form panel below.

#### Scenario: Desktop renders two equal panels

- GIVEN the viewport width is 1024px
- WHEN the auth page loads
- THEN the left panel occupies 50% of the viewport width
- AND the right panel occupies 50% of the viewport width
- AND both panels are visible without horizontal scrolling

#### Scenario: Mobile stacks panels vertically

- GIVEN the viewport width is 375px
- WHEN the auth page loads
- THEN the brand panel appears above the form panel
- AND both panels are full-width
- AND the page scrolls vertically if content overflows

### Requirement: Brand Panel Content

The left panel SHALL display the InVitro-Code logo (`/logo-negativo.svg`), the project name "InVitro-Code", a Spanish tagline (e.g., "Aprende Biotecnología e IA con código"), and the ambient gradient animation background.

The brand panel SHALL use a dark background (`#0a0a0a` or ink `#111439`) with light text for contrast against the gradient animation.

#### Scenario: Brand panel shows logo and tagline

- GIVEN the auth page renders on a desktop viewport
- WHEN the user views the left panel
- THEN the InVitro-Code logo is visible at the top
- AND the project name "InVitro-Code" is displayed below the logo
- AND a Spanish tagline is displayed below the project name
- AND the ambient gradient animation plays behind the text

#### Scenario: Brand panel text is readable over animation

- GIVEN the ambient gradient animation is playing
- WHEN the user views the brand panel text
- THEN all text (logo, name, tagline) has sufficient contrast against the animated background
- AND text uses light colors (white or fog `#5A7A8A`) on the dark background

### Requirement: Form Panel Content

The right panel SHALL render the Clerk `<SignIn />` or `<SignUp />` component with the Clerk `appearance` prop applied (see `clerk-appearance.md`). The right panel SHALL have a light background (`surface-card` or white) and centered content.

#### Scenario: Sign-in form renders in right panel

- GIVEN the sign-in page loads
- WHEN the user views the right panel
- THEN the Clerk `<SignIn />` component is rendered with the `appearance` prop
- AND the form is centered horizontally and vertically within the panel
- AND the panel background is light (surface-card or white)

#### Scenario: Sign-up form renders in right panel

- GIVEN the sign-up page loads
- WHEN the user views the right panel
- THEN the Clerk `<SignUp />` component is rendered with the `appearance` prop
- AND the form is centered horizontally and vertically within the panel
- AND the panel background is light (surface-card or white)

### Requirement: Full-Viewport Height

The auth shell SHALL fill the full viewport height (`min-h-screen` or `100vh`) so the split-screen layout occupies the entire browser window without scrolling on desktop.

#### Scenario: Shell fills viewport on desktop

- GIVEN the viewport height is 900px
- WHEN the auth page loads
- THEN the auth shell occupies the full 900px height
- AND no vertical scrollbar appears (unless content overflows on mobile)

### Requirement: Responsive Breakpoint

The layout SHALL switch from side-by-side to stacked layout at the `md` breakpoint (768px). Below 768px, the brand panel SHALL appear on top with reduced height (e.g., 30-40% of viewport) and the form panel below.

#### Scenario: Tablet viewport stacks panels

- GIVEN the viewport width is 768px
- WHEN the auth page loads
- THEN the brand panel appears above the form panel
- AND the brand panel height is reduced compared to desktop

### Requirement: No External Dependencies

The AuthShell component SHALL use only existing project dependencies (React, Tailwind CSS, existing `@theme` tokens). It SHALL NOT introduce new npm packages.

#### Scenario: Component uses existing tokens

- GIVEN the AuthShell component is implemented
- WHEN the component's styles are audited
- THEN all colors reference `@theme` tokens (ink, mint, surface-card, etc.)
- AND all spacing uses `@theme` spacing tokens (space-xs through space-3xl)
- AND no new npm dependencies are added to `package.json`

## Acceptance Criteria

- [ ] `AuthShell` component exists at `src/components/auth/AuthShell.tsx`
- [ ] Accepts `children` (the Clerk component) and `variant` prop (`"sign-in"` | `"sign-up"`) for text differences
- [ ] Two-panel layout renders correctly at 1024px+ viewport
- [ ] Stacked layout renders correctly at 375px viewport
- [ ] Full-viewport height achieved with no unwanted scrollbars on desktop
- [ ] Brand panel displays logo, name, and Spanish tagline
- [ ] Form panel centers Clerk component with appearance theming
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` succeeds
