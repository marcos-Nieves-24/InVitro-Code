"use client";

import { type ReactNode } from "react";

type CardVariant = "default" | "glass" | "elevated" | "interactive";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  variant?: CardVariant;
  onClick?: () => void;
};

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantClass: Record<CardVariant, string> = {
  default:
    "rounded-xl border border-surface-raised bg-surface-card shadow-sm",
  glass:
    "rounded-xl glass-card",
  elevated:
    "rounded-xl border border-surface-raised bg-surface-card shadow-lg hover:shadow-xl",
  interactive:
    "rounded-xl border border-surface-raised bg-surface-card shadow-sm hover:shadow-md hover:-translate-y-[2px] hover:border-mint/30 cursor-pointer transition-all duration-200",
};

export function Card({
  children,
  className = "",
  padding = "md",
  variant = "default",
  onClick,
}: CardProps) {
  return (
    <div
      className={`${variantClass[variant]} ${paddingClass[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {children}
    </div>
  );
}
