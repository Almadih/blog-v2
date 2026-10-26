"use client";
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
} from "next-share";
import { Check, Copy, Twitter, Linkedin, Facebook } from "lucide-react";
import Dropdown from "./dropdown";
import { Post } from "@/interfaces/post";
import { getAuthor } from "@/lib/author";
import { useEffect, useState } from "react";

export default function SocialShare({ post }: { post: Post }) {
  const author = getAuthor();
  const [postUrl, setPostUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPostUrl(window?.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Dropdown>
      <div className="flex flex-col text-xs font-medium space-y-0.5">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2.5 w-full px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors text-left"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-zinc-400" />
          )}
          <span>{copied ? "Link Copied!" : "Copy link"}</span>
        </button>

        <div className="h-px bg-white/[0.08] my-1" />

        <TwitterShareButton
          url={postUrl}
          title={post.title}
          via={author.twitterHandle}
          className="w-full"
        >
          <div className="flex items-center space-x-2.5 w-full px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors text-left">
            <Twitter className="w-4 h-4 text-zinc-400" />
            <span>Share on X</span>
          </div>
        </TwitterShareButton>

        <LinkedinShareButton
          url={postUrl}
          title={post.title}
          className="w-full"
        >
          <div className="flex items-center space-x-2.5 w-full px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors text-left">
            <Linkedin className="w-4 h-4 text-zinc-400" />
            <span>Share on LinkedIn</span>
          </div>
        </LinkedinShareButton>

        <FacebookShareButton
          url={postUrl}
          quote={post.title}
          className="w-full"
        >
          <div className="flex items-center space-x-2.5 w-full px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors text-left">
            <Facebook className="w-4 h-4 text-zinc-400" />
            <span>Share on Facebook</span>
          </div>
        </FacebookShareButton>
      </div>
    </Dropdown>
  );
}
