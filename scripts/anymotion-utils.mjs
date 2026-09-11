/**
 * Shared helpers for the Anymotion pipeline scripts (anyim.mjs, MCP server).
 */

/** Best-effort duration extraction from a generated timeline/script file.
 *
 * Anymotion emits DURATION in two shapes:
 *   window.DURATION = 15;                    (seconds)
 *   var DURATION = 15000; window.DURATION = DURATION / 1000;   (ms ÷ 1000)
 * Returns seconds (Number) or 0 when neither shape matches.
 */
export function extractDuration(js) {
  if (!js) return 0;

  // seconds literal: window.DURATION = 15
  const sec = js.match(/window\.DURATION\s*=\s*(\d+(?:\.\d+)?)\s*;/);
  if (sec && !/\/\s*1000/.test(js)) return Number(sec[1]);

  // milliseconds via a variable: var DURATION = 15000; window.DURATION = DURATION / 1000
  const msVar = js.match(/var\s+(\w+)\s*=\s*(\d+)\s*;[\s\S]*?window\.DURATION\s*=\s*\1\s*\/\s*1000\s*;/);
  if (msVar) return Math.round(Number(msVar[2]) / 1000);

  // fallback: literal seconds anywhere
  const anySec = js.match(/window\.DURATION\s*=\s*(\d+(?:\.\d+)?)/);
  if (anySec) return Number(anySec[1]);
  return 0;
}

/** "Loading spinner demo" → "loading-spinner-demo" */
export function slugify(s) {
  return String(s)
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .replace(/(^-|-$)/g, "");
}

/** "spinner de carga" → "SpinnerDeCargaPlayer" */
export function titleToComponent(title, slug) {
  const words = String(title || slug)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return (words.join("") || "Anymotion" + slug) + "Player";
}