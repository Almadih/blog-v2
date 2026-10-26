import { Post } from "@/interfaces/post";
import Link from "next/link";
import Tag from "./tag";
import { ArrowRight } from "lucide-react";

export default function RelatedPost({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-zinc-900/30 hover:bg-zinc-900/60 border border-white/[0.08] hover:border-white/[0.18] p-5 transition-all duration-300">
      <div>
        <div className="flex items-center flex-wrap gap-1.5 mb-3">
          {post.tags &&
            post.tags.slice(0, 2).map((tag) => <Tag key={tag} tag={tag} />)}
        </div>
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-2 mb-2">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-xs font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors"
        >
          <span>Read article</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
