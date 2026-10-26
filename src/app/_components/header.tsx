"use client";
import { ArrowLeft, Github, Rss, Twitter } from "lucide-react";
import Link from "next/link";
import { Post } from "@/interfaces/post";
import SocialShare from "./social-share";

interface HeaderProps {
  isHome?: boolean;
  showShare?: boolean;
  post?: Post;
}

export default function Header({
  isHome = false,
  showShare = false,
  post,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl h-16 flex items-center justify-between">
        {isHome ? (
          <Link
            href="/"
            className="flex items-center space-x-3 group"
          >
            <div className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center font-mono font-bold text-sm text-zinc-100 group-hover:bg-white/[0.12] transition-colors">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                Mohamed Almadih
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                almadih.dev
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Articles</span>
          </Link>
        )}

        <div className="flex items-center space-x-2 sm:space-x-3">
          {showShare && post && <SocialShare post={post} />}

          <a
            href="https://github.com/almadih"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all border border-transparent hover:border-white/[0.08]"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href="https://twitter.com/almadih_desu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all border border-transparent hover:border-white/[0.08]"
          >
            <Twitter className="w-4 h-4" />
          </a>

          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSS Feed"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all border border-transparent hover:border-white/[0.08]"
          >
            <Rss className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
