# hero-cinematic-background Specification

## Purpose

Deliver a premium, science-lab-grade first impression with a looping cinematic video background in the hero section, including base-plate composition, dark overlay for readability, and poster fallback support.

## Requirements

### Requirement: Video embed with autoplay loop

The system MUST embed a looping video at `public/landing/hero-lab-bg.mp4` as a full-bleed background in the hero section.

#### Scenario: Hero renders video background

- GIVEN the hero section is visible
- WHEN the page loads
- THEN a `<video>` element with `autoPlay muted loop playsInline` attributes is rendered
- AND the video source is `public/landing/hero-lab-bg.mp4`
- AND the poster attribute is `/landing/landing-background.png`

#### Scenario: Video loads with poster fallback

- GIVEN the video file has not yet loaded
- WHEN the hero section renders
- THEN the poster image `/landing/landing-background.png` is displayed
- AND the video plays once loaded

### Requirement: Dark hero surface

The hero section MUST render a dark surface (ink token `#111439`) as the base beneath the video and overlay, and the hero copy MUST use light foreground tokens with WCAG AA contrast.

#### Scenario: Dark base when video unavailable

- GIVEN the video file fails to load or is unsupported
- WHEN the hero section renders
- THEN the dark ink surface (`#111439`) is visible as the background
- AND the poster image is not displayed or also fails
- AND the hero remains visually coherent with the dark base

#### Scenario: Copy contrast over dark surface

- GIVEN the hero section renders with dark surface, video, or overlay
- WHEN the eyebrow, h1, body, and CTA text are displayed
- THEN all text uses light foreground tokens
- AND every text element meets WCAG AA contrast ratio against the dark background
- AND the interactive terminal remains the primary focal point of the hero

### Requirement: Dark overlay for readability

The system MUST render a semi-transparent dark overlay between the video and content layers.

#### Scenario: Overlay provides contrast

- GIVEN the hero video is playing
- WHEN the overlay is rendered
- THEN it uses `bg-ink/60`–`/70` opacity
- AND all text and interactive elements above the overlay meet WCAG AA contrast ratios

### Requirement: Header contrast over the dark hero

The fixed header MUST use light foreground tokens while the dark hero is in view (unscrolled), and MUST transition back to the light surface treatment once the user scrolls past the hero.

#### Scenario: Unscrolled header uses light tokens

- GIVEN the page has loaded and the user has not scrolled
- WHEN the header is rendered
- THEN the logo and navigation links use light foreground tokens
- AND the header background is transparent or dark-matching

#### Scenario: Header transitions on scroll past hero

- GIVEN the user scrolls down past the hero section
- WHEN the hero exits the viewport
- THEN the header transitions to the light surface treatment (dark text on light background)
- AND the transition is smooth and not jarring

#### Scenario: Scroll back restores light header

- GIVEN the user scrolled past the hero and the header is in light surface mode
- WHEN the user scrolls back up to the hero
- THEN the header transitions back to light foreground tokens over the dark hero

### Requirement: Reduced motion support

The system MUST respect `prefers-reduced-motion: reduce` by disabling video autoplay.

#### Scenario: User prefers reduced motion

- GIVEN the OS setting `prefers-reduced-motion: reduce` is active
- WHEN the hero section renders
- THEN the video does not autoplay
- AND the poster image is displayed instead
- AND no animation plays

### Requirement: Video as non-essential decoration

The video MUST be treated as decorative only — no content is conveyed through the video.

#### Scenario: Video element accessibility

- GIVEN the hero section renders
- WHEN a screen reader encounters the video
- THEN the video element has `aria-hidden="true"`
- AND the video has `pointer-events-none`
- AND no meaningful content depends on the video
