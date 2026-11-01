import Header from "@/app/_components/header";
import Post from "@/app/_components/post";
import { getAllTags, getPostByTag, getTagNameBySlug } from "@/lib/api";
import { tagToSlug } from "@/lib/tags";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Only tags used by published posts exist; anything else is a real 404.
export const dynamicParams = false;

type Params = Promise<{
  tag: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = getTagNameBySlug(tag);
  if (!name) return notFound();
  return {
    title: `#${name}`,
    description: `Articles and technical notes tagged with #${name}.`,
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({
    tag: tagToSlug(t.name),
  }));
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const tagName = getTagNameBySlug(tag);
  const posts = getPostByTag(tag);
  if (!tagName || posts.length === 0) return notFound();

  return (
    <>
      <Header />

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <header className="mb-12 border-b border-white/[0.08] pb-8">
          <div className="flex items-baseline space-x-3">
            <span aria-hidden="true" className="text-zinc-500 font-mono text-xl">#</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white capitalize">
              {tagName}
            </h1>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.06]">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Selected engineering notes, architecture breakdowns, and guides.
          </p>
        </header>

        <section aria-labelledby="tag-articles-heading">
          <h2 id="tag-articles-heading" className="sr-only">
            Articles tagged #{tagName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Post post={post} key={post.slug} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
