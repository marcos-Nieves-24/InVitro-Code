import { type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll-reveal wrapper. Adds `data-reveal` so the global `useScrollReveal`
 * hook picks it up and applies `.is-visible` when the element enters the viewport.
 * Use `delay` (ms) for staggered reveals.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <div
      data-reveal
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
