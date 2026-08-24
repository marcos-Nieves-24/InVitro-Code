# Sidebar Responsive Overlay Specification

## Purpose

The maximized console overlay (`ConsoleFrame`) and the main content area MUST adapt their left offset when the sidebar collapses or expands, eliminating blank space. This applies to both the app shell (`InVitroShell`) and the learn layout (`Sidebar`), and must work on mobile where neither sidebar is visible.

## Requirements

### Requirement: REQ-SRO-01 Overlay offset tracks sidebar width

The maximized console overlay MUST set its `padding-left` to match the current sidebar width via a CSS custom property (`--sidebar-offset`). The value MUST be `0px` on mobile (below the sidebar breakpoint) and the correct expanded or collapsed width on desktop.

#### Scenario: App shell — expanded sidebar

- GIVEN the student is on an app shell page (md+), the sidebar is expanded
- WHEN the console overlay is maximized
- THEN the overlay left padding equals the expanded sidebar width (280px)

#### Scenario: App shell — collapsed sidebar

- GIVEN the student is on an app shell page (md+), the sidebar is collapsed
- WHEN the console overlay is maximized
- THEN the overlay left padding equals the collapsed sidebar width (72px)

#### Scenario: Mobile — no sidebar offset

- GIVEN the student is on any page below the md breakpoint
- WHEN the console overlay is maximized
- THEN the overlay left padding is 0px

### Requirement: REQ-SRO-02 Content area tracks sidebar width

The main content area (the scrollable region beside the sidebar) MUST adjust its left margin or padding to match the sidebar width via the same `--sidebar-offset` custom property.

#### Scenario: Content aligns with sidebar on expand

- GIVEN the sidebar is collapsed (72px)
- WHEN the student expands the sidebar
- THEN the content area shifts right to 280px with no visible gap or overlap

#### Scenario: Content aligns with sidebar on collapse

- GIVEN the sidebar is expanded (280px)
- WHEN the student collapses the sidebar
- THEN the content area shifts left to 72px with no visible gap or overlap

### Requirement: REQ-SRO-03 Learn layout sidebar offset

The learn layout MUST set `--sidebar-offset` based on its own sidebar state (256px expanded, 0px collapsed). The overlay and content MUST respect this value independently of the app shell sidebar.

#### Scenario: Learn layout — expanded sidebar

- GIVEN the student is on a learn page (lg+), the sidebar is expanded
- WHEN the console overlay is maximized
- THEN the overlay left padding equals 256px

#### Scenario: Learn layout — collapsed sidebar

- GIVEN the student is on a learn page (lg+), the sidebar is collapsed
- WHEN the console overlay is maximized
- THEN the overlay left padding is 0px

### Requirement: REQ-SRO-04 Smooth transition

The offset change between collapsed and expanded sidebar states MUST produce a smooth CSS transition. The transition MUST NOT apply on initial page load or on route changes — only on sidebar toggle.

#### Scenario: Toggle produces animation

- GIVEN the sidebar is expanded
- WHEN the student clicks the sidebar toggle
- THEN the overlay and content shift over approximately 200–400ms (smooth visual transition)

#### Scenario: No transition on initial load

- GIVEN the page loads for the first time
- WHEN the overlay renders
- THEN there is no slide-in animation; the offset is applied immediately

### Requirement: REQ-SRO-05 No blank space at any state

The content area and the overlay MUST leave no blank space or unintended horizontal scroll when the sidebar transitions between states.

#### Scenario: No horizontal scroll after toggle

- GIVEN the console overlay is maximized on any page
- WHEN the sidebar is toggled between expanded and collapsed
- THEN no horizontal scrollbar appears on the page

#### Scenario: No visible gap beside content

- GIVEN the sidebar is collapsed
- WHEN the page renders
- THEN the content area starts flush with the sidebar edge; no blank strip is visible between them

## Key Learnings

1. The spec lives under a new domain (`sidebar-responsive-overlay`) because no existing spec covers sidebar-responsive offset behavior.
2. CSS custom properties inherit into `fixed` descendants, making them suitable for overlay offset without React context plumbing.
3. Two independent sidebars (app shell and learn) must each set the same custom property on their own root element; only one shell is active per route.
