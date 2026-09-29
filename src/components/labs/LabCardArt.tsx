"use client";

import { useState } from "react";
import type { LabCardTheme } from "./LabCardTheme";

interface LabCardArtProps {
  theme: LabCardTheme;
  size?: number;
}

/**
 * Renders the module's SVG favicon as currentColor art.
 * Falls back to the lucide icon if the SVG fails to load.
 */
export function LabCardArt({ theme, size = 48 }: LabCardArtProps) {
  const [error, setError] = useState(false);

  if (error || !theme.art) {
    const Icon = theme.icon;
    return (
      <Icon
        className="shrink-0"
        style={{ color: theme.accent, width: size, height: size }}
        aria-label={theme.label}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={theme.art}
      alt={theme.label}
      width={size}
      height={size}
      className="shrink-0"
      style={{ color: theme.accent }}
      onError={() => setError(true)}
    />
  );
}
