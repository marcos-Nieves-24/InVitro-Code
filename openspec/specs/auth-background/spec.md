# Auth Background Specification

## Purpose

Defines the ambient animated gradient background displayed on the AuthShell brand panel. Provides a lightweight CSS-only animation that cycles through the project's color palette, with a `prefers-reduced-motion` fallback to a static gradient.

## Current State

The project already has `prefers-reduced-motion: reduce` guards in `src/app/globals.css` (lines 283-314) that disable animations for users who prefer reduced motion. The Anymotion system exists but is too heavyweight for a decorative background (iframe + bridge + 16:9 stage). The existing `bg-dot-grid` utility is a static pattern used by `PageShell`. No ambient animation exists on auth pages.

## Requirements

### Requirement: CSS Gradient Animation

The system SHALL implement a CSS `@keyframes` gradient animation that smoothly cycles through the project's color palette: mint (`#00b2b2`), ink (`#111439`), and graphite (`#005f88`). The animation SHALL use `background-size` enlargement (e.g., `400% 400%`) and `background-position` shifts to create a flowing gradient effect.

#### Scenario: Gradient animation plays on brand panel

- GIVEN the auth page loads on a desktop viewport
- WHEN the user views the brand panel (left side)
- THEN a gradient animation is visible behind the logo and text
- AND the gradient cycles through mint, ink, and graphite colors
- AND the animation completes a full cycle in 8-15 seconds
- AND the animation loops infinitely

#### Scenario: Animation is smooth and performant

- GIVEN the gradient animation is playing
- WHEN the user views the brand panel for 30 seconds
- THEN the animation runs at 60fps without jank
- AND no layout shifts occur during the animation
- AND CPU usage remains low (CSS-only, no JavaScript animation)

### Requirement: Reduced Motion Fallback

The system SHALL provide a static gradient fallback for users with `prefers-reduced-motion: reduce` enabled. The fallback SHALL display a single static gradient using the same color palette (mint→ink→graphite) without any animation.

#### Scenario: Reduced motion shows static gradient

- GIVEN the user's browser has `prefers-reduced-motion: reduce` enabled
- WHEN the auth page loads
- THEN the brand panel displays a static gradient background
- AND no animation plays
- AND the gradient uses mint, ink, and graphite colors in a single direction (e.g., top-to-bottom or diagonal)

#### Scenario: Reduced motion guard is in globals.css

- GIVEN the `prefers-reduced-motion` guard exists in `src/app/globals.css`
- WHEN the auth background animation class is added
- THEN the guard disables the animation (sets `animation: none`)
- AND the fallback gradient is applied

### Requirement: Brand Panel Layering

The gradient animation SHALL be rendered as a background layer behind the brand panel content (logo, name, tagline). The content SHALL use light text colors (white or fog `#5A7A8A`) to maintain readability over the animated gradient.

The animation element SHALL use `position: absolute` with `inset: 0` (or equivalent) and `z-index: -1` (or equivalent) to sit behind the text content. The content container SHALL use `position: relative` with a higher `z-index`.

#### Scenario: Text is readable over animation

- GIVEN the gradient animation is playing on the brand panel
- WHEN the user views the logo, project name, and tagline
- THEN all text is clearly readable over the animated background
- AND text uses light colors (white, fog, or surface) with sufficient contrast

#### Scenario: Animation does not interfere with text interaction

- GIVEN the gradient animation is playing
- WHEN the user hovers over or interacts with text elements on the brand panel
- THEN the animation continues playing in the background
- AND text interactions (hover, focus) work normally

### Requirement: No JavaScript Animation

The animation SHALL be implemented purely with CSS `@keyframes` and `background` properties. It SHALL NOT use JavaScript animation libraries (framer-motion, Anymotion, requestAnimationFrame) or iframes.

#### Scenario: Animation is CSS-only

- GIVEN the auth background is implemented
- WHEN the component's code is audited
- THEN no JavaScript animation logic is present
- AND no iframes are used for the background
- AND the animation uses only CSS `@keyframes` and `background` properties

### Requirement: Color Palette Consistency

The gradient animation SHALL use the exact color values from the `@theme` tokens in `src/app/globals.css`: mint `#00b2b2`, ink `#111439`, graphite `#005f88`. The animation SHALL NOT introduce new color values or use hardcoded colors that don't match the design system.

#### Scenario: Gradient uses theme tokens

- GIVEN the gradient animation is implemented
- WHEN the CSS is audited for color values
- THEN all gradient colors match `@theme` token values exactly
- AND no new colors are introduced

## Implementation Notes

The animation can be implemented as a CSS class (e.g., `.auth-gradient-bg`) added to `src/app/globals.css` or as inline styles within the `AuthShell` component. The `prefers-reduced-motion` guard in `globals.css` (lines 283-314) should be extended to include the new animation class.

Suggested CSS approach:
```css
@keyframes auth-gradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.auth-gradient-bg {
  background: linear-gradient(135deg, #00b2b2, #111439, #005f88);
  background-size: 400% 400%;
  animation: auth-gradient 12s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .auth-gradient-bg {
    animation: none;
    background-size: 100% 100%;
  }
}
```

## Acceptance Criteria

- [ ] CSS `@keyframes` animation defined in `src/app/globals.css` (or component-scoped styles)
- [ ] Animation cycles through mint, ink, and graphite over 8-15 seconds
- [ ] `prefers-reduced-motion: reduce` disables animation and shows static gradient
- [ ] Animation is CSS-only (no JavaScript, no iframes)
- [ ] Brand panel text is readable over the animated gradient
- [ ] Animation does not cause layout shifts or performance issues
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] Visual inspection confirms smooth gradient animation on brand panel
