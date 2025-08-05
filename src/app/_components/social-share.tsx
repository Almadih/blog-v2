"use client";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";
import Dropdown from "./dropdown";
import { Post } from "@/interfaces/post";
import { getAuthor } from "@/lib/author";
import { useEffect, useState } from "react";

export default function SocialShare({ post }: { post: Post }) {
  const author = getAuthor();
  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    setPostUrl(window?.location.href);
  }, []);

  return (
    <Dropdown>
      <div className="flex flex-col  text-sm font-medium  transition-colors group">
        <FacebookShareButton
          className="hover:bg-gray-100"
          url={postUrl}
          quote={`Check out this blog post: ${post.title}`}
        >
          <div className="flex items-center space-x-2 pl-3 hover:bg-gray-100 p-2">
            <FacebookIcon size={24} round />
            <span>Share on Facebook</span>
          </div>
        </FacebookShareButton>
        <TwitterShareButton
          url={postUrl}
          title={`Check out this blog post: ${post.title}`}
          via={author.twitterHandle}
        >
          <div className="flex items-center space-x-2 pl-3 hover:bg-gray-100 p-2">
            <TwitterIcon size={24} round />
            <span>Share on Twitter</span>
          </div>
        </TwitterShareButton>
        <LinkedinShareButton
          url={postUrl}
          title={`Check out this blog post: ${post.title}`}
        >
          <div className="flex items-center space-x-2 pl-3 hover:bg-gray-100 p-2">
            <LinkedinIcon size={24} round />
            <span>Share on Linkedin</span>
          </div>
        </LinkedinShareButton>
      </div>
    </Dropdown>
  );
}
