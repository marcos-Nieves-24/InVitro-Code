"use client";

import { useEffect, useState } from "react";
import { getScientistVariant, type ScientistVariant } from "@/lib/gamification/utils";

export interface ScientistFigureProps {
  variant: ScientistVariant;
  alt?: string;
  className?: string;
  priority?: boolean;
}

const FIGURE_SRC = {
  m: "/dashboard/cientifico-1.svg",
  f: "/dashboard/cientifica-1.svg",
} as const;

const FIGURE_ALT = {
  m: "Científico con hélice de ADN",
  f: "Científica con hélice de ADN",
} as const;

export function ScientistFigure({
  variant,
  alt,
  className,
  priority = false,
}: ScientistFigureProps) {
  const resolved = getScientistVariant(variant);
  const hasFigure = resolved === "m" || resolved === "f";
  const initialSrc = hasFigure ? FIGURE_SRC[resolved] : "";

  // Single source: alt derives from the variant actually rendered, so the
  // male scientist never announces itself as "Científica".
  const resolvedAlt = hasFigure ? (alt ?? FIGURE_ALT[resolved]) : undefined;

  const [src, setSrc] = useState(initialSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setSrc(initialSrc);
  }, [initialSrc]);

  // Render nothing when the user has not chosen a figure, or when the chosen
  // asset fails to load. Substituting a different variant's figure would show
  // the user a scientist they never picked, which is the exact failure this
  // component used to produce for every unset profile.
  if (!hasFigure || failed) return null;

  return (
    <div className={`h-auto w-full overflow-visible ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={resolvedAlt}
        className="h-auto w-full object-contain object-bottom"
        loading={priority ? "eager" : "lazy"}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
