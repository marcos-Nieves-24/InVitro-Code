"use client";

import { useEffect, useState } from "react";
import { getScientistVariant, type ScientistVariant } from "@/lib/gamification/utils";

export interface ScientistFigureProps {
  variant: ScientistVariant;
  alt?: string;
  className?: string;
  priority?: boolean;
}

export function ScientistFigure({
  variant,
  alt = "Científica con hélice de ADN",
  className,
  priority = false,
}: ScientistFigureProps) {
  const resolved = getScientistVariant(variant);
  const initialSrc =
    resolved === "m"
      ? "/dashboard/cientifico-440x511.svg"
      : "/dashboard/cientifica-1.svg";

  const [src, setSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setSrc(initialSrc);
  }, [initialSrc]);

  const displaySrc = hasError ? "/dashboard/cientifica-1.svg" : src;

  return (
    <div className={`h-full w-full overflow-visible ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt={alt}
        className="h-full w-full object-contain object-bottom"
        loading={priority ? "eager" : "lazy"}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
