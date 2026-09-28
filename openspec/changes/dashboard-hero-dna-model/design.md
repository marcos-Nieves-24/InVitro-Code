# Design: Dashboard Hero DNA Model Swap

## Technical Approach

Swap `dashboard.glb` (single mesh, no emissive possible) with `cientifica-adn.glb` (two meshes: scientist + DNA helix, separate materials). Replace the blanket `scene.traverse` material correction with per-material logic that keeps the scientist PBR-clean and gives the helix real emissive glow via `emissiveMap`. Retune camera framing from the new world bounds. Downgrade the cyan `pointLight` from primary emission to dimmed spill. All changes in `DashboardHero3D.tsx` plus an asset swap in `public/dashboard/`.

## Architecture Decisions

### Decision: Per-material traverse by named constant

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Named constant `DNA_MESH_NAME` + `SCIENTIST_MESH_NAME` | Robust across model edits; explicit fallback if name absent | **Chosen** |
| Traverse order (first mesh = scientist, second = helix) | Breaks silently if Blender reorders nodes on re-export | Rejected |
| Material name match (`Material_0.001`) | Tied to Blender naming convention; same fragility as traversal order | Rejected |

**Rationale**: Named constants with `console.warn` fallback mean the developer sees a clear message on first render if the model changes. The traversal-order approach broke once already (the old `dashboard.glb` was a single mesh) and would break again on any Blender re-export.

### Decision: `emissiveMap = mat.map` (multicolour) vs flat `emissive` (monochrome)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `emissiveMap` = base colour texture | Texture luminance drives glow → multicolour, matches reference | **Chosen** |
| `emissive = new Color("#22d3ee")` | Simpler; monochrome cyan, loses texture detail | Rejected |

**Rationale**: The DNA helix texture contains blues, cyans, and highlights. Using the base colour map as `emissiveMap` means bright areas glow harder and dark areas glow less — a natural, textured emission that a flat colour cannot replicate. The reference shows multicolour variation in the helix glow.

### Decision: Asset resize pipeline — 1024 px JPEG vs 2048 px raw vs WebP

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `@gltf-transform/cli resize` 2048→1024 px (keep JPEG) | −60.6% size, zero extension risk, 4× oversampled for canvas | **Chosen** |
| Ship raw 2048 px textures | 17.2 MB; 65% of file is textures | Rejected |
| WebP conversion after resize | Only 5% more savings; introduces `EXT_texture_webp`, legacy-Safari risk | Rejected |

**Rationale**: The canvas renders at ~320 CSS px (up to ~480 px at `dpr=[1,1.5]`), so 1024 px textures are still ~2× oversampled. WebP saves only 350 KB for a new extension dependency — not worth the compatibility risk.

### Decision: New filename vs overwriting `dashboard.glb`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| New filename `cientifica-adn.glb`; delete old `dashboard.glb` | Clean break; old file untracked so preserving it as rollback backup | **Chosen** |
| Overwrite `dashboard.glb` in place | Loses the rollback asset; git can't restore old file (untracked) | Rejected |

**Rationale**: `dashboard.glb` is untracked by git, so there is no git history to restore from. A new filename preserves the old file as a rollback backup until this change is verified.

### Decision: Spill light coordinate space

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Place spill inside `<group position={MODEL_OFFSET}>` (model-local) | Light moves with the model; helix-relative position is stable | **Chosen** |
| Place spill outside the group (world-space) | Must recompute position if MODEL_OFFSET changes | Rejected |

**Rationale**: The spill light tints the hand/cuff region, which is part of the model. Placing it inside the `<group>` means its position is relative to the model's local origin — stable even if framing constants change.

## Framing Constants — Derivation

The camera sits at `z = d` looking down −Z at the origin. The visible world-Y half-height at the model plane is `d × tan(FOV/2)`.

**Chosen values**: `MODEL_OFFSET = [0.18, -0.76, 0]`, `CAMERA_POSITION = [0, 0, 1.72]`, `CAMERA_FOV = 30`

