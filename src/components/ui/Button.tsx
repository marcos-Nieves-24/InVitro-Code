import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** @deprecated Use SlideArrowButton — primary variant unified */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-mint text-ink hover:brightness-95 shadow-sm",
  secondary:
    "border border-surface-raised bg-surface-card text-ink hover:bg-surface-raised",
  ghost: "text-storm hover:bg-surface-raised hover:text-ink",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-8 py-3.5 text-base font-semibold",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-all btn-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:pointer-events-none disabled:opacity-50";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "className" | "children">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

/**
 * @deprecated Use SlideArrowButton — primary variant unified
 * Primary delegates visually to SlideArrowButton; kept for backwards compat.
 */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  if (variant === "primary" && typeof window !== "undefined") {
    console.warn("[deprecated] Button primary — use SlideArrowButton instead");
  }
  const classes = `${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ComponentProps<"button">;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
