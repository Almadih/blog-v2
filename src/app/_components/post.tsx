import { Post as PostType } from "@/interfaces/post";
import { ArrowRight, Calendar, Clock, Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Tag from "./tag";
import ReadTime from "./read-time";

export default function Post({ post }: { post: PostType }) {
  return (
    <div
      key={post.slug}
      className="group overflow-hidden bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 rounded-lg"
    >
      <div className="aspect-video relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br opacity-80`} />
        <Image
          src={post.coverImage || "/placeholder.svg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          {post.tags && post.tags.map((tag) => <Tag key={tag} tag={tag} />)}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-white/80 text-sm">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{"0"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{"0"}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-white/60 mb-3">
          <div className="flex items-center space-x-4">
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
        <h3 className="text-xl text-white group-hover:text-blue-300 transition-colors line-clamp-2 font-semibold mb-3">
          {post.title}
        </h3>
        <p className="text-white/70 line-clamp-3 leading-relaxed mb-4">
          {post.excerpt}
        </p>
        <button className="inline-flex items-center font-semibold text-blue-400 hover:text-blue-300 group transition-colors">
          <Link href={`/posts/${post.slug}`}>
            <span className="flex items-center">
              Read more
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </button>
      </div>
    </div>
  );
}
