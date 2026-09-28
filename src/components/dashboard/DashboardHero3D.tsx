"use client";

import Image from "next/image";

/**
 * Dashboard hero illustration — SVG scientist with DNA helix.
 * Replaces the Three.js GLB model for instant load and smaller bundle.
 * The SVG is displayed at full height with object-cover to match the
 * reference layout (dashboard-1.svg).
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
