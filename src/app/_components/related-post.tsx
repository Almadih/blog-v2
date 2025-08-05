import { Post } from "@/interfaces/post";
import Link from "next/link";
import Tag from "./tag";

export default function RelatedPost({ post }: { post: Post }) {
  return (
    <div className="group bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-black/60 rounded-lg">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          {post.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
        <h3 className="text-white group-hover:text-blue-300 transition-colors line-clamp-2 font-semibold text-lg mb-3">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-white/70">{post.excerpt}</p>
      </div>
    </div>
  );
}
