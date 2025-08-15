import { getAllPosts, getAllTags } from "@/lib/api";
import Link from "next/link";
import { Code2, Zap, Rocket, TrendingUp } from "lucide-react";
import Author from "./_components/author";
import Post from "./_components/post";

export default function Index() {
  const allPosts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      {/* Header - UPDATED: Border color softened to slate-800. */}
      <header className=" border-b border-slate-800 bg-black/30 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent"
              >
                <Code2 className="inline-block w-8 h-8 mr-2 text-blue-400" />
                DevCraft
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <section className="mb-16">
              <div className="text-center mb-12">
                {/* UPDATED: Pill has a more subtle background and cohesive icon colors. */}
                <div className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-700 rounded-full px-6 py-2 mb-6">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">Latest in Tech</span>
                  <Rocket className="w-4 h-4 text-teal-400" />
                </div>

                {/* UPDATED: Headline is cleaner with solid text and a focused gradient accent. */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-100 leading-tight">
                  Code. Create.
                  <span className="block bg-gradient-to-r from-cyan-300 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                    Conquer.
                  </span>
                </h1>
                {/* UPDATED: Paragraph text uses slate-400 for a softer, more readable contrast. */}
                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Dive deep into the world of modern development. From React
                  wizardry to backend sorcery, we explore the cutting-edge
                  techniques that power tomorrow&apos;s applications.
                </p>
              </div>

              <Author />
            </section>

            {/* latest Posts */}
            <section className="mb-16">
              {/* UPDATED: Replaced green accent with the primary cyan color for consistency. */}
              <div className="flex items-center space-x-3 mb-8">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h2 className="text-3xl font-bold text-white">Latest Posts</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {allPosts.map((post) => (
                  <Post post={post} key={post.slug} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* tags - UPDATED: Sidebar card styles now use slate for a unified look. */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg">
                <div className="p-6">
                  <h3 className="text-white flex items-center font-semibold text-lg mb-4">
                    {/* UPDATED: Icon uses a secondary accent color (indigo). */}
                    <Code2 className="w-5 h-5 mr-2 text-indigo-400" />
                    Tags
                  </h3>
                  <div className="space-y-3">
                    {tags.map((tag) => (
                      <div key={tag.name} className="group">
                        <Link
                          href={`/tags/${tag.name.toLowerCase()}`}
                          // UPDATED: Tag items have improved background and hover states.
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 hover:bg-cyan-900/40 transition-all duration-200 group-hover:scale-105"
                        >
                          <div className="flex items-center space-x-3 capitalize">
                            <span className="text-slate-200 group-hover:text-white transition-colors">
                              {tag.name}
                            </span>
                          </div>
                          {/* UPDATED: Count pill is styled to stand out while matching the theme. */}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-cyan-200">
                            {tag.count}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - UPDATED: Footer styles match the header for a consistent wrap-up. */}
      <footer className="relative border-t border-slate-800 mt-16 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                <Code2 className="w-8 h-8 inline-block text-blue-400" />
                <h3 className="font-bold text-2xl text-blue-400">DevCraft</h3>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                A technical blog focused on modern web development, system
                architecture, and engineering best practices. Join thousands of
                developers on this journey! 🚀
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2024 DevCraft. Built with ❤️ and lots of ☕</p>
          </div>
        </div>
      </footer>
    </>
  );
}
