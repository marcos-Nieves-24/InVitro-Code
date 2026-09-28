# Clerk Appearance Specification

## Purpose

Defines the Clerk `appearance` prop configuration that themes `<SignIn />` and `<SignUp />` components to visually blend with the InVitro-Code design system. Maps Clerk's CSS variable API to existing `@theme` tokens defined in `src/app/globals.css`.

## Current State

No `appearance` prop is passed to any Clerk component. The `<ClerkProvider>` in `src/app/layout.tsx` is bare. Clerk components render with default Clerk styling (blue primary, standard radius, default fonts). The project's design tokens (mint `#00b2b2`, ink `#111439`, radius-btn 10px, Space Grotesk/Inter fonts) are not applied to Clerk UI.

## Requirements

### Requirement: Primary Color Mapping

The system SHALL map Clerk's `variables.colorPrimary` to the project's mint token (`#00b2b2`). This affects Clerk buttons, links, and interactive elements.

#### Scenario: Sign-in button uses mint color

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views the primary action button (e.g., "Continuar")
- THEN the button background color is mint (`#00b2b2`)
- AND the button text color provides sufficient contrast (ink `#111439` or white)

#### Scenario: Sign-up button uses mint color

- GIVEN the sign-up page renders with the appearance prop
- WHEN the user views the primary action button (e.g., "Crear cuenta")
- THEN the button background color is mint (`#00b2b2`)

### Requirement: Text Color Mapping

The system SHALL map Clerk's `variables.colorText` to the project's ink token (`#111439`). This affects all text inside Clerk components (labels, headings, descriptions).

#### Scenario: Clerk form text matches ink color

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views form labels and headings
- THEN the text color is ink (`#111439`)
- AND the text is readable against the light panel background

### Requirement: Border Radius Mapping

The system SHALL map Clerk's `variables.borderRadius` to `10px` (matching `--radius-btn` from `@theme`). This affects Clerk buttons, inputs, and card corners.

#### Scenario: Clerk inputs use 10px radius

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views the email input field
- THEN the input border radius is 10px
- AND the input visually matches the project's button radius

#### Scenario: Clerk buttons use 10px radius

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views the primary button
- THEN the button border radius is 10px

### Requirement: Font Mapping

The system SHALL map Clerk's `variables.fontFamily` to the project's body font (Inter via `--font-body`). Headings inside Clerk components SHOULD use `--font-display` (Space Grotesk) where the appearance API exposes heading element overrides.

#### Scenario: Clerk form uses Inter font

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views form labels and input text
- THEN the font family is Inter (or the project's `--font-body` fallback)

### Requirement: Card Element Override

The system SHALL override Clerk's card element to blend with the project's surface tokens. The Clerk card SHALL have a transparent or surface-card background (`#F8FAFB`), no visible border (or `border-surface-raised`), and the project's shadow (`shadow-md` or `shadow-sm`).

The card override is needed because the `AuthShell` component provides its own panel background — the Clerk card should not add a second contrasting background.

#### Scenario: Clerk card blends with panel background

- GIVEN the sign-in page renders inside the AuthShell right panel
- WHEN the user views the Clerk component
- THEN the Clerk card background is transparent or matches surface-card
- AND the Clerk card has no visible border that clashes with the panel
- AND the Clerk card shadow is subtle (shadow-sm or none)

### Requirement: Button Element Override

The system SHALL override Clerk's primary button to use mint (`#00b2b2`) background with ink (`#111439`) text, matching the project's primary button pattern. Secondary buttons (e.g., OAuth providers) SHOULD use a neutral style (white/outlined) consistent with the project's secondary button variant.

#### Scenario: Primary button matches project style

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views the primary "Continuar" button
- THEN the button background is mint (`#00b2b2`)
- AND the button text is ink (`#111439`)
- AND the button has 10px border radius

#### Scenario: OAuth buttons use neutral style

- GIVEN the sign-in page renders with Google OAuth enabled
- WHEN the user views the "Continuar con Google" button
- THEN the button has a neutral/outlined style (white background, subtle border)
- AND the button text is ink (`#111439`)

### Requirement: Input Element Override

The system SHALL override Clerk's input fields to use a white background, `border-surface-raised` border color, 10px border radius, and the project's body font. Focus states SHOULD use mint (`#00b2b2`) as the border color.

#### Scenario: Input field has correct styling

- GIVEN the sign-in page renders with the appearance prop
- WHEN the user views the email input field
- THEN the input has a white background
- AND the input border is surface-raised color
- AND the input border radius is 10px
- AND focusing the input changes the border to mint

### Requirement: No Global Provider Change

The system SHALL apply the `appearance` prop per-component on `<SignIn />` and `<SignUp />`, NOT globally on `<ClerkProvider>` in `src/app/layout.tsx`. This isolates auth theming from the rest of the application.

#### Scenario: Appearance is per-component

- GIVEN the auth pages render with the appearance prop
- WHEN the user navigates to a non-auth page (e.g., `/learn`)
- THEN Clerk UI on non-auth pages (if any) retains default styling
- AND `src/app/layout.tsx` remains unchanged

## Acceptance Criteria

- [ ] `appearance` object is defined in a shared location (e.g., `src/lib/clerk-appearance.ts` or inline in `AuthShell`)
- [ ] `variables.colorPrimary` maps to `#00b2b2` (mint)
- [ ] `variables.colorText` maps to `#111439` (ink)
- [ ] `variables.borderRadius` maps to `10px`
- [ ] `variables.fontFamily` maps to Inter (`--font-body`)
- [ ] `elements.card` override removes conflicting background/border
- [ ] `elements.primaryButton` override uses mint background + ink text
- [ ] `elements.formFieldInput` override uses white bg, surface-raised border, 10px radius
- [ ] `src/app/layout.tsx` is NOT modified
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] Visual inspection confirms Clerk elements blend with project tokens
