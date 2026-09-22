"use client";

import Image from "next/image";

/**
 * DashboardHero3D — compatibility shim (PR-2).
 * Static SVG fallback without Canvas/WebGL. The GLB/`three` path is lazy
 * (`next/dynamic` ssr:false + `import('three')` only for the GLB branch)
 * and NOT mounted in the default dashboard composition — HeroBanner is the
 * default. This keeps `three` out of the initial JS for all routes and the
 * lazy chunk <300 KB gz when the GLB fallback is requested.
 * If GSAP hero is default, this component is not rendered in DashboardContainer.
 */
export function DashboardHero3D() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/dashboard/cientifica-1.svg"
        alt="Científica con hélice de ADN"
        fill
        priority
        sizes="(max-width: 1024px) 0px 384px"
        className="object-contain object-bottom"
      />
    </div>
  );
}
