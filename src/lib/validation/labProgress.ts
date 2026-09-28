import { z } from "zod";

export const lastPositionSchema = z
  .object({
    activeTab: z.enum(["lab", "quiz"]).optional(),
    scrollY: z.number().optional(),
    codeSnapshot: z.string().max(8192).optional(),
  })
  .passthrough()
  .optional();

export const labProgressPostSchema = z.object({
  module_slug: z.string().min(1),
  lesson_slug: z.string().min(1),
  completion_status: z.enum(["not_started", "in_progress", "completed"]).optional(),
  last_position: lastPositionSchema,
});

export type LastPositionInput = z.infer<typeof lastPositionSchema>;
export type LabProgressPostInput = z.infer<typeof labProgressPostSchema>;

/**
 * Caps last_position JSON to 8KB.
 * If serialized size exceeds 8192, drops or truncates codeSnapshot keeping activeTab+scrollY.
 */
export function capLastPosition(obj: Record<string, unknown>): Record<string, unknown> {
  const MAX_BYTES = 8192;
  const raw = JSON.stringify(obj);
  if (raw.length <= MAX_BYTES) return obj;

  const { codeSnapshot, ...rest } = obj as Record<string, unknown> & { codeSnapshot?: unknown };

  // If no snapshot, keep only essential keys (activeTab/scrollY) to guarantee fit
  if (typeof codeSnapshot !== "string") {
    const minimal: Record<string, unknown> = {};
    if ("activeTab" in rest) minimal.activeTab = rest.activeTab;
    if ("scrollY" in rest) minimal.scrollY = rest.scrollY;
    // include any other small keys that still fit? prefer minimal to avoid re-bloat
    const passthroughKeys = Object.keys(rest).filter((k) => k !== "activeTab" && k !== "scrollY");
    for (const k of passthroughKeys) {
      const candidate = { ...minimal, [k]: rest[k] };
      if (JSON.stringify(candidate).length <= MAX_BYTES) {
        minimal[k] = rest[k];
      }
    }
    if (JSON.stringify(minimal).length <= MAX_BYTES) return minimal;
    // ultra fallback: activeTab + scrollY only
    const ultra: Record<string, unknown> = {};
    if ("activeTab" in rest) ultra.activeTab = rest.activeTab;
    if ("scrollY" in rest) ultra.scrollY = rest.scrollY;
    return ultra;
  }

  // Try dropping snapshot entirely
  const withoutSnapshotLen = JSON.stringify(rest).length;
  if (withoutSnapshotLen <= MAX_BYTES) {
    // Try to keep truncated snapshot that still fits
    const overhead = withoutSnapshotLen + JSON.stringify({ codeSnapshot: "" }).length - 2; // approx JSON overhead for key
    const available = MAX_BYTES - overhead;
    if (available > 0) {
      const truncated = codeSnapshot.slice(0, available);
      const withTruncated = { ...rest, codeSnapshot: truncated };
      if (JSON.stringify(withTruncated).length <= MAX_BYTES) return withTruncated;
    }
    return rest;
  }

  // Even without snapshot too large — keep only activeTab+scrollY
  const fallback: Record<string, unknown> = {};
  if ("activeTab" in rest) fallback.activeTab = rest.activeTab;
  if ("scrollY" in rest) fallback.scrollY = rest.scrollY;
  return fallback;
}

/**
 * Formats ISO date string to dd/MM/yyyy. Returns "—" for null/invalid.
 */
export function formatLabDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