**Derivation**:

- `tan(15°) = 0.2679`
- `d = 1.72` → half-height = `1.72 × 0.2679 = 0.4609`
- `MODEL_OFFSET.y = -0.76` → visible local Y range = `[-1.221, -0.299]`
- Helix top `1.1539` (world: `1.1539 + (-0.76) = 0.3939`) ✓ well inside `0.4609`
- Head top `0.9458` (world: `0.9458 + (-0.76) = 0.1858`) ✓ inside `0.4609`
- Model bottom `−0.952` (world: `−0.952 + (−0.76) = −1.712`) — below `−0.4609`, so torso is cropped. This IS the bust crop.
- Horizontal: `MODEL_OFFSET.x = 0.18` → world X range = `[−0.2223, 0.5024]`
- At the hero's landscape aspect (`lg` breakpoint, wider than tall), horizontal visible width > vertical. The vertical constraint is binding. Right shoulder at `0.5024` bleeds ~0.042 past a square viewport's right edge — the deliberate edge-bleed matching the approved prior composition.

**Note**: Horizontal framing depends on container aspect ratio. The hero container is wider than tall at `lg` breakpoints, so vertical is the binding constraint. At narrow viewports the 3D canvas is hidden (`hidden lg:block`), so horizontal overflow only matters on desktop.

## Data Flow

```
DashboardHero3D (client)
  ├─ Canvas gl={{ alpha: true }}
  │   ├─ ambientLight + directionalLight
  │   ├─ pointLight (cyan spill — model-local, dimmed)
  │   ├─ Environment <Lightformer> (unchanged)
  │   └─ DashboardModel
  │       ├─ useGLTF("/dashboard/cientifica-adn.glb")
  │       ├─ useMemo([scene]) — per-material traverse:
  │       │   ├─ Mesh_0 (Material_0): metalness=0.15, roughness=0.4, envMapIntensity=1.0
  │       │   └─ Mesh_0.001 (Material_0.001): metalness=0.0, roughness=0.3,
  │       │       emissive=#ffffff, emissiveMap=mat.map, emissiveIntensity=2.5
  │       └─ <primitive object={scene} />
  └─ Suspense fallback={null}
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `public/dashboard/cientifica-adn.glb` | Already in place | New optimised GLB (6,775,656 bytes) — no action needed |
| `public/dashboard/dashboard.glb` | Delete | Old single-mesh GLB; rollback backup is the untracked source file |
| `src/components/dashboard/DashboardHero3D.tsx` | Modify | New URL, named mesh constants, per-material traverse, emissive, updated framing, dimmed spill |
| `openspec/specs/dashboard-3d-hero/spec.md` | Modify | Corrected deps, new mesh/material facts (done in delta spec) |

## Interfaces / Contracts

```tsx
// Named mesh/material constants (file top)
const SCIENTIST_MESH_NAME = "Mesh_0";
const DNA_MESH_NAME = "Mesh_0.001";

