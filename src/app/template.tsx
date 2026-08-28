"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * App Router template — remounts on every navigation, giving each route a
 * 200ms page fade-in (DESIGN.md §1.5) and activating scroll-reveal observers.
 */
export default function Template({ children }: { children: ReactNode }) {
  useScrollReveal();
  return <div className="animate-fade-in">{children}</div>;
}
