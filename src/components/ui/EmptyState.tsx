import Link from "next/link";
import type { ComponentType } from "react";

export interface EmptyStateProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  href?: string;
}

/**
 * Generic motivational empty state (real-data-replace-mocks, D1):
 * honest emptiness instead of fake numbers.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  href,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-raised bg-surface-card px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fog/20 text-ink">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {description ? (
          <p className="mx-auto mt-1 max-w-sm text-sm text-storm">
            {description}
          </p>
        ) : null}
      </div>
      {actionLabel && href ? (
        <Link
          href={href}
          className="rounded-lg bg-mint px-4 py-2 text-sm font-bold text-on-primary transition-all hover:brightness-95"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
