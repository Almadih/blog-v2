import { getAllPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const posts = getAllPosts();

  const list = posts
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/posts/${post.slug}): ${post.description ?? post.excerpt}`
    )
    .join("\n");

  const body = `# Mohamed Almadih — Engineering Journal

> Technical notes and deep dives on distributed systems, databases, asynchronous architectures, and modern web performance by Mohamed Almadih.

## Posts

${list}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
