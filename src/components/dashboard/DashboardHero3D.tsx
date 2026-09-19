"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import { DoubleSide, type MeshStandardMaterial, type Mesh } from "three";

// Named mesh constants — identify meshes by name, never by traversal order.
// If the GLB is re-exported with different node names, a console.warn fires
// and the fallback PBR correction is applied.
const SCIENTIST_MESH_NAME = "Mesh_0";
const DNA_MESH_NAME = "Mesh_0.001";

// Portrait framing for the new cientifica-adn.glb model.
// GLB world bounds: min [-0.4023, -0.952, -0.3411] max [0.3224, 1.1539, 0.3756].
// The DNA helix top reaches y ≈ 1.1539 — higher than the old model's head (0.9458).
// At FOV 30 and camera distance d=1.72, visible half-height = 1.72 × tan(15°) = 0.4609.
// MODEL_OFFSET.y = -0.76 → visible local Y = [0.299, 1.221].
// Helix top 1.1539 < 1.221 ✓ (margin 0.067). Head top 0.9458 ✓.
// Right shoulder at 0.5024 bleeds ~0.042 past the edge — matches the approved composition.
const MODEL_OFFSET: [number, number, number] = [0.18, -0.76, 0];
const CAMERA_POSITION: [number, number, number] = [0, 0, 1.72];
const CAMERA_FOV = 30;

function DashboardModel() {
  const { scene } = useGLTF("/dashboard/cientifica-adn.glb");

  // Per-material traverse — replaces the old blanket correction.
  // The new GLB has TWO meshes: scientist (Mesh_0) and DNA helix (Mesh_0.001).
  // The DNA helix gets real emissive glow via emissiveMap; the scientist gets standard PBR.
  useMemo(() => {
    scene.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      const mat = mesh.material as MeshStandardMaterial;

      if (mesh.name === DNA_MESH_NAME) {
        // DNA helix — real multicolour emissive glow.
        // emissiveMap = mat.map means texture luminance drives the glow:
        // bright neon texels glow strongly, dark texels glow dimly.
        mat.metalness = 0.0;
        mat.roughness = 0.3;
        mat.emissive.set("#ffffff");
        mat.emissiveMap = mat.map;
        mat.emissiveIntensity = 2.5;
        mat.side = DoubleSide;
      } else if (mesh.name === SCIENTIST_MESH_NAME) {
        // Scientist — standard PBR correction only (no emissive).
        mat.metalness = 0.15;
        mat.roughness = 0.4;
        mat.envMapIntensity = 1.0;
      } else {
        // Unknown mesh — fallback PBR correction with warning.
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

  return (
    <group position={MODEL_OFFSET}>
      <primitive object={scene} />
    </group>
  );
}

export function DashboardHero3D() {
  return (
    <Canvas
      gl={{ alpha: true }}
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} />

      {/* Cyan light SPILL on hand/cuff — NOT the emission mechanism.
          The DNA helix now glows via its own emissiveMap. This pointLight
          adds a subtle cyan tint to the surrounding hand and lab coat cuff,
          matching the reference image's light spill effect. */}
      <pointLight
        position={[-0.25, 0.5, 0.20]}
        color="#22d3ee"
        intensity={0.8}
        distance={1.0}
        decay={2}
      />

      <Environment frames={1} resolution={256}>
        <Lightformer
          form="ring"
          intensity={2}
          color="#a8e6cf"
          rotation-y={Math.PI / 2}
          position={[-3, 1, -1]}
          scale={2}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#c4b5fd"
          position={[2, 2, 2]}
          scale={[2, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#fde68a"
          position={[0, 4, -2]}
          scale={[4, 1, 1]}
        />
      </Environment>

      <Suspense fallback={null}>
        <DashboardModel />
      </Suspense>
    </Canvas>
  );
}
