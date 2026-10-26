import { Post as PostType } from "@/interfaces/post";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Tag from "./tag";
import ReadTime from "./read-time";

export default function Post({ post }: { post: PostType }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/70 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 overflow-hidden">
      {post.coverImage && (
        <Link
          href={`/posts/${post.slug}`}
          tabIndex={-1}
          className="relative aspect-[16/9] overflow-hidden bg-zinc-950 block"
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        </Link>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="inline-flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              <ReadTime text={post.content} />
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors line-clamp-2">
            <Link href={`/posts/${post.slug}`}>
              {post.title}
            </Link>
          </h2>

          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-1.5">
            {post.tags &&
              post.tags.slice(0, 3).map((tag) => <Tag key={tag} tag={tag} />)}
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center text-xs font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors"
          >
            <span>Read</span>
            <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