// Per-material traverse — replaces blanket correction
useMemo(() => {
  scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      const mat = mesh.material as MeshStandardMaterial;
      if (mat.metalness !== undefined) mat.metalness = 0.15;
      if (mat.roughness !== undefined) mat.roughness = 0.4;
      if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 1.0;
      mat.needsUpdate = true;
    }
  });
}, [scene]);
```

**Pseudocode — per-material traverse (replaces the above)**:

```tsx
useMemo(() => {
  scene.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const mat = mesh.material as MeshStandardMaterial;

    if (mesh.name === DNA_MESH_NAME) {
      // DNA helix — emissive treatment
      mat.metalness = 0.0;
      mat.roughness = 0.3;
      mat.emissive.set("#ffffff");
      mat.emissiveMap = mat.map; // texture luminance drives glow
      mat.emissiveIntensity = 2.5;
    } else if (mesh.name === SCIENTIST_MESH_NAME) {
      // Scientist — standard PBR correction only
      mat.metalness = 0.15;
      mat.roughness = 0.4;
      mat.envMapIntensity = 1.0;
    } else {
      console.warn(
        `[DashboardHero3D] Unexpected mesh "${mesh.name}" — applying fallback PBR correction`
      );
      mat.metalness = 0.15;
      mat.roughness = 0.4;
      mat.envMapIntensity = 1.0;
    }
    mat.needsUpdate = true;
  });
}, [scene]);
```

**Why `useMemo` on `[scene]` remains correct**: The traverse mutates material properties once after the GLB loads. `useMemo` with `[scene]` as dependency ensures it runs exactly once when the scene object changes (i.e., when the GLB finishes loading). Using `useEffect` would also work but `useMemo` is the established pattern in this codebase and avoids an extra render pass.

## Spill Light Design

**Current**: `position={[-0.28, 0.0, 0.34]}`, `intensity={2.2}`, `distance={1.6}`, `decay={1}` — this was the PRIMARY emission mechanism (no real emissive existed).

**New role**: Dimmed spill over the hand/cuff area, NOT the emission source. The DNA helix now glows via its own `emissiveMap`. The spill light adds a subtle cyan tint to the surrounding hand and lab coat cuff, reinforcing the glow without competing with it.

**New values**:
```tsx
<pointLight
  position={[-0.25, 0.5, 0.20]}  // model-local: centre of helix, toward hand
  color="#22d3ee"
  intensity={0.8}
  distance={1.0}
  decay={2}
/>
```

- **Position**: Helix spans local x ≈ −0.40..−0.13, y ≈ 0.35..1.15, z ≈ 0.09..0.35. Centre is ≈ (−0.265, 0.75, 0.22). Offset slightly toward hand at (−0.25, 0.5, 0.20) — lower y puts it near the hand grip, not the top of the helix.
- **Intensity**: Reduced from 2.2 → 0.8 (64% reduction). The helix provides its own glow; the spill only tints the surrounding geometry.
- **Distance**: Reduced from 1.6 → 1.0 (tighter falloff, less bleed onto face).
- **Decay**: Changed from 1 → 2 (inverse-square falloff, more physically natural, faster drop-off).

**Coordinate space**: The light is inside `<group position={MODEL_OFFSET}>`, so all coordinates are model-local. This means the light moves with the model if framing constants change.

## Negative-Scale Risk

The DNA helix node (`Mesh_0.001`) has negative scale on all three axes: `[-0.4556, -0.4271, -0.3147]`. Negative determinant flips the winding order of triangles, which inverts face normals — a mesh that should face outward faces inward, causing it to render black or inside-out.

**Mitigation already in place**: Both materials declare `doubleSided: true` in the GLB, which maps to `THREE.DoubleSide`. This renders both front and back faces, making the normal direction irrelevant for visibility.

**Fallback if it still shades wrong** (must be checked on first render):
1. Force `mat.side = THREE.DoubleSide` explicitly in the traverse for the DNA mesh.
2. As a last resort, call `mesh.geometry.computeVertexNormals()` after loading to recompute normals from the flipped winding.
3. Debug via DevTools: select the helix mesh in React DevTools, inspect `material.side` and `geometry.attributes.normal`.

**This MUST be verified on first render in the browser** — it cannot be validated from the GLB metadata alone. The traverse code should include the explicit `mat.side = THREE.DoubleSide` assignment as a safety net even though the GLB declares it, because Three.js may not always honour the GLB material property during scene graph instantiation.

## Negative-Scale Risk — Why `emissiveMap = mat.map` Produces Multicolour Glow

When `emissiveMap` is set to a material's own base colour map (`mat.map`), the emissive contribution at each texel is `emissive × emissiveMap.texel × emissiveIntensity`. Since `emissive` is white (`#ffffff`), the RGB values of the base colour texture pass through unchanged — bright texels glow brightly, dark texels glow dimly, and the colour variation of the texture is preserved in the emission.

A plain `emissive = new Color("#22d3ee")` would multiply every texel by the same cyan constant, producing a flat monochrome glow regardless of the underlying texture detail.

