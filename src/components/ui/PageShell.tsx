import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  /** Marketing pages use a wider max width */
  width?: "lesson" | "marketing";
  className?: string;
  /** When false, only apply background — children control layout */
  contained?: boolean;
};

export function PageShell({
  children,
  width = "lesson",
  className = "",
  contained = true,
}: PageShellProps) {
  const maxW =
    width === "marketing"
      ? "max-w-5xl"
      : "max-w-[var(--width-layout-max)]";

  return (
    <div className={`min-h-screen bg-dot-grid ${className}`}>
      {contained ? (
        <div className={`mx-auto ${maxW} px-4 py-4 md:py-6`}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
