# Tasks: Dashboard Hero DNA Model Swap

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 100–120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | auto-chain |
| Chain strategy | size-exception |

Decision needed before apply: No

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Swap asset and rewrite component | PR 1 | `npm run type-check && npm run build` | `npm run dev` → open dashboard page, inspect DNA glow and framing | Revert commit; restore `dashboard.glb` from backup, revert `useGLTF` URL and framing constants |

## Phase 1: Asset Cleanup

- [ ] 1.1 Delete `public/dashboard/dashboard.glb` (7,586,212 bytes). Verify with `ls -la public/dashboard/` that only `cientifica-adn.glb` and `dashboard-fondo.png` remain.
- [ ] 1.2 Confirm `public/dashboard/cientifica-adn.glb` exists and is ≤ 7,586,212 bytes (current: 6,775,656 bytes).

## Phase 2: Component Rewrite

All changes in `src/components/dashboard/DashboardHero3D.tsx` (97 lines → ~110 lines).

- [ ] 2.1 Add named mesh/material constants at file top:
  ```tsx
  const SCIENTIST_MESH_NAME = "Mesh_0";
  const DNA_MESH_NAME = "Mesh_0.001";
  ```
- [ ] 2.2 Update framing constants from design values:
  - `MODEL_OFFSET` → `[0.18, -0.76, 0]`
  - `CAMERA_POSITION` → `[0, 0, 1.72]`
  - `CAMERA_FOV` → `30` (unchanged)
  - Update the block comment to reference new GLB bounds `[-0.402, -0.952, -0.341]..[0.322, 1.154, 0.376]`.
- [ ] 2.3 Change `useGLTF` URL from `"/dashboard/dashboard.glb"` to `"/dashboard/cientifica-adn.glb"`.
- [ ] 2.4 Replace the blanket `scene.traverse` material correction with per-material logic:
  - DNA mesh (`DNA_MESH_NAME`): `metalness=0.0`, `roughness=0.3`, `emissive.set("#ffffff")`, `emissiveMap=mat.map`, `emissiveIntensity=2.5`.
  - Scientist mesh (`SCIENTIST_MESH_NAME`): `metalness=0.15`, `roughness=0.4`, `envMapIntensity=1.0`.
  - Unknown mesh fallback: `console.warn` + scientist PBR defaults.
  - All branches set `mat.needsUpdate = true`.
- [ ] 2.5 Update the spill `pointLight`:
  - `position` → `[-0.25, 0.5, 0.20]`
  - `intensity` → `0.8`
  - `distance` → `1.0`
  - `decay` → `2`
  - Update comment: document as spill effect, NOT the emission mechanism.

## Phase 3: Verification

- [ ] 3.1 Run `npm run type-check` — must pass with zero errors.
- [ ] 3.2 Run `npm run build` — must succeed; check that the lazy chunk for `DashboardHero3D` is ≤ 300KB gzipped.
- [ ] 3.3 Run `npm run dev`, open the dashboard page in browser, and verify:
  - DNA helix renders with multicolour emissive glow (not flat cyan).
  - Scientist mesh shows PBR reflections only, no emissive.
  - Bust framing: head visible, torso cropped, helix inside frustum.
  - Cyan spill tints hand/cuff without blow-out on face.
  - Helix not black/inverted (negative-scale normals correct).

## Phase 4: Cleanup

- [ ] 4.1 Update the comment block at file top to document new GLB bounds and framing rationale.
- [ ] 4.2 Remove any stale comments referencing `dashboard.glb` or "single mesh" limitation.
