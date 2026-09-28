"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export interface SlideArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  primaryColor?: string;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: {
    pad: "p-1.5",
    text: "text-sm",
    circle: "w-8",
    icon: 16,
    textPad: "px-6",
    textLeft: "left-3",
    circleMr: "mr-2",
  },
  md: {
    pad: "p-2",
    text: "text-base",
    circle: "w-11",
    icon: 20,
    textPad: "px-8",
    textLeft: "left-4",
    circleMr: "mr-3",
  },
  lg: {
    pad: "p-3",
    text: "text-lg",
    circle: "w-12",
    icon: 22,
    textPad: "px-10",
    textLeft: "left-5",
    circleMr: "mr-3",
  },
} as const;

export function SlideArrowButton({
  text = "Get Started",
  primaryColor = "var(--color-brand-400)",
  className = "",
  href,
  variant = "primary",
  size = "md",
  ...props
}: SlideArrowButtonProps) {
  const cfg = sizeMap[size];
  const isPrimary = variant === "primary";

  const variantBase = isPrimary
    ? "bg-white border-white"
    : "bg-surface-card border-surface-raised";

  const focusRing = isPrimary
    ? "focus-visible:outline-[var(--color-brand-400)]"
    : "focus-visible:outline-storm";

  const textColor = isPrimary
    ? "text-black group-hover/slide:text-white"
    : "text-ink group-hover/slide:text-ink";

  const circleBgClass = isPrimary ? "" : "bg-surface-raised";
  const circleTextClass = isPrimary ? "text-white" : "text-storm";
  const circleStyle = isPrimary ? { backgroundColor: primaryColor } : undefined;

  const inner = (
    <>
      <div
        className={`absolute left-0 top-0 flex h-full ${cfg.circle} items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover/slide:w-full ${circleBgClass} ${circleTextClass}`}
        style={circleStyle}
        aria-hidden="true"
      >
        <span className={cfg.circleMr}>
          <ArrowRight size={cfg.icon} />
        </span>
      </div>
      <span
        className={`relative z-10 whitespace-nowrap font-semibold transition-all duration-200 group-hover/slide:-left-3 ${cfg.textLeft} ${cfg.textPad} ${textColor}`}
      >
        {text}
      </span>
    </>
  );

  const baseClass = `group/slide relative inline-flex items-center justify-center overflow-hidden rounded-full border ${variantBase} ${cfg.pad} ${cfg.text} font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${focusRing} ${className}`;

  if (href) {
    const { type: _type, ..._rest } = props;
    void _type;
    void _rest;
    return (
      <Link href={href} className={baseClass} aria-label={text}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClass} aria-label={text} {...props}>
      {inner}
    </button>
  );
}

export default SlideArrowButton;
