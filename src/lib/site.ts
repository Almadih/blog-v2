export const SITE_URL = "https://blog.almadih.dev";

/** 1200x630 share image used when a page has no image of its own. */
export const DEFAULT_OG_IMAGE = {
  url: "/assets/blog/og-default.png",
  width: 1200,
  height: 630,
  alt: "Mohamed Almadih — Engineering Journal: Systems, scale, and engineering in practice.",
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
