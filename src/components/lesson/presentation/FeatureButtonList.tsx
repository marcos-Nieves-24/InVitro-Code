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
        const panelId = `feature-panel-${f.id}`;
        return (
          <div key={f.id} role="listitem">
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : f.id)}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              className={`group flex w-full items-center justify-between rounded-btn border px-4 py-3 text-left text-[15px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
                isExpanded
                  ? "border-brand-200 bg-brand-50 text-brand-800"
                  : "border-gray-200 bg-surface-card text-graphite hover:border-brand-200 hover:bg-brand-50/50"
              }`}
            >
              <span>{f.label}</span>
              <span
                aria-hidden="true"
                className={`ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                  isExpanded
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-gray-300 bg-white text-storm group-hover:border-brand-200"
                }`}
              >
                {isExpanded ? "−" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-label={f.label}
              aria-hidden={!isExpanded}
              data-open={isExpanded ? "true" : "false"}
              className="accordion-panel mt-2 rounded-card border border-gray-200 bg-surface-card shadow-sm"
            >
              <div className="px-4 py-3 text-[15px] leading-relaxed text-gray-700">
                {f.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeatureButtonList;
