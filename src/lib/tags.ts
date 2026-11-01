/**
 * URL-safe slug for a tag, e.g. "Google Cloud" -> "google-cloud".
 * Kept free of Node APIs so client and server components can both use it.
 */
export function tagToSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}
