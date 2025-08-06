"use sever";

import { Calendar, Clock, Code2 } from "lucide-react";
import Image from "next/image";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/api";
import markdownStyles from "@/app/_components/markdown-styles.module.css";
import MarkdownComponent from "@/app/_components/markdown-component";
import Header from "@/app/_components/header";
import RelatedPost from "@/app/_components/related-post";
import Tag from "@/app/_components/tag";
import { notFound } from "next/navigation";
import { getAuthor } from "@/lib/author";
import ReadTime from "@/app/_components/read-time";
import { Metadata } from "next";

type Params = Promise<{
  slug: string;
}>;

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }
  const author = getAuthor();

  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
      </div>

      {/* Header */}
      <Header showShare post={post} />

      <main className="relative container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <article>
            {/* Article Header */}
            <header className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                {post?.tags?.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-30" />
                    <div className="relative h-14 w-14 rounded-full ring-2 ring-white/20 overflow-hidden">
                      <Image
                        src={author.picture || "/placeholder.svg"}
                        alt={author.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 1280px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">
                      {author.name}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <ReadTime text={post.content} />
                      </div>
                    </div>
                  </div>
                </div>
                {/*TODO: add likes and comments*/}
                {/* <div className="flex items-center space-x-6 text-white/60">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-5 w-5" />
                    <span className="font-semibold">{0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="font-semibold">{0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-5 w-5 text-blue-400" />
                    <span className="font-semibold">{0}</span>
                  </div>
                </div> */}
              </div>
            </header>

            <div className="h-px bg-white/10 mb-12" />

            <div className="aspect-video relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-80`}
              />
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-lg"
              />
            </div>
            <div
              className={`prose prose-lg max-w-none text-white/80 prose-headings:text-white prose-p:text-white/80 prose-strong:text-white prose-code:text-blue-300 prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 ${markdownStyles["markdown"]}`}
            >
              <MarkdownComponent content={post.content} />
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <Code2 className="w-6 h-6 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Related Posts</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <RelatedPost key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | DevCraft`;

  return {
    metadataBase: new URL("https://blog.almadih.dev"),
    title,
    openGraph: {
      title,
      description: post.excerpt,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
