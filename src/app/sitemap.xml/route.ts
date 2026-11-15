import { getAllPosts, getAllTags, getPostByTag } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import { tagToSlug } from "@/lib/tags";

export async function GET() {
  const posts = getAllPosts();
  // Tags with a single post are noindexed, so keep them out of the sitemap.
  const tags = getAllTags().filter((tag) => tag.count >= 2);
  const baseUrl = SITE_URL;

  const lastmod = (post: (typeof posts)[number]) =>
    new Date(post.updated ?? post.date).toISOString().split("T")[0];
  // ISO dates sort lexicographically.
  const newest = (list: typeof posts) => list.map(lastmod).sort().at(-1);
  const homeLastmod = newest(posts);

  const postUrls = posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/posts/${post.slug}</loc>
    <lastmod>${lastmod(post)}</lastmod>
  </url>`
    )
    .join("");

  const tagUrls = tags
    .map(
      (tag) => `
  <url>
    <loc>${baseUrl}/tags/${tagToSlug(tag.name)}</loc>
    <lastmod>${newest(getPostByTag(tagToSlug(tag.name)))}</lastmod>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${homeLastmod}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${homeLastmod}</lastmod>
  </url>
  ${postUrls}
  ${tagUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
