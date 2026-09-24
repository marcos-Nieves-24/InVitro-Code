"use client";

import { motion, useReducedMotion } from "framer-motion";

type Bubble = { id: number; x: number; size: number; delay: number; duration: number };

const BUBBLES_MD: Bubble[] = [
  { id: 0, x: -8, size: 8, delay: 0, duration: 2.8 },
  { id: 1, x: 6, size: 6, delay: 0.4, duration: 3.1 },
  { id: 2, x: -12, size: 10, delay: 0.7, duration: 2.9 },
  { id: 3, x: 10, size: 5, delay: 1.0, duration: 3.0 },
  { id: 4, x: -4, size: 7, delay: 1.3, duration: 2.7 },
  { id: 5, x: 8, size: 6, delay: 1.6, duration: 3.2 },
  { id: 6, x: 0, size: 9, delay: 0.2, duration: 2.85 },
];

export function BubbleLayer({ percent }: { percent: number }) {
  const shouldReduce = useReducedMotion();
  if (shouldReduce || percent < 5) return null;

  return (
    <div
      className="bubble-layer pointer-events-none absolute inset-0 overflow-hidden"
      style={{ clipPath: "url(#vesselInnerClip)", willChange: "transform" } as React.CSSProperties}
      aria-hidden="true"
    >
      {BUBBLES_MD.map((b) => (
        <motion.div
          key={b.id}
          className="bubble absolute bottom-5 rounded-full border border-bubble-highlight/50 bg-surface-card"
          style={
            {
              left: `calc(50% + ${b.x}px)`,
              width: b.size,
              height: b.size,
              ["--bubble-x" as string]: `${b.x * 0.3}px`,
              boxShadow: "0 0 6px var(--color-bubble-glow)",
            } as React.CSSProperties
          }
          animate={{ y: [0, -140], opacity: [0, 0.92, 0], x: [0, b.x * 0.08, 0] }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function BubbleStatic() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-end justify-center gap-1 overflow-hidden pb-6 opacity-40"
      style={{ clipPath: "url(#vesselInnerClip)" } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-surface-card border border-bubble-highlight/40" />
      <span className="h-2 w-2 rounded-full bg-surface-card border border-bubble-highlight/40" />
      <span className="h-1.5 w-1.5 rounded-full bg-surface-card border border-bubble-highlight/40" />
    </div>
  );
}
