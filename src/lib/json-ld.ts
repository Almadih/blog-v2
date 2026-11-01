/**
 * Serialise structured data for a <script type="application/ld+json"> tag.
 * Escapes "<" so content such as "</script>" in a post title can't break out.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
