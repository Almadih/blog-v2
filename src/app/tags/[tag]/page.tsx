import Header from "@/app/_components/header";
import Post from "@/app/_components/post";
import { getPostByTag } from "@/lib/api";
import { ArrowLeft, Bookmark, Share2, TrendingUp } from "lucide-react";
import Link from "next/link";

type Params = {
  params: Promise<{
    tag: string;
  }>;
};

export default async function Tag({ params }: Params) {
  const { tag } = await params;
  const posts = getPostByTag(tag);
  return (
    <>
      {/* Header */}
      <Header />

      <main className="relative container mx-auto px-4 py-8">
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight capitalize">
              # {tag}
            </h1>
          </div>
        </section>
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Post post={post} key={post.slug} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
