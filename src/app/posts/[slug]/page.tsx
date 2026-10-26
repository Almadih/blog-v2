import { Calendar, Clock } from "lucide-react";
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
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: author.name,
      url: "https://blog.almadih.dev",
    },
    publisher: {
      "@type": "Person",
      name: author.name,
      url: "https://blog.almadih.dev",
    },
    image: post.coverImage ? [post.coverImage] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://blog.almadih.dev/posts/${post.slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header showShare post={post} />

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <article>
            {/* Article Header */}
            <header className="mb-10 sm:mb-14">
              <div className="flex items-center flex-wrap gap-2 mb-6">
                {post?.tags?.map((tag) => (
                  <Tag key={tag} tag={tag} />
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.2]">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-white/[0.08] text-xs text-zinc-400 font-mono">
                <div className="flex items-center space-x-3">
                  <div className="relative h-8 w-8 rounded-full ring-1 ring-white/10 overflow-hidden bg-zinc-800">
                    <Image
                      src={author.picture || "/placeholder.svg"}
                      alt={author.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-zinc-200 font-sans font-medium text-sm">
                    {author.name}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                    {formattedDate}
                  </span>
                  <span className="inline-flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                    <ReadTime text={post.content} />
                  </span>
                </div>
              </div>
            </header>

            {post.coverImage && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.08] mb-12 bg-zinc-950">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            )}

            <div
              className={`prose prose-invert prose-zinc max-w-none ${markdownStyles["markdown"]}`}
            >
              <MarkdownComponent content={post.content} />
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-20 pt-12 border-t border-white/[0.08]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <RelatedPost key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const author = getAuthor();

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Mohamed Almadih`;
  const url = `https://blog.almadih.dev/posts/${post.slug}`;
  const ogImageUrl =
    post.ogImage?.url || post.coverImage || "/assets/blog/authors/almadih2.png";

  return {
    metadataBase: new URL("https://blog.almadih.dev"),
    title,
    description: post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.date,
      authors: [author.name],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: author.twitterHandle,
      title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
