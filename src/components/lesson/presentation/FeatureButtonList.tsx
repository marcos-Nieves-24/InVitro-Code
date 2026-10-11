"use client";

import { useState } from "react";

export interface FeatureButtonListProps {
  features: Array<{ id: string; label: string; detail: string }>;
}

export function FeatureButtonList({ features }: FeatureButtonListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div role="list" className="grid gap-2">
      {features.map((f) => {
        const isExpanded = expanded === f.id;
        return (
          <div key={f.id} role="listitem">
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : f.id)}
              aria-expanded={isExpanded}
              className="flex w-full items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-left text-sm font-medium text-brand-800 transition hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            >
              <span>{f.label}</span>
              <span
                aria-hidden="true"
                className="ml-2 shrink-0 text-xs font-bold text-storm"
              >
                {isExpanded ? "−" : "+"}
              </span>
            </button>
            {isExpanded && (
              <div className="mt-1 rounded-lg bg-gray-50 px-4 py-2 text-sm leading-relaxed text-gray-700">
                {f.detail}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FeatureButtonList;
