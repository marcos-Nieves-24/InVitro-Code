/**
 * Normalizes text for accent-insensitive substring search.
 * - NFD decomposition strips diacritics (á→a, ñ→n after strip)
 * - lowercases for case-insensitive match
 * Intentionally small, no external dep (Fuse-less client search).
 */
export function normalizeSearchText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Returns true if haystack contains needle after normalization.
 * Empty needle always matches (caller decides to show recents).
 */
export function matchesNormalized(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return normalizeSearchText(haystack).includes(normalizeSearchText(needle));
}
