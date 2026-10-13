"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * Values sourced from design.tokens.json — keep the token path in the comment
 * so a token change is traceable instead of an unexplained hex literal.
 */
const TOKENS = {
  warning: "#B45309", // color.warning
  bg: "#FBF8F5", // color.bg
  border: "#CBD5DC", // color.border
  text: "#1A1A1A", // color.text
  muted: "#5B6770", // color.muted
  radiusMd: "0.5rem", // radius.md
  spacing2: "0.5rem", // spacing.2
  spacing4: "1rem", // spacing.4
} as const;

export const DEFAULT_OFFLINE_MESSAGE =
  "Este lab requiere conexión a internet para cargar Python. Verificá tu conexión e intentá nuevamente.";

/** Resolves the final message, falling back to the canned notice on empty input. */
export function getOfflineMessage(message?: string): string {
  return message && message.trim().length > 0 ? message : DEFAULT_OFFLINE_MESSAGE;
}

/**
 * Pure offline resolution shared by the effect and the tests.
 * `forcedOffline` (when defined) always wins — it is the test/story hook.
 */
export function resolveOffline(
  forcedOffline: boolean | undefined,
  online: boolean,
): boolean {
  if (forcedOffline !== undefined) return forcedOffline;
  return !online;
}

/**
 * Non-blocking offline notice for Pyodide labs. Labs stream Pyodide from a CDN,
 * so an offline run can never succeed; surfacing it beats a silent failure.
 */
export function LabOfflineNotice({
  message,
  forcedOffline,
}: {
  message?: string;
  forcedOffline?: boolean;
}) {
  const [isOffline, setIsOffline] = useState<boolean>(forcedOffline ?? false);

  useEffect(() => {
    if (forcedOffline !== undefined) {
      setIsOffline(forcedOffline);
      return;
    }

    const update = () =>
      setIsOffline(resolveOffline(forcedOffline, navigator.onLine));
    update();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [forcedOffline]);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: TOKENS.spacing2,
        padding: TOKENS.spacing4,
        margin: `${TOKENS.spacing4} 0`,
        background: TOKENS.bg,
        border: `1px solid ${TOKENS.border}`,
        borderRadius: TOKENS.radiusMd,
        color: TOKENS.text,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
    >
      <WifiOff
        aria-hidden="true"
        size={18}
        style={{ flexShrink: 0, marginTop: "2px", color: TOKENS.warning }}
      />
      <p style={{ margin: 0, color: TOKENS.muted }}>
        {getOfflineMessage(message)}
      </p>
    </div>
  );
}
