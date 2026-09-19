# dashboard-3d-hero Specification

## Purpose

3D model viewer in the dashboard hero section using React Three Fiber, replacing the static XP badge with a static bust GLB model.

## Requirements

### Requirement: Dependencies installation

The system MUST install `three` (^0.170.0), `@react-three/fiber` (^8.17.0), `@react-three/drei` (^9.114.0). Versions MUST resolve without peer dependency conflicts.

#### Scenario: Install and type-check

- GIVEN the three packages are added to package.json
- WHEN `npm install` and `npm run type-check` run
- THEN both complete without errors

### Requirement: Static asset delivery

The system MUST place `dashboard.glb` (7.23 MB) and `dashboard-fondo.png` in `public/dashboard/`, served at `/dashboard/dashboard.glb` and `/dashboard/dashboard-fondo.png`.

#### Scenario: GLB accessible

- GIVEN the dashboard page is visited
- WHEN the browser requests `/dashboard/dashboard.glb`
- THEN the file is served with correct content-type

### Requirement: DashboardHero3D client component

The system MUST export `DashboardHero3D` from `src/components/dashboard/DashboardHero3D.tsx` with `"use client"`. The component MUST accept no required props. The Canvas MUST render with a transparent background so the hero background image shows through. The scene MUST include a procedural `Environment` from drei (`<Environment frames={1} resolution={256}>`) for PBR reflections, with no CDN or network dependency. The model material MUST use `metalness` ≤ 0.2 and `roughness` ~0.4 so the model renders visibly lit rather than near-black.

(Previously: Canvas used opaque background; material had metalness=1 roughness=1 with no environment map, causing the model to render as a black silhouette)

#### Scenario: Static bust framing

- GIVEN the component mounts in the browser
- WHEN the Canvas initializes
- THEN a GLB model loads via `useGLTF("/dashboard/dashboard.glb")`
- AND the model is presented as a STATIC bust (head, shoulders and upper chest) with NO animation
- AND the framing is defined by the named constants `MODEL_OFFSET`, `CAMERA_POSITION` and `CAMERA_FOV` at file top
- AND the GLB pivot is at the model's centre (`y` bounds -0.9513..0.9467), so `MODEL_OFFSET.y` MUST be derived from the real bounds rather than assumed to be the model's base

(Previously: the model rotated around the Y axis via `useFrame` at ~0.5 rad/s. The rotation was removed at the user's request — the reference `dashboard-propuesta.png` is a static portrait.)

#### Scenario: Model renders visibly lit

- GIVEN the Canvas renders
- WHEN the scene composes
- THEN the model MUST display with visible metallic reflections (not a black silhouette)
- AND the `Environment` Lightformers MUST provide PBR reflections procedurally

#### Scenario: Transparent background shows hero image

- GIVEN the Canvas renders inside the hero banner
- WHEN the scene composes
- THEN the Canvas background MUST be transparent (`alpha: true`)
- AND the `dashboard-fondo.png` background image MUST be visible behind and around the model

#### Scenario: Lighting and camera

- GIVEN the Canvas renders
- WHEN the scene composes
- THEN at least one ambient and one directional light are present
- AND the camera frames the model without user interaction (OrbitControls disabled)

### Requirement: Static presentation

The system MUST NOT animate the 3D scene. Because the presentation is static, the `prefers-reduced-motion` preference is satisfied unconditionally and NO `matchMedia` listener, hover-pause handler or `useFrame` loop is required.

(Previously: this requirement MANDATED turntable rotation, a `prefers-reduced-motion` listener and hover pause. All three were removed when the presentation became a static bust, per the reference `dashboard-propuesta.png`.)

#### Scenario: No continuous motion

- GIVEN the component mounts
- WHEN the scene composes
- THEN no continuous animation runs (no `useFrame` rotation)
- AND the rendered content is identical across successive frames

#### Scenario: Reduced motion satisfied by default

- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN DashboardHero3D mounts
- THEN the model renders statically, satisfying the preference without any special handling

### Requirement: DNA helix cyan accent

The GLB ships a SINGLE mesh and a SINGLE material (`metallicFactor: 1.0`), so the held DNA helix cannot be made emissive independently from code. The system MUST approximate the reference's glowing cyan helix with a short-range cyan `pointLight` that tints the helix without blowing out the rest of the figure.

(Previously: the helix rendered matte brown against the reference's glowing cyan.)

#### Scenario: Cyan accent on the helix

- GIVEN the scene composes
- WHEN the lighting is evaluated
- THEN a cyan `pointLight` is present near the held helix
- AND its `distance` and `decay` are tuned so the falloff is gradual across the helix rather than a hot band with black ends
- AND the surrounding figure remains legible

#### Scenario: Emission limitation is documented

- GIVEN a reader inspects the component
- WHEN they read the accent light's comment
- THEN the code states that true emission is unachievable because the helix has no separate material
- AND points to the accent light as the documented approximation

### Requirement: WebGL fallback

The system MUST render `dashboard-fondo.png` when WebGL is unavailable or the GLB fails to load.

#### Scenario: WebGL unavailable

- GIVEN the browser lacks WebGL support
- WHEN DashboardHero3D renders
- THEN the error boundary catches the failure
- AND the static fallback image is displayed

#### Scenario: GLB load failure

- GIVEN the GLB returns 404 or is corrupt
- WHEN the model loader errors
- THEN the fallback image displays and no unhandled error propagates

### Requirement: Dashboard page integration

The dashboard page MUST dynamically import DashboardHero3D with `next/dynamic` and `{ ssr: false }`. The 3D viewer replaces the static XP badge in the hero section.

#### Scenario: SSR disabled

- GIVEN the dashboard page server-renders
- WHEN the page evaluates
- THEN DashboardHero3D is loaded via `next/dynamic({ ssr: false })`
- AND no server-side WebGL execution occurs

### Requirement: Performance budget

The GLB and component MUST be lazy-loaded — zero 3D code executes until the dashboard page is visited, and the initial bundle MUST NOT grow because of 3D code.

(AMENDED 2026-09-19 by explicit maintainer decision) The original budget — "3D dependencies MUST NOT increase the initial bundle by >50KB gzipped" and "the dashboard page chunk MUST NOT exceed 250KB gzipped" — was written before the dependency was ever measured and was never achievable for a three.js scene. Measured against the production build, the lazy chunk containing three.js is **274KB gzipped** (1017KB raw). The budget is restated at the measured reality rather than left aspirational, so it is enforced instead of silently violated. The initial-bundle guarantee is unchanged and is the part that actually protects users.

#### Scenario: Lazy 3D chunk budget

- GIVEN `npm run build` completes
- WHEN the lazy chunk containing three.js is inspected
- THEN it MUST NOT exceed **300KB gzipped** (currently 274KB; the headroom is kept deliberately thin so future growth is noticed)
- AND three.js MUST be excluded from the initial bundle

#### Scenario: No 3D code on other pages

- GIVEN a user visits any non-dashboard page
- WHEN JS bundles load
- THEN no three.js or R3F code is downloaded or executed