## Asset Pipeline

**Source**: `~/Documentos/imagenes-invitro-code/modelo/cientifica-adn.glb` (17,187,464 bytes)

**Processing**: `@gltf-transform/cli resize --width 1024 --height 1024` → 6,775,656 bytes (−60.6%)

**Structure preserved**: Same node names (`Mesh_0`, `Mesh_0.001`), same material names (`Material_0`, `Material_0.001`), identical transform floats, identical vertex counts, identical `extensionsUsed` (empty). Only texture resolution changed (2048→1024 px).

**WebP alternative measured and rejected**: 6,775,656 → 6,423,148 bytes (only 5% more savings) but introduces `EXT_texture_webp` extension for marginal gain plus a small legacy-Safari compatibility risk.

**Result vs old asset**: ~11% smaller than `dashboard.glb` (7,586,212 bytes), so the swap reduces download despite the larger model.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Bust framing matches derived constants | Manual browser check at 1024/1280/1440/1920; helix top inside frustum, head visible, torso cropped |
| Visual | DNA helix emits multicolour glow | Compare against reference `dashboard-propuesta.png` — glow should show texture variation, not flat cyan |
| Visual | Scientist mesh does NOT emit | Confirm scientist body shows no glow, only PBR reflections |
| Visual | Negative-scale normals correct | First render: helix visible, not black/inverted; both sides render correctly |
| Functional | Per-material traverse by name | Inspect in DevTools: DNA mesh gets emissive, scientist does not |
| Functional | Spill light tints hand/cuff | Cyan tint visible on hand area, no blow-out on face |
| Functional | Old `dashboard.glb` deleted | File no longer exists in `public/dashboard/` |
| Performance | Lazy chunk size | `npm run build` — chunk ≤ 300KB gzipped |

**Items unverifiable without a browser**: Framing constants (frustum crop), glow strength, spill light falloff, negative-scale normal correctness. These MUST be verified during the apply/verify phases.

## Rollback Plan

1. **Git revert**: Revert the commit that swaps the asset and changes `DashboardHero3D.tsx`.
2. **Restore `dashboard.glb`**: The old file is **untracked by git** — there is no git history to restore from. The rollback backup is the source file at `~/Documentos/imagenes-invitro-code/dashboard.glb`. If this file is deleted, the only option is to re-export from the original Blender file.
3. **Revert `useGLTF` URL**: The component points back to `/dashboard/dashboard.glb`.
4. **Verify**: `npm run build` succeeds; old framing and blanket material correction restored.

**Untracked-asset caveat**: The old `dashboard.glb` is not in git. The new `cientifica-adn.glb` IS tracked (committed). The source Blender file at `~/Documentos/imagenes-invitro-code/modelo/cientifica-adn.glb` is the true rollback backup for the new asset.

## Decisions and Rejected Alternatives Summary

| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Mesh identification | Named constants | Traverse order / material name | Robust across model re-exports |
| Emissive strategy | `emissiveMap = mat.map` (multicolour) | Flat `emissive` colour (monochrome) | Preserves texture detail in glow |
| Texture resolution | 1024 px JPEG resize | 2048 px raw / WebP | 4× oversampled for canvas; WebP adds extension for 5% savings |
| Filename | New `cientifica-adn.glb` | Overwrite `dashboard.glb` | Old file untracked; preserves rollback backup |
| Spill light space | Inside `<group>` (model-local) | World-space | Stable if framing constants change |
| Spill intensity | 0.8 (dimmed) | 2.2 (previous) | Helix provides its own glow; spill is supplementary |

## Open Questions

- [ ] Framing constants may need visual tuning at first render — named constants at file top enable easy devtools adjustment
- [ ] `emissiveIntensity = 2.5` is a starting point; may need adjustment based on how the procedural Environment interacts with the emissive material
- [ ] Consider converting `dashboard-fondo.png` (1.94 MB) to WebP in a follow-up — not blocking this change
