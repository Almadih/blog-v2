import { getAllPosts, getAllTags } from "@/lib/api";
import Link from "next/link";
import { Code2, Zap, Rocket, TrendingUp } from "lucide-react";
import Author from "./_components/author";
import Post from "./_components/post";

export default function Index() {
  const allPosts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      {/* Header */}
      <header className=" border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
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
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-6">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/80">Latest in Tech</span>
                  <Rocket className="w-4 h-4 text-blue-400" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                  Code. Create.
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Conquer.
                  </span>
                </h1>
                <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                  Dive deep into the world of modern development. From React
                  wizardry to backend sorcery, we explore the cutting-edge
                  techniques that power tomorrow&apos;s applications.
                </p>
              </div>

              <Author />
            </section>

            {/* latest Posts */}
            <section className="mb-16">
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
              {/* tags */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg">
                <div className="p-6">
                  <h3 className="text-white flex items-center font-semibold text-lg mb-4">
                    <Code2 className="w-5 h-5 mr-2 text-purple-400" />
                    Tags
                  </h3>
                  <div className="space-y-3">
                    {tags.map((tag) => (
                      <div key={tag.name} className="group">
                        <Link
                          href={`/tags/${tag.name.toLowerCase()}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group-hover:scale-105"
                        >
                          <div className="flex items-center space-x-3 capitalize">
                            <span className="text-white/80 group-hover:text-white transition-colors">
                              {tag.name}
                            </span>
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
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

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-16 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Code2 className="w-8 h-8 text-blue-400" />
                <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DevCraft
                </h3>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                A technical blog focused on modern web development, system
                architecture, and engineering best practices. Join thousands of
                developers on this journey! 🚀
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>© 2024 DevCraft. Built with ❤️ and lots of ☕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
