import type { ReactNode } from "react";

type CalloutVariant = "info" | "check" | "warning";

const variantClass: Record<CalloutVariant, string> = {
  info: "border-brand bg-brand-soft text-gray-800",
  check: "border-teal-600 bg-teal-50 text-gray-800",
  warning: "border-amber-500 bg-amber-50 text-gray-800",
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
