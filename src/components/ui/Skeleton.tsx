type SkeletonVariant = "card" | "row" | "text" | "circle" | "shimmer";

const variantClass: Record<SkeletonVariant, string> = {
  card: "h-32 w-full rounded-lg",
  row: "h-4 w-full rounded-md",
  text: "h-3 w-2/3 rounded-md",
  circle: "h-10 w-10 rounded-full",
  shimmer: "h-4 w-full rounded-md",
};

export function Skeleton({
  variant = "row",
  className = "",
}: {
  variant?: SkeletonVariant;
  className?: string;
}) {
  const shimmer = variant === "shimmer";
  return (
    <div
      aria-hidden="true"
      className={`${shimmer ? "skeleton-shimmer" : "animate-pulse"} bg-surface-raised ${variantClass[variant]} ${className}`}
    />
  );
}
