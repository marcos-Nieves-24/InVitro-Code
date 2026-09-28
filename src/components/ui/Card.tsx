import type { ReactNode } from "react";

type CardVariant = "default" | "glass";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  variant?: CardVariant;
};

const paddingClass = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantClass: Record<CardVariant, string> = {
  default:
    "rounded-card border border-surface-raised bg-surface-card shadow-md",
  glass:
    "rounded-card glass-card",
};

export function Card({
  children,
  className = "",
  padding = "md",
  variant = "default",
}: CardProps) {
  return (
    <div
      className={`${variantClass[variant]} ${paddingClass[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
