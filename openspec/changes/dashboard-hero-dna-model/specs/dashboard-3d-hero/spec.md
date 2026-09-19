# Delta for dashboard-3d-hero

## RENAMED Requirements

### Requirement: DNA helix cyan accent → DNA helix emissive glow

(Reason: The new GLB ships separate meshes and materials, so the helix can be made emissive independently. The old name described an approximation; the new name reflects real emissive capability.)
(Migration: All code comments, scenario references, and docs referencing "DNA helix cyan accent" MUST be updated to "DNA helix emissive glow". The old cyan `pointLight` remains as a spill effect but is no longer the emission mechanism.)

## MODIFIED Requirements

### Requirement: Dependencies installation

The system MUST install `three` (^0.186.0), `@react-three/fiber` (^9.7.0), `@react-three/drei` (^10.7.8). Versions MUST resolve without peer dependency conflicts.

(Previously: listed `three` ^0.170.0, `@react-three/fiber` ^8.17.0, `@react-three/drei` ^9.114.0 — versions that did not match `package.json`)

#### Scenario: Install and type-check

- GIVEN the three packages are added to package.json
- WHEN `npm install` and `npm run type-check` run
- THEN both complete without errors

### Requirement: Static asset delivery

The system MUST place `cientifica-adn.glb` (6,775,656 bytes ≈ 6.8 MB) and `dashboard-fondo.png` in `public/dashboard/`, served at `/dashboard/cientifica-adn.glb` and `/dashboard/dashboard-fondo.png`. The GLB MUST NOT require Draco, Meshopt, or `EXT_texture_webp` extensions (the shipped asset has an empty `extensionsUsed`, so no new runtime decoder or CDN dependency is introduced).

(Previously: asset was `dashboard.glb` at 7,586,212 bytes with no extension constraints documented)

#### Scenario: GLB accessible

- GIVEN the dashboard page is visited
- WHEN the browser requests `/dashboard/cientifica-adn.glb`
- THEN the file is served with correct content-type

#### Scenario: Old asset removed and file is smaller

- GIVEN the previous asset `dashboard.glb` (7,586,212 bytes) existed at `/dashboard/dashboard.glb`
- WHEN the change is applied
- THEN `dashboard.glb` MUST NOT exist and `cientifica-adn.glb` MUST be ≤ 7,586,212 bytes (current: 6,775,656 bytes, ~11% smaller)

### Requirement: DashboardHero3D client component

The system MUST export `DashboardHero3D` from `src/components/dashboard/DashboardHero3D.tsx` with `"use client"`. The component MUST accept no required props. The Canvas MUST render with a transparent background so the hero background image shows through. The scene MUST include a procedural `Environment` from drei (`<Environment frames={1} resolution={256}>`) for PBR reflections, with no CDN or network dependency. The model material MUST use `metalness` ≤ 0.2 and `roughness` ~0.4 so the model renders visibly lit rather than near-black.

(Previously: Canvas used opaque background; material had metalness=1 roughness=1 with no environment map, causing the model to render as a black silhouette)

#### Scenario: Static bust framing

- GIVEN the component mounts in the browser
- WHEN the Canvas initializes
- THEN a GLB model loads via `useGLTF("/dashboard/cientifica-adn.glb")`
- AND the model is presented as a STATIC bust (head, shoulders and upper chest) with NO animation
- AND the framing is defined by the named constants `MODEL_OFFSET`, `CAMERA_POSITION` and `CAMERA_FOV` at file top
- AND the GLB bounds are min `[-0.4023, -0.952, -0.3411]` max `[0.3224, 1.1539, 0.3756]`, so `MODEL_OFFSET.y` MUST be derived from the real bounds rather than assumed to be the model's base
- AND the helix top (`y ≈ 1.1539`) MUST sit inside the frustum: at FOV 30 and camera distance `d`, visible half-height at the model plane is `d × tan(15°)`, and the helix top MUST be below `MODEL_OFFSET.y + d × tan(15°)`

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

#### Scenario: Per-material correction

- GIVEN the model loads and traverses materials
- WHEN materials are corrected for rendering
- THEN the scientist mesh (`Material_0`) receives metalness/roughness correction only
- AND the DNA helix mesh (`Material_0.001`) receives emissive treatment (separate from the scientist)
- AND mesh identification MUST be by named constant with a documented fallback, never by traversal order

### Requirement: DNA helix emissive glow

The new GLB ships TWO meshes and TWO materials, so the held DNA helix CAN be made emissive independently from code. The helix is `Mesh_0.001` / `Material_0.001`. The system MUST make the helix emissive by setting `emissive` to `#ffffff` together with `emissiveMap` set to that material's own base colour map so that texture luminance drives the glow. `emissiveIntensity` SHOULD be about 2.5. The scientist mesh (`Material_0`) MUST NOT receive emissive treatment.

(Previously: the GLB shipped a SINGLE mesh and material, so true emission was unachievable — the helix was approximated with a cyan `pointLight` only. The old `Emission limitation is documented` scenario is removed because the limitation no longer applies.)

#### Scenario: Helix glows via its own material

- GIVEN the scene composes after per-material traverse
- WHEN the DNA helix mesh (`Material_0.001`) is evaluated
- THEN `emissive` is set to `#ffffff`
- AND `emissiveMap` is set to that material's own base colour map
- AND `emissiveIntensity` is approximately 2.5

#### Scenario: Scientist mesh unaffected by emissive

- GIVEN the scene composes after per-material traverse
- WHEN the scientist mesh (`Material_0`) is evaluated
- THEN it receives NO emissive properties (`emissive`, `emissiveMap`, `emissiveIntensity` unchanged)
- AND it receives only metalness/roughness correction

## ADDED Requirements

### Requirement: Cyan light spill on hand and cuff

The system MUST retain a cyan `pointLight` at the hand/helix region, reduced from its previous intensity (`intensity={2.2}`, `distance={1.6}`, `decay={1}`) to read as spill, not primary glow. The code comment MUST document it as a spill effect and NOT the emission mechanism.

#### Scenario: Spill tints hand and cuff without blow-out

- GIVEN the scene composes with the emissive DNA helix and the cyan point light
- WHEN the lighting is evaluated
- THEN the point light tints the hand/cuff region without blow-out
- AND the code comment documents it as a spill effect, not the emission source
