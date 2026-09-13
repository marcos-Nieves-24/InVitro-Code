"use client";

import { useEffect, useState } from "react";

export function HeroBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Ink base — always visible */}
      <div className="absolute inset-0 bg-[#111439]" />

      {/* Video layer — hidden when reduced motion */}
      {!reducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/landing/landing-background.png"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src="/landing/hero-lab-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-[#111439]/60" />
    </div>
  );
}
