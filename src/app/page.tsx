import { getAllPosts, getAllTags } from "@/lib/api";
import Link from "next/link";
import Header from "./_components/header";
import Author from "./_components/author";
import Post from "./_components/post";

export default function Index() {
  const allPosts = getAllPosts();
  const tags = getAllTags();
  const featuredPost = allPosts[0];
  const remainingPosts = allPosts.slice(1);

  return (
    <>
      <Header isHome />

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12 flex-1">
        {/* Editorial Hero */}
        <section className="mb-12 sm:mb-16 pb-10 border-b border-white/[0.08]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engineering Journal & Notes</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Systems, scale, and engineering in practice.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              In-depth technical write-ups by{" "}
              <span className="text-zinc-200 font-medium">Mohamed Almadih</span>{" "}
              focusing on distributed architectures, database internals, PostgreSQL materialized views, asynchronous workers, and high-performance web systems.
            </p>
          </div>

          <Author />
        </section>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-10">
            {featuredPost && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Latest Article
                  </h2>
                </div>
                <Post post={featuredPost} priority={true} />
              </section>
            )}

            {remainingPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6 pt-6 border-t border-white/[0.06]">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    All Articles ({allPosts.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {remainingPosts.map((post) => (
                    <Post post={post} key={post.slug} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl bg-zinc-900/30 border border-white/[0.08] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Topics & Tags
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">
                    {tags.length}
                  </span>
                </div>

                <div className="flex flex-col space-y-1.5">
                  {tags.map((tag) => (
                    <Link
                      key={tag.name}
                      href={`/tags/${tag.name.toLowerCase()}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-all group"
                    >
                      <span className="capitalize group-hover:translate-x-0.5 transition-transform">
                        #{tag.name}
                      </span>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.04] group-hover:text-zinc-200">
                        {tag.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Senior Minimalist Footer */}
      <footer className="border-t border-white/[0.08] bg-zinc-950/60 mt-16 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-medium text-zinc-300">
                Mohamed Almadih
              </span>
              <span>—</span>
              <span>Engineering Journal</span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/almadih"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-200 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/almadih_desu"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-200 transition-colors"
              >
                Twitter / X
              </a>
              <a
                href="https://linkedin.com/in/almadih"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-200 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="/feed.xml"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-200 transition-colors"
              >
                RSS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
