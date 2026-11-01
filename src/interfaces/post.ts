import { type Author } from "./author";

export type Post = {
  slug: string;
  title: string;
  date: string;
  /** Optional last-updated date (frontmatter `updated`), used for dateModified. */
  updated?: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  published: boolean;
  content: string;
  preview?: boolean;
  tags: string[];
};
