type BadgeVariant = "info" | "success" | "warning" | "danger";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
  danger: "border-red-200 bg-red-50 text-red-700",
};

export function Badge({ children, variant = "info" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-[7px] border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
