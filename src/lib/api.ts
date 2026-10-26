import { Post } from "@/interfaces/post";
import { Tag } from "@/interfaces/tag";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

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

export function getAllTags(): Tag[] {
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

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0,5);
}

export function getPostByTag(tag: string) {
  const posts = getAllPosts();
  const decoded = decodeURIComponent(tag).toLowerCase();
  return posts
    .filter(
      (post) =>
        post.tags &&
        post.tags.some((t) => t.trim().toLowerCase() === decoded)
    )
    .filter((post) => post.published);
}

export function getRelatedPosts(post: Post) {
  const relatedPosts = getAllPosts();
  return relatedPosts
    .filter(
      (relatedPost) =>
        relatedPost.tags && relatedPost.tags.includes(post.tags[0])
    )
    .filter((relatedPost) => relatedPost.slug !== post.slug)
    .filter((relatedPost) => relatedPost.published)
    .slice(0, 3);
}
