// Domain — bookmarks (retención búsqueda + guardados)
// Pure domain, no infrastructure imports. Tested via vitest in node env.

export interface Bookmark {
  module_slug: string;
  lesson_slug: string;
  created_at: string;
}

/**
 * Stable composite key for a bookmarked lesson.
 * Mirrors progress key `${module}/${lesson}` used in getResumeHref / progress maps.
 */
export function bookmarkKey(module_slug: string, lesson_slug: string): string {
  return `${module_slug}/${lesson_slug}`;
}

/**
 * Pure validation: both slugs must be non-empty trimmed strings.
 */
export function isValidBookmark(module_slug: unknown, lesson_slug: unknown): boolean {
  if (typeof module_slug !== "string" || typeof lesson_slug !== "string") return false;
  if (module_slug.trim().length === 0 || lesson_slug.trim().length === 0) return false;
  return true;
}
