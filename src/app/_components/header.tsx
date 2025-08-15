"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Post } from "@/interfaces/post";
import SocialShare from "./social-share";
import { Suspense } from "react";

const Header = ({
  showShare = false,
  post,
}: {
  showShare?: boolean;
  post?: Post;
}) => {
  return (
    <header className=" border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm font-medium text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="inline-block h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>
          {showShare && post && <SocialShare post={post} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
