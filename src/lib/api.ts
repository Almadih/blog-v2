import { Post } from "@/interfaces/post";
import { Tag } from "@/interfaces/tag";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { tagToSlug } from "./tags";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  try {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return { ...data, slug: realSlug, content } as Post;
  } catch (e) {
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts.filter((post) => post.published);
}

/** All tags ordered by post count. Pass `limit` to keep only the top N. */
export function getAllTags(limit?: number): Tag[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((rawTag) => {
        const normalized = rawTag.trim();
        if (normalized) {
          tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
        }
      });
    }
  });

  const tags = Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  return limit === undefined ? tags : tags.slice(0, limit);
}

/** Published posts whose tags match the given tag slug (see `tagToSlug`). */
export function getPostByTag(slug: string) {
  const target = tagToSlug(decodeURIComponent(slug));
  return getAllPosts().filter(
    (post) => post.tags && post.tags.some((t) => tagToSlug(t) === target)
  );
}

/** Original display name for a tag slug, or null if no published post uses it. */
export function getTagNameBySlug(slug: string): string | null {
  const target = tagToSlug(decodeURIComponent(slug));
  return getAllTags().find((t) => tagToSlug(t.name) === target)?.name ?? null;
}

/** A post by slug, but only if it is published. */
export function getPublishedPostBySlug(slug: string) {
  const post = getPostBySlug(slug);
  return post && post.published ? post : null;
}

/** Up to 3 other posts, ranked by shared tags, padded with the newest posts. */
export function getRelatedPosts(post: Post) {
  const mine = new Set((post.tags ?? []).map(tagToSlug));
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const score = (p: Post) =>
    (p.tags ?? []).filter((t) => mine.has(tagToSlug(t))).length;
  const matched = others
    .filter((p) => score(p) > 0)
    .sort((a, b) => score(b) - score(a)); // stable: ties stay newest-first
  const padding = others.filter((p) => !matched.includes(p));
  return [...matched, ...padding].slice(0, 3);
}
