# Proposal: Dashboard Hero DNA Model Swap

## Intent

The existing `dashboard.glb` ships a single mesh/material — the DNA helix is fused into the scientist, making real emissive glow impossible. A new model separates the DNA into its own mesh/material, unlocking real multicolour emission. The helix is also enlarged so the current bust framing would clip it.

## Scope

### In Scope
- Asset swap: `cientifica-adn.glb` replaces `dashboard.glb`; old file deleted
- Optimised textures: 2048→1024 px; 17.2 MB → 6.8 MB (−60.6%, 11% smaller than old)
- Per-material traverse: scientist gets metalness/roughness correction; DNA gets `emissive=#ffffff`, `emissiveMap=map`, `emissiveIntensity=2.5`
- Framing re-tune from new bounds (DNA reaches y ≈ 1.15)
- Cyan pointLight repositioned onto helix/hand as dimmed spill
- Spec drift correction: canonical spec lists `three ^0.170.0`/R3F `^8.17.0`/drei `^9.114.0`; actual is `^0.186.0`/`^9.7.0`/`^10.7.8`

### Out of Scope
- Static presentation unchanged (no turntable, `useFrame`, hover pause, `matchMedia` listener)
- Hero background image, `totalXp` prop, gamification widgets, side panel
- Blender round-trip, `plotly.js` changes

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `dashboard-3d-hero`: New asset, per-material traverse, real emissive on DNA, updated framing, dimmed spill, corrected dep versions

## Approach

1. Delete `dashboard.glb`; place `cientifica-adn.glb` in `public/dashboard/`
2. Update `useGLTF` URL; replace blanket `scene.traverse` with per-material logic
3. Recompute `MODEL_OFFSET`/`CAMERA_POSITION`/`CAMERA_FOV` from new bounds `[-0.402, -0.952, -0.341]..[0.322, 1.154, 0.376]`
4. Reposition cyan `pointLight` to hand/helix region, dimmed
5. Update spec with corrected deps and new mesh/material facts

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `public/dashboard/cientifica-adn.glb` | Created | New optimised GLB (6.8 MB) |
| `public/dashboard/dashboard.glb` | Deleted | Old single-mesh GLB |
| `src/components/dashboard/DashboardHero3D.tsx` | Modified | New URL, per-material traverse, emissive, framing, spill |
| `openspec/specs/dashboard-3d-hero/spec.md` | Modified | Corrected deps, new mesh/material facts |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| DNA node's negative scale inverts normals | Medium | `doubleSided: true`; verify on first render |
| Framing constants need visual tuning | High | Named constants at file top for devtools adjustment |
| 1024 px textures lose quality at high DPI | Low | Canvas renders 320–480 CSS px; manual check |

## Rollback Plan

Revert commit. Restore `dashboard.glb` from backup; revert `useGLTF` URL.

## Dependencies

- Optimised GLB already at `public/dashboard/cientifica-adn.glb` (measured)
- No new npm packages, CDN, or runtime decoders (`extensionsUsed` empty)

## Success Criteria

- [ ] `npm run type-check` passes
- [ ] New asset renders with DNA glowing multicolour emission
- [ ] Cyan spill tints hand/cuff matching reference
- [ ] No helix clipping at any breakpoint
- [ ] Old `dashboard.glb` deleted; spec deps match `package.json`
- [ ] `npm run build` succeeds; lazy chunk ≤ 300KB gzipped
