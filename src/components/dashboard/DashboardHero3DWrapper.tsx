"use client";

import { DashboardHero3D } from "./DashboardHero3D";

/**
 * Wrapper for the dashboard hero illustration.
 * Previously used dynamic import + ErrorBoundary for the Three.js Canvas.
 * Now simplified since the SVG illustration loads instantly.
 */
export function DashboardHero3DWrapper() {
  return <DashboardHero3D />;
}
