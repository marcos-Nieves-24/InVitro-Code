import type { ReactNode } from "react";

type CalloutVariant = "info" | "check" | "warning";

const variantClass: Record<CalloutVariant, string> = {
  info: "border-fog bg-surface-raised text-ink",
  check: "border-mint bg-mint/20 text-ink",
  warning: "border-storm bg-surface-raised text-ink",
};

export function Callout({
  children,
  variant = "info",
  className = "",
}: {
  children: ReactNode;
  variant?: CalloutVariant;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border p-4 ${variantClass[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
