import Header from "@/app/_components/header";
import Post from "@/app/_components/post";
import { getAllTags, getPostByTag } from "@/lib/api";
import { Metadata } from "next";

type Params = Promise<{
  tag: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} | Mohamed Almadih`,
    description: `Articles and technical notes tagged with #${decoded}.`,
  };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((t) => ({
    tag: t.name.toLowerCase(),
  }));
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostByTag(decodedTag);

  return (
    <>
      <Header />

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <header className="mb-12 border-b border-white/[0.08] pb-8">
          <div className="flex items-baseline space-x-3">
            <span className="text-zinc-500 font-mono text-xl">#</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white capitalize">
              {decodedTag}
            </h1>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.06]">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Selected engineering notes, architecture breakdowns, and guides.
          </p>
        </header>

        {posts.length > 0 ? (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Post post={post} key={post.slug} />
              ))}
            </div>
          </section>
        ) : (
          <div className="py-16 text-center text-zinc-500">
            <p className="text-base">No articles found tagged with #{decodedTag}.</p>
          </div>
        )}
      </main>
    </>
  );
}
